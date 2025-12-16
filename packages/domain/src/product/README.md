# Product Bounded Context

## Purpose
The Product bounded context manages the product catalog, including product information, variants, images, categories, and metadata. It provides the foundation for the marketplace.

## Status
🚧 **Implementation Pending** - This context structure is created but domain code needs to be extracted from `product-service`.

## Planned Components

### Key Aggregates
- **Product**: Product catalog entry
- **ProductVariant**: Product variations (size, color, etc.)
- **Category**: Product categorization

### Value Objects
- **ProductId**: Unique product identifier
- **SKU**: Stock keeping unit
- **Price**: Product price with currency
- **ProductName**: Validated product name
- **Description**: Product description

### Domain Events (Planned)
- `ProductCreatedV1`: New product added
- `ProductUpdatedV1`: Product information changed
- `ProductDeactivatedV1`: Product removed from catalog
- `PriceChangedV1`: Product price updated
- `CategoryAssignedV1`: Product categorized

### Business Rules
- Product name must be unique per artisan
- Price must be positive
- Active products must have at least one image
- Products must belong to at least one category
- SKU must be unique

## Integration Points
- Inventory Context: Links to stock management
- Order Context: Product details for orders
- Artisan Context: Product ownership
