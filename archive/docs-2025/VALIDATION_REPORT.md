# A4CO Validation Report

Date: 2026-06-30
Branch: `buyer-ready-core-preview`
Scope: buyer-ready core preview.

## Validation position

This report is intentionally conservative. It does not record a successful runtime validation unless the command has been executed in a local clone or by GitHub Actions.

## Buyer baseline

The current validation baseline is:

- gateway;
- order-service;
- inventory-service;
- shared utilities;
- shared events;
- observability package;
- order and inventory domain packages;
- PostgreSQL;
- NATS.

## Commands to validate

- `pnpm install --frozen-lockfile`
- `pnpm run buyer:check`
- `pnpm run buyer:runtime:up`
- `pnpm run buyer:smoke`
- `pnpm run buyer:runtime:down`

## Current recorded results

| Command                          | Result               | Notes                                                                             |
| -------------------------------- | -------------------- | --------------------------------------------------------------------------------- |
| Repository inspection            | Pass                 | README, package scripts, buyer docs and runtime baseline reviewed.                |
| `pnpm install --frozen-lockfile` | Not run in this pass | `pnpm add -Dw eslint@^9.0.0` updated dependency state and lockfile.               |
| `pnpm run lint:preview`          | Pass with warnings   | 0 errors; warnings are known preview technical debt.                              |
| `pnpm run check:fast`            | Pass                 | Node v20.20.0, pnpm 10.14.0, Docker 29.4.0, Compose v5.1.1.                       |
| `pnpm run test:preview`          | Pass                 | Gateway, order-service and inventory-service preview tests passed.                |
| `pnpm run build:preview`         | Pass                 | Shared packages, gateway, order-service and inventory-service built successfully. |
| `pnpm run buyer:runtime:up`      | Not run in this pass | Docker daemon was unavailable earlier in the session.                             |
| `pnpm run buyer:smoke`           | Not run in this pass | Requires running beta runtime.                                                    |
| `pnpm run buyer:runtime:down`    | Not run in this pass | Cleanup command.                                                                  |

## Buyer-readiness statement

A4CO is ready to be reviewed as an executable core preview once the above commands pass in CI or in a clean local clone. Production readiness is not claimed.
