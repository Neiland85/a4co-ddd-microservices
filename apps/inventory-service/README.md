# Inventory Service - DDD Implementation

## Descripción

Servicio de inventario implementado con Domain-Driven Design (DDD), CQRS y Saga Pattern. Gestiona el stock de productos y se integra con el flujo de saga Order → Payment → Inventory mediante eventos asíncronos vía NATS JetStream.

## Arquitectura DDD

### Aggregate Root

- **Product**: Aggregate root que gestiona el inventario de productos
  - Emite eventos de dominio automáticamente
  - Valida reglas de negocio antes de cambiar estado
  - Mantiene consistencia dentro de sus límites

### Value Objects

- **ProductId**: Identificador único del producto (UUID)
- **StockQuantity**: Cantidad de stock con validaciones (no negativo, entero)
- **SKU**: Código SKU con formato validado `[A-Z]{3}-[0-9]{4}`
- **WarehouseLocation**: Ubicación en almacén (warehouse, aisle, shelf)

### Domain Events

El servicio emite los siguientes eventos de dominio:

1. **InventoryReservedEvent** (`inventory.reserved`)
   - Se emite cuando se reserva stock exitosamente
   - Payload: `productId`, `quantity`, `currentStock`, `reservedStock`, `availableStock`, `orderId`, `timestamp`

2. **InventoryOutOfStockEvent** (`inventory.out_of_stock`)
   - Se emite cuando no hay stock suficiente para una reserva
   - Payload: `productId`, `requestedQuantity`, `availableStock`, `orderId`, `timestamp`

3. **InventoryReleasedEvent** (`inventory.released`)
   - Se emite cuando se libera stock reservado (compensación)
   - Payload: `productId`, `quantity`, `currentStock`, `reservedStock`, `availableStock`, `orderId`, `reason`, `timestamp`

4. **StockDeductedEvent** (`inventory.stock_deducted`)
   - Se emite cuando se confirma y deduce stock definitivamente
   - Payload: `productId`, `quantity`, `currentStock`, `reservedStock`, `availableStock`, `orderId`, `timestamp`

5. **StockReplenishedEvent** (`inventory.stock_replenished`)
   - Se emite cuando se repone stock
   - Payload: `productId`, `quantity`, `currentStock`, `previousStock`, `reason`, `timestamp`

6. **LowStockEvent** (`inventory.low_stock`)
   - Se emite cuando el stock disponible cae por debajo del punto de reorden
   - Payload: `productId`, `currentStock`, `reservedStock`, `availableStock`, `reorderPoint`, `timestamp`

## Flujo de Saga

### 1. Order Created → Payment Processing

Cuando se crea una orden, el payment service procesa el pago.

### 2. Payment Succeeded → Reserve Stock

**Evento recibido**: `payment.succeeded`

```typescript
{
  orderId: string;
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  paymentId: string;
  timestamp: Date;
  sagaId?: string;
}
```

**Acción**: 
- Para cada item, ejecuta `ReserveStockUseCase`
- Si todo OK → emite `InventoryReservedEvent`
- Si algún producto sin stock → emite `InventoryOutOfStockEvent`

### 3. Order Cancelled → Release Stock (Compensación)

**Evento recibido**: `order.cancelled`

```typescript
{
  orderId: string;
  customerId: string;
  reason: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  timestamp: Date;
  sagaId?: string;
}
```

**Acción**:
- Ejecuta `ReleaseStockUseCase` para cada item
- Emite `InventoryReleasedEvent` para cada producto

### 4. Order Completed → Confirm Stock Deduction

**Evento recibido**: `order.completed`

```typescript
{
  orderId: string;
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  timestamp: Date;
  sagaId?: string;
}
```

**Acción**:
- Ejecuta `ConfirmStockUseCase` para cada item
- Deduce stock definitivamente (no solo reserva)
- Emite `StockDeductedEvent`

## Use Cases

### ReserveStockUseCase

Reserva stock para una orden. El stock no se deduce inmediatamente, solo se reserva.

**Request**:
```typescript
{
  productId: string;
  quantity: number;
  orderId: string;
  customerId: string;
  expiresAt: Date;
  sagaId?: string;
}
```

**Response**:
```typescript
{
  success: boolean;
  reservationId: string;
  productId: string;
  quantity: number;
  availableStock: number;
  expiresAt: Date;
  message?: string;
}
```

### ReleaseStockUseCase

Libera stock reservado (usado para compensación de saga).

**Request**:
```typescript
{
  productId: string;
  quantity: number;
  orderId: string;
  reason: string;
  sagaId?: string;
}
```

### ConfirmStockUseCase

Confirma la deducción de stock después de que la orden se completa.

**Request**:
```typescript
{
  productId: string;
  quantity: number;
  orderId: string;
  sagaId?: string;
}
```

## Lógica de Negocio Crítica

1. **Stock Reservation**: El stock NO se deduce inmediatamente, solo se reserva
2. **Confirmation**: Solo después de `order.completed` se deduce el stock definitivamente
3. **Compensation**: Si el pago falla o la orden se cancela, se libera el stock reservado
4. **Low Stock Alert**: Si `availableStock < reorderPoint`, se emite `LowStockEvent`
5. **Concurrencia**: Se recomienda usar transacciones o optimistic locking para evitar race conditions

## Restricciones

- ❌ NUNCA stock negativo (validado en `StockQuantity`)
- ✅ TRANSACCIONES para reserva de stock (evitar race conditions)
- ✅ IDEMPOTENCIA en handlers (mismo evento no procesa 2 veces)
- ✅ LOGS de todas las reservas/liberaciones (audit)

## Configuración NATS

El servicio se conecta a NATS usando la configuración:

```typescript
{
  transport: Transport.NATS,
  options: {
    servers: process.env.NATS_URL || 'nats://localhost:4222',
    name: 'inventory-service',
  },
}
```

## Tests

Los tests cubren:
- ✅ Value Objects (validación, comparación)
- ✅ Product Aggregate (reserva, liberación, confirmación, eventos)
- ✅ Use Cases (flujos completos)
- ✅ Integración Saga (reserve → confirm, reserve → release)

Coverage objetivo: > 80%

## Eventos Publicados

Todos los eventos se publican automáticamente a NATS cuando se guarda un aggregate con eventos pendientes. El `EventPublisherService` se encarga de:

1. Escuchar eventos de aggregates
2. Publicar a NATS con el patrón correcto
3. Manejar reintentos
4. Log de eventos publicados

## Diagrama de Flujo

```
Order Created
    ↓
Payment Processing
    ↓
Payment Succeeded ──→ Reserve Stock ──→ InventoryReservedEvent
    │                                          ↓
    │                                    Order Completed
    │                                          ↓
    │                                    Confirm Stock ──→ StockDeductedEvent
    │
    └──→ Payment Failed / Order Cancelled
              ↓
         Release Stock ──→ InventoryReleasedEvent
```

## Próximos Pasos

- [ ] Agregar `reorderPoint` y `reorderQuantity` al schema de Prisma
- [ ] Implementar optimistic locking para concurrencia
- [ ] Agregar idempotencia en handlers (tracking de eventos procesados)
- [ ] Implementar expiración automática de reservas
- [ ] Agregar métricas y monitoring
