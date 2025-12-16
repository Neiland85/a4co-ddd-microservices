import { Order } from '../order.aggregate.js';
import { OrderItem } from '../../value-objects/order-item.vo.js';
import { OrderStatus } from '../../value-objects/order-status.vo.js';

describe('Order Aggregate', () => {
  describe('create', () => {
    it('should create a new order with valid data', () => {
      const customerId = 'customer-123';
      const items = [new OrderItem('product-1', 2, 10.0, 'EUR')];

      const order = Order.create(customerId, items);

      expect(order).toBeDefined();
      expect(order.customerId).toBe(customerId);
      expect(order.items).toHaveLength(1);
      expect(order.status).toBe(OrderStatus.PENDING);
      expect(order.totalAmount).toBe(20.0);
      expect(order.currency).toBe('EUR');
    });

    it('should throw error when customer ID is empty', () => {
      const items = [new OrderItem('product-1', 1, 10.0, 'EUR')];

      expect(() => Order.create('', items)).toThrow('Customer ID cannot be empty');
    });

    it('should throw error when items array is empty', () => {
      expect(() => Order.create('customer-123', [])).toThrow('Order must have at least one item');
    });
  });

  describe('confirm', () => {
    it('should confirm a pending order', () => {
      const items = [new OrderItem('product-1', 1, 10.0, 'EUR')];
      const order = Order.create('customer-123', items);

      order.confirm();

      expect(order.status).toBe(OrderStatus.CONFIRMED);
    });
  });

  describe('toPrimitives', () => {
    it('should serialize order to primitives', () => {
      const items = [new OrderItem('product-1', 2, 10.0, 'EUR')];
      const order = Order.create('customer-123', items);

      const primitives = order.toPrimitives();

      expect(primitives).toMatchObject({
        customerId: 'customer-123',
        status: OrderStatus.PENDING,
        totalAmount: 20.0,
        currency: 'EUR',
      });
      expect(primitives.items).toHaveLength(1);
      expect(primitives.id).toBeDefined();
      expect(primitives.createdAt).toBeInstanceOf(Date);
      expect(primitives.updatedAt).toBeInstanceOf(Date);
    });
  });
});
