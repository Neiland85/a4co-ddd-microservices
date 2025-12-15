import {
  OrderCreatedV1Event,
  OrderCreatedV1Data,
  OrderConfirmedV1Event,
  OrderConfirmedV1Data,
  OrderCancelledV1Event,
  OrderCancelledV1Data,
  OrderFailedV1Event,
  OrderFailedV1Data,
  EventTypes,
} from '../events/order';
import { DomainEventBase } from '../base/event.base';

describe('Order Events', () => {
  describe('OrderCreatedV1Event', () => {
    it('should create order created event with required data', () => {
      const data = {
        orderId: 'order-123',
        customerId: 'customer-456',
        items: [
          { productId: 'prod-1', quantity: 2, unitPrice: 29.99 },
          { productId: 'prod-2', quantity: 1, unitPrice: 49.99 },
        ],
        totalAmount: 109.97,
        currency: 'USD',
      };

      const event = new OrderCreatedV1Event(data);

      expect(event.eventType).toBe(EventTypes.ORDER_CREATED_V1);
      expect(event.data).toEqual(data);
      expect(event.eventId).toBeDefined();
      expect(event.correlationId).toBeDefined();
      expect(event.timestamp).toBeInstanceOf(Date);
    });

    it('should create event with custom correlationId', () => {
      const data = {
        orderId: 'order-123',
        customerId: 'customer-456',
        items: [],
        totalAmount: 0,
      };
      const correlationId = 'custom-corr-id';

      const event = new OrderCreatedV1Event(data, correlationId);

      expect(event.correlationId).toBe(correlationId);
    });

    it('should serialize and deserialize correctly', () => {
      const data = {
        orderId: 'order-123',
        customerId: 'customer-456',
        items: [{ productId: 'prod-1', quantity: 1, unitPrice: 10.0 }],
        totalAmount: 10.0,
      };

      const original = new OrderCreatedV1Event(data);
      const json = original.toJSON();
      const deserialized = DomainEventBase.fromJSON<OrderCreatedV1Data>(json);

      expect(deserialized.eventType).toBe(original.eventType);
      expect(deserialized.data).toEqual(original.data);
      expect(deserialized.eventId).toBe(original.eventId);
      expect(deserialized.correlationId).toBe(original.correlationId);
    });
  });

  describe('OrderConfirmedV1Event', () => {
    it('should create order confirmed event', () => {
      const data = {
        orderId: 'order-123',
        customerId: 'customer-456',
        paymentId: 'payment-789',
        totalAmount: 109.97,
        currency: 'USD',
        confirmedAt: new Date().toISOString(),
      };

      const event = new OrderConfirmedV1Event(data);

      expect(event.eventType).toBe(EventTypes.ORDER_CONFIRMED_V1);
      expect(event.data).toEqual(data);
    });

    it('should serialize and deserialize correctly', () => {
      const data = {
        orderId: 'order-123',
        customerId: 'customer-456',
        paymentId: 'payment-789',
        totalAmount: 109.97,
        confirmedAt: new Date().toISOString(),
      };

      const original = new OrderConfirmedV1Event(data);
      const json = original.toJSON();
      const deserialized = DomainEventBase.fromJSON<OrderConfirmedV1Data>(json);

      expect(deserialized.eventType).toBe(original.eventType);
      expect(deserialized.data).toEqual(original.data);
    });
  });

  describe('OrderCancelledV1Event', () => {
    it('should create order cancelled event', () => {
      const data = {
        orderId: 'order-123',
        customerId: 'customer-456',
        reason: 'Payment failed',
        cancelledAt: new Date().toISOString(),
      };

      const event = new OrderCancelledV1Event(data);

      expect(event.eventType).toBe(EventTypes.ORDER_CANCELLED_V1);
      expect(event.data).toEqual(data);
      expect(event.data.reason).toBe('Payment failed');
    });

    it('should serialize and deserialize correctly', () => {
      const data = {
        orderId: 'order-123',
        customerId: 'customer-456',
        reason: 'Inventory out of stock',
        cancelledAt: new Date().toISOString(),
      };

      const original = new OrderCancelledV1Event(data);
      const json = original.toJSON();
      const deserialized = DomainEventBase.fromJSON<OrderCancelledV1Data>(json);

      expect(deserialized.eventType).toBe(original.eventType);
      expect(deserialized.data).toEqual(original.data);
    });
  });

  describe('OrderFailedV1Event', () => {
    it('should create order failed event', () => {
      const data = {
        orderId: 'order-123',
        customerId: 'customer-456',
        reason: 'Validation failed',
        failedAt: new Date().toISOString(),
        stage: 'validation' as const,
      };

      const event = new OrderFailedV1Event(data);

      expect(event.eventType).toBe(EventTypes.ORDER_FAILED_V1);
      expect(event.data).toEqual(data);
      expect(event.data.stage).toBe('validation');
    });

    it('should serialize and deserialize correctly', () => {
      const data = {
        orderId: 'order-123',
        customerId: 'customer-456',
        reason: 'Payment gateway timeout',
        failedAt: new Date().toISOString(),
        stage: 'payment' as const,
      };

      const original = new OrderFailedV1Event(data);
      const json = original.toJSON();
      const deserialized = DomainEventBase.fromJSON<OrderFailedV1Data>(json);

      expect(deserialized.eventType).toBe(original.eventType);
      expect(deserialized.data).toEqual(original.data);
    });
  });

  describe('correlationId propagation', () => {
    it('should propagate correlationId through event chain', () => {
      const correlationId = 'saga-correlation-123';

      const orderCreated = new OrderCreatedV1Event(
        {
          orderId: 'order-123',
          customerId: 'customer-456',
          items: [],
          totalAmount: 0,
        },
        correlationId,
      );

      const orderConfirmed = new OrderConfirmedV1Event(
        {
          orderId: 'order-123',
          customerId: 'customer-456',
          paymentId: 'payment-789',
          totalAmount: 0,
          confirmedAt: new Date().toISOString(),
        },
        correlationId,
      );

      expect(orderCreated.correlationId).toBe(correlationId);
      expect(orderConfirmed.correlationId).toBe(correlationId);
      expect(orderCreated.correlationId).toBe(orderConfirmed.correlationId);
    });
  });
});
