# Order Bounded Context

## Purpose
The Order bounded context manages the complete lifecycle of customer orders, from creation through fulfillment or cancellation. It orchestrates the order saga, coordinating with Payment, Inventory, and Shipment contexts.

## Ubiquitous Language

- **Order**: A customer's request to purchase products
- **Order Item**: A specific product and quantity within an order
- **Order Status**: The current state of an order (Pending, Confirmed, Shipped, Delivered, Cancelled, Failed)
- **Customer**: The person placing the order
- **Total Amount**: The sum of all order items

## Key Aggregates

### Order (Aggregate Root)
The main aggregate that encapsulates all order-related data and behavior.

**Invariants:**
- An order must have at least one item
- All items in an order must use the same currency
- Order status transitions must follow valid paths
- Only pending orders can be modified (add/remove items)
- Total amount must match the sum of all item prices

**Properties:**
- `orderId`: Unique identifier
- `customerId`: Reference to the customer
- `items`: Collection of OrderItem value objects
- `status`: Current order status
- `totalAmount`: Calculated total price
- `currency`: Order currency (EUR default)

## Value Objects

### OrderId
Unique identifier for an order (UUID).

### OrderItem
Represents a product in an order with:
- `productId`: Reference to the product
- `quantity`: Number of units
- `unitPrice`: Price per unit
- `currency`: Item currency

### OrderStatus
Enum representing order lifecycle states:
- `PENDING`: Initial state, awaiting payment
- `CONFIRMED`: Payment succeeded, ready for fulfillment
- `SHIPPED`: Order dispatched to customer
- `DELIVERED`: Order received by customer
- `CANCELLED`: Order cancelled (can happen before delivery)
- `FAILED`: Order failed (payment failed, inventory unavailable)

**Valid Transitions:**
- PENDING → CONFIRMED, CANCELLED, FAILED
- CONFIRMED → SHIPPED, CANCELLED
- SHIPPED → DELIVERED, CANCELLED
- DELIVERED, CANCELLED, FAILED → (terminal states)

## Domain Events

All events are versioned following the pattern `{context}.{event}.v{version}`:

### OrderCreatedV1 (`order.created.v1`)
Emitted when a new order is created. Triggers the order saga orchestration.

**Payload:**
- `orderId`: Order identifier
- `customerId`: Customer identifier
- `items`: Array of order items
- `totalAmount`: Total order amount
- `currency`: Order currency
- `createdAt`: Timestamp

### OrderConfirmedV1 (`order.confirmed.v1`)
Emitted when payment is successful and order is confirmed.

**Payload:**
- `orderId`: Order identifier
- `customerId`: Customer identifier
- `totalAmount`: Total amount
- `currency`: Order currency
- `confirmedAt`: Timestamp

### OrderCancelledV1 (`order.cancelled.v1`)
Emitted when an order is cancelled. Triggers compensating transactions.

**Payload:**
- `orderId`: Order identifier
- `customerId`: Customer identifier
- `reason`: Cancellation reason (optional)
- `cancelledAt`: Timestamp

### OrderFailedV1 (`order.failed.v1`)
Emitted when an order fails. Triggers saga rollback.

**Payload:**
- `orderId`: Order identifier
- `customerId`: Customer identifier
- `reason`: Failure reason
- `failedAt`: Timestamp

## Business Rules

1. **Order Creation**
   - Must have at least one item
   - All items must use the same currency
   - Customer ID must be valid and non-empty

2. **Order Modification**
   - Only PENDING orders can have items added or removed
   - Items must match order currency
   - Order must always have at least one item

3. **Status Transitions**
   - Must follow valid transition paths
   - Terminal states (DELIVERED, CANCELLED, FAILED) cannot transition

4. **Payment Integration**
   - Order confirms only after successful payment
   - Payment failure triggers order failure
   - Cancellation triggers payment refund (if paid)

5. **Inventory Integration**
   - Items must be available in inventory
   - Inventory reserved on order creation
   - Inventory released on cancellation/failure

## Repository Interface

`IOrderRepository` defines the persistence contract:
- `save(order)`: Persist order changes
- `findById(orderId)`: Retrieve order by ID
- `findByCustomerId(customerId)`: Get customer's orders
- `findByStatus(status)`: Query orders by status
- `delete(orderId)`: Remove order
- `exists(orderId)`: Check order existence

## Domain Services

Currently, no domain services are defined. Business logic is contained within the Order aggregate.

## Integration Points

- **Payment Context**: Coordinates payment processing
- **Inventory Context**: Manages stock reservations
- **Shipment Context**: Triggers delivery when order is confirmed
- **Notification Context**: Sends order status updates to customers

## Testing Strategy

Unit tests cover:
- Order aggregate creation and validation
- Status transition logic
- Item management (add/remove)
- Business rule enforcement
- Event emission verification
