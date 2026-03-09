package issues

import (
	"testing"

	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tests"
	"github.com/pocketbase/pocketbase/tools/search"
)

// https://github.com/fondoger/pocketbase/issues/49
func TestIssue49_DateTimeFieldComparison(t *testing.T) {
	app, _ := tests.NewTestApp()
	defer app.Cleanup()

	// Create a collection with a DateTime field `updated`
	collection := core.NewBaseCollection("test_issue_49")
	collection.Fields.Add(&core.DateField{
		Name: "updated",
	})
	err := app.Save(collection)
	if err != nil {
		t.Fatal(err)
	}
	resolver := core.NewRecordFieldResolver(app, collection, nil, false)

	// Insert a record with a specific date
	record := core.NewRecord(collection)
	record.Set("updated", "2025-09-01")
	err = app.Save(record)
	if err != nil {
		t.Fatal(err)
	}
	record2 := core.NewRecord(collection)
	record2.Set("updated", "2025-08-01")
	err = app.Save(record2)
	if err != nil {
		t.Fatal(err)
	}

	// Test filtering records where `updated` > "2025-08-31"
	whereExpr, _ := search.FilterData(`updated > "2025-08-31"`).BuildExpr(resolver)
	query := app.RecordQuery(collection).Select("COUNT(*) as count")
	_ = resolver.UpdateQuery(query)

	var count int
	err = query.AndWhere(whereExpr).Row(&count)
	if err != nil {
		t.Fatal(err)
	}

	if count != 1 {
		t.Fatalf("Expected 1 record, got %d", count)
	}
}
