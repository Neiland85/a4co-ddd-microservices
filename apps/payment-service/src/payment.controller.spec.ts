import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';
import { PAYMENT_REPOSITORY_TOKEN } from './application/application.constants';
import { PaymentEventPublisher } from './application/services/payment-event.publisher';
import { PaymentService } from './application/services/payment.service';
import { ProcessPaymentUseCase } from './application/use-cases/process-payment.use-case';
import { StripeGateway } from './infrastructure/stripe.gateway';
import { CreatePaymentDto } from './presentation/dtos/create-payment.dto';
import { PaymentController } from './presentation/payment.controller';

describe('PaymentController', () => {
  let controller: PaymentController;
  let paymentService: PaymentService;
  let stripeGateway: StripeGateway;

  const paymentId = uuidv4();
  const orderId = uuidv4();
  const customerId = uuidv4();

  const mockPaymentService = {
    processPayment: jest.fn(),
    getPaymentById: jest.fn(),
    getPaymentByOrderId: jest.fn(),
    refundPayment: jest.fn(),
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
    findById: jest.fn(),
    findByOrderId: jest.fn(),
    save: jest.fn(),
  };

  const mockProcessPaymentUseCase = {
    execute: jest.fn(),
  };

  const mockPayment = {
    toPrimitives: jest.fn().mockReturnValue({
      id: paymentId,
      orderId: orderId,
      amount: 10000,
      currency: 'EUR',
      status: 'succeeded',
      customerId: customerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        { provide: PaymentService, useValue: mockPaymentService },
        { provide: StripeGateway, useValue: mockStripeGateway },
        { provide: PaymentEventPublisher, useValue: mockPaymentEventPublisher },
        { provide: PAYMENT_REPOSITORY_TOKEN, useValue: mockPaymentRepository },
        { provide: ProcessPaymentUseCase, useValue: mockProcessPaymentUseCase },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    paymentService = module.get<PaymentService>(PaymentService);
    stripeGateway = module.get<StripeGateway>(StripeGateway);
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
      expect(result).toMatchObject({
        status: 'ok',
        service: 'payment-service',
        version: '1.0.0',
        dependencies: expect.objectContaining({
          database: expect.any(String),
          stripe: expect.any(String),
          nats: expect.any(String),
        }),
      });
    });
  });

  describe('createPayment', () => {
    it('should create a payment successfully', async () => {
      const dto: CreatePaymentDto = {
        orderId: orderId,
        amount: 10000,
        currency: 'EUR',
        customerId: customerId,
        description: 'Test payment',
      };

      mockPaymentService.processPayment.mockResolvedValue(mockPayment);

      const result = await controller.createPayment(dto);

      expect(paymentService.processPayment).toHaveBeenCalledWith({
        orderId: dto.orderId,
        amount: dto.amount,
        currency: dto.currency,
        customerId: dto.customerId,
        description: dto.description,
        metadata: undefined,
      });

      expect(result).toEqual(mockPayment.toPrimitives());
    });
  });

  describe('getPayment', () => {
    it('should return payment by id', async () => {
      mockPaymentService.getPaymentById.mockResolvedValue(mockPayment);

      const result = await controller.getPayment(paymentId);

      expect(paymentService.getPaymentById).toHaveBeenCalledWith(paymentId);
      expect(result).toEqual(mockPayment.toPrimitives());
    });

    it('should throw NotFoundException when payment not found', async () => {
      mockPaymentService.getPaymentById.mockResolvedValue(null);

      await expect(controller.getPayment(paymentId)).rejects.toThrow(NotFoundException);
      await expect(controller.getPayment(paymentId)).rejects.toThrow('Pago no encontrado');
    });
  });

  describe('getPaymentByOrder', () => {
    it('should return payment by order id', async () => {
      mockPaymentService.getPaymentByOrderId.mockResolvedValue(mockPayment);

      const result = await controller.getPaymentByOrder(orderId);

      expect(paymentService.getPaymentByOrderId).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(mockPayment.toPrimitives());
    });

    it('should throw NotFoundException when payment not found', async () => {
      mockPaymentService.getPaymentByOrderId.mockResolvedValue(null);

      await expect(controller.getPaymentByOrder(orderId)).rejects.toThrow(
        new NotFoundException('Pago no encontrado para esta orden'),
      );
    });
  });

  describe('refundPayment', () => {
    it('should process refund successfully', async () => {
      const refundDto = { amount: 5000, reason: 'Customer request' };
      const refundedPayment = {
        ...mockPayment,
        toPrimitives: jest.fn().mockReturnValue({
          id: paymentId,
          orderId: orderId,
          amount: 10000,
          currency: 'EUR',
          status: 'refunded',
          customerId: customerId,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      };

      mockPaymentService.refundPayment.mockResolvedValue(refundedPayment);

      const result = await controller.refundPayment(paymentId, refundDto);

      expect(paymentService.refundPayment).toHaveBeenCalledWith(
        paymentId,
        refundDto.amount,
        refundDto.reason,
      );
      expect(result).toEqual(refundedPayment.toPrimitives());
    });
  });

  describe('handleWebhook', () => {
    it('should handle webhook successfully', async () => {
      const mockEvent = {
        type: 'payment_intent.succeeded',
        data: { object: { id: 'pi_123' } },
      };

      mockStripeGateway.constructWebhookEvent.mockReturnValue(mockEvent);

      const result = await controller.handleWebhook({}, 'test-signature');

      expect(stripeGateway.constructWebhookEvent).toHaveBeenCalledWith(
        {},
        'test-signature',
      );
      expect(result).toEqual({ received: true });
    });
  });
});
