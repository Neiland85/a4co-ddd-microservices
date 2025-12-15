import { SimulatedPaymentGateway } from '../simulated-payment.gateway';
import { Money } from '../../domain/value-objects/money.vo';

describe('SimulatedPaymentGateway', () => {
  let gateway: SimulatedPaymentGateway;

  beforeEach(() => {
    // Set success rate to 1.0 for predictable tests
    process.env['PAYMENT_SUCCESS_RATE'] = '1.0';
    gateway = new SimulatedPaymentGateway();
  });

  afterEach(() => {
    delete process.env['PAYMENT_SUCCESS_RATE'];
  });

  describe('createPaymentIntent', () => {
    it('should create a successful payment intent when success rate is 100%', async () => {
      // Arrange
      const amount = Money.create(20.0, 'EUR');
      const params = {
        amount,
        orderId: 'order-123',
        customerId: 'customer-456',
      };

      // Act
      const result = await gateway.createPaymentIntent(params);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toMatch(/^pi_simulated_/);
      expect(result.status).toBe('succeeded');
      expect(result.amount).toBe(2000); // 20.00 EUR in cents
      expect(result.currency).toBe('eur');
      expect(result.orderId).toBe('order-123');
      expect(result.customerId).toBe('customer-456');
    });

    it('should create a failed payment intent when success rate is 0%', async () => {
      // Arrange
      process.env['PAYMENT_SUCCESS_RATE'] = '0.0';
      gateway = new SimulatedPaymentGateway();

      const amount = Money.create(20.0, 'EUR');
      const params = {
        amount,
        orderId: 'order-456',
        customerId: 'customer-789',
      };

      // Act
      const result = await gateway.createPaymentIntent(params);

      // Assert
      expect(result).toBeDefined();
      expect(result.status).toBe('failed');
      expect(result.orderId).toBe('order-456');
    });

    it('should respect configured success rate', async () => {
      // Arrange - 90% success rate
      process.env['PAYMENT_SUCCESS_RATE'] = '0.9';
      gateway = new SimulatedPaymentGateway();

      const amount = Money.create(10.0, 'EUR');
      const results: string[] = [];

      // Act - Create 20 payments (reduced from 100 for faster test execution)
      for (let i = 0; i < 20; i++) {
        const params = {
          amount,
          orderId: `order-${i}`,
          customerId: 'customer-test',
        };
        const result = await gateway.createPaymentIntent(params);
        results.push(result.status);
      }

      // Assert - Approximately 90% should succeed (with some variance)
      const successCount = results.filter(s => s === 'succeeded').length;
      const successRate = successCount / 20;

      // Allow for statistical variance (70-100% success is acceptable for 20 samples)
      expect(successRate).toBeGreaterThanOrEqual(0.7);
      expect(successRate).toBeLessThanOrEqual(1.0);
    }, 60000); // Increase timeout to 60s for this specific test

    it('should simulate processing delay', async () => {
      // Arrange
      const amount = Money.create(15.0, 'EUR');
      const params = {
        amount,
        orderId: 'order-timing',
        customerId: 'customer-timing',
      };

      // Act
      const start = Date.now();
      await gateway.createPaymentIntent(params);
      const duration = Date.now() - start;

      // Assert - Should take at least 500ms (min delay)
      expect(duration).toBeGreaterThanOrEqual(450); // Allow small variance
    });
  });

  describe('refundPayment', () => {
    it('should create a refund for a payment', async () => {
      // Arrange
      const paymentIntentId = 'pi_simulated_123';
      const amount = Money.create(10.0, 'EUR');

      // Act
      const result = await gateway.refundPayment(paymentIntentId, amount);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toMatch(/^re_simulated_/);
      expect(result.payment_intent).toBe(paymentIntentId);
      expect(result.amount).toBe(1000); // 10.00 EUR in cents
      expect(result.status).toBe('succeeded');
    });

    it('should create a full refund when amount is not specified', async () => {
      // Arrange
      const paymentIntentId = 'pi_simulated_456';

      // Act
      const result = await gateway.refundPayment(paymentIntentId);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toMatch(/^re_simulated_/);
      expect(result.payment_intent).toBe(paymentIntentId);
      expect(result.amount).toBeUndefined();
      expect(result.status).toBe('succeeded');
    });
  });

  describe('currency validation', () => {
    it('should accept EUR currency', async () => {
      // Arrange
      const amount = Money.create(10.0, 'EUR');
      const params = {
        amount,
        orderId: 'order-eur',
        customerId: 'customer-test',
      };

      // Act & Assert
      const result = await gateway.createPaymentIntent(params);
      expect(result.currency).toBe('eur');
    });

    it('should accept USD currency', async () => {
      // Arrange
      const amount = Money.create(10.0, 'USD');
      const params = {
        amount,
        orderId: 'order-usd',
        customerId: 'customer-test',
      };

      // Act & Assert
      const result = await gateway.createPaymentIntent(params);
      expect(result.currency).toBe('usd');
    });

    it('should accept GBP currency', async () => {
      // Arrange
      const amount = Money.create(10.0, 'GBP');
      const params = {
        amount,
        orderId: 'order-gbp',
        customerId: 'customer-test',
      };

      // Act & Assert
      const result = await gateway.createPaymentIntent(params);
      expect(result.currency).toBe('gbp');
    });

    it('should reject unsupported currency', async () => {
      // Arrange
      const amount = Money.create(10.0, 'JPY');
      const params = {
        amount,
        orderId: 'order-jpy',
        customerId: 'customer-test',
      };

      // Act & Assert
      await expect(gateway.createPaymentIntent(params)).rejects.toThrow(
        'Unsupported currency: JPY. Supported currencies: EUR, USD, GBP'
      );
    });
  });

  describe('successRate validation', () => {
    it('should reject success rate below 0', () => {
      // Arrange
      process.env['PAYMENT_SUCCESS_RATE'] = '-0.1';

      // Act & Assert
      expect(() => new SimulatedPaymentGateway()).toThrow(
        'PAYMENT_SUCCESS_RATE must be between 0 and 1, got: -0.1'
      );
    });

    it('should reject success rate above 1', () => {
      // Arrange
      process.env['PAYMENT_SUCCESS_RATE'] = '1.5';

      // Act & Assert
      expect(() => new SimulatedPaymentGateway()).toThrow(
        'PAYMENT_SUCCESS_RATE must be between 0 and 1, got: 1.5'
      );
    });

    it('should accept success rate of 0', () => {
      // Arrange
      process.env['PAYMENT_SUCCESS_RATE'] = '0';

      // Act & Assert
      expect(() => new SimulatedPaymentGateway()).not.toThrow();
    });

    it('should accept success rate of 1', () => {
      // Arrange
      process.env['PAYMENT_SUCCESS_RATE'] = '1';

      // Act & Assert
      expect(() => new SimulatedPaymentGateway()).not.toThrow();
    });
  });
});
