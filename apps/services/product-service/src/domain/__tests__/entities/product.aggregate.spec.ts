import { describe, it, expect } from 'vitest';
// import { Product } from '../../entities/product.entity';
import { ProductId } from '../../value-objects/product-id.vo';

describe('Product Aggregate', () => {
  it('creates a valid product and exposes its identity', () => {
    const id = ProductId.create();
    const product = Product.create({
      id,
      name: 'Test Product',
      price: 100,
      stock: 10,
    });

    expect(product.id.equals(id)).toBe(true);
  });

  it('emits a domain event on creation', () => {
    const product = Product.create({
      id: ProductId.create(),
      name: 'Evented Product',
      price: 50,
      stock: 5,
    });

    const events = product.pullDomainEvents();

    expect(events.length).toBe(1);
    expect(events[0].eventName).toBe('ProductCreated');
  });

  it('prevents invalid state transitions', () => {
    const product = Product.create({
      id: ProductId.create(),
      name: 'Limited Product',
      price: 20,
      stock: 1,
    });

    expect(() => {
      product.decreaseStock(2);
    }).toThrow();
  });
});
