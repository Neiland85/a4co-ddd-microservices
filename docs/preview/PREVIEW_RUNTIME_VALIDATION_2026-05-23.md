# A4CO Preview Runtime Validation — 2026-05-23

## Estado

Preview híbrido levantado correctamente.

## Infraestructura

- Postgres en Docker: localhost:5433
- NATS en Docker: localhost:4222 / 8222

## Servicios locales

- API Gateway: localhost:3000
- Order Service: localhost:3004
- Inventory Service: localhost:3006

## Validaciones OK

- GET /api/v1/health → 200
- GET /api/v1/orders → 200
- GET /api/v1/orders/metrics → 200
- GET /api/v1/inventory/health → 200
- GET /api/docs → 200

## Pendiente conocido

- GET /api/v1/inventory/products → 500
  - El gateway alcanza inventory.
  - El fallo parece interno del endpoint de productos.
  - Revisar Prisma/migraciones/seed/repositorio de productos.

## Decisión técnica

No continuar con Dockerización completa de apps en esta fase.
Docker queda limitado a infraestructura.
Servicios Nest se ejecutan localmente para preview técnico estable.

## Clasificación

Technical Preview local/híbrido defendible.
No production-ready.
