import {
  OrderCreatedEvent,
  OrderId,
  OrderItem,
  OrderStatus,
} from '../src/domain/aggregates/order.aggregate';

describe('Order Domain Objects', () => {
  describe('OrderId', () => {
    it('should create a valid OrderId', () => {
      const id = 'order-123';
      const orderId = new OrderId(id);
      expect(orderId.value).toBe(id);
    });

    it('should throw error for empty OrderId', () => {
      expect(() => new OrderId('')).toThrow('OrderId cannot be empty');
      expect(() => new OrderId('   ')).toThrow('OrderId cannot be empty');
    });
  });

  describe('OrderItem', () => {
    it('should create a valid OrderItem', () => {
      const productId = 'product-123';
      const quantity = 2;
      const unitPrice = 25.5;
      const currency = 'EUR';

      const orderItem = new OrderItem(productId, quantity, unitPrice, currency);

      expect(orderItem.productId).toBe(productId);
      expect(orderItem.quantity).toBe(quantity);
      expect(orderItem.unitPrice).toBe(unitPrice);
      expect(orderItem.currency).toBe(currency);
    });

    it('should calculate total price correctly', () => {
      const orderItem = new OrderItem('product-123', 3, 10.0);
      expect(orderItem.totalPrice).toBe(30.0);
    });

    it('should use EUR as default currency', () => {
      const orderItem = new OrderItem('product-123', 1, 15.0);
      expect(orderItem.currency).toBe('EUR');
    });

    it('should throw error for non-positive quantity', () => {
      expect(() => new OrderItem('product-123', 0, 10.0)).toThrow('Quantity must be positive');
      expect(() => new OrderItem('product-123', -1, 10.0)).toThrow('Quantity must be positive');
    });

    it('should throw error for negative unit price', () => {
      expect(() => new OrderItem('product-123', 1, -5.0)).toThrow('Unit price cannot be negative');
    });
  });

  describe('OrderStatus', () => {
    it('should have all expected status values', () => {
      expect(OrderStatus.PENDING).toBe('PENDING');
      expect(OrderStatus.CONFIRMED).toBe('CONFIRMED');
      expect(OrderStatus.PAID).toBe('PAID');
      expect(OrderStatus.SHIPPED).toBe('SHIPPED');
      expect(OrderStatus.DELIVERED).toBe('DELIVERED');
      expect(OrderStatus.CANCELLED).toBe('CANCELLED');
    });
  });

  describe('OrderCreatedEvent', () => {
    it('should create an OrderCreatedEvent', () => {
      const orderId = 'order-123';
      const customerId = 'customer-456';
      const totalAmount = 150.0;

      const event = new OrderCreatedEvent(orderId, customerId, totalAmount);

      expect(event.orderId).toBe(orderId);
      expect(event.customerId).toBe(customerId);
      expect(event.totalAmount).toBe(totalAmount);
      expect(event.eventType).toBe('OrderCreatedEvent');
      expect(event.timestamp).toBeInstanceOf(Date);
    });
  });
});
