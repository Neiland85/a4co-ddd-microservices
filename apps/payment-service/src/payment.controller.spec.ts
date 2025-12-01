import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './presentation/payment.controller';
import { PaymentService } from './application/services/payment.service';
import { StripeGateway } from './infrastructure/stripe.gateway';
import { PaymentEventPublisher } from './application/services/payment-event.publisher';
import { PaymentRepository } from './domain/repositories/payment.repository';
import { ProcessPaymentUseCase } from './application/use-cases/process-payment.use-case';

describe('PaymentController', () => {
  let controller: PaymentController;
  let paymentService: PaymentService;
  let stripeGateway: StripeGateway;
  let processPaymentUseCase: ProcessPaymentUseCase;
  let paymentRepository: PaymentRepository;
  let eventPublisher: PaymentEventPublisher;

  const mockPaymentService = {
    getHealth: jest.fn().mockReturnValue({
      status: 'ok',
      service: 'payment-service',
      version: '1.0.0',
      dependencies: {
        database: 'connected',
        stripe: 'configured',
        nats: 'connected',
      },
    }),
  };

  const mockStripeGateway = {
    constructWebhookEvent: jest.fn(),
  };

  const mockPaymentEventPublisher = {
    publishPaymentEvents: jest.fn(),
  };

  const mockPaymentRepository = {
    findByOrderId: jest.fn(),
    save: jest.fn(),
  };

  const mockProcessPaymentUseCase = {
    execute: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: mockPaymentService,
        },
        {
          provide: StripeGateway,
          useValue: mockStripeGateway,
        },
        {
          provide: PaymentEventPublisher,
          useValue: mockPaymentEventPublisher,
        },
        {
          provide: 'PaymentRepository',
          useValue: mockPaymentRepository,
        },
        {
          provide: ProcessPaymentUseCase,
          useValue: mockProcessPaymentUseCase,
        },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    paymentService = module.get<PaymentService>(PaymentService);
    stripeGateway = module.get<StripeGateway>(StripeGateway);
    processPaymentUseCase = module.get<ProcessPaymentUseCase>(ProcessPaymentUseCase);
    paymentRepository = module.get<PaymentRepository>('PaymentRepository');
    eventPublisher = module.get<PaymentEventPublisher>(PaymentEventPublisher);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getHealth', () => {
    it('should return health status', () => {
      const result = controller.getHealth();
      expect(result).toEqual({
        status: 'ok',
        service: 'payment-service',
        version: '1.0.0',
        dependencies: {
          database: 'connected',
          stripe: 'configured',
          nats: 'connected',
        },
      });
      expect(mockPaymentService.getHealth).toHaveBeenCalled();
    });
  });

  describe('handlePaymentInitiate', () => {
    it('should process payment initiation from saga', async () => {
      const paymentData = {
        orderId: 'order_123',
        amount: 10000,
        customerId: 'cust_123',
      };

      mockProcessPaymentUseCase.execute.mockResolvedValue(undefined);

      await controller.handlePaymentInitiate(paymentData);

      expect(mockProcessPaymentUseCase.execute).toHaveBeenCalledWith({
        orderId: 'order_123',
        amount: 10000,
        currency: 'usd',
        customerId: 'cust_123',
      });
    });

    it('should handle errors during payment initiation', async () => {
      const paymentData = {
        orderId: 'order_123',
        amount: 10000,
        customerId: 'cust_123',
      };

      mockProcessPaymentUseCase.execute.mockRejectedValue(new Error('Payment failed'));

      // Should not throw - errors are logged
      await controller.handlePaymentInitiate(paymentData);

      expect(mockProcessPaymentUseCase.execute).toHaveBeenCalled();
    });
  });

  describe('handleStripeWebhook', () => {
    it('should throw error if signature is missing', async () => {
      const mockReq = { rawBody: Buffer.from('{}') };

      await expect(
        controller.handleStripeWebhook(mockReq as any, '')
      ).rejects.toThrow('Missing stripe-signature header');
    });

    it('should handle payment_intent.succeeded webhook', async () => {
      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_123',
            metadata: { orderId: 'order_123' },
          },
        },
      };

      const mockPayment = {
        markAsSucceeded: jest.fn(),
      };

      mockStripeGateway.constructWebhookEvent.mockReturnValue(mockEvent);
      mockPaymentRepository.findByOrderId.mockResolvedValue(mockPayment);
      mockPaymentRepository.save.mockResolvedValue(mockPayment);
      mockPaymentEventPublisher.publishPaymentEvents.mockResolvedValue(undefined);

      const mockReq = { rawBody: Buffer.from('{}') };
      const result = await controller.handleStripeWebhook(mockReq as any, 'test-signature');

      expect(result).toEqual({ received: true });
      expect(mockStripeGateway.constructWebhookEvent).toHaveBeenCalledWith(
        mockReq.rawBody,
        'test-signature'
      );
      expect(mockPaymentRepository.findByOrderId).toHaveBeenCalledWith('order_123');
      expect(mockPayment.markAsSucceeded).toHaveBeenCalledWith('pi_123');
      expect(mockPaymentRepository.save).toHaveBeenCalledWith(mockPayment);
      expect(mockPaymentEventPublisher.publishPaymentEvents).toHaveBeenCalledWith(mockPayment);
    });

    it('should handle unhandled event types', async () => {
      const mockEvent = {
        type: 'customer.created',
        data: { object: {} },
      };

      mockStripeGateway.constructWebhookEvent.mockReturnValue(mockEvent);

      const mockReq = { rawBody: Buffer.from('{}') };
      const result = await controller.handleStripeWebhook(mockReq as any, 'test-signature');

      expect(result).toEqual({ received: true });
    });
  });
});
