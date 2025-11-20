import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './application/services/payment.service';
import { ProcessPaymentUseCase } from './application/use-cases/process-payment.use-case';
import { RefundPaymentUseCase } from './application/use-cases/refund-payment.use-case';
import { PaymentRepository } from './domain/repositories/payment.repository';
import { PAYMENT_REPOSITORY_TOKEN } from './application/application.constants';
import { PaymentId } from './domain/value-objects/payment-id.vo';
import { Payment } from './domain/entities/payment.entity';
import { Money } from './domain/value-objects/money.vo';

describe('PaymentService', () => {
  let service: PaymentService;
  let processPaymentUseCase: ProcessPaymentUseCase;
  let refundPaymentUseCase: RefundPaymentUseCase;
  let paymentRepository: PaymentRepository;

  const mockProcessPaymentUseCase = {
    execute: jest.fn(),
  };

  const mockRefundPaymentUseCase = {
    execute: jest.fn(),
  };

  const mockPaymentRepository = {
    findById: jest.fn(),
    findByOrderId: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: ProcessPaymentUseCase,
          useValue: mockProcessPaymentUseCase,
        },
        {
          provide: RefundPaymentUseCase,
          useValue: mockRefundPaymentUseCase,
        },
        {
          provide: PAYMENT_REPOSITORY_TOKEN,
          useValue: mockPaymentRepository,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    processPaymentUseCase = module.get<ProcessPaymentUseCase>(ProcessPaymentUseCase);
    refundPaymentUseCase = module.get<RefundPaymentUseCase>(RefundPaymentUseCase);
    paymentRepository = module.get<PaymentRepository>(PAYMENT_REPOSITORY_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processPayment', () => {
    it('should process payment successfully', async () => {
      const command = {
        orderId: 'order_123',
        amount: 10000,
        currency: 'EUR',
        customerId: 'cust_123',
      };

      const mockPayment = {} as Payment;

      mockProcessPaymentUseCase.execute.mockResolvedValue(mockPayment);

      const result = await service.processPayment(command);

      expect(processPaymentUseCase.execute).toHaveBeenCalledWith(command);
      expect(result).toEqual(mockPayment);
    });
  });

  describe('refundPayment', () => {
    it('should refund payment successfully', async () => {
      const paymentId = 'pay_123';
      const amount = 5000;
      const reason = 'Customer request';

      mockRefundPaymentUseCase.execute.mockResolvedValue(true);

      const result = await service.refundPayment(paymentId, amount, reason);

      expect(refundPaymentUseCase.execute).toHaveBeenCalledWith(paymentId, amount, reason);
      expect(result).toBe(true);
    });
  });

  describe('getPaymentById', () => {
    it('should return payment by id', async () => {
      const paymentId = 'pay_123';
      const mockPayment = {} as Payment;

      mockPaymentRepository.findById.mockResolvedValue(mockPayment);

      const result = await service.getPaymentById(paymentId);

      expect(paymentRepository.findById).toHaveBeenCalledWith(PaymentId.create(paymentId));
      expect(result).toEqual(mockPayment);
    });
  });

  describe('getPaymentByOrderId', () => {
    it('should return payment by order id', async () => {
      const orderId = 'order_123';
      const mockPayment = {} as Payment;

      mockPaymentRepository.findByOrderId.mockResolvedValue(mockPayment);

      const result = await service.getPaymentByOrderId(orderId);

      expect(paymentRepository.findByOrderId).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(mockPayment);
    });
  });

  describe('getHealth', () => {
    it('should return health status', () => {
      const health = service.getHealth();

      expect(health).toEqual({
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
});
