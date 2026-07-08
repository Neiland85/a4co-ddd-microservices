# Índice de evidencias técnicas ENS-ready

## Runtime beta incremental

Carpeta de evidencia:

- `docs/ens/04_evidencias/runtime-beta-20260708-024013`

Resultado:

- Postgres healthy.
- NATS healthy.
- API Gateway healthy.
- Order Service healthy.
- Inventory Service healthy.
- Gateway health/live/ready responden 200 OK.
- Order endpoint `/orders` responde 200 OK.
- Inventory health responde 200 OK.
- NATS healthz responde 200 OK.

Alcance:

- Validación incremental de runtime beta.
- No equivale a certificación ENS.
- No equivale a `buyer:validate` completo.
- Auth/Product/Payment quedan fuera de este hito.
