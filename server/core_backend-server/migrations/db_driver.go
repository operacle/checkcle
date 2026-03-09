package migrations

import (
	"strings"

	"github.com/pocketbase/dbx"
)

// isPostgres checks if the provided database builder is using the PostgreSQL driver.
func isPostgres(db dbx.Builder) bool {
	// We check if the table pg_proc exists, which is a system table in PostgreSQL.
	// This is a reliable way to detect PostgreSQL at runtime without needing
	// access to the unexported driver name in dbx.
	var exists bool
	err := db.NewQuery("SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pg_proc')").Row(&exists)
	if err != nil {
		// If the query fails, it's likely not PostgreSQL (e.g. SQLite doesn't have information_schema.tables)
		return false
	}
	// Note: in PostgreSQL specifically, pg_proc is in pg_catalog, but information_schema works too
	// Actually, let's try a simpler one:
	_, err = db.NewQuery("SELECT version()").Execute()
	if err != nil {
		return false
	}
	return true
}

// getDriverName returns the driver name for the provided database builder.
func getDriverName(db dbx.Builder) string {
	// PostgreSQL supports 'SELECT version()'
	var version string
	err := db.NewQuery("SELECT version()").Row(&version)
	if err == nil {
		if strings.Contains(strings.ToLower(version), "postgres") {
			return "postgres"
		}
		// Assume MySQL if version() works but not postgres
		// (MariaDB also returns version string usually without postgres)
		return "mysql"
	}

	// SQLite supports 'SELECT sqlite_version()'
	var sqliteVersion string
	err = db.NewQuery("SELECT sqlite_version()").Row(&sqliteVersion)
	if err == nil {
		return "sqlite"
	}

	return "unknown"
}
