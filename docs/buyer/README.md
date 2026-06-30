# A4CO Buyer Due Diligence Index

This folder is the buyer-facing technical due-diligence entry point for the A4CO core preview.

The purpose is to help a technical reviewer distinguish what is real and executable today from what is partial, experimental, legacy, or roadmap.

## Review order

1. `../../README.md` — 15-minute project entry point.
2. `SERVICE_MATRIX.md` — honest maturity matrix by service/package.
3. `ARCHITECTURE.md` — bounded contexts, gateway and runtime architecture.
4. `VALIDATION_GUIDE.md` — exact commands to run.
5. `../../VALIDATION_REPORT.md` — latest validation status and evidence.
6. `RISK_REGISTER.md` — known risks, debt and recommended follow-up actions.

## Current buyer baseline

The buyer-ready baseline is intentionally narrow:

- `@a4co/gateway`
- `@a4co/order-service`
- `@a4co/inventory-service`
- `@a4co/shared-utils`
- `@a4co/shared-events`
- `@a4co/observability`
- `@a4co/domain-order`
- `@a4co/domain-inventory`
- PostgreSQL
- NATS / JetStream

This is the technical proof to evaluate architecture, bounded-context separation, runtime reproducibility and auditability.

## What should not be inferred

Do not infer that every service folder is complete. Do not infer that every older document represents current scope. Do not infer production readiness from preview runtime success.

A4CO should be reviewed as a controlled core preview with a clear upgrade path, not as a fully finished SaaS.

## Access control recommendation

For a full acquisition, license, partnership or integration review, provide repository access under controlled conditions. Full review should preferably happen under NDA before exposing non-public roadmap, valuation logic, buyer-specific context, internal notes or negotiation material.
