import { ProductId } from '../value-objects/product-id.vo';
import { SKU, Slug } from '../value-objects/product-value-objects';

export class Product {
  constructor(
    public readonly id: ProductId,
    public readonly sku: SKU,
    public readonly slug: Slug
  ) {}
}
