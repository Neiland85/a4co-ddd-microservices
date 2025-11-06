# Inventory Service - DDD Implementation

## Resumen de Implementación

Este servicio implementa el patrón DDD (Domain-Driven Design) completo con AggregateRoot, Value Objects, Domain Events y comunicación asíncrona vía NATS JetStream.

## Arquitectura

### Domain Layer
- **Aggregate Root**: `Product` extiende `AggregateRoot` de `@a4co/shared-utils`
- **Value Objects**: 
  - `ProductId`: Identificador único del producto
  - `StockQuantity`: Cantidad de stock con validaciones (no negativo, entero)
  - `SKU`: Código SKU con formato validado `[A-Z]{3}-[0-9]{4}`
  - `WarehouseLocation`: Ubicación en almacén (warehouse, aisle, shelf)

### Domain Events
Todos los eventos extienden `DomainEvent` de `@a4co/shared-utils`:

1. **InventoryReservedEvent**: Stock reservado exitosamente
   - Se emite cuando `product.reserveStock()` se ejecuta correctamente
   - Subject NATS: `inventory.reserved`

2. **InventoryOutOfStockEvent**: Sin stock disponible
   - Se emite cuando se intenta reservar más stock del disponible
   - Subject NATS: `inventory.out_of_stock`

3. **InventoryReleasedEvent**: Reserva cancelada/liberada
   - Se emite cuando `product.releaseStock()` se ejecuta
   - Subject NATS: `inventory.released`

4. **StockDeductedEvent**: Stock confirmado y deducido
   - Se emite cuando `product.confirmReservation()` se ejecuta
   - Subject NATS: `inventory.deducted`

5. **StockReplenishedEvent**: Stock añadido/reabastecido
   - Se emite cuando `product.replenishStock()` se ejecuta
   - Subject NATS: `inventory.replenished`

6. **LowStockEvent**: Alerta de stock bajo
   - Se emite cuando el stock disponible cae por debajo del `reorderPoint`
   - Subject NATS: `inventory.low_stock`

## Flujo de Saga Order → Payment → Inventory

### 1. Payment Succeeded Event
Cuando el servicio de pagos publica `payment.succeeded`:
- El `OrderEventsHandler` escucha el evento
- Para cada item en la orden, ejecuta `ReserveStockUseCase`
- Si todas las reservas son exitosas, publica `InventoryReservedEvent`
- Si algún producto está sin stock, publica `InventoryOutOfStockEvent`

### 2. Order Cancelled Event (Compensación)
Cuando se cancela una orden (`order.cancelled`):
- El handler ejecuta `ReleaseStockUseCase` para cada item
- Libera el stock reservado (compensación de saga)
- Publica `InventoryReleasedEvent` para cada producto

### 3. Order Completed Event
Cuando una orden se completa (`order.completed`):
- El handler ejecuta `ConfirmStockUseCase` para cada item
- Confirma la deducción de stock (no solo reserva)
- Publica `StockDeductedEvent` para cada producto

## Use Cases

### ReserveStockUseCase
- Reserva stock sin deducirlo inmediatamente
- Emite eventos automáticamente a través del aggregate
- Retorna éxito/fallo con detalles

### ReleaseStockUseCase
- Libera stock reservado (compensación)
- Emite `InventoryReleasedEvent`
- Usado cuando falla el pago o se cancela la orden

### ConfirmStockUseCase
- Confirma y deduce stock definitivamente
- Reduce tanto `currentStock` como `reservedStock`
- Emite `StockDeductedEvent`
- Usado cuando la orden se completa exitosamente

## Event Publishing

Los eventos se publican automáticamente mediante:
1. **DomainEventDispatcher**: Despacha eventos de aggregates después de guardar
2. **EventPublisherService**: Publica eventos a NATS JetStream
3. **ProductRepositoryWithEvents**: Wrapper del repository que despacha eventos automáticamente

## Configuración NATS

```typescript
const NATS_CONFIG = {
  servers: process.env.NATS_URL || 'nats://localhost:4222',
  token: process.env.NATS_AUTH_TOKEN || '',
  name: 'inventory-service',
};
```

## Estructura de Eventos

Todos los eventos siguen esta estructura:

```typescript
{
  eventId: string;           // UUID único del evento
  eventType: string;         // Nombre de la clase del evento
  aggregateId: string;       // ID del producto
  eventVersion: number;      // Versión del evento (default: 1)
  occurredOn: Date;          // Timestamp del evento
  eventData: {               // Datos específicos del evento
    orderId?: string;
    quantity: number;
    currentStock: number;
    // ... otros campos específicos
  };
  sagaId?: string;           // ID de la saga (opcional)
}
```

## Lógica de Negocio Crítica

### Stock Reservation
- El stock NO se deduce inmediatamente, solo se reserva
- `reservedStock` aumenta, `currentStock` permanece igual
- `availableStock = currentStock - reservedStock`

### Stock Confirmation
- Solo después de `order.completed` se deduce el stock
- Se reduce tanto `currentStock` como `reservedStock`
- El stock queda definitivamente deducido

### Compensation
- Si `payment.failed` o `order.cancelled`, se libera el stock reservado
- `reservedStock` se reduce, `currentStock` permanece igual
- El stock vuelve a estar disponible

### Low Stock Alert
- Si `availableStock <= reorderPoint`, se emite `LowStockEvent`
- Se puede usar para trigger de reposición automática

## Concurrencia

- Los value objects `StockQuantity` validan que no haya stock negativo
- Se recomienda usar transacciones o optimistic locking en producción
- Los eventos garantizan consistencia eventual entre servicios

## Tests

Los tests cubren:
- ✅ Creación de productos con value objects
- ✅ Reserva de stock con emisión de eventos
- ✅ Liberación de stock con eventos
- ✅ Confirmación de reserva con deducción
- ✅ Validaciones de negocio
- ✅ Eventos de dominio emitidos correctamente

## Próximos Pasos

1. Implementar optimistic locking en el repository
2. Agregar idempotencia en handlers (evitar procesar el mismo evento 2 veces)
3. Implementar retry logic para publicación de eventos
4. Agregar métricas y logging detallado
5. Crear tests de integración end-to-end del flujo de saga
