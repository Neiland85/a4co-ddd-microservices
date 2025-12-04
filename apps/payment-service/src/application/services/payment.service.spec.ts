import { PaymentService } from './payment.service';

describe('PaymentService', () => {
  let service: PaymentService;
  let mockProcessPaymentUseCase: any;
  let mockRefundPaymentUseCase: any;
  let mockPaymentRepository: any;

  beforeEach(() => {
    mockProcessPaymentUseCase = {
      execute: jest.fn(),
    };
    mockRefundPaymentUseCase = {
      execute: jest.fn(),
    };
    mockPaymentRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    };
    service = new PaymentService(
      mockProcessPaymentUseCase,
      mockRefundPaymentUseCase,
      mockPaymentRepository,
    );
  });

  describe('getPaymentById', () => {
    it('should return payment by id', async () => {
      const validPaymentId = '550e8400-e29b-41d4-a716-446655440000';

      const mockPayment = {
        id: validPaymentId,
        orderId: 'order_123',
        amount: 10000,
        currency: 'EUR',
        status: 'succeeded',
        customerId: 'customer_123',
        createdAt: new Date(),
        updatedAt: new Date(),
        toPrimitives: jest.fn().mockReturnValue({
          id: validPaymentId,
          orderId: 'order_123',
          amount: 10000,
          currency: 'EUR',
          status: 'succeeded',
          customerId: 'customer_123',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      };

      mockPaymentRepository.findById.mockResolvedValue(mockPayment);

      const result = await service.getPaymentById(validPaymentId);

      expect(result).toEqual(mockPayment);
      expect(mockPaymentRepository.findById).toHaveBeenCalled();
    });
  });
});
