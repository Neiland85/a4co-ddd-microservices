# Order Service - Saga Implementation

## Descripción

Este servicio implementa el patrón Saga para orquestar el flujo completo de creación de pedidos, integrando con los servicios de Payment e Inventory mediante comunicación asíncrona vía NATS JetStream.

## Arquitectura

### Patrón DDD + CQRS + Saga

El servicio sigue los principios de Domain-Driven Design (DDD) con:
- **Aggregate Root**: `Order` - Representa la entidad de dominio principal
- **Value Objects**: `OrderStatus`, `Money`, `CustomerId`, `Address`
- **Domain Events**: `OrderCreatedEvent`, `OrderStatusChangedEvent`, `OrderCancelledEvent`, `OrderCompletedEvent`, `OrderFailedEvent`
- **Repository Pattern**: `IOrderRepository` con implementación `PrismaOrderRepository`
- **Use Cases**: `CreateOrderUseCase`
- **Saga Orchestrator**: `OrderSaga` - Orquesta el flujo completo de la saga

## Flujo de Saga: Order → Payment → Inventory

### 1. Creación de Orden (Order Service)

```
POST /orders
```

**Flujo:**
1. Cliente crea una orden mediante `CreateOrderUseCase`
2. Se crea el aggregate `Order` con estado `PENDING`
3. Se guarda en la base de datos mediante `PrismaOrderRepository`
4. Se publican eventos:
   - `order.created` - Evento de dominio
   - `payment.request` - Solicitud de pago al Payment Service

### 2. Procesamiento de Pago (Payment Service → Order Service)

**Eventos recibidos:**

#### `payment.succeeded`
- El Payment Service procesa el pago exitosamente
- `OrderSaga.handlePaymentSucceeded()`:
  1. Carga la orden desde el repository
  2. Llama a `order.confirmPayment()` - Cambia estado a `PAYMENT_CONFIRMED`
  3. Guarda la orden
  4. Publica `inventory.reserve` - Solicita reserva de inventario

#### `payment.failed`
- El pago falla
- `OrderSaga.handlePaymentFailed()`:
  1. Carga la orden
  2. Llama a `order.cancel(reason)` - Cambia estado a `CANCELLED`
  3. Guarda la orden

### 3. Reserva de Inventario (Inventory Service → Order Service)

**Eventos recibidos:**

#### `inventory.reserved`
- El Inventory Service reserva el inventario exitosamente
- `OrderSaga.handleInventoryReserved()`:
  1. Carga la orden
  2. Llama a `order.reserveInventory()` - Cambia estado a `INVENTORY_RESERVED`
  3. Llama a `order.complete()` - Cambia estado a `COMPLETED`
  4. Guarda la orden
  5. Publica `order.completed` - Notifica que la orden está completada

#### `inventory.out_of_stock`
- No hay suficiente inventario
- `OrderSaga.handleInventoryOutOfStock()`:
  1. Carga la orden
  2. Publica `payment.refund` - Solicita reembolso del pago
  3. Llama a `order.cancel(reason)` - Cancela la orden
  4. Guarda la orden

## Estados de la Orden

```
PENDING → PAYMENT_CONFIRMED → INVENTORY_RESERVED → COMPLETED
   ↓              ↓                    ↓
CANCELLED    CANCELLED          CANCELLED
   ↓              ↓                    ↓
FAILED        FAILED             FAILED
```

### Transiciones válidas:

- `PENDING` → `PAYMENT_CONFIRMED`, `CANCELLED`, `FAILED`
- `PAYMENT_CONFIRMED` → `INVENTORY_RESERVED`, `CANCELLED`, `FAILED`
- `INVENTORY_RESERVED` → `COMPLETED`, `CANCELLED`, `FAILED`
- `COMPLETED` → (estado final)
- `CANCELLED` → (estado final)
- `FAILED` → (estado final)

## Compensación (Rollback)

La saga implementa transacciones compensatorias:

1. **Si el pago falla**: La orden se cancela automáticamente
2. **Si el inventario está agotado**: 
   - Se solicita reembolso del pago (`payment.refund`)
   - La orden se cancela
3. **Si hay errores en el procesamiento**: 
   - Se marca la orden como `FAILED`
   - Se solicita reembolso si el pago ya fue confirmado

## Eventos Publicados

### Por Order Service:

- `order.created` - Cuando se crea una nueva orden
- `payment.request` - Solicitud de procesamiento de pago
- `inventory.reserve` - Solicitud de reserva de inventario
- `order.completed` - Cuando la orden se completa exitosamente
- `payment.refund` - Solicitud de reembolso (compensación)

### Escuchados por Order Service:

- `payment.succeeded` - Pago procesado exitosamente
- `payment.failed` - Pago fallido
- `inventory.reserved` - Inventario reservado exitosamente
- `inventory.out_of_stock` - Inventario agotado

## Estructura del Proyecto

```
apps/order-service/
├── src/
│   ├── domain/
│   │   ├── aggregates/
│   │   │   └── order.aggregate.ts      # Aggregate Root Order
│   │   ├── value-objects/
│   │   │   ├── order-status.vo.ts      # Value Object OrderStatus
│   │   │   ├── money.vo.ts             # Value Object Money
│   │   │   ├── customer-id.vo.ts       # Value Object CustomerId
│   │   │   └── address.vo.ts           # Value Object Address
│   │   └── index.ts                    # Exports del dominio
│   ├── application/
│   │   ├── sagas/
│   │   │   └── order.saga.ts           # Saga Orchestrator
│   │   └── use-cases/
│   │       └── create-order.use-case.ts # Use Case CreateOrder
│   ├── infrastructure/
│   │   ├── repositories/
│   │   │   └── prisma-order.repository.ts # Implementación Repository
│   │   ├── database/
│   │   │   └── database.module.ts      # Módulo de base de datos
│   │   └── nats/
│   │       ├── nats.module.ts          # Módulo NATS
│   │       ├── nats.service.ts          # Servicio NATS
│   │       └── nats.constants.ts        # Configuración NATS
│   ├── presentation/
│   │   └── controllers/
│   │       └── controller.ts            # REST Controller
│   ├── __tests__/
│   │   ├── unit/
│   │   │   ├── order.entity.spec.ts    # Tests del Aggregate
│   │   │   └── order.saga.spec.ts       # Tests de la Saga
│   │   └── integration/
│   │       └── create-order.integration.spec.ts # Tests de integración
│   └── order.module.ts                 # Módulo principal NestJS
├── prisma/
│   └── schema.prisma                   # Schema de Prisma
└── package.json
```

## Configuración

### Variables de Entorno

```env
DATABASE_URL=postgresql://user:password@localhost:5432/orderdb
NATS_URL=nats://localhost:4222
NATS_AUTH_TOKEN=your_token_here
PORT=3004
```

### Base de Datos

Ejecutar migraciones de Prisma:

```bash
cd apps/order-service
npx prisma migrate dev
npx prisma generate
```

## Testing

Ejecutar tests:

```bash
npm test
```

Coverage objetivo: > 80%

## Diagrama de Estados

```
                    ┌─────────┐
                    │ PENDING │
                    └────┬────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
┌───────────────┐ ┌──────────────┐ ┌──────────┐
│PAYMENT_CONFIRM│ │  CANCELLED   │ │  FAILED  │
│      ED       │ └──────────────┘ └──────────┘
└───────┬───────┘
        │
        ▼
┌──────────────────┐
│INVENTORY_RESERVED│
└───────┬──────────┘
        │
        ├──────────┐
        │          │
        ▼          ▼
┌─────────────┐ ┌──────────────┐
│  COMPLETED  │ │  CANCELLED   │
└─────────────┘ └──────────────┘
```

## Próximos Pasos

- [ ] Implementar idempotencia en los handlers de eventos
- [ ] Agregar manejo de timeouts para operaciones asíncronas
- [ ] Implementar retry logic con exponential backoff
- [ ] Agregar métricas y observabilidad
- [ ] Implementar dead letter queue para eventos fallidos
