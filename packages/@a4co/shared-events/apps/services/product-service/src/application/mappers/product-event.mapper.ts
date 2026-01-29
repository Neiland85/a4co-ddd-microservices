import { Product } from '../../domain/entities/product.entity';
import { ProductCreatedV1 } from '@a4co/shared-events';

export class ProductEventMapper {
  static toProductCreated(product: Product): ProductCreatedV1 {
    return new ProductCreatedV1({
      productId: product.id.value,
      name: product.name,
      price: product.price.value,
      stock: product.stock.value,
      occurredAt: new Date(),
    });
  }
}
