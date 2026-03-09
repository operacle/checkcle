//go:build !no_default_driver

package core

import (
	"fmt"
	"net/url"
	"regexp"
	"strings"

	_ "github.com/go-sql-driver/mysql"
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/pocketbase/dbx"
	_ "modernc.org/sqlite"
)

func DefaultDBConnect(dbPath string) (*dbx.DB, error) {
	// Note: the busy_timeout pragma must be first because
	// the connection needs to be set to block on busy before WAL mode
	// is set in case it hasn't been already set by another connection.
	pragmas := "?_pragma=busy_timeout(10000)&_pragma=journal_mode(WAL)&_pragma=journal_size_limit(200000000)&_pragma=synchronous(NORMAL)&_pragma=foreign_keys(ON)&_pragma=temp_store(MEMORY)&_pragma=cache_size(-32000)"

	db, err := dbx.Open("sqlite", dbPath+pragmas)
	if err != nil {
		return nil, err
	}

	return db, nil
}

// Sample Connection String: "postgres://<username>:<password>@127.0.0.1:<port>"
func PostgresDBConnectFunc(connectionString string) DBConnectFunc {
	url, err := url.Parse(connectionString)
	if err != nil {
		panic(fmt.Errorf("invalid connection string: %s", err))
	}
	if url.Scheme != "postgres" && url.Scheme != "postgresql" {
		panic(fmt.Errorf("invalid connection string scheme: [%s], must be [postgres] or [postgresql]", url.Scheme))
	}

	return func(dbName string) (*dbx.DB, error) {
		fmt.Println("Connecting to DB:", dbName)
		// clone url and replace the db name
		urlClone := *url
		urlClone.Path = dbName
		db, err := dbx.MustOpen("pgx", urlClone.String())
		if err != nil && regexp.MustCompile(`database ".+" does not exist`).MatchString(err.Error()) {
			fmt.Println("Database not found, creating:", dbName)
			if err := createDatabase(connectionString, dbName); err != nil {
				return nil, fmt.Errorf("Failed to create database [%s]: %s, please create it manually", dbName, err)
			}
			fmt.Println("Database created, reconnecting:", dbName)
			db, err = dbx.MustOpen("pgx", urlClone.String())
		}
		if err != nil {
			return nil, fmt.Errorf("failed to connect to Postgres: %s", err)
		}

		return db, nil
	}
}

func createDatabase(connectionString string, dbName string) error {
	initDB, err := dbx.MustOpen("pgx", connectionString)
	if err != nil {
		return err
	}
	_, err = initDB.NewQuery(fmt.Sprintf(`CREATE DATABASE "%s"`, dbName)).Execute()
	if err != nil {
		return err
	}
	return nil
}

// MysqlDBConnectFunc returns a DBConnectFunc for MySQL connection.
// Sample Connection String: "user:password@tcp(127.0.0.1:3306)/"
func MysqlDBConnectFunc(connectionString string) DBConnectFunc {
	return func(dbName string) (*dbx.DB, error) {
		fmt.Println("Connecting to MySQL DB:", dbName)

		baseDSN := connectionString
		if !strings.HasSuffix(baseDSN, "/") {
			if strings.Contains(baseDSN, "?") {
				fmt.Println("Warning: MySQL connection string should preferably end with /")
			} else {
				baseDSN += "/"
			}
		}

		fullDSN := baseDSN + dbName + "?parseTime=true&loc=Local&multiStatements=true&sql_mode='ANSI_QUOTES'"

		db, err := dbx.Open("mysql", fullDSN)
		if err != nil {
			// This usually doesn't fail immediately, validation happens on Ping
		}

		// Ping to check connection and database existence
		if err := db.DB().Ping(); err != nil {
			// Check if error is "Unknown database" (Error 1049)
			if strings.Contains(err.Error(), "Unknown database") {
				fmt.Println("Database not found, creating:", dbName)
				if err := createMysqlDatabase(baseDSN, dbName); err != nil {
					return nil, fmt.Errorf("Failed to create database [%s]: %s", dbName, err)
				}
				fmt.Println("Database created, reconnecting:", dbName)
				// Reconnect
				db, err = dbx.Open("mysql", fullDSN)
			} else {
				return nil, fmt.Errorf("failed to connect to MySQL: %s", err)
			}
		}

		if err != nil {
			return nil, err
		}

		return db, nil
	}
}

func createMysqlDatabase(baseDSN string, dbName string) error {
	// Connect without DB name to creates it
	// baseDSN ends with / usually
	initDB, err := dbx.Open("mysql", baseDSN)
	if err != nil {
		return err
	}
	defer initDB.Close()

	_, err = initDB.NewQuery(fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci", dbName)).Execute()
	return err
}
