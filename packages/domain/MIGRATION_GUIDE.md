# Migration Guide: Using @a4co/domain in Services

This guide helps service developers migrate from local domain artifacts to the shared `@a4co/domain` package.

## Overview

The `@a4co/domain` package provides shared domain artifacts organized by bounded context. Services should import common value objects and events from this package instead of maintaining duplicate implementations.

## Installation

The package is already available in the monorepo workspace:

```typescript
import { Money, Email, OrderId, OrderStatus } from '@a4co/domain';
```

## What to Migrate

### ✅ Should Use @a4co/domain

**Common Value Objects:**
- `Money` - Monetary amounts with currency
- `Email` - Email addresses with validation
- `Address` - Physical addresses
- `OrderId`, `PaymentId`, `UserId`, `ProductId` - Entity identifiers

**Domain Errors:**
- `DomainError` - Base domain error
- `BusinessRuleViolationError` - Business rule violations
- `InvalidStateTransitionError` - Invalid state changes
- `NotFoundError`, `DuplicateError`, `ValidationError`, etc.

**Status Value Objects (with state transitions):**
- `OrderStatus` - Order lifecycle states
- `PaymentStatus` - Payment lifecycle states

**Versioned Domain Events (for shared event schemas):**
- `OrderCreatedV1Event`, `OrderConfirmedV1Event`, etc.
- `PaymentSucceededV1Event`, `PaymentFailedV1Event`, etc.

### ❌ Should Stay in Services

**Service-Specific Logic:**
- Aggregate roots (Order aggregate, Payment aggregate)
- Domain services specific to the service
- Repository interfaces (ports)
- Application-specific use cases
- Infrastructure implementations

**Service-Specific Value Objects:**
- Value objects that are only used within one service
- Value objects with service-specific validation rules

## Migration Examples

### Example 1: Money Value Object

**Before (in service):**
```typescript
// apps/order-service/src/domain/value-objects/money.vo.ts
export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string,
  ) {
    // validation logic
  }
}
```

**After (using @a4co/domain):**
```typescript
import { Money } from '@a4co/domain';

// Use directly
const price = Money.create(100, 'EUR');
const total = price.multiply(2);
```

### Example 2: OrderStatus Value Object

**Before:**
```typescript
// apps/order-service/src/domain/value-objects/order-status.vo.ts
export enum OrderStatusValue {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  // ...
}

export class OrderStatus {
  // state transition logic
}
```

**After:**
```typescript
import { OrderStatus, OrderStatusValue } from '@a4co/domain';

// Use with state validation
const status = OrderStatus.pending();
const confirmed = status.transitionTo(
  OrderStatus.create(OrderStatusValue.CONFIRMED)
);
```

### Example 3: Domain Events

**Before:**
```typescript
// apps/order-service/src/domain/events/order-created.event.ts
export class OrderCreatedEvent {
  public readonly eventType = 'orders.created'; // ❌ Not versioned
  // ...
}
```

**After:**
```typescript
import { OrderCreatedV1Event } from '@a4co/domain';

// Create versioned event
const event = OrderCreatedV1Event.create(
  orderId.value,
  customerId,
  items,
  totalAmount.toPrimitives(),
  sagaId
);
```

### Example 4: Domain Errors

**Before:**
```typescript
// apps/order-service/src/domain/errors/order.error.ts
export class OrderError extends Error {
  // custom error logic
}
```

**After:**
```typescript
import {
  BusinessRuleViolationError,
  InvalidStateTransitionError,
  EmptyOrderError,
} from '@a4co/domain';

// Use specific error types
if (items.length === 0) {
  throw new EmptyOrderError(orderId);
}

// Or create custom service-specific errors extending base
class ServiceSpecificOrderError extends BusinessRuleViolationError {
  constructor(message: string) {
    super(message, { service: 'order-service' });
  }
}
```

## Migration Checklist

For each service:

- [ ] Review current domain artifacts
- [ ] Identify artifacts that match @a4co/domain offerings
- [ ] Update imports to use @a4co/domain
- [ ] Remove duplicate implementations
- [ ] Update tests to import from @a4co/domain
- [ ] Verify builds and tests pass
- [ ] Update documentation

## Service-by-Service Status

### Order Service
- [ ] Migrate Money value object
- [ ] Migrate OrderId, OrderItem value objects
- [ ] Use OrderStatus with state transitions
- [ ] Use OrderCreatedV1, OrderConfirmedV1 events
- [ ] Migrate order-specific errors

### Payment Service
- [ ] Migrate Money value object
- [ ] Use PaymentId, PaymentStatus
- [ ] Use PaymentSucceededV1, PaymentFailedV1 events
- [ ] Migrate payment-specific errors

### Inventory Service
- [ ] Use ProductId, Quantity value objects
- [ ] Use InventoryReservedV1 event
- [ ] Migrate inventory errors

### User Service
- [ ] Migrate Email, Address value objects
- [ ] Use UserId value object
- [ ] Migrate user-specific errors

## Testing After Migration

```bash
# Build the domain package
cd packages/domain
pnpm build

# Run domain tests
pnpm test

# Build affected services
cd ../../apps/order-service
pnpm build

# Run service tests
pnpm test
```

## Troubleshooting

### Import Errors

If you get import errors:
1. Ensure `@a4co/domain` is built: `cd packages/domain && pnpm build`
2. Check that the import path is correct: `import { Money } from '@a4co/domain'`
3. Verify pnpm workspace is set up correctly

### Type Errors

If you get type errors:
1. Check that interfaces match (e.g., `MoneyPrimitives` for serialization)
2. Use `.toPrimitives()` and `.fromPrimitives()` methods for conversion
3. Ensure you're using the correct value object methods

### Test Failures

If tests fail after migration:
1. Update test imports
2. Adjust test assertions to match new value object behavior
3. Check that validation rules are consistent

## Benefits

After migration, services will:
- ✅ Share consistent domain logic
- ✅ Use versioned events for compatibility
- ✅ Have better validation and type safety
- ✅ Reduce code duplication
- ✅ Maintain clearer bounded context separation

## Questions?

Refer to:
- [packages/domain/README.md](./README.md) - Package documentation
- [packages/domain/src/order/README.md](./src/order/README.md) - Order context guide
- [packages/domain/src/payment/README.md](./src/payment/README.md) - Payment context guide

## Next Steps

After successful migration:
1. Update service documentation to reference @a4co/domain
2. Add integration tests using shared domain artifacts
3. Consider extracting more common patterns
4. Keep @a4co/domain updated with new shared needs
