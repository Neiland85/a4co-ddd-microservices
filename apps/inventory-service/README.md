# Inventory Service - DDD Implementation

## Descripción

Servicio de inventario implementado con Domain-Driven Design (DDD), conectado al flujo de saga Order → Payment → Inventory mediante comunicación asíncrona vía NATS JetStream.

## Arquitectura DDD

### Aggregate Root
- **Product**: Aggregate root que gestiona el inventario de productos y emite eventos de dominio.

### Value Objects
- **ProductId**: Identificador único del producto
- **StockQuantity**: Cantidad de stock con validaciones (no negativo, entero)
- **SKU**: Código SKU con formato validado `[A-Z]{3}-[0-9]{4}` (ejemplo: INV-1234)
- **WarehouseLocation**: Ubicación en almacén (almacén, pasillo, estantería)

### Domain Events
- **InventoryReservedEvent**: Stock reservado exitosamente
- **InventoryOutOfStockEvent**: Sin stock disponible
- **InventoryReleasedEvent**: Reserva cancelada/liberada
- **StockDeductedEvent**: Stock confirmado y deducido
- **StockReplenishedEvent**: Stock añadido/reposición
- **LowStockEvent**: Alerta de stock bajo (por debajo de reorderPoint)

## Flujo de Saga

### 1. Payment Succeeded → Reserve Stock
Cuando se recibe el evento `payment.succeeded`:
- Se reserva stock para cada item del pedido
- Se emite `InventoryReservedEvent` si la reserva es exitosa
- Se emite `InventoryOutOfStockEvent` si no hay stock disponible
- Se emite `LowStockEvent` si el stock cae por debajo del punto de reorden

### 2. Order Cancelled → Release Stock (Compensación)
Cuando se recibe el evento `order.cancelled`:
- Se libera el stock reservado para cada item
- Se emite `InventoryReleasedEvent` para cada liberación

### 3. Order Completed → Confirm Stock
Cuando se recibe el evento `order.completed`:
- Se confirma la deducción de stock (se reduce stock y stock reservado)
- Se emite `StockDeductedEvent`

## Use Cases

### ReserveStockUseCase
Reserva stock para un pedido. No deduce el stock inmediatamente, solo lo reserva.

```typescript
const result = await reserveStockUseCase.execute({
  productId: 'prod_123',
  quantity: 10,
  orderId: 'order_456',
  customerId: 'customer_789',
  expiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos
  sagaId: 'saga_001' // opcional
});
```

### ReleaseStockUseCase
Libera stock reservado (compensación de saga).

```typescript
const result = await releaseStockUseCase.execute({
  productId: 'prod_123',
  quantity: 10,
  orderId: 'order_456',
  reason: 'Order cancelled',
  sagaId: 'saga_001' // opcional
});
```

### ConfirmStockUseCase
Confirma la deducción de stock después de completar el pedido.

```typescript
const result = await confirmStockUseCase.execute({
  productId: 'prod_123',
  quantity: 10,
  orderId: 'order_456',
  sagaId: 'saga_001' // opcional
});
```

## Event Handlers

### OrderEventsHandler
Maneja eventos de otros servicios:
- `payment.succeeded`: Reserva stock
- `order.cancelled`: Libera stock (compensación)
- `order.completed`: Confirma deducción de stock

## Event Publisher

El `EventPublisherService` publica automáticamente los eventos de dominio a NATS cuando se guarda un aggregate en el repository.

### Subjects NATS
- `inventory.reserved` - Stock reservado
- `inventory.out_of_stock` - Sin stock disponible
- `inventory.released` - Stock liberado
- `inventory.stock_deducted` - Stock deducido
- `inventory.stock_replenished` - Stock repuesto
- `inventory.low_stock` - Alerta de stock bajo

## Lógica de Negocio Crítica

### Stock Reservation
- El stock NO se deduce inmediatamente, solo se reserva
- El stock reservado reduce el stock disponible
- No se puede reservar más stock del disponible

### Stock Confirmation
- Solo después de `order.completed` se deduce el stock realmente
- Se reduce tanto `currentStock` como `reservedStock`

### Compensación
- Si `payment.failed` u `order.cancelled`, se libera el stock reservado
- El stock vuelve a estar disponible para otros pedidos

### Low Stock Alert
- Si `availableStock < reorderPoint`, se emite `LowStockEvent`
- Permite al sistema de reposición actuar automáticamente

## Configuración

### Variables de Entorno
```env
DATABASE_URL=postgresql://user:password@localhost:5432/inventory_db
NATS_URL=nats://localhost:4222
PORT=3006
```

### Prisma Schema
El schema incluye los campos:
- `reorderPoint`: Nivel de stock mínimo para reordenar
- `reorderQuantity`: Cantidad a reordenar
- `warehouseLocation`: Ubicación en almacén

## Tests

### Tests Unitarios
- `product.entity.spec.ts`: Tests del aggregate Product
- `reserve-stock.use-case.spec.ts`: Tests del use case de reserva

### Cobertura
Ejecutar tests con:
```bash
npm test
```

## Patrones Implementados

- **Aggregate Root**: Product gestiona su propio estado y eventos
- **Value Objects**: Validación de invariantes en el dominio
- **Domain Events**: Eventos emitidos por el aggregate
- **Event Sourcing**: Eventos publicados a NATS automáticamente
- **Saga Pattern**: Compensación mediante eventos
- **CQRS**: Separación de comandos (use cases) y queries

## Restricciones

- ❌ NUNCA stock negativo (validado en StockQuantity)
- ✅ TRANSACCIONES para reserva de stock (evitar race conditions)
- ✅ IDEMPOTENCIA en handlers (mismo evento no procesa 2 veces)
- ✅ LOGS de todas las reservas/liberaciones (audit)

## Próximos Pasos

1. Implementar optimistic locking para evitar race conditions
2. Agregar idempotencia en handlers usando eventId
3. Implementar retry logic para publicación de eventos
4. Agregar métricas y monitoreo de eventos
5. Implementar tests de integración completos
