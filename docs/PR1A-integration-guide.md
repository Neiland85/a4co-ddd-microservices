# PR1A: Integration Guide for Services

## 📋 Overview

This guide provides step-by-step instructions for integrating the `@a4co/shared-events` package into Order Service and Payment Service.

**Target Services:**
- `apps/order-service`
- `apps/payment-service`

**Status:** Ready for Implementation  
**Last Updated:** 2025-12-15

---

## 🎯 Integration Objectives

1. Replace local event definitions with shared-events package
2. Add correlationId tracking for saga orchestration
3. Update event publishers to use versioned events
4. Update event subscribers to handle versioned events
5. Maintain backward compatibility during transition

---

## 📦 Step 1: Add Package Dependency

### Order Service

```bash
cd apps/order-service
pnpm add @a4co/shared-events
```

Update `apps/order-service/package.json`:

```json
{
  "dependencies": {
    "@a4co/shared-events": "workspace:*",
    // ... other dependencies
  }
}
```

### Payment Service

```bash
cd apps/payment-service
pnpm add @a4co/shared-events
```

Update `apps/payment-service/package.json`:

```json
{
  "dependencies": {
    "@a4co/shared-events": "workspace:*",
    // ... other dependencies
  }
}
```

---

## 🔄 Step 2: Update Order Service Events

### 2.1 Replace Event Definitions

**Current:** `apps/order-service/src/domain/events/index.ts`

```typescript
// OLD - Remove these
export class OrderCreatedEvent {
  public readonly eventType = 'orders.created';
  // ...
}

export class OrderConfirmedEvent {
  public readonly eventType = 'orders.confirmed';
  // ...
}
```

**New:** Import from shared-events

```typescript
// apps/order-service/src/domain/events/index.ts
export {
  OrderCreatedV1Event,
  OrderConfirmedV1Event,
  OrderCancelledV1Event,
  OrderFailedV1Event,
  EventTypes,
} from '@a4co/shared-events';
```

### 2.2 Update Order Aggregate

**File:** `apps/order-service/src/domain/aggregates/order.aggregate.ts`

**Before:**
```typescript
import { OrderCreatedEvent } from '../events/index.js';

// In constructor
this.addDomainEvent(
  new OrderCreatedEvent(
    id,
    customerId,
    items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.unitPrice,
    })),
    this._totalAmount,
  ),
);
```

**After:**
```typescript
import { OrderCreatedV1Event } from '@a4co/shared-events';

// In constructor - Add correlationId parameter
constructor(
  id: string,
  customerId: string,
  items: OrderItem[],
  status: OrderStatus = OrderStatus.PENDING,
  correlationId?: string,  // NEW
  createdAt?: Date,
  updatedAt?: Date,
) {
  super(id, createdAt, updatedAt);
  this._customerId = customerId;
  this._items = [...items];
  this._status = status;
  this._totalAmount = this.calculateTotal();
  this._correlationId = correlationId;  // NEW

  // Add domain event if this is a new order
  if (status === OrderStatus.PENDING && !createdAt) {
    this.addDomainEvent(
      new OrderCreatedV1Event(
        {
          orderId: id,
          customerId,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
          totalAmount: this._totalAmount,
          currency: 'EUR',
        },
        correlationId,  // Pass correlationId
      ),
    );
  }
}

// Add correlationId tracking
private _correlationId?: string;

get correlationId(): string | undefined {
  return this._correlationId;
}
```

### 2.3 Update Saga Orchestrator

**File:** `apps/order-service/src/application/sagas/order-saga-orchestrator.ts`

**Before:**
```typescript
await this.eventBus.publish('orders.created', event.toJSON());
```

**After:**
```typescript
import { OrderCreatedV1Event, EventTypes } from '@a4co/shared-events';

// When starting saga
async startOrderSaga(command: {
  orderId: string;
  customerId: string;
  items: Array<{ productId: string; quantity: number; price: number }>;
  totalAmount: number;
  correlationId?: string;  // NEW - Accept correlationId
}): Promise<void> {
  const sagaId = `saga-${command.orderId}`;
  const correlationId = command.correlationId || sagaId;  // NEW

  // Create event with correlationId
  const event = new OrderCreatedV1Event(
    {
      orderId: command.orderId,
      customerId: command.customerId,
      items: command.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.price,
      })),
      totalAmount: command.totalAmount,
      currency: 'EUR',
    },
    correlationId,  // Pass correlationId
  );

  // Publish with versioned event type
  await this.eventBus.publish(EventTypes.ORDER_CREATED_V1, event.toJSON());
}
```

### 2.4 Update Event Subscribers

**Before:**
```typescript
this.eventBus.subscribe('inventory.reserved', async (event) => {
  await this.handleInventoryReserved(event);
});
```

**After:**
```typescript
import { EventTypes } from '@a4co/shared-events';

// Use versioned event types
this.eventBus.subscribe(EventTypes.INVENTORY_RESERVED_V1, async (event) => {
  // Extract correlationId from event
  const correlationId = event.correlationId;
  await this.handleInventoryReserved(event, correlationId);
});

this.eventBus.subscribe(EventTypes.PAYMENT_CONFIRMED_V1, async (event) => {
  const correlationId = event.correlationId;
  await this.handlePaymentSucceeded(event, correlationId);
});

this.eventBus.subscribe(EventTypes.PAYMENT_FAILED_V1, async (event) => {
  const correlationId = event.correlationId;
  await this.handlePaymentFailed(event, correlationId);
});
```

---

## 💳 Step 3: Update Payment Service Events

### 3.1 Replace Event Definitions

**Current:** `apps/payment-service/src/domain/events/`

Replace existing payment events with shared-events:

```typescript
// apps/payment-service/src/domain/events/index.ts
export {
  PaymentRequestedV1Event,
  PaymentProcessingV1Event,
  PaymentConfirmedV1Event,
  PaymentFailedV1Event,
  EventTypes,
} from '@a4co/shared-events';
```

### 3.2 Update Payment Service

**File:** `apps/payment-service/src/application/services/payment.service.ts`

**Before:**
```typescript
const event = new PaymentCreatedEvent({
  paymentId,
  orderId,
  customerId,
  amount: { value: amount, currency },
  // ...
});
```

**After:**
```typescript
import { 
  PaymentRequestedV1Event,
  PaymentConfirmedV1Event,
  PaymentFailedV1Event,
  EventTypes,
} from '@a4co/shared-events';

// When receiving payment request
async handlePaymentRequest(data: {
  orderId: string;
  customerId: string;
  amount: number;
  currency: string;
  correlationId: string;  // NEW - Required
}): Promise<void> {
  const paymentId = uuidv4();
  
  try {
    // Process payment...
    const result = await this.processPayment({
      paymentId,
      orderId: data.orderId,
      amount: data.amount,
      currency: data.currency,
    });

    // Publish success event with correlationId
    const confirmedEvent = new PaymentConfirmedV1Event(
      {
        paymentId,
        orderId: data.orderId,
        customerId: data.customerId,
        amount: data.amount,
        currency: data.currency,
        paymentIntentId: result.stripePaymentIntentId,
        confirmedAt: new Date().toISOString(),
      },
      data.correlationId,  // Propagate correlationId
    );

    await this.eventBus.publish(
      EventTypes.PAYMENT_CONFIRMED_V1,
      confirmedEvent.toJSON(),
    );
  } catch (error) {
    // Publish failure event with correlationId
    const failedEvent = new PaymentFailedV1Event(
      {
        paymentId,
        orderId: data.orderId,
        customerId: data.customerId,
        amount: data.amount,
        currency: data.currency,
        reason: error.message,
        failedAt: new Date().toISOString(),
        errorCode: error.code,
      },
      data.correlationId,  // Propagate correlationId
    );

    await this.eventBus.publish(
      EventTypes.PAYMENT_FAILED_V1,
      failedEvent.toJSON(),
    );
  }
}
```

### 3.3 Update Event Subscribers

**File:** `apps/payment-service/src/application/handlers/order-events.handler.ts`

**Before:**
```typescript
@EventPattern('orders.created')
async handleOrderCreated(@Payload() data: any): Promise<void> {
  // ...
}
```

**After:**
```typescript
import { EventTypes } from '@a4co/shared-events';

@EventPattern(EventTypes.ORDER_CREATED_V1)
async handleOrderCreated(@Payload() data: any): Promise<void> {
  // Extract correlationId from event
  const correlationId = data.correlationId;
  
  // Process payment request
  await this.paymentService.handlePaymentRequest({
    orderId: data.data.orderId,
    customerId: data.data.customerId,
    amount: data.data.totalAmount,
    currency: data.data.currency || 'EUR',
    correlationId,  // Pass correlationId
  });
}
```

---

## 📊 Step 4: Update Tests

### 4.1 Order Service Tests

**File:** `apps/order-service/src/__tests__/order.aggregate.spec.ts`

```typescript
import { OrderCreatedV1Event, EventTypes } from '@a4co/shared-events';

describe('Order Aggregate', () => {
  it('should create order with correlationId', () => {
    const correlationId = 'test-corr-123';
    const order = new Order(
      'order-1',
      'customer-1',
      [/* items */],
      OrderStatus.PENDING,
      correlationId,  // NEW
    );

    expect(order.correlationId).toBe(correlationId);
    
    const events = order.getDomainEvents();
    expect(events[0]).toBeInstanceOf(OrderCreatedV1Event);
    expect(events[0].correlationId).toBe(correlationId);
    expect(events[0].eventType).toBe(EventTypes.ORDER_CREATED_V1);
  });
});
```

### 4.2 Payment Service Tests

**File:** `apps/payment-service/src/__tests__/payment.service.spec.ts`

```typescript
import { 
  PaymentConfirmedV1Event,
  PaymentFailedV1Event,
  EventTypes,
} from '@a4co/shared-events';

describe('Payment Service', () => {
  it('should propagate correlationId in success event', async () => {
    const correlationId = 'saga-123';
    
    await paymentService.handlePaymentRequest({
      orderId: 'order-1',
      customerId: 'customer-1',
      amount: 100,
      currency: 'USD',
      correlationId,
    });

    expect(eventBus.publish).toHaveBeenCalledWith(
      EventTypes.PAYMENT_CONFIRMED_V1,
      expect.objectContaining({
        correlationId,
        eventType: EventTypes.PAYMENT_CONFIRMED_V1,
      }),
    );
  });
});
```

---

## 🔍 Step 5: Validation

### 5.1 Build Check

```bash
# Build order service
cd apps/order-service
pnpm run build

# Build payment service
cd apps/payment-service
pnpm run build
```

### 5.2 Test Check

```bash
# Test order service
cd apps/order-service
pnpm test

# Test payment service
cd apps/payment-service
pnpm test
```

### 5.3 Lint Check

```bash
# Lint order service
cd apps/order-service
pnpm run lint

# Lint payment service
cd apps/payment-service
pnpm run lint
```

---

## 🚀 Step 6: Integration Testing

### 6.1 Start NATS

```bash
docker-compose up nats -d
```

### 6.2 Test Event Flow

Create an integration test:

```typescript
// apps/order-service/tests/integration/saga-flow.test.ts
import { OrderCreatedV1Event, EventTypes } from '@a4co/shared-events';
import { NatsEventBus } from '@a4co/shared-utils';

describe('Saga Flow Integration', () => {
  let eventBus: NatsEventBus;
  const correlationId = 'integration-test-123';

  beforeAll(async () => {
    eventBus = new NatsEventBus({
      servers: 'nats://localhost:4222',
    });
    await eventBus.connect();
  });

  afterAll(async () => {
    await eventBus.disconnect();
  });

  it('should complete order saga with correlationId tracking', async () => {
    const receivedEvents: any[] = [];

    // Subscribe to all events
    await eventBus.subscribe('*.v1', async (event) => {
      receivedEvents.push(event);
    });

    // Publish order created event
    const orderEvent = new OrderCreatedV1Event(
      {
        orderId: 'test-order-1',
        customerId: 'test-customer-1',
        items: [{ productId: 'prod-1', quantity: 1, unitPrice: 10 }],
        totalAmount: 10,
        currency: 'USD',
      },
      correlationId,
    );

    await eventBus.publish(EventTypes.ORDER_CREATED_V1, orderEvent.toJSON());

    // Wait for saga to complete (adjust timeout as needed)
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Verify correlationId is maintained
    const allHaveSameCorrelationId = receivedEvents.every(
      (e) => e.correlationId === correlationId,
    );

    expect(allHaveSameCorrelationId).toBe(true);
    expect(receivedEvents.length).toBeGreaterThan(0);
  }, 10000);
});
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: TypeScript Errors

**Error:** `Cannot find module '@a4co/shared-events'`

**Solution:**
```bash
# Rebuild workspace
pnpm install
pnpm run build

# Or rebuild just shared-events
cd packages/shared-events
pnpm run build
```

### Issue 2: Event Not Received

**Symptoms:** Event published but not received by subscriber

**Solutions:**
1. Check NATS connection is active
2. Verify event type matches exactly (case-sensitive)
3. Check queue groups are configured correctly
4. Enable NATS debug logs

### Issue 3: CorrelationId Lost

**Symptoms:** CorrelationId not propagating through saga

**Solutions:**
1. Verify correlationId is passed to event constructor
2. Check event subscribers extract and forward correlationId
3. Add logging to trace correlationId flow

---

## 📈 Migration Checklist

- [ ] Add @a4co/shared-events dependency to services
- [ ] Replace local event definitions
- [ ] Update aggregates to accept correlationId
- [ ] Update saga orchestrator to use versioned events
- [ ] Update event publishers
- [ ] Update event subscribers
- [ ] Update unit tests
- [ ] Add integration tests
- [ ] Run lint and build checks
- [ ] Test with local NATS instance
- [ ] Verify correlationId propagation
- [ ] Update API documentation
- [ ] Deploy to staging
- [ ] Monitor logs for errors

---

## 📚 Additional Resources

- [PR1A Summary](PR1A-summary.md) - Technical overview
- [PR1A Tests](PR1A-tests.md) - Testing guide
- [Shared Events README](../packages/shared-events/README.md) - Package usage
- [NATS Documentation](https://docs.nats.io/) - Message broker

---

**Document Version:** 1.0  
**Last Updated:** 2025-12-15  
**Next Review:** After service integration complete
