package dbutils

import (
	"fmt"
	"os"
	"strings"

	"github.com/pocketbase/dbx"
)

// TODO: replace json with `jsonb` everywhere in the codebase
// TODO: Use PostgreSQL's native JSON functions instead of manually simulate JSON functions like SQLite.

// JSONEach returns JSON_EACH SQLite string expression with
// some normalizations for non-json columns.
func JSONEach(column string) string {
	dbType := os.Getenv("DB_TYPE")
	if dbType == "postgres" {
		// PostgreSQL:
		return fmt.Sprintf(
			`jsonb_array_elements_text(CASE WHEN ([[%s]] IS JSON OR json_valid([[%s]]::text)) AND jsonb_typeof([[%s]]::jsonb) = 'array' THEN [[%s]]::jsonb ELSE jsonb_build_array([[%s]]) END)`,
			column, column, column, column, column,
		)
	}

	if dbType == "mysql" {
		// MySQL:
		return fmt.Sprintf(
			`JSON_TABLE(CASE WHEN JSON_VALID([[%s]]) AND JSON_TYPE([[%s]])='ARRAY' THEN [[%s]] ELSE JSON_ARRAY([[%s]]) END, "$[*]" COLUMNS (value JSON PATH "$"))`,
			column, column, column, column,
		)
	}

	// SQLite (default):
	return fmt.Sprintf(
		`json_each(CASE WHEN iif(json_valid([[%s]]), json_type([[%s]])='array', FALSE) THEN [[%s]] ELSE json_array([[%s]]) END)`,
		column, column, column, column,
	)
}

// JSONEachByPlaceholder expands a given user input json array to multiple rows.
// Use [JSONEach] if you want to expand a column value instead.
// The [placeholder] is the parameter placeholder in SQL prepared statements.
// We assume the parameter value is a marshalled JSON array.
func JSONEachByPlaceholder(placeholder string) string {
	dbType := os.Getenv("DB_TYPE")
	if dbType == "postgres" {
		// PostgreSQL:
		return fmt.Sprintf(`jsonb_array_elements({:%s}::jsonb)`, placeholder)
	}

	if dbType == "mysql" {
		// MySQL:
		return fmt.Sprintf(`JSON_TABLE({:%s}, "$[*]" COLUMNS (value JSON PATH "$"))`, placeholder)
	}

	// SQLite (default):
	return fmt.Sprintf("json_each({:%s})", placeholder)
}

// JsonArrayExistsStr is used to determine whether a JSON string array contains a string element.
// Right now it only used to determine whether a JSON string ID array contains a specific ID.
// Operation "?" definition: Does the string exist as a top-level key within the JSON value?
// The type of the key is only supported to be string.
// If we want to support other types, we may need to use `@>` operator instead.
func JsonArrayExistsStr(column string, strValue string) dbx.Expression {
	dbType := os.Getenv("DB_TYPE")
	if dbType == "postgres" {
		// PostgreSQL:
		return dbx.NewExp(fmt.Sprintf("[[%s]] ? {:value}::text", column), dbx.Params{
			"value": strValue,
		})
	}

	if dbType == "mysql" {
		// MySQL:
		return dbx.NewExp(fmt.Sprintf(
			"JSON_CONTAINS([[%s]], JSON_ARRAY({:value}))",
			column,
		), dbx.Params{"value": strValue})
	}

	// SQLite (default):
	return dbx.NewExp(fmt.Sprintf(
		"EXISTS (SELECT 1 FROM json_each([[%s]]) WHERE value = {:value})",
		column,
	), dbx.Params{"value": strValue})
}

// JSONArrayLength returns JSON_ARRAY_LENGTH SQLite string expression
// with some normalizations for non-json columns.
//
// It works with both json and non-json column values.
//
// Returns 0 for empty string or NULL column values.
func JSONArrayLength(column string) string {
	dbType := os.Getenv("DB_TYPE")
	if dbType == "postgres" {
		// PostgreSQL:
		return fmt.Sprintf(
			`(CASE WHEN ([[%s]] IS JSON OR JSON_VALID([[%s]]::text)) AND jsonb_typeof([[%s]]::jsonb) = 'array' THEN jsonb_array_length([[%s]]::jsonb) ELSE 0 END)`,
			column, column, column, column,
		)
	}

	if dbType == "mysql" {
		// MySQL:
		return fmt.Sprintf(
			`(CASE WHEN JSON_VALID([[%s]]) AND JSON_TYPE([[%s]])='ARRAY' THEN JSON_LENGTH([[%s]]) ELSE 0 END)`,
			column, column, column,
		)
	}

	// SQLite (default):
	return fmt.Sprintf(
		`json_array_length(CASE WHEN iif(json_valid([[%s]]), json_type([[%s]])='array', FALSE) THEN [[%s]] ELSE (CASE WHEN [[%s]] = '' OR [[%s]] IS NULL THEN json_array() ELSE json_array([[%s]]) END) END)`,
		column, column, column, column, column, column,
	)
}

// JSONExtract returns a JSON_EXTRACT SQLite string expression with
// some normalizations for non-json columns.
func JSONExtract(column string, path string) string {
	// prefix the path with dot if it is not starting with array notation
	if path != "" && !strings.HasPrefix(path, "[") {
		path = "." + path
	}

	dbType := os.Getenv("DB_TYPE")
	if dbType == "postgres" {
		// PostgreSQL:
		return fmt.Sprintf(
			`JSON_QUERY_OR_NULL([[%s]], '$%s')::jsonb`,
			column,
			path,
		)
	}

	if dbType == "mysql" {
		// MySQL:
		return fmt.Sprintf(
			`JSON_EXTRACT([[%s]], '$%s')`,
			column,
			path,
		)
	}

	// SQLite (default):
	return fmt.Sprintf(
		// note: the extra object wrapping is needed to workaround the cases where a json_extract is used with non-json columns.
		"(CASE WHEN json_valid([[%s]]) THEN JSON_EXTRACT([[%s]], '$%s') ELSE JSON_EXTRACT(json_object('pb', [[%s]]), '$.pb%s') END)",
		column,
		column,
		path,
		column,
		path,
	)
}
