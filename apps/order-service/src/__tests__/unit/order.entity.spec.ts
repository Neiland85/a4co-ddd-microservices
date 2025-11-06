import { Order, OrderItem, OrderStatusEnum } from '../../domain/aggregates/order.aggregate';
import { OrderStatus } from '../../domain/value-objects/order-status.vo';

describe('Order Aggregate', () => {
  describe('Creation', () => {
    it('should create an order with PENDING status', () => {
      const items = [
        new OrderItem('product1', 2, 10.0, 'EUR'),
        new OrderItem('product2', 1, 20.0, 'EUR'),
      ];
      const order = new Order('order-1', 'customer-1', items);

      expect(order.id).toBe('order-1');
      expect(order.customerId).toBe('customer-1');
      expect(order.status).toBe(OrderStatusEnum.PENDING);
      expect(order.totalAmount).toBe(40.0);
      expect(order.items).toHaveLength(2);
      expect(order.domainEvents.length).toBeGreaterThan(0);
    });

    it('should calculate total amount correctly', () => {
      const items = [
        new OrderItem('product1', 3, 15.5, 'EUR'),
        new OrderItem('product2', 2, 25.0, 'EUR'),
      ];
      const order = new Order('order-2', 'customer-1', items);

      expect(order.totalAmount).toBe(96.5); // (3 * 15.5) + (2 * 25.0)
    });
  });

  describe('confirmPayment', () => {
    it('should change status to PAYMENT_CONFIRMED', () => {
      const order = new Order('order-1', 'customer-1', [
        new OrderItem('product1', 1, 10.0),
      ]);

      order.confirmPayment();

      expect(order.status).toBe(OrderStatusEnum.PAYMENT_CONFIRMED);
      expect(order.domainEvents.length).toBeGreaterThan(1);
    });

    it('should throw error if status transition is invalid', () => {
      const order = new Order('order-1', 'customer-1', [
        new OrderItem('product1', 1, 10.0),
      ]);
      order.confirmPayment();

      expect(() => order.confirmPayment()).toThrow();
    });
  });

  describe('reserveInventory', () => {
    it('should change status to INVENTORY_RESERVED', () => {
      const order = new Order('order-1', 'customer-1', [
        new OrderItem('product1', 1, 10.0),
      ]);
      order.confirmPayment();

      order.reserveInventory();

      expect(order.status).toBe(OrderStatusEnum.INVENTORY_RESERVED);
    });

    it('should throw error if status is not PAYMENT_CONFIRMED', () => {
      const order = new Order('order-1', 'customer-1', [
        new OrderItem('product1', 1, 10.0),
      ]);

      expect(() => order.reserveInventory()).toThrow();
    });
  });

  describe('complete', () => {
    it('should change status to COMPLETED', () => {
      const order = new Order('order-1', 'customer-1', [
        new OrderItem('product1', 1, 10.0),
      ]);
      order.confirmPayment();
      order.reserveInventory();

      order.complete();

      expect(order.status).toBe(OrderStatusEnum.COMPLETED);
      const completedEvents = order.domainEvents.filter(
        e => e.eventType === 'OrderCompletedEvent',
      );
      expect(completedEvents.length).toBeGreaterThan(0);
    });

    it('should throw error if status is not INVENTORY_RESERVED', () => {
      const order = new Order('order-1', 'customer-1', [
        new OrderItem('product1', 1, 10.0),
      ]);

      expect(() => order.complete()).toThrow();
    });
  });

  describe('cancel', () => {
    it('should cancel order with reason', () => {
      const order = new Order('order-1', 'customer-1', [
        new OrderItem('product1', 1, 10.0),
      ]);

      order.cancel('Customer requested cancellation');

      expect(order.status).toBe(OrderStatusEnum.CANCELLED);
      expect(order.cancelledAt).toBeDefined();
      expect(order.cancelledReason).toBe('Customer requested cancellation');
    });

    it('should throw error if reason is empty', () => {
      const order = new Order('order-1', 'customer-1', [
        new OrderItem('product1', 1, 10.0),
      ]);

      expect(() => order.cancel('')).toThrow();
    });

    it('should allow cancellation from PAYMENT_CONFIRMED status', () => {
      const order = new Order('order-1', 'customer-1', [
        new OrderItem('product1', 1, 10.0),
      ]);
      order.confirmPayment();

      order.cancel('Payment issue');

      expect(order.status).toBe(OrderStatusEnum.CANCELLED);
    });
  });

  describe('markAsFailed', () => {
    it('should mark order as failed with reason', () => {
      const order = new Order('order-1', 'customer-1', [
        new OrderItem('product1', 1, 10.0),
      ]);

      order.markAsFailed('System error');

      expect(order.status).toBe(OrderStatusEnum.FAILED);
      const failedEvents = order.domainEvents.filter(
        e => e.eventType === 'OrderFailedEvent',
      );
      expect(failedEvents.length).toBeGreaterThan(0);
    });

    it('should throw error if reason is empty', () => {
      const order = new Order('order-1', 'customer-1', [
        new OrderItem('product1', 1, 10.0),
      ]);

      expect(() => order.markAsFailed('')).toThrow();
    });
  });

  describe('addItem', () => {
    it('should add item to pending order', () => {
      const order = new Order('order-1', 'customer-1', [
        new OrderItem('product1', 1, 10.0),
      ]);

      order.addItem(new OrderItem('product2', 2, 15.0));

      expect(order.items).toHaveLength(2);
      expect(order.totalAmount).toBe(40.0);
    });

    it('should throw error if order is not pending', () => {
      const order = new Order('order-1', 'customer-1', [
        new OrderItem('product1', 1, 10.0),
      ]);
      order.confirmPayment();

      expect(() => order.addItem(new OrderItem('product2', 1, 10.0))).toThrow();
    });
  });

  describe('removeItem', () => {
    it('should remove item from pending order', () => {
      const order = new Order('order-1', 'customer-1', [
        new OrderItem('product1', 1, 10.0),
        new OrderItem('product2', 1, 20.0),
      ]);

      order.removeItem('product1');

      expect(order.items).toHaveLength(1);
      expect(order.totalAmount).toBe(20.0);
    });

    it('should throw error if item not found', () => {
      const order = new Order('order-1', 'customer-1', [
        new OrderItem('product1', 1, 10.0),
      ]);

      expect(() => order.removeItem('product999')).toThrow();
    });
  });

  describe('toPersistence', () => {
    it('should serialize order to persistence format', () => {
      const order = new Order('order-1', 'customer-1', [
        new OrderItem('product1', 2, 10.0, 'EUR'),
      ]);

      const persistence = order.toPersistence();

      expect(persistence.id).toBe('order-1');
      expect(persistence.customerId).toBe('customer-1');
      expect(persistence.status).toBe(OrderStatusEnum.PENDING);
      expect(persistence.totalAmount).toBe(20.0);
      expect(persistence.currency).toBe('EUR');
      expect(persistence.items).toHaveLength(1);
    });
  });

  describe('reconstruct', () => {
    it('should reconstruct order from persistence data', () => {
      const items = [new OrderItem('product1', 2, 10.0, 'EUR')];
      const order = Order.reconstruct(
        'order-1',
        'customer-1',
        items,
        OrderStatusEnum.PAYMENT_CONFIRMED,
        20.0,
        'EUR',
        undefined,
        undefined,
        new Date('2024-01-01'),
        new Date('2024-01-02'),
      );

      expect(order.id).toBe('order-1');
      expect(order.status).toBe(OrderStatusEnum.PAYMENT_CONFIRMED);
      expect(order.totalAmount).toBe(20.0);
    });
  });
});
