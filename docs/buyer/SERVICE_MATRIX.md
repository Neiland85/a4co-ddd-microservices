# A4CO Buyer Service Matrix

Status language used in this document:

- **Buyer baseline**: included in the current executable buyer-ready proof.
- **Partial**: meaningful code exists, but it is not part of the current buyer validation gate.
- **Stub / skeleton**: structure exists, but not enough to claim functional completeness.
- **Experimental / legacy**: should not be used to evaluate the buyer-ready core without separate review.

## Services and packages

| Component | Type | Buyer status | Evidence / reason | Buyer interpretation |
| --- | --- | --- | --- | --- |
| `apps/infrastructure/gateway` / `@a4co/gateway` | API gateway | Buyer baseline | Built and tested by `build:preview`, `test:preview` and beta runtime. | Public entry point for current technical proof. |
| `apps/services/order-service` / `@a4co/order-service` | Bounded context service | Buyer baseline | Built and tested by preview scripts; included in beta runtime. | Core commerce flow context. |
| `apps/services/inventory-service` / `@a4co/inventory-service` | Bounded context service | Buyer baseline | Built and tested by preview scripts; included in beta runtime. | Core stock/availability context. |
| `packages/domain/order` / `@a4co/domain-order` | Domain package | Buyer baseline | Built before service builds in `build:preview`. | Demonstrates domain separation for order logic. |
| `packages/domain/inventory` / `@a4co/domain-inventory` | Domain package | Buyer baseline | Built before service builds in `build:preview`. | Demonstrates domain separation for inventory logic. |
| `packages/shared-events` | Shared contracts | Buyer baseline | Built before service builds; referenced by service packages. | Shared event vocabulary and cross-context contracts. |
| `packages/shared-utils` | Shared utility package | Buyer baseline | Built before service builds. | Shared utilities, not a domain dumping ground. |
| `packages/observability` | Observability package | Buyer baseline | Built before service builds; referenced by services. | Logging/tracing/metrics foundation. |
| `apps/services/payment-service` | Service | Partial | Present in scripts and target topology, but not included in beta runtime baseline. | Roadmap/extension area; do not treat as finished payment platform. |
| `apps/services/auth-service` | Service | Partial | Present in broader scripts/topology, but not included in beta runtime baseline. | Security/auth context requires separate hardening. |
| `apps/services/product-service` | Service | Partial | Present in broader scripts/topology, but not included in beta runtime baseline. | Product/catalog context requires separate validation. |
| `apps/services/user-service` | Service | Partial / non-core | Referenced by full scripts only. | Not part of current buyer proof. |
| `apps/frontend`, `apps/dashboard-client`, `apps/dashboard-web` | Frontend apps | Non-core for this phase | Present in workspace, but not part of buyer runtime proof. | Useful for future demo, not acquisition-grade backend proof. |
| `apps/transportista-service` | Auxiliary service | Active development | Workspace marks it as auxiliary. | Review separately only if needed. |
| Excluded skeleton services | Various | Stub / skeleton | Workspace explicitly excludes several folders. | Do not count as delivered service value. |
| `docker-compose.beta.yml` | Runtime | Buyer baseline | Canonical local runtime for buyer proof. | Use this for review. |
| `docker-compose.preview.yml` | Runtime | Extended / legacy preview | More ambitious topology with additional services. | Inspect as future/extended context, not the buyer gate. |
| `docker-compose.prod.yml` | Runtime | Not buyer baseline | Production script exists, but production readiness is not claimed. | Do not treat as accepted production deployment. |

## Current proof boundary

The current defensible claim is:

> A4CO contains a real executable microservices core preview with a gateway, order bounded context, inventory bounded context, shared contracts, domain packages, observability foundations, PostgreSQL and NATS runtime infrastructure.

The current defensible claim is **not**:

> A4CO is a complete production commerce platform with finished auth, product, payment, user, frontend and deployment operations.

## Recommended next hardening sequence

1. Keep the buyer baseline green.
2. Decide whether payment belongs in the next buyer gate.
3. If yes, add payment to `Dockerfile.beta`, `docker-compose.beta.yml`, smoke checks and `VALIDATION_REPORT.md`.
4. Only then present order/inventory/payment as a validated cross-service flow.
5. Repeat the same process for auth/product/user rather than presenting them prematurely.
