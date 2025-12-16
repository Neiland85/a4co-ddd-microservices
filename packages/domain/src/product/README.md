# Product Bounded Context

## Purpose and Scope

The Product bounded context manages product catalog, pricing, and product information.

## Key Aggregates/Entities

### Product (Aggregate Root)
- **Main Properties**: productId, name, description, price, category

## Related Contexts

- **Inventory**: Manages stock for products
- **Order**: References products in orders
