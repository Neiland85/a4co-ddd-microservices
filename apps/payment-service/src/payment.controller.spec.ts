import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './presentation/payment.controller';
import { PaymentService } from './application/services/payment.service';
import { StripeGateway } from './infrastructure/stripe.gateway';
import { CreatePaymentDto } from './presentation/dtos/create-payment.dto';
import { NotFoundException } from '@nestjs/common';
import { Payment } from './domain/entities/payment.entity';
import { Money } from './domain/value-objects/money.vo';

describe('PaymentController', () => {
  let controller: PaymentController;
  let paymentService: PaymentService;
  let stripeGateway: StripeGateway;

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

  const mockPayment = {
    toPrimitives: jest.fn().mockReturnValue({
      id: 'pay_123',
      orderId: 'order_123',
      amount: 10000,
      currency: 'EUR',
      status: 'succeeded',
      customerId: 'cust_123',
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
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
    });
  });

  describe('createPayment', () => {
    it('should create a payment successfully', async () => {
      const dto: CreatePaymentDto = {
        orderId: 'order_123',
        amount: 10000,
        currency: 'EUR',
        customerId: 'cust_123',
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

      const result = await controller.getPayment('pay_123');

      expect(paymentService.getPaymentById).toHaveBeenCalledWith('pay_123');
      expect(result).toEqual(mockPayment.toPrimitives());
    });

    it('should throw NotFoundException when payment not found', async () => {
      mockPaymentService.getPaymentById.mockResolvedValue(null);

      await expect(controller.getPayment('pay_123')).rejects.toThrow(
        new NotFoundException('Pago no encontrado'),
      );
    });
  });

  describe('getPaymentByOrder', () => {
    it('should return payment by order id', async () => {
      mockPaymentService.getPaymentByOrderId.mockResolvedValue(mockPayment);

      const result = await controller.getPaymentByOrder('order_123');

      expect(paymentService.getPaymentByOrderId).toHaveBeenCalledWith('order_123');
      expect(result).toEqual(mockPayment.toPrimitives());
    });

    it('should throw NotFoundException when payment not found', async () => {
      mockPaymentService.getPaymentByOrderId.mockResolvedValue(null);

      await expect(controller.getPaymentByOrder('order_123')).rejects.toThrow(
        new NotFoundException('Pago no encontrado para esta orden'),
      );
    });
  });

  describe('refundPayment', () => {
    it('should process refund successfully', async () => {
      const refundDto = { amount: 5000, reason: 'Customer request' };
      const refundedPayment = { ...mockPayment, status: 'refunded' };
      
      mockPaymentService.refundPayment.mockResolvedValue(refundedPayment);

      const result = await controller.refundPayment('pay_123', refundDto);

      expect(paymentService.refundPayment).toHaveBeenCalledWith(
        'pay_123',
        refundDto.amount,
        refundDto.reason,
      );
      expect(result).toEqual(refundedPayment);
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
