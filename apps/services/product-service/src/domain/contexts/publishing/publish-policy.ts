import { Product } from '../../aggregates/product/product.entity';

export class PublishPolicy {
  static assertPublishable(product: Product): void {
    if (!product.isActive()) {
      throw new Error('Product cannot be published');
    }
  }
}
