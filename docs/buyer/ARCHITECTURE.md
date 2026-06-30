# A4CO Buyer Architecture Guide

This document explains the architecture that should be evaluated in the buyer-ready core preview.

## Architectural intent

A4CO is structured as a distributed commerce backend using:

- Domain-Driven Design;
- bounded-context separation;
- NestJS services;
- shared event contracts;
- PostgreSQL/Prisma persistence foundations;
- NATS messaging foundations;
- a gateway as the external entry point;
- observability as a shared operational capability.

The repository is intentionally reviewed as a technical preview, not as a final production deployment.

## Buyer baseline topology

```text
                                  +----------------------+
                                  |  HTTP / API reviewer |
                                  +----------+-----------+
                                             |
                                             v
                                  +----------------------+
                                  |  api-gateway         |
                                  |  @a4co/gateway       |
                                  +----+-------------+---+
                                       |             |
                         orders proxy |             | inventory proxy
                                       |             |
                                       v             v
                         +------------------+   +----------------------+
                         | order-service    |   | inventory-service    |
                         | @a4co/order      |   | @a4co/inventory      |
                         +---------+--------+   +----------+-----------+
                                   |                       |
                                   v                       v
                         +------------------+   +----------------------+
                         | PostgreSQL       |   | PostgreSQL           |
                         | order_db         |   | inventory_db         |
                         +------------------+   +----------------------+
                                   \                       /
                                    \                     /
                                     v                   v
                                      +-----------------+
                                      | NATS / JetStream|
                                      +-----------------+
```

## Bounded contexts

### Order context

The order context is responsible for the order-side business capability. It is represented by:

- service: `apps/services/order-service`;
- package: `@a4co/order-service`;
- domain package: `packages/domain/order`;
- runtime port in beta compose: host `3004`, container `3000`.

### Inventory context

The inventory context is responsible for inventory/availability capability. It is represented by:

- service: `apps/services/inventory-service`;
- package: `@a4co/inventory-service`;
- domain package: `packages/domain/inventory`;
- runtime port in beta compose: host/container `3006`.

### Gateway context

The gateway is the external access layer. It should be treated as the buyer-reviewable public entry point, not as a domain service.

- path: `apps/infrastructure/gateway`;
- package: `@a4co/gateway`;
- runtime port in beta compose: host `8088`, container `3000`.

## Shared contracts and operational packages

| Package | Role |
| --- | --- |
| `packages/shared-events` | Shared event names/contracts used to express cross-context communication. |
| `packages/shared-utils` | Shared utilities used by core services. |
| `packages/observability` | Logging, tracing and metrics foundation. |
| `packages/domain/order` | Order domain boundary. |
| `packages/domain/inventory` | Inventory domain boundary. |

## Runtime baseline

The buyer runtime baseline is:

- `Dockerfile.beta` — deterministic build for gateway, order and inventory preview services.
- `docker-compose.beta.yml` — PostgreSQL, NATS, order-service, inventory-service and api-gateway.
- `scripts/beta-smoke.sh` — health checks for gateway, order, inventory and NATS.

This is intentionally narrower than the extended preview compose file.

## Event-driven boundary

The current preview contains NATS/JetStream infrastructure and shared event packages. The buyer review should evaluate this as an event-driven foundation and contract vocabulary. It should not assume that every target saga/payment compensation flow is fully production-complete until it is added to the buyer validation gate and recorded in `VALIDATION_REPORT.md`.

## Persistence boundary

PostgreSQL is included in the beta runtime. Prisma is part of the monorepo tooling and service foundations. Buyer review should inspect schema/migration maturity per service before treating persistence as production-final.

## Observability boundary

The observability package is part of the current build baseline. Runtime smoke checks validate service availability, not full telemetry completeness. A production-grade observability acceptance package would still need dashboards, alerts, trace sampling policy, log retention policy and incident runbooks.

## Production boundary

Production readiness is not claimed in this phase. The correct buyer conclusion is that A4CO has a real backend architecture core that can be audited, extended, acquired, licensed or integrated after targeted hardening.
