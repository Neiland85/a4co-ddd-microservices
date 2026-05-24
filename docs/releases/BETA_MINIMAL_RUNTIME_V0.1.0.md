# A4CO Beta Minimal Runtime v0.1.0

## Estado

Beta Docker mínima validada para núcleo backend:

- API Gateway
- Order Service
- Inventory Service
- NATS
- Postgres

## Commits base

- `5ac5409e` — `chore(beta): add minimal runtime commands and status report`
- `f4987f65` — `fix(security): update observability nest runtime dependencies`
- `4c0f7e3b` — `docs(security): triage beta runtime dependabot alerts`
- `803f5c39` — `chore(beta): validate minimal docker runtime healthchecks`
- `0ce5c531` — `chore(beta): add partial docker beta baseline`
- `1854c313` — `test(preview): enable stable smoke test suite`

## Comandos oficiales

```bash
pnpm run beta:up
pnpm run beta:ps
pnpm run beta:smoke
pnpm run beta:down
Smoke HTTP validado
GET http://localhost:8088/api/v1/health -> 200
GET http://localhost:8088/api/v1/health/ready -> 200
GET http://localhost:8088/api/v1/health/live -> 200
GET http://localhost:3004/orders -> 200
GET http://localhost:3006/api/inventory/health -> 200
GET http://localhost:18222/healthz -> 200
Evidencia local

Evidencia generada en:

audit-outputs/final/beta-minimal-runtime-v0.1.0-evidence.log

Nota: audit-outputs/ puede estar fuera de control de versiones si se mantiene como artefacto local de auditoría.

Seguridad

Estado tras triage:

Dependabot agregado de GitHub sigue mostrando deuda amplia del monorepo.
El audit productivo local quedó reducido tras el ajuste de observability.
Las vulnerabilidades restantes principales están fuera del runtime beta mínimo validado.

Referencia:

docs/security/BETA_RUNTIME_DEPENDABOT_TRIAGE.md
Decisión

Esta versión se considera una beta Docker mínima reproducible del núcleo backend, apta para continuar hacia preproducción técnica controlada.

No representa todavía el producto completo ni una release comercial final.
