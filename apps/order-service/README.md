# 🧩 Order Service

Microservicio principal de orquestación de pedidos bajo arquitectura DDD + Event-Driven.

## Scripts

```bash
pnpm run dev:order
pnpm test --filter @a4co/order-service

Endpoints
Método  Ruta  Descripción
POST  /orders  Crear nuevo pedido
GET  /orders/:id  Obtener pedido
Eventos NATS

OrderCreated

PaymentSucceeded

PaymentFailed

OrderCancelled

Infraestructura

PostgreSQL (schema: orders_schema)

NATS JetStream

Redis (cache)
