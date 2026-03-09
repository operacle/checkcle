package apis

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/dop251/goja"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
	"github.com/pocketbase/pocketbase/tools/security"
)

func executeEdgeFunction(app core.App, fn edgeFunction, record *core.Record) {
	start := time.Now()
	vm := goja.New()
	vm.SetFieldNameMapper(goja.UncapFieldNameMapper())

	var logs []string
	outputMu := sync.Mutex{}

	// Basic binds
	vm.Set("$app", app)
	if record != nil && record.Id != "" {
		vm.Set("$record", record)
	} else {
		// Dummy record for testing
		vm.Set("$record", map[string]any{
			"id": "test_id",
			"get": func(field string) string {
				return "test_" + field
			},
			"collection": func() map[string]any {
				return map[string]any{
					"name": fn.TriggerCollection.String,
				}
			},
		})
	}

	// Simple console.log implementation
	vm.Set("console", map[string]any{
		"log": func(args ...any) {
			outputMu.Lock()
			logs = append(logs, fmt.Sprint(args...))
			outputMu.Unlock()
			app.Logger().Info("Edge Function Log", "name", fn.Name, "message", args)
		},
	})

	// Add fetch polyfill
	vm.Set("fetch", func(url string, options map[string]any) (goja.Value, error) {
		method := "GET"
		var body io.Reader
		headers := make(map[string]string)

		if options != nil {
			if m, ok := options["method"].(string); ok {
				method = strings.ToUpper(m)
			}
			if h, ok := options["headers"].(map[string]any); ok {
				for k, v := range h {
					headers[k] = fmt.Sprintf("%v", v)
				}
			}
			if b, ok := options["body"].(string); ok {
				body = strings.NewReader(b)
			}
		}

		req, err := http.NewRequest(method, url, body)
		if err != nil {
			return nil, err
		}

		for k, v := range headers {
			req.Header.Set(k, v)
		}

		client := &http.Client{Timeout: 30 * time.Second}
		resp, err := client.Do(req)
		if err != nil {
			return nil, err
		}
		defer resp.Body.Close()

		respBody, _ := io.ReadAll(resp.Body)

		// Parse JSON if possible
		var jsonBody any
		_ = json.Unmarshal(respBody, &jsonBody)

		// Create response object
		responseObj := map[string]any{
			"ok":         resp.StatusCode >= 200 && resp.StatusCode < 300,
			"status":     resp.StatusCode,
			"statusText": resp.Status,
			"json": func() (goja.Value, error) {
				p, resolve, _ := vm.NewPromise()
				resolve(vm.ToValue(jsonBody))
				return vm.ToValue(p), nil
			},
			"text": func() (goja.Value, error) {
				p, resolve, _ := vm.NewPromise()
				resolve(vm.ToValue(string(respBody)))
				return vm.ToValue(p), nil
			},
		}

		// Return a resolved promise
		promise, resolve, _ := vm.NewPromise()
		resolve(vm.ToValue(responseObj))
		return vm.ToValue(promise), nil
	})

	// Execute the body
	_, err := vm.RunString(fn.Body.String)
	duration := time.Since(start).Milliseconds()
	output := strings.Join(logs, "\n")

	if err != nil {
		app.Logger().Error("Edge Function Execution Failed", "name", fn.Name, "error", err.Error())
		logEdgeFunctionExecution(app, fn.Id, "error", duration, output, err.Error())
	} else {
		app.Logger().Info("Edge Function Executed Successfully", "name", fn.Name)
		logEdgeFunctionExecution(app, fn.Id, "success", duration, output, "")
	}
}

type edgeFunction struct {
	Id                string         `db:"id" json:"id"`
	Name              string         `db:"name" json:"name"`
	Body              sql.NullString `db:"body" json:"body"`
	TriggerType       sql.NullString `db:"trigger_type" json:"trigger_type"`
	TriggerConfig     sql.NullString `db:"trigger_config" json:"trigger_config"`
	Active            bool           `db:"active" json:"active"`
	TriggerCollection sql.NullString `db:"trigger_collection" json:"trigger_collection"`
	TriggerEvent      sql.NullString `db:"trigger_event" json:"trigger_event"`
	Created           sql.NullTime   `db:"created" json:"created"`
	Updated           sql.NullTime   `db:"updated" json:"updated"`
}

func logEdgeFunctionExecution(app core.App, fnId string, status string, duration int64, output string, errStr string) {
	id := security.PseudorandomStringWithAlphabet(15, "abcdefghijklmnopqrstuvwxyz0123456789")
	_, err := app.NonconcurrentDB().Insert("_edge_function_logs", dbx.Params{
		"id":          id,
		"function_id": fnId,
		"status":      status,
		"duration":    duration,
		"output":      output,
		"error":       errStr,
	}).Execute()

	if err != nil {
		app.Logger().Error("Failed to save edge function log", "error", err.Error())
	}
}

func reloadCronJobs(app core.App) {
	if app.Cron() == nil {
		app.Logger().Warn("Cron is not initialized, skipping reload")
		return
	}
	app.Logger().Info("Reloading edge function cron jobs")
	// Remove all existing edge function cron jobs
	for _, job := range app.Cron().Jobs() {
		if strings.HasPrefix(job.Id(), "edge_") {
			app.Logger().Info("Removing cron job", "id", job.Id())
			app.Cron().Remove(job.Id())
		}
	}

	var functions []edgeFunction
	err := app.DB().
		Select("*").
		From("_edge_functions").
		Where(dbx.HashExp{
			"active":       true,
			"trigger_type": "cron",
		}).
		All(&functions)

	if err != nil {
		return
	}

	for _, fn := range functions {
		cronExpr := fn.TriggerConfig.String
		if cronExpr == "" {
			continue
		}

		fnCopy := fn // capture for closure
		jobName := "edge_" + fn.Id
		app.Cron().Add(jobName, cronExpr, func() {
			executeEdgeFunction(app, fnCopy, nil)
		})
	}
}

// bindEdgeFunctionsApi registers the Edge Functions API routes.
func bindEdgeFunctionsApi(app core.App, rg *router.RouterGroup[*core.RequestEvent]) {
	subGroup := rg.Group("/functions").Bind(RequireSuperuserAuth())

	// Ensure the table exists on startup
	ensureEdgeFunctionsTable(app)

	// Load cron jobs and register webhook on startup
	app.OnServe().BindFunc(func(e *core.ServeEvent) error {
		// Register HTTP Trigger Route (Public)
		// We register it here to avoid conflicts with the static file server
		e.Router.POST("/edge-hook/{name}", func(e *core.RequestEvent) error {
			name := e.Request.PathValue("name")

			var fn edgeFunction
			err := e.App.DB().
				Select("*").
				From("_edge_functions").
				Where(dbx.HashExp{
					"active":       true,
					"trigger_type": "http",
					"name":         name,
				}).
				One(&fn)

			if err != nil {
				return e.NotFoundError("Function not found or inactive.", nil)
			}

			// Execute function
			go executeEdgeFunction(e.App, fn, nil)

			return e.JSON(http.StatusOK, map[string]any{
				"message": "Function triggered successfully",
			})
		})

		reloadCronJobs(e.App)
		return e.Next()
	})

	// Register hooks to trigger functions
	app.OnRecordAfterCreateSuccess().BindFunc(func(e *core.RecordEvent) error {
		collectionName := e.Record.Collection().Name

		var functions []edgeFunction
		err := e.App.DB().
			Select("*").
			From("_edge_functions").
			Where(dbx.HashExp{
				"active":             true,
				"trigger_type":       "record",
				"trigger_collection": collectionName,
				"trigger_event":      "create",
			}).
			All(&functions)

		if err != nil {
			return e.Next()
		}

		for _, fn := range functions {
			go executeEdgeFunction(e.App, fn, e.Record)
		}

		return e.Next()
	})

	app.OnRecordAfterUpdateSuccess().BindFunc(func(e *core.RecordEvent) error {
		var functions []edgeFunction
		err := e.App.DB().
			Select("*").
			From("_edge_functions").
			Where(dbx.HashExp{
				"active":             true,
				"trigger_type":       "record",
				"trigger_collection": e.Record.Collection().Name,
				"trigger_event":      "update",
			}).
			All(&functions)

		if err == nil {
			for _, fn := range functions {
				go executeEdgeFunction(e.App, fn, e.Record)
			}
		}

		return e.Next()
	})

	app.OnRecordAfterDeleteSuccess().BindFunc(func(e *core.RecordEvent) error {
		var functions []edgeFunction
		err := e.App.DB().
			Select("*").
			From("_edge_functions").
			Where(dbx.HashExp{
				"active":             true,
				"trigger_type":       "record",
				"trigger_collection": e.Record.Collection().Name,
				"trigger_event":      "delete",
			}).
			All(&functions)

		if err == nil {
			for _, fn := range functions {
				go executeEdgeFunction(e.App, fn, e.Record)
			}
		}

		return e.Next()
	})

	// Logs API
	subGroup.GET("/{id}/logs", func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")

		var logs []map[string]any
		err := e.App.DB().
			Select("*").
			From("_edge_function_logs").
			Where(dbx.HashExp{"function_id": id}).
			OrderBy("created DESC").
			Limit(50).
			All(&logs)

		if err != nil {
			return e.BadRequestError("Failed to load logs", err)
		}

		return e.JSON(http.StatusOK, logs)
	})

	subGroup.GET("", func(e *core.RequestEvent) error {
		var functions []edgeFunction
		e.App.Logger().Info("Executing GET /api/functions")

		// Use app.DB() which is the standard way to access the data database
		err := e.App.DB().
			Select("*").
			From("_edge_functions").
			OrderBy("created DESC").
			All(&functions)

		if err != nil {
			e.App.Logger().Error("Failed to load edge functions", "error", err.Error())
			return e.BadRequestError("Failed to load edge functions: "+err.Error(), nil)
		}

		e.App.Logger().Info("Loaded edge functions from DB", "count", len(functions))
		for _, f := range functions {
			e.App.Logger().Info("Function in list", "id", f.Id, "name", f.Name)
		}

		// Convert to response format with string dates
		result := make([]map[string]any, len(functions))
		for i, f := range functions {
			created := ""
			if f.Created.Valid {
				created = f.Created.Time.Format("2006-01-02 15:04:05.000Z")
			}
			updated := ""
			if f.Updated.Valid {
				updated = f.Updated.Time.Format("2006-01-02 15:04:05.000Z")
			}

			// Debug log each function ID and Name
			e.App.Logger().Debug("Function row", "id", f.Id, "name", f.Name)

			result[i] = map[string]any{
				"id":                 f.Id,
				"name":               f.Name,
				"body":               f.Body.String,
				"trigger_type":       f.TriggerType.String,
				"trigger_config":     f.TriggerConfig.String,
				"active":             f.Active,
				"trigger_collection": f.TriggerCollection.String,
				"trigger_event":      f.TriggerEvent.String,
				"created":            created,
				"updated":            updated,
			}
		}

		return e.JSON(http.StatusOK, result)
	})

	subGroup.POST("", func(e *core.RequestEvent) error {
		data := struct {
			Name              string `json:"name" form:"name"`
			Body              string `json:"body" form:"body"`
			TriggerType       string `json:"trigger_type" form:"trigger_type"`
			TriggerConfig     string `json:"trigger_config" form:"trigger_config"`
			Active            bool   `json:"active" form:"active"`
			TriggerCollection string `json:"trigger_collection" form:"trigger_collection"`
			TriggerEvent      string `json:"trigger_event" form:"trigger_event"`
		}{}

		if err := e.BindBody(&data); err != nil {
			return e.BadRequestError("Failed to parse request body.", err)
		}

		if data.Name == "" {
			return e.BadRequestError("Function name is required.", nil)
		}

		e.App.Logger().Info("Creating function",
			"name", data.Name,
			"trigger_col", data.TriggerCollection,
			"trigger_event", data.TriggerEvent)

		id := security.PseudorandomStringWithAlphabet(15, "abcdefghijklmnopqrstuvwxyz0123456789")

		// Insert the function
		_, err := e.App.NonconcurrentDB().Insert("_edge_functions", dbx.Params{
			"id":                 id,
			"name":               data.Name,
			"body":               data.Body,
			"trigger_type":       data.TriggerType,
			"trigger_config":     data.TriggerConfig,
			"active":             data.Active,
			"trigger_collection": data.TriggerCollection,
			"trigger_event":      data.TriggerEvent,
		}).Execute()

		if err != nil {
			return e.BadRequestError("Failed to create function: "+err.Error(), nil)
		}

		if data.TriggerType == "cron" {
			reloadCronJobs(e.App)
		}

		// Return the created object
		return e.JSON(http.StatusOK, map[string]any{
			"id":                 id,
			"name":               data.Name,
			"body":               data.Body,
			"trigger_type":       data.TriggerType,
			"trigger_config":     data.TriggerConfig,
			"active":             data.Active,
			"trigger_collection": data.TriggerCollection,
			"trigger_event":      data.TriggerEvent,
		})
	})

	subGroup.GET("/{id}", func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")

		var f edgeFunction
		err := e.App.ConcurrentDB().
			Select("*").
			From("_edge_functions").
			Where(dbx.HashExp{"id": id}).
			One(&f)

		if err != nil {
			return e.NotFoundError("Function not found.", nil)
		}

		created := ""
		if f.Created.Valid {
			created = f.Created.Time.Format("2006-01-02 15:04:05.000Z")
		}
		updated := ""
		if f.Updated.Valid {
			updated = f.Updated.Time.Format("2006-01-02 15:04:05.000Z")
		}

		return e.JSON(http.StatusOK, map[string]any{
			"id":                 f.Id,
			"name":               f.Name,
			"body":               f.Body.String,
			"trigger_collection": f.TriggerCollection.String,
			"trigger_event":      f.TriggerEvent.String,
			"created":            created,
			"updated":            updated,
		})
	})

	subGroup.POST("/{id}/test", func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")

		var f edgeFunction
		err := e.App.ConcurrentDB().
			Select("*").
			From("_edge_functions").
			Where(dbx.HashExp{"id": id}).
			One(&f)

		if err != nil {
			return e.NotFoundError("Function not found.", nil)
		}

		// Execute with a dummy record
		go executeEdgeFunction(e.App, f, &core.Record{})

		return e.JSON(http.StatusOK, map[string]any{
			"message": "Test execution started",
		})
	})

	subGroup.PATCH("/{id}", func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")
		e.App.Logger().Info("PATCH function request", "id", id)

		data := struct {
			Name              string `json:"name" form:"name"`
			Body              string `json:"body" form:"body"`
			TriggerType       string `json:"trigger_type" form:"trigger_type"`
			TriggerConfig     string `json:"trigger_config" form:"trigger_config"`
			Active            bool   `json:"active" form:"active"`
			TriggerCollection string `json:"trigger_collection" form:"trigger_collection"`
			TriggerEvent      string `json:"trigger_event" form:"trigger_event"`
		}{}

		if err := e.BindBody(&data); err != nil {
			e.App.Logger().Error("Failed to bind body", "error", err.Error())
			return e.BadRequestError("Failed to parse request body.", err)
		}

		e.App.Logger().Info("Updating function",
			"name", data.Name,
			"body_len", len(data.Body),
			"trigger_col", data.TriggerCollection,
			"trigger_event", data.TriggerEvent)

		_, err := e.App.NonconcurrentDB().Update("_edge_functions", dbx.Params{
			"name":               data.Name,
			"body":               data.Body,
			"trigger_type":       data.TriggerType,
			"trigger_config":     data.TriggerConfig,
			"active":             data.Active,
			"trigger_collection": data.TriggerCollection,
			"trigger_event":      data.TriggerEvent,
		}, dbx.HashExp{"id": id}).Execute()

		if err != nil {
			e.App.Logger().Error("Failed to update function in DB", "error", err.Error())
			return e.BadRequestError("Failed to update function: "+err.Error(), nil)
		}

		reloadCronJobs(e.App)

		return e.JSON(http.StatusOK, map[string]any{
			"id":                 id,
			"name":               data.Name,
			"body":               data.Body,
			"trigger_type":       data.TriggerType,
			"trigger_config":     data.TriggerConfig,
			"active":             data.Active,
			"trigger_collection": data.TriggerCollection,
			"trigger_event":      data.TriggerEvent,
		})
	})

	subGroup.DELETE("/{id}", func(e *core.RequestEvent) error {
		id := e.Request.PathValue("id")

		_, err := e.App.NonconcurrentDB().Delete("_edge_functions", dbx.HashExp{"id": id}).Execute()

		if err != nil {
			return e.BadRequestError("Failed to delete function: "+err.Error(), nil)
		}

		reloadCronJobs(e.App)

		return e.NoContent(http.StatusNoContent)
	})
}

// ensureEdgeFunctionsTable creates the _edge_functions table if it doesn't exist (PostgreSQL compatible)
func ensureEdgeFunctionsTable(app core.App) {
	_, _ = app.NonconcurrentDB().NewQuery(`
		CREATE TABLE IF NOT EXISTS _edge_functions (
			id TEXT PRIMARY KEY,
			name TEXT NOT NULL,
			body TEXT,
			trigger_type TEXT DEFAULT 'record',
			trigger_config TEXT,
			active BOOLEAN DEFAULT TRUE,
			trigger_collection TEXT,
			trigger_event TEXT,
			created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`).Execute()

	// Add columns if they don't exist (for existing tables)
	_, _ = app.NonconcurrentDB().NewQuery(`ALTER TABLE _edge_functions ADD COLUMN IF NOT EXISTS trigger_type TEXT DEFAULT 'record'`).Execute()
	_, _ = app.NonconcurrentDB().NewQuery(`ALTER TABLE _edge_functions ADD COLUMN IF NOT EXISTS trigger_config TEXT`).Execute()
	_, _ = app.NonconcurrentDB().NewQuery(`ALTER TABLE _edge_functions ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE`).Execute()
	_, _ = app.NonconcurrentDB().NewQuery(`ALTER TABLE _edge_functions ADD COLUMN IF NOT EXISTS trigger_collection TEXT`).Execute()
	_, _ = app.NonconcurrentDB().NewQuery(`ALTER TABLE _edge_functions ADD COLUMN IF NOT EXISTS trigger_event TEXT`).Execute()

	// Create logs table
	_, _ = app.NonconcurrentDB().NewQuery(`
		CREATE TABLE IF NOT EXISTS _edge_function_logs (
			id TEXT PRIMARY KEY,
			function_id TEXT NOT NULL,
			status TEXT,
			duration INTEGER,
			output TEXT,
			error TEXT,
			created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`).Execute()
}
