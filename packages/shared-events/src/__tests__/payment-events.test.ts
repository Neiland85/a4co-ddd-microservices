import {
  PaymentRequestedV1Event,
  PaymentRequestedV1Data,
  PaymentProcessingV1Event,
  PaymentProcessingV1Data,
  PaymentConfirmedV1Event,
  PaymentConfirmedV1Data,
  PaymentFailedV1Event,
  PaymentFailedV1Data,
  EventTypes,
} from '../events/payment';
import { DomainEventBase } from '../base/event.base';

describe('Payment Events', () => {
  describe('PaymentRequestedV1Event', () => {
    it('should create payment requested event', () => {
      const data = {
        orderId: 'order-123',
        customerId: 'customer-456',
        amount: 109.97,
        currency: 'USD',
        paymentMethod: 'credit_card',
      };

      const event = new PaymentRequestedV1Event(data);

      expect(event.eventType).toBe(EventTypes.PAYMENT_REQUESTED_V1);
      expect(event.data).toEqual(data);
      expect(event.eventId).toBeDefined();
    });

    it('should serialize and deserialize correctly', () => {
      const data = {
        orderId: 'order-123',
        customerId: 'customer-456',
        amount: 109.97,
        currency: 'USD',
      };

      const original = new PaymentRequestedV1Event(data);
      const json = original.toJSON();
      const deserialized = DomainEventBase.fromJSON<PaymentRequestedV1Data>(json);

      expect(deserialized.eventType).toBe(original.eventType);
      expect(deserialized.data).toEqual(original.data);
    });
  });

  describe('PaymentProcessingV1Event', () => {
    it('should create payment processing event', () => {
      const data = {
        paymentId: 'payment-789',
        orderId: 'order-123',
        customerId: 'customer-456',
        amount: 109.97,
        currency: 'USD',
        startedAt: new Date().toISOString(),
      };

      const event = new PaymentProcessingV1Event(data);

      expect(event.eventType).toBe(EventTypes.PAYMENT_PROCESSING_V1);
      expect(event.data).toEqual(data);
    });

    it('should serialize and deserialize correctly', () => {
      const data = {
        paymentId: 'payment-789',
        orderId: 'order-123',
        customerId: 'customer-456',
        amount: 109.97,
        currency: 'USD',
        startedAt: new Date().toISOString(),
      };

      const original = new PaymentProcessingV1Event(data);
      const json = original.toJSON();
      const deserialized = DomainEventBase.fromJSON<PaymentProcessingV1Data>(json);

      expect(deserialized.eventType).toBe(original.eventType);
      expect(deserialized.data).toEqual(original.data);
    });
  });

  describe('PaymentConfirmedV1Event', () => {
    it('should create payment confirmed event', () => {
      const data = {
        paymentId: 'payment-789',
        orderId: 'order-123',
        customerId: 'customer-456',
        amount: 109.97,
        currency: 'USD',
        paymentIntentId: 'pi_stripe_123',
        confirmedAt: new Date().toISOString(),
      };

      const event = new PaymentConfirmedV1Event(data);

      expect(event.eventType).toBe(EventTypes.PAYMENT_CONFIRMED_V1);
      expect(event.data).toEqual(data);
      expect(event.data.paymentIntentId).toBe('pi_stripe_123');
    });

    it('should serialize and deserialize correctly', () => {
      const data = {
        paymentId: 'payment-789',
        orderId: 'order-123',
        customerId: 'customer-456',
        amount: 109.97,
        currency: 'USD',
        confirmedAt: new Date().toISOString(),
      };

      const original = new PaymentConfirmedV1Event(data);
      const json = original.toJSON();
      const deserialized = DomainEventBase.fromJSON<PaymentConfirmedV1Data>(json);

      expect(deserialized.eventType).toBe(original.eventType);
      expect(deserialized.data).toEqual(original.data);
    });
  });

  describe('PaymentFailedV1Event', () => {
    it('should create payment failed event', () => {
      const data = {
        paymentId: 'payment-789',
        orderId: 'order-123',
        customerId: 'customer-456',
        amount: 109.97,
        currency: 'USD',
        reason: 'Insufficient funds',
        failedAt: new Date().toISOString(),
        errorCode: 'card_declined',
      };

      const event = new PaymentFailedV1Event(data);

      expect(event.eventType).toBe(EventTypes.PAYMENT_FAILED_V1);
      expect(event.data).toEqual(data);
      expect(event.data.reason).toBe('Insufficient funds');
      expect(event.data.errorCode).toBe('card_declined');
    });

    it('should create event without optional paymentId', () => {
      const data = {
        orderId: 'order-123',
        customerId: 'customer-456',
        amount: 109.97,
        currency: 'USD',
        reason: 'Payment processor unavailable',
        failedAt: new Date().toISOString(),
      };

      const event = new PaymentFailedV1Event(data);

      expect(event.eventType).toBe(EventTypes.PAYMENT_FAILED_V1);
      expect(event.data.paymentId).toBeUndefined();
    });

    it('should serialize and deserialize correctly', () => {
      const data = {
        orderId: 'order-123',
        customerId: 'customer-456',
        amount: 109.97,
        currency: 'USD',
        reason: 'Timeout',
        failedAt: new Date().toISOString(),
      };

      const original = new PaymentFailedV1Event(data);
      const json = original.toJSON();
      const deserialized = DomainEventBase.fromJSON<PaymentFailedV1Data>(json);

      expect(deserialized.eventType).toBe(original.eventType);
      expect(deserialized.data).toEqual(original.data);
    });
  });

  describe('Saga flow simulation', () => {
    it('should maintain correlationId through payment flow', () => {
      const correlationId = 'saga-payment-123';

      const requested = new PaymentRequestedV1Event(
        {
          orderId: 'order-123',
          customerId: 'customer-456',
          amount: 100.0,
          currency: 'USD',
        },
        correlationId,
      );

      const processing = new PaymentProcessingV1Event(
        {
          paymentId: 'payment-789',
          orderId: 'order-123',
          customerId: 'customer-456',
          amount: 100.0,
          currency: 'USD',
          startedAt: new Date().toISOString(),
        },
        correlationId,
      );

      const confirmed = new PaymentConfirmedV1Event(
        {
          paymentId: 'payment-789',
          orderId: 'order-123',
          customerId: 'customer-456',
          amount: 100.0,
          currency: 'USD',
          confirmedAt: new Date().toISOString(),
        },
        correlationId,
      );

      expect(requested.correlationId).toBe(correlationId);
      expect(processing.correlationId).toBe(correlationId);
      expect(confirmed.correlationId).toBe(correlationId);
    });

    it('should handle failed payment flow with correlationId', () => {
      const correlationId = 'saga-payment-failed-456';

      const requested = new PaymentRequestedV1Event(
        {
          orderId: 'order-123',
          customerId: 'customer-456',
          amount: 100.0,
          currency: 'USD',
        },
        correlationId,
      );

      const failed = new PaymentFailedV1Event(
        {
          orderId: 'order-123',
          customerId: 'customer-456',
          amount: 100.0,
          currency: 'USD',
          reason: 'Card declined',
          failedAt: new Date().toISOString(),
        },
        correlationId,
      );

      expect(requested.correlationId).toBe(correlationId);
      expect(failed.correlationId).toBe(correlationId);
    });
  });
});
