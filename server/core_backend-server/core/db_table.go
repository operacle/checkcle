package core

import (
	"database/sql"
	"fmt"
	"strings"

	"github.com/pocketbase/dbx"
)

// TableColumns returns all column names of a single table by its name.
func (app *BaseApp) TableColumns(tableName string) ([]string, error) {
	columns := []string{}
	var err error

	if IsMysql(app) {
		// MySQL:
		err = app.ConcurrentDB().NewQuery(`
			SELECT column_name
			FROM information_schema.columns
			WHERE table_name = {:tableName}
			  AND table_schema = DATABASE()
		`).Bind(dbx.Params{"tableName": tableName}).Column(&columns)
	} else if IsPostgres(app) {
		// PostgreSQL:
		err = app.ConcurrentDB().NewQuery(`
			SELECT column_name
			FROM information_schema.columns
			WHERE table_name = {:tableName}
			  AND table_schema = current_schema()
		`).Bind(dbx.Params{"tableName": tableName}).Column(&columns)
	} else {
		// SQLite:
		err = app.ConcurrentDB().NewQuery("SELECT name FROM PRAGMA_TABLE_INFO({:tableName})").
			Bind(dbx.Params{"tableName": tableName}).
			Column(&columns)
	}

	return columns, err
}

type TableInfoRow struct {
	// the `db:"pk"` tag has special semantic so we cannot rename
	// the original field without specifying a custom mapper
	PK int

	Index        int            `db:"cid"`
	Name         string         `db:"name"`
	Type         string         `db:"type"`
	NotNull      bool           `db:"notnull"`
	DefaultValue sql.NullString `db:"dflt_value"`
}

// TableInfo returns the "table_info" pragma result for the specified table.
func (app *BaseApp) TableInfo(tableName string) ([]*TableInfoRow, error) {
	info := []*TableInfoRow{}
	var err error

	if IsMysql(app) {
		// MySQL:
		err = app.ConcurrentDB().NewQuery(`
			SELECT 
				ORDINAL_POSITION - 1 AS cid,
				COLUMN_NAME AS name,
				DATA_TYPE AS type,
				CASE WHEN IS_NULLABLE = 'NO' THEN 1 ELSE 0 END AS notnull,
				COLUMN_DEFAULT AS dflt_value,
				CASE WHEN COLUMN_KEY = 'PRI' THEN 1 ELSE 0 END AS pk
			FROM information_schema.columns
			WHERE table_name = {:tableName}
			  AND table_schema = DATABASE()
			ORDER BY ORDINAL_POSITION
		`).Bind(dbx.Params{"tableName": tableName}).All(&info)
	} else if IsPostgres(app) {
		// PostgreSQL:
		// TODO: Consider simplifying this query because not all result columns are used in the app.
		sql := `
			SELECT 
				ordinal_position - 1 AS cid,
				c.column_name AS name,
				data_type AS type,
				CASE WHEN is_nullable = 'NO' THEN 1 ELSE 0 END AS notnull,
				column_default AS dflt_value,
				CASE WHEN pk.constraint_type = 'PRIMARY KEY' THEN 1 ELSE 0 END AS pk
			FROM 
				information_schema.columns c
			LEFT JOIN (
				SELECT 
					ccu.column_name,
					tc.constraint_type
				FROM 
					information_schema.table_constraints tc
				JOIN 
					information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
				WHERE 
					tc.constraint_type = 'PRIMARY KEY' AND 
					tc.table_name = {:table_name} AND 
					tc.table_schema = 'public'
			) pk ON c.column_name = pk.column_name
			WHERE 
				c.table_name = {:table_name} AND 
				c.table_schema = current_schema()
			ORDER BY 
				c.ordinal_position;	
		`
		err = app.ConcurrentDB().NewQuery(sql).Bind(dbx.Params{"table_name": tableName}).All(&info)
	} else {
		// SQLite:
		err = app.ConcurrentDB().NewQuery("SELECT * FROM PRAGMA_TABLE_INFO({:tableName})").
			Bind(dbx.Params{"tableName": tableName}).
			All(&info)
	}

	if err != nil {
		return nil, err
	}

	// mattn/go-sqlite3 doesn't throw an error on invalid or missing table
	// so we additionally have to check whether the loaded info result is nonempty
	if len(info) == 0 {
		return nil, fmt.Errorf("empty table info probably due to invalid or missing table %s", tableName)
	}

	return info, nil
}

// TableIndexes returns a name grouped map with all non empty index of the specified table.
//
// Note: This method doesn't return an error on nonexisting table.
func (app *BaseApp) TableIndexes(tableName string) (map[string]string, error) {
	indexes := []struct {
		Name string `db:"indexname"`
		Sql  string `db:"indexdef"`
	}{}

	var err error
	if IsMysql(app) {
		// MySQL:
		// Note: constructing the CREATE INDEX statement from information_schema is complex.
		// For now returning empty indexdef.
		err = app.ConcurrentDB().NewQuery(`
			SELECT INDEX_NAME as indexname, '' as indexdef
			FROM information_schema.statistics
			WHERE table_name = {:tableName}
			  AND table_schema = DATABASE()
			GROUP BY INDEX_NAME
		`).Bind(dbx.Params{"tableName": tableName}).All(&indexes)
	} else if IsPostgres(app) {
		// PostgreSQL:
		// Note: `sql is not null` is for filtering auto created primary indexes in SQLite.
		// In PostgreSQL, we have to make subquery in 'pg_constraint` for the same purpose.
		err = app.ConcurrentDB().NewQuery(`
			SELECT indexname, indexdef
			FROM pg_indexes
			WHERE tablename = {:tableName}
			AND indexname NOT IN (
				SELECT conname
				FROM pg_constraint
				WHERE contype = 'p' AND conrelid = {:tableName}::regclass
			);
		`).Bind(dbx.Params{"tableName": tableName}).All(&indexes)
	} else {
		// SQLite:
		err = app.ConcurrentDB().Select("name indexname", "sql indexdef").
			From("sqlite_master").
			AndWhere(dbx.NewExp("sql is not null")).
			AndWhere(dbx.HashExp{
				"type":     "index",
				"tbl_name": tableName,
			}).
			All(&indexes)
	}

	if err != nil {
		return nil, err
	}

	result := make(map[string]string, len(indexes))

	for _, idx := range indexes {
		result[idx.Name] = idx.Sql
	}

	return result, nil
}

// DeleteTable drops the specified table.
//
// This method is a no-op if a table with the provided name doesn't exist.
//
// NB! Be aware that this method is vulnerable to SQL injection and the
// "tableName" argument must come only from trusted input!
func (app *BaseApp) DeleteTable(tableName string) error {
	if strings.TrimSpace(tableName) == "" {
		return fmt.Errorf("invalid table name")
	}

	var err error
	if !IsPostgres(app) {
		// SQLite:
		_, err = app.NonconcurrentDB().NewQuery(fmt.Sprintf(
			"DROP TABLE IF EXISTS {{%s}}",
			tableName,
		)).Execute()
	} else {
		// PostgreSQL:
		// Note: We use "CASCADE" to drop all dependent objects (e.g. views, etc.) in PostgreSQL.
		_, err = app.ConcurrentDB().NewQuery(fmt.Sprintf(
			"DROP TABLE IF EXISTS {{%s}} CASCADE",
			tableName,
		)).Execute()
	}

	return err
}

// HasTable checks if a table (or view) with the provided name exists (case insensitive).
// in the data.db.
func (app *BaseApp) HasTable(tableName string) bool {
	return app.hasTable(app.ConcurrentDB(), tableName)
}

// AuxHasTable checks if a table (or view) with the provided name exists (case insensitive)
// in the auixiliary.db.
func (app *BaseApp) AuxHasTable(tableName string) bool {
	return app.hasTable(app.AuxConcurrentDB(), tableName)
}

func (app *BaseApp) hasTable(db dbx.Builder, tableName string) bool {
	var exists int
	var err error

	if IsMysql(app) {
		// MySQL:
		err = db.NewQuery(`
			SELECT count(*)
			FROM information_schema.tables
			WHERE table_schema = DATABASE()
			  AND lower(table_name) = lower({:tableName})
		`).Bind(dbx.Params{"tableName": tableName}).Row(&exists)
	} else if IsPostgres(app) {
		// PostgreSQL:
		// Notes: both views and tables are included in `information_schema.tables`.
		err = db.NewQuery(`
			SELECT count(*)
			FROM information_schema.tables
			WHERE table_schema = current_schema()
			  AND lower(table_name) = lower({:tableName})
		`).Bind(dbx.Params{"tableName": tableName}).Row(&exists)
	} else {
		// SQLite:
		err = db.Select("count(*)").
			From("sqlite_master").
			AndWhere(dbx.HashExp{"type": []any{"table", "view"}}).
			AndWhere(dbx.NewExp("LOWER([[name]])=LOWER({:tableName})", dbx.Params{"tableName": tableName})).
			Row(&exists)
	}

	return err == nil && exists > 0
}

// Vacuum executes VACUUM on the data.db in order to reclaim unused data db disk space.
func (app *BaseApp) Vacuum() error {
	return app.vacuum(app.NonconcurrentDB())
}

// AuxVacuum executes VACUUM on the auxiliary.db in order to reclaim unused auxiliary db disk space.
func (app *BaseApp) AuxVacuum() error {
	return app.vacuum(app.AuxNonconcurrentDB())
}

func (app *BaseApp) vacuum(db dbx.Builder) error {
	_, err := db.NewQuery("VACUUM").Execute()

	return err
}
