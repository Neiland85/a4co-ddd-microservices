import { Payment } from '../domain/entities/payment.entity';
import { Money } from '../domain/value-objects/money.vo';
import { PaymentId } from '../domain/value-objects/payment-id.vo';
import { PaymentStatus } from '../domain/value-objects/payment-status.vo';

describe('Payment Aggregate', () => {
  describe('create', () => {
    it('should create a payment with PENDING status', () => {
      const payment = Payment.create({
        orderId: 'order-123',
        amount: new Money(100, 'USD'),
        customerId: 'customer-456',
      });

      expect(payment.status).toBe(PaymentStatus.PENDING);
      expect(payment.orderId).toBe('order-123');
      expect(payment.amount.amount).toBe(100);
      expect(payment.amount.currency).toBe('USD');
      expect(payment.customerId).toBe('customer-456');
      expect(payment.getUncommittedEvents().length).toBeGreaterThan(0);
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
    it('should transition from PENDING to PROCESSING', () => {
      const payment = Payment.create({
        orderId: 'order-123',
        amount: new Money(100, 'USD'),
        customerId: 'customer-456',
      });

      payment.process();

      expect(payment.status).toBe(PaymentStatus.PROCESSING);
      expect(payment.getUncommittedEvents().length).toBeGreaterThan(0);
    });

    it('should throw error if not in PENDING status', () => {
      const payment = Payment.create({
        orderId: 'order-123',
        amount: new Money(100, 'USD'),
        customerId: 'customer-456',
      });

      payment.process();
      payment.markAsSucceeded('pi_test_1234567890');

      expect(() => {
        payment.process();
      }).toThrow();
    });
  });

  describe('markAsSucceeded', () => {
    it('should transition from PROCESSING to SUCCEEDED', () => {
      const payment = Payment.create({
        orderId: 'order-123',
        amount: new Money(100, 'USD'),
        customerId: 'customer-456',
      });

      payment.process();
      payment.markAsSucceeded('pi_test_1234567890abcdefghijklmn');

      expect(payment.status).toBe(PaymentStatus.SUCCEEDED);
      expect(payment.stripePaymentIntentId).toBe('pi_test_1234567890abcdefghijklmn');
    });

    it('should throw error if not in PROCESSING status', () => {
      const payment = Payment.create({
        orderId: 'order-123',
        amount: new Money(100, 'USD'),
        customerId: 'customer-456',
      });

      expect(() => {
        payment.markAsSucceeded('pi_test_1234567890abcdefghijklmn');
      }).toThrow();
    });
  });

  describe('markAsFailed', () => {
    it('should transition to FAILED status', () => {
      const payment = Payment.create({
        orderId: 'order-123',
        amount: new Money(100, 'USD'),
        customerId: 'customer-456',
      });

      payment.process();
      payment.markAsFailed('Insufficient funds');

      expect(payment.status).toBe(PaymentStatus.FAILED);
    });
  });

  describe('refund', () => {
    it('should transition from SUCCEEDED to REFUNDED', () => {
      const payment = Payment.create({
        orderId: 'order-123',
        amount: new Money(100, 'USD'),
        customerId: 'customer-456',
      });

      payment.process();
      payment.markAsSucceeded('pi_test_1234567890abcdefghijklmn');
      payment.refund('re_test_1234567890abcdefghijklmn');

      expect(payment.status).toBe(PaymentStatus.REFUNDED);
      expect(payment.stripeRefundId).toBe('re_test_1234567890abcdefghijklmn');
    });

    it('should throw error if not in SUCCEEDED status', () => {
      const payment = Payment.create({
        orderId: 'order-123',
        amount: new Money(100, 'USD'),
        customerId: 'customer-456',
      });

      expect(() => {
        payment.refund('re_test_1234567890abcdefghijklmn');
      }).toThrow();
    });
  });
});
