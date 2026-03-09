#!/usr/bin/env python3
# pip install psycopg[binary]

import psycopg

dsn = "postgresql://user:pass@127.0.0.1/pb-data"


# cur.execute("PREPARE q AS SELECT $1::int + 1")
# cur.execute("EXECUTE q(41)")
# print(cur.fetchone()[0])  # 42
# cur.execute("DEALLOCATE q")

def expect_error(callback, substr):
    try:
        callback()
        assert False, "Expected exception, but none was raised"
    except Exception as e:
        assert substr in str(e), f"Expected exception message to contain '{substr}', got '{str(e)}'"

def expect_good(callback):
    try:
        callback()
    except Exception as e:
        assert False, f"Expected no exception, but got: {str(e)}"

cur = psycopg.connect(dsn).cursor()
expect_good(
    lambda: cur.execute("PREPARE q AS select $1 is distinct from $2")
)

cur = psycopg.connect(dsn).cursor()
expect_good(
    lambda: cur.execute("PREPARE q AS select null is distinct from null")
)

cur = psycopg.connect(dsn).cursor()
expect_error(
    lambda: cur.execute("PREPARE q AS select null is distinct from $1"),
    "could not determine data type of parameter $1",
)


cur = psycopg.connect(dsn).cursor()
expect_good(
    lambda: cur.execute("PREPARE q AS select 1 as res where $1 = $2")
)
cur.execute("SELECT 1 AS res WHERE %s = %s", (5, 5))
res = cur.fetchone()[0]
assert res == 1



