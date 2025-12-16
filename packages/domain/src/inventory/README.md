# Inventory Bounded Context

## Purpose and Scope

The Inventory bounded context manages product stock levels, reservations, and availability. It ensures that orders can only be fulfilled if sufficient stock is available.

## Key Aggregates/Entities

### Stock (Aggregate Root)
- **Identifier**: ProductId
- **Main Properties**:
  - productId: ProductId
  - availableQuantity: Quantity
  - reservedQuantity: Quantity

### Value Objects
- **ProductId**: Unique identifier for a product
- **Quantity**: Stock quantity (non-negative integer)

## Core Invariants/Business Rules

1. **Stock Management**
   - Available quantity must be non-negative
   - Reserved quantity must be non-negative
   - Total quantity = available + reserved

2. **Reservation Rules**
   - Can only reserve if sufficient available stock
   - Reservation decreases available, increases reserved
   - Release increases available, decreases reserved

## Main Domain Events and Flow

1. **InventoryReservedV1** (`inventory.reserved.v1`)
   - Emitted when stock is reserved for an order
   - Contains: reservationId, orderId, productId, quantity

## Related Contexts

- **Order**: Requests inventory reservations
- **Product**: Provides product information
