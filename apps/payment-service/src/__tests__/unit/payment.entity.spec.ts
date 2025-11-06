import { Payment } from '../domain/entities';
import { PaymentId, Money, PaymentStatus } from '../domain/value-objects';

describe('Payment Entity', () => {
  describe('create', () => {
    it('should create a payment with valid data', () => {
      const payment = Payment.create({
        orderId: 'order-123',
        amount: new Money(100, 'USD'),
        customerId: 'customer-456',
      });

      expect(payment).toBeDefined();
      expect(payment.orderId).toBe('order-123');
      expect(payment.status).toBe(PaymentStatus.PENDING);
      expect(payment.domainEvents.length).toBeGreaterThan(0);
    });

    it('should throw error if orderId is empty', () => {
      expect(() => {
        Payment.create({
          orderId: '',
          amount: new Money(100, 'USD'),
          customerId: 'customer-456',
        });
      }).toThrow('OrderId is required');
    });

    it('should throw error if customerId is empty', () => {
      expect(() => {
        Payment.create({
          orderId: 'order-123',
          amount: new Money(100, 'USD'),
          customerId: '',
        });
      }).toThrow('CustomerId is required');
    });
  });

  describe('process', () => {
    it('should change status to PROCESSING', () => {
      const payment = Payment.create({
        orderId: 'order-123',
        amount: new Money(100, 'USD'),
        customerId: 'customer-456',
      });

      payment.process();

      expect(payment.status).toBe(PaymentStatus.PROCESSING);
    });

    it('should throw error if not in PENDING status', () => {
      const payment = Payment.create({
        orderId: 'order-123',
        amount: new Money(100, 'USD'),
        customerId: 'customer-456',
      });

      payment.process();
      payment.markAsSucceeded('pi_test_123');

      expect(() => {
        payment.process();
      }).toThrow();
    });
  });

  describe('markAsSucceeded', () => {
    it('should change status to SUCCEEDED', () => {
      const payment = Payment.create({
        orderId: 'order-123',
        amount: new Money(100, 'USD'),
        customerId: 'customer-456',
      });

      payment.process();
      payment.markAsSucceeded('pi_test_12345678901234567890');

      expect(payment.status).toBe(PaymentStatus.SUCCEEDED);
      expect(payment.stripePaymentIntentId).toBe('pi_test_12345678901234567890');
    });
  });

  describe('markAsFailed', () => {
    it('should change status to FAILED', () => {
      const payment = Payment.create({
        orderId: 'order-123',
        amount: new Money(100, 'USD'),
        customerId: 'customer-456',
      });

      payment.process();
      payment.markAsFailed('Insufficient funds');

      expect(payment.status).toBe(PaymentStatus.FAILED);
      expect(payment.failureReason).toBe('Insufficient funds');
    });
  });

  describe('refund', () => {
    it('should change status to REFUNDED', () => {
      const payment = Payment.create({
        orderId: 'order-123',
        amount: new Money(100, 'USD'),
        customerId: 'customer-456',
      });

      payment.process();
      payment.markAsSucceeded('pi_test_12345678901234567890');
      payment.refund('re_test_12345678901234567890');

      expect(payment.status).toBe(PaymentStatus.REFUNDED);
      expect(payment.stripeRefundId).toBe('re_test_12345678901234567890');
    });

    it('should throw error if payment is not SUCCEEDED', () => {
      const payment = Payment.create({
        orderId: 'order-123',
        amount: new Money(100, 'USD'),
        customerId: 'customer-456',
      });

      expect(() => {
        payment.refund('re_test_12345678901234567890');
      }).toThrow();
    });
  });
});
