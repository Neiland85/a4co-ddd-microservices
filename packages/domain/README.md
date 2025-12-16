# @a4co/domain

Shared domain artifacts organized by bounded contexts for the A4CO DDD microservices platform.

## Overview

This package provides domain-layer components (value objects, events, errors, etc.) that are shared across multiple microservices. It follows Domain-Driven Design principles and organizes code by bounded context.

## Structure

```
src/
├── common/              # Shared domain primitives
│   ├── value-objects/   # Money, Email, Address
│   ├── errors/          # Domain errors
│   └── types/           # Common types
├── order/               # Order bounded context
│   ├── value-objects/   # OrderId, OrderStatus, OrderItem
│   ├── events/          # OrderCreatedV1, OrderConfirmedV1
│   ├── errors/          # Order-specific errors
│   └── README.md
├── payment/             # Payment bounded context
├── inventory/           # Inventory bounded context
├── user/                # User bounded context
├── auth/                # Auth bounded context
├── product/             # Product bounded context
└── shipment/            # Shipment bounded context
```

## Bounded Contexts

Each bounded context contains:
- **value-objects/**: Immutable value objects with business logic
- **events/**: Versioned domain events (e.g., `OrderCreatedV1`)
- **errors/**: Domain-specific error types
- **repositories/**: Repository interfaces (ports)
- **services/**: Domain services
- **README.md**: Context documentation

## Installation

```bash
pnpm add @a4co/domain
```

## Usage

### Common Value Objects

```typescript
import { Money, Email, Address } from '@a4co/domain';

// Money
const price = Money.create(100, 'EUR');
const total = price.multiply(2); // 200 EUR

// Email
const email = Email.create('user@example.com');
console.log(email.getDomain()); // 'example.com'

// Address
const address = Address.create(
  '123 Main St',
  'Seville',
  'Andalusia',
  '41001',
  'Spain'
);
```

### Order Context

```typescript
import {
  OrderId,
  OrderStatus,
  OrderStatusValue,
  OrderItem,
  OrderCreatedV1Event,
} from '@a4co/domain';

// Create order components
const orderId = OrderId.generate();
const status = OrderStatus.pending();

// Create order item
const item = OrderItem.create(
  'prod-123',
  'Product Name',
  2,
  Money.create(25.50, 'EUR')
);

// Create domain event
const event = OrderCreatedV1Event.create(
  orderId.value,
  'customer-123',
  [item.toPrimitives()],
  Money.create(51, 'EUR').toPrimitives(),
  'saga-123'
);
```

### Payment Context

```typescript
import {
  PaymentId,
  PaymentStatus,
  PaymentStatusValue,
  PaymentSucceededV1Event,
} from '@a4co/domain';

const paymentId = PaymentId.generate();
const status = PaymentStatus.pending();

// Transition status
const processing = status.transitionTo(
  PaymentStatus.create(PaymentStatusValue.PROCESSING)
);
```

### Error Handling

```typescript
import {
  DomainError,
  BusinessRuleViolationError,
  InvalidStateTransitionError,
  OrderAlreadyFinalizedError,
} from '@a4co/domain';

try {
  // Domain operation
  status.transitionTo(invalidStatus);
} catch (error) {
  if (error instanceof InvalidStateTransitionError) {
    console.error('Invalid state transition:', error.message);
  }
}
```

## Event Versioning

All domain events follow a versioning convention:

- **Class name**: `EventNameV1Event`
- **Topic constant**: `EVENT_NAME_V1` = `'context.event-name.v1'`
- **Example**: `OrderCreatedV1Event` with topic `'order.created.v1'`

This allows for backward-compatible event schema evolution.

## Design Principles

1. **Pure Domain Layer**: No infrastructure dependencies (no NestJS, no database)
2. **Immutability**: Value objects are immutable
3. **Validation**: All value objects validate invariants on creation
4. **Versioning**: All events are versioned for schema evolution
5. **Bounded Contexts**: Clear separation of domain concerns
6. **Shared Kernel**: Common value objects (Money, Email, Address) in `common/`

## Dependencies

- `@a4co/shared-utils`: Base classes (BaseValueObject, DomainEvent, etc.)
- `uuid`: For generating unique identifiers

## Development

```bash
# Build
pnpm build

# Test
pnpm test

# Test with coverage
pnpm test:cov

# Lint
pnpm lint
pnpm lint:fix
```

## Related Packages

- `@a4co/shared-events`: Shared event contracts for inter-service communication
- `@a4co/shared-utils`: Base classes and utilities
- `@a4co/observability`: Observability and logging

## Contributing

When adding new domain artifacts:

1. Place them in the appropriate bounded context
2. Follow the existing naming conventions
3. Version all events (e.g., `V1`, `V2`)
4. Add unit tests
5. Update the context README.md
6. Export from context and package index files

## License

Proprietary - A4CO Platform
