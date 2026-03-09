package migrations

import (
	"fmt"
	"strings"

	"github.com/pocketbase/pocketbase/core"
)

func init() {
	core.SystemMigrations.Add(&core.Migration{
		Up: func(txApp core.App) error {
			if err := createSQLiteEquivalentFunctions(txApp.AuxDB()); err != nil {
				return err
			}
			driver := getDriverName(txApp.AuxDB())

			var logsSql string
			if driver == "mysql" {
				fmt.Println("DEBUG: Running MySQL aux init migration for _logs table")
				_, err := txApp.AuxDB().NewQuery(`
					CREATE TABLE IF NOT EXISTS {{_logs}} (
						[[id]]      VARCHAR(100) PRIMARY KEY NOT NULL,
						[[level]]   INT DEFAULT 0 NOT NULL,
						[[message]] TEXT NOT NULL,
						[[data]]    JSON NOT NULL,
						[[created]] VARCHAR(50) NOT NULL
					);`).Execute()
				if err != nil {
					return err
				}

				// Create indices separately
				fmt.Println("DEBUG: Creating index idx_logs_level")
				_, err = txApp.AuxDB().NewQuery("CREATE INDEX idx_logs_level on {{_logs}} ([[level]]);").Execute()
				if err != nil {
					if strings.Contains(err.Error(), "Duplicate key name") {
						fmt.Println("DEBUG: Index idx_logs_level already exists, ignoring error")
					} else {
						return err
					}
				}
				fmt.Println("DEBUG: Creating index idx_logs_message")
				_, err = txApp.AuxDB().NewQuery("CREATE INDEX idx_logs_message on {{_logs}} (message(255));").Execute()
				if err != nil {
					if strings.Contains(err.Error(), "Duplicate key name") {
						fmt.Println("DEBUG: Index idx_logs_message already exists, ignoring error")
					} else {
						return err
					}
				}
				fmt.Println("DEBUG: Creating index idx_logs_created_hour")
				_, err = txApp.AuxDB().NewQuery("CREATE INDEX idx_logs_created_hour on {{_logs}} ((DATE_FORMAT([[created]], '%Y-%m-%d %H:00:00')));").Execute()
				return err
			} else if driver == "postgres" {
				logsSql = `
					CREATE TABLE IF NOT EXISTS {{_logs}} (
						[[id]]      UUID PRIMARY KEY DEFAULT uuid_generate_v7() NOT NULL,
						[[level]]   INTEGER DEFAULT 0 NOT NULL,
						[[message]] TEXT DEFAULT '' NOT NULL,
						[[data]]    JSONB DEFAULT '{}' NOT NULL,
						[[created]] TIMESTAMP DEFAULT now() NOT NULL
					);
					CREATE INDEX IF NOT EXISTS idx_logs_level on {{_logs}} ([[level]]);
					CREATE INDEX IF NOT EXISTS idx_logs_message on {{_logs}} ([[message]]);
					CREATE INDEX IF NOT EXISTS idx_logs_created_hour on {{_logs}} (date_trunc('hour', [[created]]));`
			} else {
				logsSql = `
					CREATE TABLE IF NOT EXISTS {{_logs}} (
						[[id]]      TEXT PRIMARY KEY DEFAULT ('r'||lower(hex(randomblob(7)))) NOT NULL,
						[[level]]   INTEGER DEFAULT 0 NOT NULL,
						[[message]] TEXT DEFAULT "" NOT NULL,
						[[data]]    JSON DEFAULT "{}" NOT NULL,
						[[created]] TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%fZ')) NOT NULL
					);
					CREATE INDEX IF NOT EXISTS idx_logs_level on {{_logs}} ([[level]]);
					CREATE INDEX IF NOT EXISTS idx_logs_message on {{_logs}} ([[message]]);
					CREATE INDEX IF NOT EXISTS idx_logs_created_hour on {{_logs}} (strftime('%Y-%m-%d %H:00:00', [[created]]));`
			}

			_, execErr := txApp.AuxDB().NewQuery(logsSql).Execute()
			return execErr
		},
		Down: func(txApp core.App) error {
			_, err := txApp.AuxDB().DropTable("_logs").Execute()
			return err
		},
		ReapplyCondition: func(txApp core.App, runner *core.MigrationsRunner, fileName string) (bool, error) {
			// reapply only if the _logs table doesn't exist
			exists := txApp.AuxHasTable("_logs")
			return !exists, nil
		},
	})
}
