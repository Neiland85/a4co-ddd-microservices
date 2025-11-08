# A4CO DDD Microservices (Monorepo)

This repository contains multiple microservices following DDD patterns. Below is a short developer guide and notes about CI/CD workflows.

## CI/CD Workflows

### SQL Script Validation

The repository includes `ci-sql-validate.yml` which validates SQL scripts under `scripts/**` on pull requests and pushes to `develop`.

- It runs a disposable PostgreSQL 15 container, preprocesses `scripts/init-db.sql` with `envsubst`, and executes the processed SQL.
- Optional secrets used by the workflow (can be set in GitHub repository secrets):
  - `CI_POSTGRES_PASSWORD` (defaults to `postgres` for disposable CI DB)
  - `APP_DB_PASSWORD` (defaults to `secure_ci_test_password` for CI user)

Example usage:

```bash
# Locally preprocess and run against a local postgres instance
envsubst < scripts/init-db.sql > /tmp/init-db-processed.sql
psql -h localhost -U postgres -d a4co_platform -f /tmp/init-db-processed.sql
```

### Notes

- SQL files that require variable expansion MUST be preprocessed with `envsubst` or equivalent.
- Secrets must never be committed into the repository. Use GitHub secrets for CI and deployment workflows.
- See `docs/security-guidelines.md` for more details and the PR template for required checks.

