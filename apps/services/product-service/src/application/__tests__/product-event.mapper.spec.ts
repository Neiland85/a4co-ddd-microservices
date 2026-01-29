import { describe, it, expect } from 'vitest';
import { Product } from '../../domain/entities/product.entity';
import { ProductId } from '../../domain/value-objects/product-id.vo';
import { ProductEventMapper } from '../mappers/product-event.mapper';

describe('ProductEventMapper', () => {
  it('maps Product to ProductCreatedV1', () => {
    const product = Product.create({
      id: ProductId.create(),
      name: 'Mapped Product',
      price: 42,
      stock: 3,
    });

    const event = ProductEventMapper.toProductCreated(product);

    expect(event.payload.productId).toBe(product.id.value);
    expect(event.payload.name).toBe('Mapped Product');
  });
});
