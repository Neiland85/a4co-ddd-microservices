# @a4co/domain

## Overview

Domain package for A4CO DDD microservices. This package contains domain models organized by bounded contexts following Domain-Driven Design principles.

## Bounded Contexts

- **Order**: Order lifecycle management and saga orchestration
- **Payment**: Payment processing and transaction management
- **Inventory**: Stock management and reservations
- **Auth**: Authentication and authorization
- **User**: User account management
- **Product**: Product catalog and management

## Structure

Each bounded context is organized with the following structure:

```
{context}/
├── entities/          # Domain entities and aggregates
├── value-objects/     # Value objects
├── events/            # Domain events (versioned)
├── errors/            # Domain-specific errors
├── repositories/      # Repository interfaces (ports)
├── services/          # Domain services
└── README.md          # Context documentation
```

## Shared Kernel

The `shared/` directory contains:
- Common value objects (Money, etc.)
- Shared types
- Base domain errors

## Naming Conventions

- **TypeScript classes**: `PascalCase`
- **Files/folders**: `kebab-case`
- **Event names**: `{context}.{event}.v{version}` (e.g., `order.created.v1`)
- **Event constants**: `{CONTEXT}_{EVENT}_V{VERSION}` (e.g., `ORDER_CREATED_V1`)

## Event Versioning

All domain events MUST be versioned:
- Event type: `order.created.v1`, `order.created.v2`
- Event class: `OrderCreatedV1Event`, `OrderCreatedV2Event`
- Event constant: `ORDER_CREATED_V1`, `ORDER_CREATED_V2`

This ensures backward compatibility when events evolve.

## Usage

```typescript
import { Order, OrderItem, OrderStatus } from '@a4co/domain';
import { Money } from '@a4co/domain';

// Create an order
const items = [new OrderItem('product-1', 2, 10.0, 'EUR')];
const order = Order.create('customer-123', items);

// Confirm the order
order.confirm();

// Use shared value objects
const price = Money.create(100.50, 'EUR');
```

## Testing

Run tests:
```bash
cd packages/domain
pnpm test
```

Run tests with coverage:
```bash
pnpm test:cov
```

## Development

Build the package:
```bash
pnpm build
```

Clean build artifacts:
```bash
pnpm clean
```

## Dependencies

- `@a4co/shared-utils`: Base classes (AggregateRoot, ValueObject, DomainEvent)
- `uuid`: Unique identifier generation

## Principles

1. **Ubiquitous Language**: Use domain terminology consistently
2. **Bounded Context Isolation**: Minimize cross-context dependencies
3. **Aggregate Boundaries**: Enforce invariants within aggregates
4. **Domain Event Versioning**: Always version events for evolution
5. **Repository Abstraction**: Define ports, implement adapters elsewhere

## Contributing

When adding new domain code:
1. Place it in the appropriate bounded context
2. Follow the established folder structure
3. Add comprehensive unit tests
4. Document in the context's README
5. Version all domain events
6. Define repository interfaces as ports
