# Scripts

This folder contains convenience scripts for local development and database
initialization.

## init-db.sql (PostgreSQL)

- Purpose: create the `a4co_app` role idempotently and configure database-level
  settings and extensions used by the services.
- Dialect: PostgreSQL only. This script is NOT T-SQL (SQL Server).

### Why this matters

Some VS Code SQL extensions (for example `mssql`) parse SQL as T-SQL and report
syntax errors for Postgres-specific constructs such as `DO $$ ... $$;`,
`CREATE EXTENSION`, or `\set` psql variables. If the script runs fine with
`psql` but your editor shows errors, it's likely a dialect/linter mismatch.

### How to run

Recommended (reads password from environment variable):

```bash
APP_DB_PASSWORD="${APP_DB_PASSWORD:-secure_dev_password}" \
  psql -v APP_DB_PASSWORD="$APP_DB_PASSWORD" -d a4co_platform -f scripts/init-db.sql
```

Alternative (pass password directly for local/dev only):

```bash
psql -v APP_DB_PASSWORD='secure_dev_password' -d a4co_platform -f scripts/init-db.sql
```

Notes:

- Run the command while connected to the target database `a4co_platform` (or
  change `-d` accordingly).
- `CREATE EXTENSION` statements must be executed inside the database where you
  want them installed.

### Editor hints

- In VS Code change the file language mode to "SQL (PostgreSQL)" (bottom-right)
  or install a PostgreSQL-aware extension (for example "PostgreSQL" or
  "SQLTools") to avoid false linting errors.

If you want, I can add a CI check that validates `psql -f scripts/init-db.sql`
against a disposable Postgres container. Tell me if you want that and I will add
it as a GitHub Actions job.
