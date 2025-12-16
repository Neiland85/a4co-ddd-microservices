# Order Bounded Context

## Purpose and Scope

The Order bounded context manages the lifecycle of customer orders from creation through completion or cancellation. It handles order validation, status transitions, and coordination with other bounded contexts (Payment, Inventory, Shipment) through domain events.

## Key Aggregates/Entities

### Order (Aggregate Root)
- **Identifier**: OrderId
- **Main Properties**:
  - customerId: string
  - items: OrderItem[]
  - status: OrderStatus
  - totalAmount: Money
  - createdAt: Date
  - updatedAt: Date

### Value Objects
- **OrderId**: Unique identifier for an order
- **OrderItem**: Represents a product in the order (productId, productName, quantity, unitPrice)
- **OrderStatus**: Current status of the order (PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED, FAILED)

## Core Invariants/Business Rules

1. **Order Creation**
   - Order must have at least one item
   - All items must have positive quantities
   - Total amount must equal sum of all item totals

2. **Status Transitions**
   - PENDING → CONFIRMED (after successful payment)
   - PENDING → CANCELLED (customer cancellation)
   - PENDING → FAILED (payment or inventory failure)
   - CONFIRMED → SHIPPED (when shipment begins)
   - CONFIRMED → CANCELLED (before shipment)
   - SHIPPED → DELIVERED (successful delivery)
   - DELIVERED, CANCELLED, FAILED are final states (no further transitions)

3. **Order Modification**
   - Items can only be added/removed while status is PENDING
   - Cannot modify an order in a final state (DELIVERED, CANCELLED, FAILED)

4. **Cancellation Rules**
   - Can be cancelled if not yet DELIVERED
   - Cancellation triggers compensation actions (refund, inventory release)

## Main Domain Events and Flow

### Order Creation Flow
1. **OrderCreatedV1** (`order.created.v1`)
   - Emitted when order is first created
   - Triggers saga orchestration
   - Contains: orderId, customerId, items, totalAmount

### Payment Flow
2. **OrderConfirmedV1** (`order.confirmed.v1`)
   - Emitted when payment succeeds
   - Triggers inventory reservation
   - Contains: orderId, customerId, totalAmount, paymentId

### Cancellation/Failure Flow
3. **OrderCancelledV1** (`order.cancelled.v1`)
   - Emitted when order is cancelled
   - Triggers compensation actions
   - Contains: orderId, customerId, reason

### Saga Integration
- Order participates in Order Fulfillment Saga
- Coordinates with Payment, Inventory, and Shipment contexts
- Handles both successful flows and compensation

## Error Handling

### Domain Errors
- **OrderItemError**: Invalid item operations
- **OrderAlreadyFinalizedError**: Attempting to modify finalized order
- **InvalidOrderTotalError**: Total amount calculation mismatch
- **EmptyOrderError**: Order created without items

### State Transition Errors
- **InvalidStateTransitionError**: Invalid status change attempt

## Usage Examples

```typescript
import { OrderId, OrderItem, OrderStatus, Money } from '@a4co/domain';

// Create order item
const item = OrderItem.create(
  'prod-123',
  'Product Name',
  2,
  Money.create(25.50, 'EUR')
);

// Create order ID
const orderId = OrderId.generate();

// Create order status
const status = OrderStatus.pending();

// Transition status
const confirmed = status.transitionTo(OrderStatus.create(OrderStatusValue.CONFIRMED));
```

## Related Contexts

- **Payment**: Handles payment processing for orders
- **Inventory**: Manages stock reservation for order items
- **Shipment**: Handles physical delivery of orders
- **User**: Provides customer information

## Version History

- **v1.0.0**: Initial implementation with basic order lifecycle
