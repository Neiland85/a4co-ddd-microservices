# @a4co/shared-events

Shared event definitions for A4CO microservices event-driven architecture.

## Overview

This library provides typed TypeScript event definitions used across all microservices for event-driven communication via NATS.

## Features

- ✅ Strongly typed event payloads
- ✅ Versioned events (v1, v2, etc.) for backward compatibility
- ✅ Base event class with common fields
- ✅ Event metadata (eventId, timestamp, correlationId)

## Events

### Order Events

- `OrderCreatedV1Event` - New order created
- `OrderConfirmedV1Event` - Order successfully confirmed
- `OrderCancelledV1Event` - Order cancelled
- `OrderFailedV1Event` - Order processing failed

### Payment Events

- `PaymentConfirmedV1Event` - Payment successful
- `PaymentFailedV1Event` - Payment failed
- `PaymentRefundedV1Event` - Payment refunded (compensation)

### Inventory Events

- `InventoryReservedV1Event` - Stock reserved for order
- `InventoryFailedV1Event` - Stock reservation failed
- `InventoryReleasedV1Event` - Stock released (compensation)

## Usage

```typescript
import { OrderCreatedV1Event, ORDER_CREATED_V1 } from '@a4co/shared-events';

// Create event
const event = new OrderCreatedV1Event({
  orderId: 'order-123',
  customerId: 'customer-456',
  items: [
    { productId: 'prod-1', quantity: 2, unitPrice: 10.00 }
  ],
  totalAmount: 20.00,
  currency: 'EUR'
});

// Emit via NATS
natsClient.emit(ORDER_CREATED_V1, event.toJSON());

// Listen for events
@EventPattern(ORDER_CREATED_V1)
async handleOrderCreated(data: any) {
  const payload = data.payload;
  // Process event...
}
```

## Versioning Strategy

Events are versioned to allow gradual migration between versions:

- `v1` - Initial version
- `v2` - Breaking changes, old consumers still work with v1
- Old versions maintained for backward compatibility period

## Development

```bash
# Build the library
npm run build

# Watch mode
npm run watch
```

## Integration

Add to service's `package.json`:

```json
{
  "dependencies": {
    "@a4co/shared-events": "workspace:*"
  }
}
```
