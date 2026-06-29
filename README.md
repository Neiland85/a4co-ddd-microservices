# A4CO — Buyer-Ready Core Preview

A4CO is a TypeScript/NestJS microservices monorepo built to demonstrate a bounded-context commerce backend using DDD, a gateway entry point, shared contracts, PostgreSQL/Prisma foundations, event-driven messaging foundations and observable service boundaries.

This repository is **not presented as a finished production product**. It is a controlled technical preview intended for buyer, partner, license, integration or acquisition evaluation under appropriate access controls and, for full due diligence, preferably under NDA.

## Current buyer-ready position

| Area | Status | Notes |
| --- | --- | --- |
| Core preview | Buyer-reviewable | Gateway, order-service, inventory-service and shared packages are the current validation baseline. |
| Runtime baseline | Buyer-reviewable | `Dockerfile.beta`, `docker-compose.beta.yml` and `scripts/beta-smoke.sh` define the reproducible local runtime path. |
| DDD / bounded contexts | Present | Domain packages and service separation show the intended architecture. |
| Payments | Partial / simulated | Payment is part of the target topology, but it is not part of the current buyer validation baseline. |
| Auth / product / user | Partial / non-core for this phase | Present in the repo, but not used as the buyer gate. |
| Frontends | Non-core for this phase | Useful as context, not as the technical buyer proof. |
| Production readiness | Not claimed | This is a core preview, not a production acceptance package. |

## 15-minute technical review path

A reviewer should start here:

1. Read this README.
2. Open `docs/buyer/SERVICE_MATRIX.md` to understand finished, partial, stub and experimental areas.
3. Open `docs/buyer/ARCHITECTURE.md` to understand the bounded-context layout.
4. Run the documented validation commands below.
5. Check `VALIDATION_REPORT.md` for the latest recorded validation status.

## Core preview topology

```text
HTTP client
  |
  v
api-gateway (@a4co/gateway)
  |-- orders route/proxy --> order-service (@a4co/order-service)
  |-- inventory route/proxy --> inventory-service (@a4co/inventory-service)

Shared packages used by the buyer baseline:
  - @a4co/shared-utils
  - @a4co/shared-events
  - @a4co/observability
  - @a4co/domain-order
  - @a4co/domain-inventory

Infrastructure used by the local preview:
  - PostgreSQL
  - NATS / JetStream
```

The current buyer baseline deliberately focuses on the stable core rather than presenting every folder as equally finished.

## Requirements

- Node.js `>=20 <23`
- pnpm `10.14.0`
- Docker + Docker Compose v2
- macOS/Linux shell environment for the provided scripts

Recommended setup:

```bash
corepack enable
corepack prepare pnpm@10.14.0 --activate
pnpm install --frozen-lockfile
```

## Validation commands

### Static/core validation

```bash
pnpm run buyer:check
```

This runs the preview validation baseline: package validation, environment check, lint, tests and build for the current buyer scope.

### Local runtime validation

```bash
pnpm run buyer:runtime:up
pnpm run buyer:smoke
pnpm run buyer:runtime:down
```

The runtime command builds the deterministic beta image and starts the gateway, order-service, inventory-service, PostgreSQL and NATS baseline. The smoke script checks gateway health, readiness/liveness, order endpoint, inventory health and NATS health.

### Full local validation wrapper

```bash
pnpm run buyer:validate
```

This wrapper runs the static/core validation, starts the runtime baseline, runs smoke checks and shuts the runtime down.

## Repository map

| Path | Purpose |
| --- | --- |
| `apps/infrastructure/gateway` | API gateway / public entry point for the buyer baseline. |
| `apps/services/order-service` | Order bounded context and current order API baseline. |
| `apps/services/inventory-service` | Inventory bounded context and current inventory API baseline. |
| `packages/domain/order` | Order domain package. |
| `packages/domain/inventory` | Inventory domain package. |
| `packages/shared-events` | Shared event contracts / event-driven vocabulary. |
| `packages/shared-utils` | Shared utilities used by the preview baseline. |
| `packages/observability` | Logging/tracing/metrics foundation for services. |
| `docker-compose.beta.yml` | Canonical buyer-reviewable local runtime baseline. |
| `Dockerfile.beta` | Deterministic image build for the buyer runtime baseline. |
| `docs/buyer` | Due-diligence documentation for technical buyers. |
| `VALIDATION_REPORT.md` | Validation status, command matrix and latest recorded evidence. |

## Documentation for buyers

- `docs/buyer/README.md` — due-diligence index.
- `docs/buyer/ARCHITECTURE.md` — architecture, bounded contexts and runtime view.
- `docs/buyer/SERVICE_MATRIX.md` — honest service maturity matrix.
- `docs/buyer/VALIDATION_GUIDE.md` — exact validation procedure.
- `docs/buyer/RISK_REGISTER.md` — known debt, risks and follow-up actions.

## What is intentionally not claimed

A4CO is not currently represented as:

- a final production deployment;
- a complete commerce SaaS;
- a fully implemented payment/auth/product platform;
- a fully security-certified product;
- a repository with zero technical debt.

The buyer-ready claim is narrower and stronger: the repository contains a real, inspectable, executable and auditable core preview with documented boundaries.

## Commercial access note

For full repository access, deeper architecture discussion, integration evaluation, licensing, acquisition or partnership review, access should be controlled and documented. Full due diligence is preferably performed under NDA, especially before exposing internal roadmap, valuation logic, non-public context or buyer-specific integration material.
