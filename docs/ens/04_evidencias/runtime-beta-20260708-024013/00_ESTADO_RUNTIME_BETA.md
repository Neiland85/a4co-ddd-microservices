# Runtime beta incremental

Estado:
- Postgres healthy.
- NATS healthy.
- API Gateway healthy.
- Order Service healthy.
- Inventory Service healthy.
- Auth/Product/Payment no incluidos en esta validación incremental.
- Puerto 8080 descartado: pertenece a otro servicio Uvicorn externo a este compose beta.
- Puertos válidos beta: 8088 gateway, 3004 order, 3006 inventory, 55433 postgres, 14222/18222 nats.

Resultado:
Runtime beta incremental válido para baseline técnico ENS-ready.
No equivale todavía a buyer:validate completo.
