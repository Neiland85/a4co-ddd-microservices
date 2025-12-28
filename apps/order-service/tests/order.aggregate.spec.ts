import { Order, OrderItem, OrderStatus } from '../src/domain/aggregates/order.aggregate';

describe('Order Aggregate - Payment Status Transitions', () => {
  describe('confirmPayment', () => {
    it('should change status from PENDING to CONFIRMED', () => {
      // Arrange
      const items = [new OrderItem('product-1', 2, 10.0)];
      const order = new Order('order-1', 'customer-1', items, OrderStatus.PENDING);

      // Act
      order.confirmPayment();

      // Assert
      expect(order.status).toBe(OrderStatus.CONFIRMED);
    });

    it('should throw error when not in PENDING status', () => {
      // Arrange
      const items = [new OrderItem('product-1', 2, 10.0)];
      const order = new Order('order-1', 'customer-1', items, OrderStatus.CONFIRMED);

      // Act & Assert
      expect(() => order.confirmPayment()).toThrow(
        'Cannot confirm payment for order in status: CONFIRMED'
      );
    });
  });

  describe('markAsShipped', () => {
    it('should change status from CONFIRMED to SHIPPED', () => {
      // Arrange
      const items = [new OrderItem('product-1', 2, 10.0)];
      const order = new Order('order-1', 'customer-1', items, OrderStatus.CONFIRMED);

      // Act
      order.markAsShipped();

      // Assert
      expect(order.status).toBe(OrderStatus.SHIPPED);
    });

    it('should throw error when not in CONFIRMED status', () => {
      // Arrange
      const items = [new OrderItem('product-1', 2, 10.0)];
      const order = new Order('order-1', 'customer-1', items, OrderStatus.PENDING);

      // Act & Assert
      expect(() => order.markAsShipped()).toThrow(
        'Cannot ship order in status: PENDING'
      );
    });
  });

  describe('Payment flow integration', () => {
    it('should transition through PENDING -> CONFIRMED -> SHIPPED', () => {
      // Arrange
      const items = [new OrderItem('product-1', 2, 10.0)];
      const order = new Order('order-1', 'customer-1', items, OrderStatus.PENDING);

      // Act & Assert
      expect(order.status).toBe(OrderStatus.PENDING);

      order.confirmPayment();
      expect(order.status).toBe(OrderStatus.CONFIRMED);

      order.markAsShipped();
      expect(order.status).toBe(OrderStatus.SHIPPED);

      order.markAsDelivered();
      expect(order.status).toBe(OrderStatus.DELIVERED);
    });
  });
});
