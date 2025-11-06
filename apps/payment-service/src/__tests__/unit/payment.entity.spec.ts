import { Payment } from '../domain/entities/payment.entity';
import { PaymentId, Money, PaymentStatus } from '../domain/value-objects';

describe('Payment Aggregate', () => {
  describe('create', () => {
    it('should create a new payment with PENDING status', () => {
      const amount = new Money(100, 'EUR');
      const payment = Payment.create('order-123', amount, 'customer-456');

      expect(payment.status).toBe(PaymentStatus.PENDING);
      expect(payment.orderId).toBe('order-123');
      expect(payment.customerId).toBe('customer-456');
      expect(payment.amount.equals(amount)).toBe(true);
      expect(payment.domainEvents.length).toBeGreaterThan(0);
    });

    it('should throw error if orderId is empty', () => {
      const amount = new Money(100, 'EUR');
      expect(() => {
        Payment.create('', amount, 'customer-456');
      }).toThrow('OrderId cannot be empty');
    });

    it('should throw error if customerId is empty', () => {
      const amount = new Money(100, 'EUR');
      expect(() => {
        Payment.create('order-123', amount, '');
      }).toThrow('CustomerId cannot be empty');
    });
  });

  describe('process', () => {
    it('should transition from PENDING to PROCESSING', () => {
      const amount = new Money(100, 'EUR');
      const payment = Payment.create('order-123', amount, 'customer-456');
      
      payment.process();

      expect(payment.status).toBe(PaymentStatus.PROCESSING);
      expect(payment.domainEvents.length).toBeGreaterThan(0);
    });

    it('should throw error if already in final state', () => {
      const amount = new Money(100, 'EUR');
      const payment = Payment.create('order-123', amount, 'customer-456');
      payment.process();
      payment.markAsSucceeded('pi_test_123');

      expect(() => {
        payment.process();
      }).toThrow();
    });
  });

  describe('markAsSucceeded', () => {
    it('should transition to SUCCEEDED and set Stripe Payment Intent ID', () => {
      const amount = new Money(100, 'EUR');
      const payment = Payment.create('order-123', amount, 'customer-456');
      payment.process();

      payment.markAsSucceeded('pi_test_123456789012345678901234');

      expect(payment.status).toBe(PaymentStatus.SUCCEEDED);
      expect(payment.stripePaymentIntentId?.value).toBe('pi_test_123456789012345678901234');
      expect(payment.failureReason).toBeNull();
    });

    it('should throw error if not in PROCESSING state', () => {
      const amount = new Money(100, 'EUR');
      const payment = Payment.create('order-123', amount, 'customer-456');

      expect(() => {
        payment.markAsSucceeded('pi_test_123');
      }).toThrow();
    });
  });

  describe('markAsFailed', () => {
    it('should transition to FAILED and set failure reason', () => {
      const amount = new Money(100, 'EUR');
      const payment = Payment.create('order-123', amount, 'customer-456');
      payment.process();

      payment.markAsFailed('Insufficient funds');

      expect(payment.status).toBe(PaymentStatus.FAILED);
      expect(payment.failureReason).toBe('Insufficient funds');
    });

    it('should throw error if reason is empty', () => {
      const amount = new Money(100, 'EUR');
      const payment = Payment.create('order-123', amount, 'customer-456');
      payment.process();

      expect(() => {
        payment.markAsFailed('');
      }).toThrow('Failure reason cannot be empty');
    });
  });

  describe('refund', () => {
    it('should transition to REFUNDED', () => {
      const amount = new Money(100, 'EUR');
      const payment = Payment.create('order-123', amount, 'customer-456');
      payment.process();
      payment.markAsSucceeded('pi_test_123456789012345678901234');

      payment.refund();

      expect(payment.status).toBe(PaymentStatus.REFUNDED);
    });

    it('should throw error if payment is not succeeded', () => {
      const amount = new Money(100, 'EUR');
      const payment = Payment.create('order-123', amount, 'customer-456');

      expect(() => {
        payment.refund();
      }).toThrow();
    });

    it('should throw error if refund amount exceeds payment amount', () => {
      const amount = new Money(100, 'EUR');
      const payment = Payment.create('order-123', amount, 'customer-456');
      payment.process();
      payment.markAsSucceeded('pi_test_123456789012345678901234');

      const refundAmount = new Money(200, 'EUR');

      expect(() => {
        payment.refund(refundAmount);
      }).toThrow('Refund amount cannot exceed payment amount');
    });
  });

  describe('canBeRefunded', () => {
    it('should return true for succeeded payment with Stripe Intent ID', () => {
      const amount = new Money(100, 'EUR');
      const payment = Payment.create('order-123', amount, 'customer-456');
      payment.process();
      payment.markAsSucceeded('pi_test_123456789012345678901234');

      expect(payment.canBeRefunded()).toBe(true);
    });

    it('should return false for pending payment', () => {
      const amount = new Money(100, 'EUR');
      const payment = Payment.create('order-123', amount, 'customer-456');

      expect(payment.canBeRefunded()).toBe(false);
    });
  });

  describe('isFinal', () => {
    it('should return true for succeeded payment', () => {
      const amount = new Money(100, 'EUR');
      const payment = Payment.create('order-123', amount, 'customer-456');
      payment.process();
      payment.markAsSucceeded('pi_test_123456789012345678901234');

      expect(payment.isFinal()).toBe(true);
    });

    it('should return true for failed payment', () => {
      const amount = new Money(100, 'EUR');
      const payment = Payment.create('order-123', amount, 'customer-456');
      payment.process();
      payment.markAsFailed('Test failure');

      expect(payment.isFinal()).toBe(true);
    });

    it('should return false for pending payment', () => {
      const amount = new Money(100, 'EUR');
      const payment = Payment.create('order-123', amount, 'customer-456');

      expect(payment.isFinal()).toBe(false);
    });
  });
});
