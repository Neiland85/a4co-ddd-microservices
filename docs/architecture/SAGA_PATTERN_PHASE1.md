# 🔄 Saga Pattern - Fase 1: Order Flow

## 📋 Resumen

Este documento describe la implementación del Saga Pattern para el flujo de procesamiento de órdenes en A4CO, utilizando el patrón de **Orquestación** con Order Service como coordinador.

## 🎯 Objetivo

Garantizar la consistencia de datos en transacciones distribuidas que involucran múltiples microservicios (Order, Inventory, Payment) mediante compensaciones automáticas cuando ocurren fallos.

---

## 🏗️ Arquitectura

### Servicios Involucrados

1. **Order Service** (Orchestrator)
   - Puerto: 3004
   - Rol: Coordinador de la saga
   - Responsabilidad: Gestionar el flujo completo y compensaciones

2. **Inventory Service**
   - Puerto: 3006
   - Rol: Gestor de stock
   - Responsabilidad: Reservar/liberar inventario

3. **Payment Service**
   - Puerto: 3005
   - Rol: Procesador de pagos
   - Responsabilidad: Procesar pagos con Stripe

4. **NATS JetStream**
   - Puerto: 4222
   - Rol: Event Bus
   - Responsabilidad: Comunicación asíncrona entre servicios

---

## 📊 Diagrama de Secuencia

### Flujo Exitoso (Happy Path)

\`\`\`
┌────────┐      ┌─────────────┐      ┌───────────────┐      ┌─────────────┐
│ Client │      │   Order     │      │   Inventory   │      │   Payment   │
│        │      │  Service    │      │   Service     │      │   Service   │
└───┬────┘      └──────┬──────┘      └───────┬───────┘      └──────┬──────┘
    │                  │                     │                     │
    │  POST /orders    │                     │                     │
    ├─────────────────>│                     │                     │
    │                  │                     │                     │
    │   201 Created    │                     │                     │
    │<─────────────────┤                     │                     │
    │  {orderId}       │                     │                     │
    │                  │                     │                     │
    │                  │ orders.created      │                     │
    │                  ├────────────────────>│                     │
    │                  │                     │                     │
    │                  │                     │ Check Stock         │
    │                  │                     │ Reserve Stock       │
    │                  │                     │                     │
    │                  │ inventory.reserved  │                     │
    │                  │<────────────────────┤                     │
    │                  │ {reservationId}     │                     │
    │                  │                     │                     │
    │                  │ payments.process_request                  │
    │                  ├──────────────────────────────────────────>│
    │                  │                     │                     │
    │                  │                     │                     │ Create Payment
    │                  │                     │                     │ Intent (Stripe)
    │                  │                     │                     │
    │                  │ payments.succeeded  │                     │
    │                  │<──────────────────────────────────────────┤
    │                  │ {paymentId}         │                     │
    │                  │                     │                     │
    │                  │ orders.confirmed    │                     │
    │                  ├────────────────────>│ (Info)              │
    │                  │                     │                     │
    │                  │ Update Order        │                     │
    │                  │ Status: CONFIRMED   │                     │
    │                  │                     │                     │
\`\`\`

### Flujo con Compensación: Fallo en Pago

\`\`\`
┌────────┐      ┌─────────────┐      ┌───────────────┐      ┌─────────────┐
│ Client │      │   Order     │      │   Inventory   │      │   Payment   │
│        │      │  Service    │      │   Service     │      │   Service   │
└───┬────┘      └──────┬──────┘      └───────┬───────┘      └──────┬──────┘
    │                  │                     │                     │
    │  POST /orders    │                     │                     │
    ├─────────────────>│                     │                     │
    │   201 Created    │                     │                     │
    │<─────────────────┤                     │                     │
    │                  │                     │                     │
    │                  │ orders.created      │                     │
    │                  ├────────────────────>│                     │
    │                  │                     │                     │
    │                  │ inventory.reserved  │                     │
    │                  │<────────────────────┤                     │
    │                  │                     │                     │
    │                  │ payments.process_request                  │
    │                  ├──────────────────────────────────────────>│
    │                  │                     │                     │
    │                  │                     │                     │ ❌ Payment
    │                  │                     │                     │    Fails
    │                  │                     │                     │
    │                  │ payments.failed     │                     │
    │                  │<──────────────────────────────────────────┤
    │                  │ {reason}            │                     │
    │                  │                     │                     │
    │                  │ 🔄 COMPENSATION     │                     │
    │                  │                     │                     │
    │                  │ inventory.release_request                 │
    │                  ├────────────────────>│                     │
    │                  │                     │                     │
    │                  │                     │ Release Reserved    │
    │                  │                     │ Stock               │
    │                  │                     │                     │
    │                  │ inventory.released  │                     │
    │                  │<────────────────────┤                     │
    │                  │                     │                     │
    │                  │ orders.cancelled    │                     │
    │                  ├────────────────────>│ (Info)              │
    │                  │                     │                     │
    │                  │ Update Order        │                     │
    │                  │ Status: CANCELLED   │                     │
    │                  │                     │                     │
\`\`\`

### Flujo con Compensación: Stock Insuficiente

\`\`\`
┌────────┐      ┌─────────────┐      ┌───────────────┐
│ Client │      │   Order     │      │   Inventory   │
│        │      │  Service    │      │   Service     │
└───┬────┘      └──────┬──────┘      └───────┬───────┘
    │                  │                     │
    │  POST /orders    │                     │
    ├─────────────────>│                     │
    │   201 Created    │                     │
    │<─────────────────┤                     │
    │                  │                     │
    │                  │ orders.created      │
    │                  ├────────────────────>│
    │                  │                     │
    │                  │                     │ ❌ Check Stock
    │                  │                     │    Insufficient
    │                  │                     │
    │                  │ inventory.out_of_stock
    │                  │<────────────────────┤
    │                  │ {unavailableItems}  │
    │                  │                     │
    │                  │ orders.failed       │
    │                  │                     │
    │                  │ Update Order        │
    │                  │ Status: FAILED      │
    │                  │                     │
\`\`\`

---

## 🔄 Estados de la Saga

### Enum: SagaStatus

\`\`\`typescript
enum SagaStatus {
  STARTED = 'STARTED',
  INVENTORY_RESERVED = 'INVENTORY_RESERVED',
  PAYMENT_PROCESSING = 'PAYMENT_PROCESSING',
  PAYMENT_SUCCEEDED = 'PAYMENT_SUCCEEDED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  COMPENSATING = 'COMPENSATING',
  COMPENSATED = 'COMPENSATED',
}
\`\`\`

### Transiciones de Estado

\`\`\`
STARTED
  └─> INVENTORY_RESERVED
       └─> PAYMENT_PROCESSING
            └─> PAYMENT_SUCCEEDED
                 └─> COMPLETED ✅

STARTED
  └─> FAILED ❌ (stock insuficiente)

INVENTORY_RESERVED
  └─> PAYMENT_PROCESSING
       └─> COMPENSATING 🔄 (pago fallido)
            └─> COMPENSATED
\`\`\`

---

## 📡 Eventos de Dominio

### Orders

| Evento | Subject | Payload |
|--------|---------|---------|
| **OrderCreated** | \`orders.created\` | orderId, customerId, items, totalAmount |
| **OrderConfirmed** | \`orders.confirmed\` | orderId, paymentId, timestamp |
| **OrderCancelled** | \`orders.cancelled\` | orderId, reason, timestamp |
| **OrderFailed** | \`orders.failed\` | orderId, reason, failureStage |

### Inventory

| Evento | Subject | Payload |
|--------|---------|---------|
| **InventoryReserved** | \`inventory.reserved\` | orderId, reservationId, items, expiresAt |
| **InventoryOutOfStock** | \`inventory.out_of_stock\` | orderId, unavailableItems |
| **InventoryReleased** | \`inventory.released\` | orderId, reservationId, reason |

### Payments

| Evento | Subject | Payload |
|--------|---------|---------|
| **PaymentSucceeded** | \`payments.succeeded\` | orderId, paymentId, amount, stripePaymentIntentId |
| **PaymentFailed** | \`payments.failed\` | orderId, reason, timestamp |
| **PaymentProcessRequest** | \`payments.process_request\` | orderId, customerId, amount |

---

## ⚙️ Configuración NATS JetStream

### Streams Configurados

\`\`\`bash

# Stream para Orders

STREAM: ORDERS
  Subjects: orders.*
  Storage: file
  Retention: 7 days
  Max Messages: unlimited

# Stream para Payments

STREAM: PAYMENTS
  Subjects: payments.*
  Storage: file
  Retention: 7 days
  Max Messages: unlimited

# Stream para Inventory

STREAM: INVENTORY
  Subjects: inventory.*
  Storage: file
  Retention: 7 days
  Max Messages: unlimited
\`\`\`

### Consumers Configurados

\`\`\`bash

# Payment Service escucha orders.created

CONSUMER: payment-service
  Stream: ORDERS
  Filter: orders.created
  Ack: explicit
  Max Deliver: 3

# Inventory Service escucha orders.created

CONSUMER: inventory-service
  Stream: ORDERS
  Filter: orders.created
  Ack: explicit
  Max Deliver: 3

# Order Service escucha eventos de Payment

CONSUMER: order-service-payment
  Stream: PAYMENTS
  Filter: payments.*
  Ack: explicit
  Max Deliver: 3

# Order Service escucha eventos de Inventory

CONSUMER: order-service-inventory
  Stream: INVENTORY
  Filter: inventory.*
  Ack: explicit
  Max Deliver: 3
\`\`\`

---

## 🛡️ Manejo de Errores y Resiliencia

### Timeouts

- **Saga Timeout:** 5 minutos
- **Reserva de Inventario TTL:** 15 minutos (configurable)
- **Payment Processing Timeout:** 2 minutos

### Reintentos

- **NATS Max Deliver:** 3 intentos
- **Exponential Backoff:** Implementado en consumidores

### Idempotencia

Todos los handlers de eventos son idempotentes:

- Verifican si el evento ya fue procesado
- Usan \`orderId\` como clave de idempotencia
- Previenen procesamiento duplicado

---

## 📊 Métricas

### Métricas Expuestas

\`\`\`prometheus

# Tasa de éxito de sagas

saga_success_rate

# Duración de sagas (p50, p95, p99)

saga_duration_seconds

# Total de compensaciones

saga_compensation_total

# Tasa de éxito de compensaciones

saga_compensation_success_rate

# Estados de órdenes

order_status_count{status="CONFIRMED|CANCELLED|FAILED"}

# Reservas activas

inventory_reservations_active

# Pagos procesados

payments_processed_total{status="succeeded|failed"}
\`\`\`

### Dashboard Grafana

Ver: \`/infra/grafana/dashboards/saga-monitoring.json\`

---

## 🧪 Testing

### Tests E2E

\`\`\`bash

# Test flujo completo exitoso

npm run test:e2e order-saga-flow

# Test compensaciones

npm run test:e2e order-saga-compensation

# Test carga concurrente

npm run test:e2e:load
\`\`\`

### Archivos de Test

- \`/tests/e2e/order-saga-flow.e2e.spec.ts\`
- \`/tests/e2e/order-saga-compensation.e2e.spec.ts\`

---

## 🚀 Despliegue

### Prerequisitos

1. NATS JetStream corriendo
2. PostgreSQL para cada servicio
3. Variables de entorno configuradas

### Setup NATS

\`\`\`bash

# Ejecutar script de configuración

./infra/nats/jetstream-setup.sh
\`\`\`

### Iniciar Servicios

\`\`\`bash

# Docker Compose

docker compose -f compose.dev.yaml up -d

# O servicios individuales

pnpm --filter @a4co/order-service start:dev
pnpm --filter @a4co/payment-service start:dev
pnpm --filter @a4co/inventory-service start:dev
\`\`\`

---

## 📚 Referencias

- [Saga Pattern - Microservices.io](https://microservices.io/patterns/data/saga.html)
- [NATS JetStream Documentation](https://docs.nats.io/nats-concepts/jetstream)
- [Event-Driven Architecture Patterns](https://martinfowler.com/articles/201701-event-driven.html)

---

## 👥 Equipo

- **Tech Lead:** Responsable de arquitectura
- **Backend Team:** Implementación de servicios
- **DevOps Team:** Infraestructura y monitoreo

---

**Última actualización:** 2025-11-11  
**Versión:** 1.0.0  
**Estado:** ✅ Implementado
