# 🧭 FASE 1 — CORE DDD + SAGAS

## Objetivo
Consolidar el flujo de negocio principal **Order → Payment → Inventory** con comunicación asíncrona (NATS) y persistencia independiente por microservicio.

## Servicios implicados
| Servicio | Rol | DB Schema |
|-----------|-----|-----------|
| order-service | Coordinador de pedidos (Saga) | orders_schema |
| payment-service | Procesamiento de pagos (Stripe sandbox) | payments_schema |
| inventory-service | Reserva/liberación de stock | inventory_schema |

## Comunicación
- Bus de eventos: **NATS JetStream**
- Eventos dominio:
  - OrderCreated
  - PaymentSucceeded / PaymentFailed
  - InventoryReserved / InventoryOutOfStock
  - OrderCancelled

## Resultado esperado
- `POST /orders` → Crea pedido y dispara saga completa
- Trazabilidad total entre servicios
- Métricas Prometheus expuestas
- Tests E2E cubriendo 3 flujos clave
