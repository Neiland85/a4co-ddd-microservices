import { Product } from '../../aggregates/product/product.entity';

export class PricingPolicy {
  static assertHasValidPrice(product: Product): void {
    if (!product.price || product.price <= 0) {
      throw new Error('Product price must be greater than zero');
    }
  }
}
