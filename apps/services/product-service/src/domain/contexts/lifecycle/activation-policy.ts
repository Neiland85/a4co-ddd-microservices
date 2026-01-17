import { Product } from '../../aggregates/product/product.entity';

export class ActivationPolicy {
  static assertCanActivate(product: Product): void {
    if (product.isActive()) {
      throw new Error('Product already active');
    }
  }
}
