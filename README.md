# A4CO DDD Microservices (Monorepo)

This repository contains multiple microservices following DDD patterns.
Below is a short developer guide and notes about CI/CD workflows.

## CI/CD Workflows

### SQL Script Validation

- The repository includes `ci-sql-validate.yml` which validates SQL scripts under `scripts/**` on pull requests
  and pushes to `develop`.

- It runs a disposable PostgreSQL 15 container, preprocesses `scripts/init-db.sql` with `envsubst`,
  and executes the processed SQL.
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

## Development setup and git hooks

Follow these steps after cloning the repository to ensure hooks and script tooling work correctly:

1. Install dependencies (pnpm workspaces):

```bash
pnpm install
```

2. Verify a critical dev dependency is available (helps diagnose hook issues):

```bash
pnpm run verify:deps
# or: node -e "require('json5')"
```

3. Git hooks are installed automatically via the `prepare` script which runs `simple-git-hooks`.
  If hooks are missing or you changed them, run:

```bash
pnpm run prepare
```

Post-commit hook behavior

- The repository runs a non-blocking post-commit hook that updates cSpell dictionaries after commits.
- The hook runs `bash scripts/update-dicts-safe.sh` which checks for required dependencies and runs the TypeScript script via `ts-node --project tsconfig.scripts.json`.
- If the dictionary update fails (for example, `json5` is missing), the hook will print a helpful message but will not prevent the commit.

Manual dictionary update

To update dictionaries manually run:

```bash
pnpm run update:dicts
```

If you see an error like `Cannot find module 'json5'`, run `pnpm install` at the repository root.

### VSCode settings paths (cross-platform)

The dictionary update script defaults to the macOS user settings path.
If you use Linux or Windows, update the `userPath` constant in `scripts/update-cspell-dicts.ts` before running the script.

- macOS (default): `~/Library/Application Support/Code/User/settings.json`
- Linux: `~/.config/Code/User/settings.json`
- Windows: `%APPDATA%\Code\User\settings.json`

