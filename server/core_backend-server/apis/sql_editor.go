package apis

import (
	"net/http"
	"strings"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/router"
)

// bindSqlEditorApi registers the SQL editor API routes.
func bindSqlEditorApi(app core.App, rg *router.RouterGroup[*core.RequestEvent]) {
	subGroup := rg.Group("/sql").Bind(RequireSuperuserAuth())

	subGroup.POST("/query", func(e *core.RequestEvent) error {
		data := struct {
			Query string `json:"query" form:"query"`
		}{}

		if err := e.BindBody(&data); err != nil {
			return e.BadRequestError("Failed to parse request body.", err)
		}

		query := strings.TrimSpace(data.Query)
		if query == "" {
			return e.BadRequestError("Query cannot be empty.", nil)
		}

		// Basic security: only allow SELECT queries
		upperQuery := strings.ToUpper(query)
		if !strings.HasPrefix(upperQuery, "SELECT") {
			return e.BadRequestError("Only SELECT queries are allowed.", nil)
		}

		// Disallow potentially dangerous operations
		disallowed := []string{"INSERT", "UPDATE", "DELETE", "DROP", "ALTER", "CREATE", "TRUNCATE", "EXEC", "EXECUTE"}
		for _, keyword := range disallowed {
			if strings.Contains(upperQuery, " "+keyword+" ") || strings.HasPrefix(upperQuery, keyword+" ") {
				return e.BadRequestError("Query contains disallowed keyword: "+keyword, nil)
			}
		}

		// Remove trailing semicolons
		query = strings.TrimSuffix(query, ";")

		// Execute the query using NullStringMap which works with any database
		var rows []dbx.NullStringMap
		err := e.App.DB().NewQuery(query).All(&rows)
		if err != nil {
			e.App.Logger().Error("SQL query failed", "query", query, "error", err.Error())
			return e.BadRequestError("Failed to execute query: "+err.Error(), nil)
		}

		// Convert NullStringMap to regular maps for JSON
		result := make([]map[string]any, len(rows))
		for i, row := range rows {
			result[i] = make(map[string]any)
			for k, v := range row {
				if v.Valid {
					result[i][k] = v.String
				} else {
					result[i][k] = nil
				}
			}
		}

		return e.JSON(http.StatusOK, map[string]any{
			"rows":  result,
			"count": len(result),
		})
	})
}
