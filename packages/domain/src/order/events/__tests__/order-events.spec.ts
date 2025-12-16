import {
  OrderCreatedV1Event,
  ORDER_CREATED_V1,
  OrderConfirmedV1Event,
  ORDER_CONFIRMED_V1,
  OrderCancelledV1Event,
  ORDER_CANCELLED_V1,
  OrderFailedV1Event,
  ORDER_FAILED_V1,
} from '../index.js';

describe('Order Domain Events', () => {
  describe('OrderCreatedV1Event', () => {
    it('should have correct event type', () => {
      const data = {
        orderId: 'order-123',
        customerId: 'customer-123',
        items: [{ productId: 'product-1', quantity: 1, unitPrice: 10.0, currency: 'EUR' }],
        totalAmount: 10.0,
        currency: 'EUR',
        createdAt: new Date().toISOString(),
      };

      const event = new OrderCreatedV1Event(data);

      expect(event.eventType).toBe(ORDER_CREATED_V1);
      expect(event.eventType).toBe('order.created.v1');
    });

    it('should contain valid payload', () => {
      const data = {
        orderId: 'order-123',
        customerId: 'customer-123',
        items: [{ productId: 'product-1', quantity: 2, unitPrice: 10.0, currency: 'EUR' }],
        totalAmount: 20.0,
        currency: 'EUR',
        createdAt: new Date().toISOString(),
      };

      const event = new OrderCreatedV1Event(data);

      expect(event.data.orderId).toBe('order-123');
      expect(event.data.customerId).toBe('customer-123');
      expect(event.data.items).toHaveLength(1);
      expect(event.data.totalAmount).toBe(20.0);
    });
  });

  describe('OrderConfirmedV1Event', () => {
    it('should have correct event type', () => {
      const data = {
        orderId: 'order-123',
        customerId: 'customer-123',
        totalAmount: 10.0,
        currency: 'EUR',
        confirmedAt: new Date().toISOString(),
      };

      const event = new OrderConfirmedV1Event(data);

      expect(event.eventType).toBe(ORDER_CONFIRMED_V1);
      expect(event.eventType).toBe('order.confirmed.v1');
    });
  });

  describe('OrderCancelledV1Event', () => {
    it('should have correct event type', () => {
      const data = {
        orderId: 'order-123',
        customerId: 'customer-123',
        reason: 'Customer request',
        cancelledAt: new Date().toISOString(),
      };

      const event = new OrderCancelledV1Event(data);

      expect(event.eventType).toBe(ORDER_CANCELLED_V1);
      expect(event.eventType).toBe('order.cancelled.v1');
    });
  });

  describe('OrderFailedV1Event', () => {
    it('should have correct event type', () => {
      const data = {
        orderId: 'order-123',
        customerId: 'customer-123',
        reason: 'Payment failed',
        failedAt: new Date().toISOString(),
      };

      const event = new OrderFailedV1Event(data);

      expect(event.eventType).toBe(ORDER_FAILED_V1);
      expect(event.eventType).toBe('order.failed.v1');
    });
  });
});
