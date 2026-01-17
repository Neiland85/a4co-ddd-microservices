import { Product } from '../../aggregates/product/product.entity';

export class CatalogPolicy {
  static assertVisible(product: Product): void {
    if (!product.active) {
      throw new Error('Product is not visible in catalog');
    }
  }
}
