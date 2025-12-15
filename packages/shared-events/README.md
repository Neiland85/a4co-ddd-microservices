# @a4co/shared-events

Shared domain events package with versioning support for A4CO DDD microservices architecture.

## Overview

This package provides versioned domain events used for event-driven communication between microservices. All events follow a consistent structure with:

- **eventId**: Unique identifier for idempotency
- **eventType**: Versioned event type (e.g., `order.created.v1`)
- **correlationId**: For distributed tracing through saga flows
- **timestamp**: Event occurrence time
- **data**: Event-specific payload

## Features

- ✅ **Event Versioning**: All events follow `{domain}.{action}.v{version}` naming convention
- ✅ **Correlation Tracking**: Built-in correlationId for saga orchestration
- ✅ **Type Safety**: Full TypeScript support with strict typing
- ✅ **Idempotency**: Unique eventId for duplicate detection
- ✅ **Serialization**: JSON serialization for message broker transmission

## Installation

```bash
pnpm add @a4co/shared-events
```

## Usage

### Creating Events

```typescript
import {
  OrderCreatedV1Event,
  PaymentRequestedV1Event,
  EventTypes,
} from '@a4co/shared-events';

// Create an order created event
const orderEvent = new OrderCreatedV1Event(
  {
    orderId: 'order-123',
    customerId: 'customer-456',
    items: [
      { productId: 'prod-1', quantity: 2, unitPrice: 29.99 },
    ],
    totalAmount: 59.98,
    currency: 'USD',
  },
  'correlation-id-789', // Optional: for saga tracking
);

// Serialize for transmission
const json = orderEvent.toJSON();
```

### Deserializing Events

```typescript
import { OrderCreatedV1Event } from '@a4co/shared-events';

// Deserialize from JSON
const event = OrderCreatedV1Event.fromJSON(jsonPayload);
console.log(event.data.orderId);
console.log(event.correlationId);
```

## Event Catalog

### Order Events (v1)

- **`order.created.v1`**: Order created, triggers saga
- **`order.confirmed.v1`**: Order successfully confirmed
- **`order.cancelled.v1`**: Order cancelled (compensation)
- **`order.failed.v1`**: Order processing failed

### Payment Events (v1)

- **`payment.requested.v1`**: Payment requested by order service
- **`payment.processing.v1`**: Payment processing started
- **`payment.confirmed.v1`**: Payment successfully confirmed
- **`payment.failed.v1`**: Payment failed (triggers compensation)

## Saga Pattern

Events are designed to support the Saga orchestration pattern:

```
OrderCreated → PaymentRequested → PaymentConfirmed → OrderConfirmed
                                ↓
                         PaymentFailed → OrderCancelled (compensation)
```

## Best Practices

1. **Always include correlationId** for saga tracking
2. **Use versioned event types** for backward compatibility
3. **Validate event data** before publishing
4. **Handle deserialization errors** gracefully
5. **Log events** with correlationId for debugging

## Testing

```bash
# Run tests
pnpm test

# Run tests with coverage
pnpm test:cov
```

## License

MIT
