# Arquitectura Saga Pattern - Fase 1

## 📋 Resumen

Este documento describe la implementación del patrón Saga para orquestar transacciones distribuidas en el flujo **Order → Inventory → Payment**.

## 🏗️ Arquitectura General

```
┌─────────────────────────────────────────────────────────┐
│                    ORDER SERVICE                         │
│              (Saga Orchestrator)                         │
│                                                           │
│  ┌─────────────────────────────────────────────────┐    │
│  │         OrderSaga                               │    │
│  │  - Estados: STARTED → STOCK_RESERVED →         │    │
│  │             PAYMENT_PENDING → COMPLETED         │    │
│  │  - Compensación automática                      │    │
│  │  - Timeout: 30 segundos                         │    │
│  └─────────────────────────────────────────────────┘    │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ NATS JetStream
                     │
        ┌────────────┼────────────┐
        │            │            │
┌───────▼──────┐ ┌───▼──────┐ ┌───▼──────────┐
│ INVENTORY    │ │ PAYMENT  │ │              │
│ SERVICE      │ │ SERVICE  │ │              │
│              │ │          │ │              │
│ - Reserva    │ │ - Stripe │ │              │
│   stock      │ │   Intent │ │              │
│ - TTL: 15min │ │ - Webhook│ │              │
└───────┬──────┘ └───┬──────┘ └──────────────┘
        │            │
        └────────────┼────────────┘
                     │
            ┌────────▼────────┐
            │  NATS JetStream │
            │  Event Bus      │
            └─────────────────┘
```

## 🔄 Flujo de Saga

### Estados de la Saga

```typescript
enum SagaState {
  STARTED = 'STARTED',              // Saga iniciada
  STOCK_RESERVED = 'STOCK_RESERVED', // Stock reservado
  PAYMENT_PENDING = 'PAYMENT_PENDING', // Esperando pago
  COMPLETED = 'COMPLETED',           // Completada exitosamente
  FAILED = 'FAILED',                 // Falló
  COMPENSATING = 'COMPENSATING',     // En proceso de compensación
  COMPENSATED = 'COMPENSATED',       // Compensación completada
}
```

### Flujo Exitoso

1. **Order Service** crea orden y publica `order.created`
2. **Inventory Service** recibe evento, reserva stock y publica `inventory.reserved`
3. **Order Service** recibe `inventory.reserved`, publica `payment.initiate`
4. **Payment Service** recibe evento, crea PaymentIntent en Stripe
5. **Stripe** procesa pago y envía webhook a Payment Service
6. **Payment Service** publica `payment.succeeded`
7. **Order Service** recibe evento y completa la saga

### Compensación

La compensación se activa cuando:

- Inventory no tiene stock suficiente → `inventory.out_of_stock`
- Payment falla → `payment.failed`
- Timeout de saga (30 segundos)

**Proceso de compensación:**

1. Liberar reservas de stock (si existen)
2. Cancelar PaymentIntent (si existe)
3. Actualizar estado de orden a CANCELLED
4. Publicar `order.cancelled`

## 📨 Eventos de Dominio

### Order Service

| Evento | Subject | Descripción |
|--------|---------|-------------|
| `OrderCreated` | `order.created` | Orden creada, inicia saga |
| `OrderCompleted` | `order.completed` | Orden completada exitosamente |
| `OrderCancelled` | `order.cancelled` | Orden cancelada (compensación) |

### Inventory Service

| Evento | Subject | Descripción |
|--------|---------|-------------|
| `InventoryReserved` | `inventory.reserved` | Stock reservado exitosamente |
| `InventoryOutOfStock` | `inventory.out_of_stock` | Stock insuficiente |
| `InventoryReleased` | `inventory.released` | Reserva liberada |

### Payment Service

| Evento | Subject | Descripción |
|--------|---------|-------------|
| `PaymentInitiated` | `payment.initiate` | Inicio de procesamiento de pago |
| `PaymentSucceeded` | `payment.succeeded` | Pago exitoso |
| `PaymentFailed` | `payment.failed` | Pago fallido |

## 🔧 Configuración NATS JetStream

### Streams

```javascript
// Stream ORDERS
{
  name: 'ORDERS',
  subjects: ['order.*'],
  retention: 'workqueue',
  maxAge: 86400000, // 24 horas
}

// Stream PAYMENTS
{
  name: 'PAYMENTS',
  subjects: ['payment.*'],
  retention: 'workqueue',
  maxAge: 86400000,
}

// Stream INVENTORY
{
  name: 'INVENTORY',
  subjects: ['inventory.*'],
  retention: 'workqueue',
  maxAge: 86400000,
}
```

### Consumers

Cada servicio tiene su propio consumer group para garantizar procesamiento:

- `order-service-queue`: Order Service
- `payment-service-queue`: Payment Service
- `inventory-service-queue`: Inventory Service

## 🧪 Testing

### Tests E2E

Los tests E2E validan:

1. ✅ Flujo completo exitoso
2. ✅ Compensación por stock insuficiente
3. ✅ Compensación por pago fallido
4. ✅ Timeout de saga

Ver: `apps/order-service/tests/e2e/order-saga.e2e.spec.ts`

## 📊 Métricas

### Métricas de Saga

- `saga_success_rate`: Tasa de éxito de sagas
- `saga_duration`: Duración promedio de sagas
- `saga_compensation_rate`: Tasa de compensaciones
- `order_status_count`: Contador por estado de orden

### Endpoints

- `GET /orders/metrics`: Métricas Prometheus

## 🚨 Manejo de Errores

### Retry Logic

- **NATS**: Reintentos automáticos configurados en cliente
- **Stripe**: Webhooks con idempotencia
- **Database**: Transacciones con rollback

### Timeout

- **Saga Timeout**: 30 segundos
- **Reservation TTL**: 15 minutos

## 📝 Próximos Pasos

1. ✅ Implementar métricas Prometheus
2. ✅ Tests de carga (100 órdenes concurrentes)
3. ✅ Dashboard de monitoreo en Grafana
4. ✅ Alertas para sagas fallidas

## 🔗 Referencias

- [Saga Pattern](https://microservices.io/patterns/data/saga.html)
- [NATS JetStream](https://docs.nats.io/nats-concepts/jetstream)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
