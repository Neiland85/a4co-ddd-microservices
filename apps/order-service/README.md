# Order Service - Saga Implementation

## Descripción

Este servicio implementa el patrón Saga para orquestar el flujo completo de creación de pedidos: **Order → Payment → Inventory**.

## Arquitectura

### Patrón Saga (Orquestación)

La saga orquesta el flujo completo mediante eventos de dominio:

```
1. OrderCreated (order-service)
   ↓
2. PaymentSucceeded / PaymentFailed (payment-service)
   ↓
3. InventoryReserved / InventoryOutOfStock (inventory-service)
   ↓
4. OrderCompleted / OrderCancelled (order-service)
```

### Estados de la Orden

```
PENDING → PAYMENT_CONFIRMED → INVENTORY_RESERVED → COMPLETED
   ↓              ↓                    ↓
CANCELLED    CANCELLED           CANCELLED
   ↓              ↓                    ↓
FAILED        FAILED              FAILED
```

## Flujo de la Saga

### Flujo Exitoso

1. **Crear Orden** (`CreateOrderUseCase`)
   - Se crea una orden con estado `PENDING`
   - Se publica evento `OrderCreated` a NATS

2. **Pago Exitoso** (`OrderSaga.handlePaymentSucceeded`)
   - El servicio de pago publica `PaymentSucceeded`
   - La saga cambia el estado a `PAYMENT_CONFIRMED`
   - Se solicita reserva de inventario (`inventory.reserve.requested.v1`)

3. **Inventario Reservado** (`OrderSaga.handleInventoryReserved`)
   - El servicio de inventario publica `StockReserved`
   - La saga cambia el estado a `INVENTORY_RESERVED`
   - Se completa la orden (`COMPLETED`)
   - Se publica evento `OrderConfirmed`

### Flujo de Compensación

#### Escenario 1: Pago Fallido

1. El servicio de pago publica `PaymentFailed`
2. La saga cancela la orden (`CANCELLED`)
3. No se requiere compensación adicional

#### Escenario 2: Inventario Sin Stock

1. El servicio de inventario publica `StockDepleted`
2. La saga solicita reembolso (`RefundInitiated`)
3. La saga cancela la orden (`CANCELLED`)

## Estructura del Proyecto

```
apps/order-service/
├── src/
│   ├── domain/
│   │   ├── aggregates/
│   │   │   └── order.aggregate.ts      # Aggregate Root Order
│   │   ├── value-objects/              # Value Objects
│   │   └── index.ts                     # Interfaces del dominio
│   ├── application/
│   │   ├── sagas/
│   │   │   └── order.saga.ts           # Orquestación de la saga
│   │   └── use-cases/
│   │       └── create-order.use-case.ts # Casos de uso
│   ├── infrastructure/
│   │   ├── repositories/
│   │   │   └── prisma-order.repository.ts # Implementación Prisma
│   │   ├── database/
│   │   │   └── database.module.ts      # Módulo de Prisma
│   │   └── nats/
│   │       └── nats.constants.ts       # Configuración NATS
│   └── presentation/
│       └── controllers/
│           └── controller.ts            # Controlador REST
└── prisma/
    └── schema.prisma                   # Schema de base de datos
```

## Eventos de Dominio

### Eventos Publicados por Order Service

- `order.created.v1` - Cuando se crea una nueva orden
- `order.status.changed.v1` - Cuando cambia el estado de la orden
- `order.completed.v1` - Cuando la orden se completa exitosamente
- `order.cancelled.v1` - Cuando la orden se cancela
- `order.failed.v1` - Cuando la orden falla

### Eventos Escuchados por Order Service

- `payment.succeeded.v1` - Cuando el pago es exitoso
- `payment.failed.v1` - Cuando el pago falla
- `inventory.stock.reserved.v1` - Cuando el inventario es reservado
- `inventory.stock.depleted.v1` - Cuando no hay stock disponible

## Configuración

### Variables de Entorno

```env
DATABASE_URL=postgresql://user:password@localhost:5432/orderdb
NATS_URL=nats://localhost:4222
NATS_AUTH_TOKEN=your_token_here
PORT=3004
```

### Prisma

Para generar el cliente de Prisma:

```bash
cd apps/order-service
npx prisma generate
npx prisma migrate dev
```

## Testing

### Tests Unitarios

```bash
npm test -- order.entity.spec.ts
npm test -- order.saga.spec.ts
npm test -- create-order.use-case.spec.ts
```

### Coverage

El objetivo es mantener un coverage > 80%:

```bash
npm test -- --coverage
```

## Diagrama de Estados

```
┌─────────┐
│ PENDING │
└────┬────┘
     │
     ├─[PaymentSucceeded]─→┌──────────────────┐
     │                      │ PAYMENT_CONFIRMED │
     │                      └────┬──────────────┘
     │                           │
     │                           ├─[StockReserved]─→┌──────────────┐
     │                           │                  │INVENTORY_     │
     │                           │                  │RESERVED       │
     │                           │                  └────┬──────────┘
     │                           │                       │
     │                           │                       ├─[Complete]─→┌───────────┐
     │                           │                       │             │ COMPLETED  │
     │                           │                       │             └────────────┘
     │                           │                       │
     │                           │                       └─[Error]─→┌────────┐
     │                           │                                  │ FAILED  │
     │                           │                                  └─────────┘
     │                           │
     │                           └─[StockDepleted]─→┌───────────┐
     │                                              │CANCELLED │
     │                                              └───────────┘
     │
     └─[PaymentFailed]─→┌───────────┐
                        │CANCELLED  │
                        └───────────┘
```

## Compensaciones

La saga implementa transacciones compensatorias:

1. **Si falla el pago**: Se cancela la orden (no hay nada que compensar)
2. **Si falla el inventario**: Se solicita reembolso del pago y se cancela la orden
3. **Si falla cualquier paso**: Se marca la orden como `FAILED` y se registra el error

## Próximos Pasos

- [ ] Implementar retry logic para eventos fallidos
- [ ] Agregar dead letter queue para eventos no procesados
- [ ] Implementar idempotencia en los handlers de eventos
- [ ] Agregar métricas y monitoreo de la saga
- [ ] Implementar timeouts para pasos de la saga
