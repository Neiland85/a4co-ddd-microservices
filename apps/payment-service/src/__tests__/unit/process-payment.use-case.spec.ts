import { Test, TestingModule } from '@nestjs/testing';
import { ProcessPaymentUseCase } from '../../application/use-cases/process-payment.use-case';
import { PaymentRepository } from '../../domain/repositories/payment.repository';
import { PaymentDomainService } from '../../domain/services/payment-domain.service';
import { StripeGateway } from '../../infrastructure/stripe.gateway';
import { Money } from '../../domain/value-objects';
import { NatsEventBus } from '@a4co/shared-utils';
import { Payment } from '../../domain/entities/payment.entity';

describe('ProcessPaymentUseCase', () => {
  let useCase: ProcessPaymentUseCase;
  let paymentRepository: jest.Mocked<PaymentRepository>;
  let paymentDomainService: jest.Mocked<PaymentDomainService>;
  let stripeGateway: jest.Mocked<StripeGateway>;
  let eventBus: jest.Mocked<NatsEventBus>;

  beforeEach(async () => {
    const mockPaymentRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findByOrderId: jest.fn(),
      findByStripeIntentId: jest.fn(),
      exists: jest.fn(),
    };

    const mockPaymentDomainService = {
      validatePaymentLimits: jest.fn(),
      calculateRefundAmount: jest.fn(),
      validateRefundAmount: jest.fn(),
      canRefundPayment: jest.fn(),
    };

    const mockStripeGateway = {
      createPaymentIntent: jest.fn(),
      confirmPaymentIntent: jest.fn(),
      getPaymentIntent: jest.fn(),
      refundPayment: jest.fn(),
      handleWebhook: jest.fn(),
    };

    const mockEventBus = {
      publish: jest.fn(),
      connect: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProcessPaymentUseCase,
        {
          provide: PaymentRepository,
          useValue: mockPaymentRepository,
        },
        {
          provide: PaymentDomainService,
          useValue: mockPaymentDomainService,
        },
        {
          provide: StripeGateway,
          useValue: mockStripeGateway,
        },
        {
          provide: NatsEventBus,
          useValue: mockEventBus,
        },
      ],
    }).compile();

    useCase = module.get<ProcessPaymentUseCase>(ProcessPaymentUseCase);
    paymentRepository = module.get(PaymentRepository);
    paymentDomainService = module.get(PaymentDomainService);
    stripeGateway = module.get(StripeGateway);
    eventBus = module.get(NatsEventBus);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    it('should process payment successfully', async () => {
      const orderId = 'order-123';
      const amount = new Money(100, 'EUR');
      const customerId = 'customer-456';

      paymentRepository.findByOrderId.mockResolvedValue(null);
      stripeGateway.createPaymentIntent.mockResolvedValue({
        id: 'pi_test_123456789012345678901234',
        status: 'requires_confirmation',
      } as any);
      stripeGateway.confirmPaymentIntent.mockResolvedValue({
        id: 'pi_test_123456789012345678901234',
        status: 'succeeded',
      } as any);
      eventBus.publish.mockResolvedValue(undefined);

      const result = await useCase.execute(orderId, amount, customerId);

      expect(result).toBeInstanceOf(Payment);
      expect(result.status).toBe('SUCCEEDED');
      expect(paymentRepository.save).toHaveBeenCalledTimes(3);
      expect(stripeGateway.createPaymentIntent).toHaveBeenCalledWith(
        amount,
        customerId,
        orderId,
        {}
      );
    });

    it('should throw error if payment already exists', async () => {
      const orderId = 'order-123';
      const amount = new Money(100, 'EUR');
      const customerId = 'customer-456';

      const existingPayment = Payment.create(orderId, amount, customerId);
      paymentRepository.findByOrderId.mockResolvedValue(existingPayment);

      await expect(
        useCase.execute(orderId, amount, customerId)
      ).rejects.toThrow('Payment already exists');
    });

    it('should mark payment as failed if Stripe returns error', async () => {
      const orderId = 'order-123';
      const amount = new Money(100, 'EUR');
      const customerId = 'customer-456';

      paymentRepository.findByOrderId.mockResolvedValue(null);
      stripeGateway.createPaymentIntent.mockRejectedValue(
        new Error('Stripe API error')
      );
      eventBus.publish.mockResolvedValue(undefined);

      await expect(
        useCase.execute(orderId, amount, customerId)
      ).rejects.toThrow('Stripe API error');

      expect(paymentRepository.save).toHaveBeenCalled();
    });
  });
});
