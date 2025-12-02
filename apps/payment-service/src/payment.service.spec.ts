import { Test, TestingModule } from '@nestjs/testing';
import { PAYMENT_REPOSITORY_TOKEN } from './application/application.constants';
import { PaymentService } from './application/services/payment.service';
import { ProcessPaymentUseCase } from './application/use-cases/process-payment.use-case';
import { RefundPaymentUseCase } from './application/use-cases/refund-payment.use-case';
import { Payment } from './domain/entities/payment.entity';
import { PaymentRepository } from './domain/repositories/payment.repository';

describe('PaymentService', () => {
  let service: PaymentService;
  let processPaymentUseCase: ProcessPaymentUseCase;
  let refundPaymentUseCase: RefundPaymentUseCase;
  let paymentRepository: jest.Mocked<PaymentRepository>;

  const mockProcessPaymentUseCase = {
    execute: jest.fn(),
  };

  const mockRefundPaymentUseCase = {
    execute: jest.fn(),
  };

  // Mock completo del repositorio (incluye findByStripeIntentId)
  const mockPaymentRepository = {
    findById: jest.fn(),
    findByOrderId: jest.fn(),
    findByStripeIntentId: jest.fn(), // ← AÑADIDO (obligatorio)
    save: jest.fn(),
  } as jest.Mocked<PaymentRepository>;

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
    paymentRepository = module.get<PaymentRepository>(PAYMENT_REPOSITORY_TOKEN) as jest.Mocked<PaymentRepository>;
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

      paymentRepository.findById.mockResolvedValue(mockPayment);

      const result = await service.getPaymentById(paymentId);

      // The service likely passes paymentId directly, not wrapped in an object with value property
      expect(paymentRepository.findById).toHaveBeenCalledWith(paymentId);
      expect(result).toEqual(mockPayment);
    });
  });
});
