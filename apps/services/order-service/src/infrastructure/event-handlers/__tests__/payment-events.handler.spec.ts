import { Test, TestingModule } from '@nestjs/testing';
import { PaymentEventsHandler } from '../payment-events.handler';
import { OrderRepository } from '../../../domain/repositories/order.repository';
import { Order, OrderItem, OrderStatus } from '../../../domain/aggregates/order.aggregate';
import { PaymentConfirmedV1Payload, PaymentFailedV1Payload } from '@a4co/shared-events';

describe('PaymentEventsHandler', () => {
  let handler: PaymentEventsHandler;
  let mockOrderRepository: jest.Mocked<OrderRepository>;

  beforeEach(async () => {
    mockOrderRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentEventsHandler,
        {
          provide: 'OrderRepository',
          useValue: mockOrderRepository,
        },
      ],
    }).compile();

    handler = module.get<PaymentEventsHandler>(PaymentEventsHandler);
  });

  describe('handlePaymentConfirmed', () => {
    it('should update order status to CONFIRMED when payment succeeds', async () => {
      // Arrange
      const orderId = 'order-123';
      const paymentId = 'payment-456';
      
      const mockOrder = new Order(
        orderId,
        'customer-123',
        [new OrderItem('product-1', 2, 10.0, 'EUR')],
        OrderStatus.PENDING
      );

      mockOrderRepository.findById.mockResolvedValue(mockOrder);
      mockOrderRepository.save.mockResolvedValue(undefined);

      const payload: PaymentConfirmedV1Payload = {
        paymentId,
        orderId,
        customerId: 'customer-123',
        amount: 20.0,
        currency: 'EUR',
        confirmedAt: new Date().toISOString(),
      };

      const eventData = {
        payload,
        eventId: 'event-123',
        eventType: 'payment.confirmed.v1',
        version: 'v1',
        timestamp: new Date().toISOString(),
      };

      // Act
      await handler.handlePaymentConfirmed(eventData);

      // Assert
      expect(mockOrderRepository.findById).toHaveBeenCalledWith(orderId);
      expect(mockOrderRepository.save).toHaveBeenCalledWith(mockOrder);
      expect(mockOrder.status).toBe(OrderStatus.CONFIRMED);
    });

    it('should handle missing order gracefully', async () => {
      // Arrange
      const payload: PaymentConfirmedV1Payload = {
        paymentId: 'payment-456',
        orderId: 'non-existent-order',
        customerId: 'customer-123',
        amount: 20.0,
        currency: 'EUR',
        confirmedAt: new Date().toISOString(),
      };

      const eventData = {
        payload,
        eventId: 'event-123',
        eventType: 'payment.confirmed.v1',
        version: 'v1',
        timestamp: new Date().toISOString(),
      };

      mockOrderRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(handler.handlePaymentConfirmed(eventData)).resolves.not.toThrow();
      expect(mockOrderRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('handlePaymentFailed', () => {
    it('should update order status to CANCELLED when payment fails', async () => {
      // Arrange
      const orderId = 'order-123';
      const reason = 'Insufficient funds';
      
      const mockOrder = new Order(
        orderId,
        'customer-123',
        [new OrderItem('product-1', 2, 10.0, 'EUR')],
        OrderStatus.PENDING
      );

      mockOrderRepository.findById.mockResolvedValue(mockOrder);
      mockOrderRepository.save.mockResolvedValue(undefined);

      const payload: PaymentFailedV1Payload = {
        orderId,
        customerId: 'customer-123',
        amount: 20.0,
        currency: 'EUR',
        reason,
        failedAt: new Date().toISOString(),
      };

      const eventData = {
        payload,
        eventId: 'event-456',
        eventType: 'payment.failed.v1',
        version: 'v1',
        timestamp: new Date().toISOString(),
      };

      // Act
      await handler.handlePaymentFailed(eventData);

      // Assert
      expect(mockOrderRepository.findById).toHaveBeenCalledWith(orderId);
      expect(mockOrderRepository.save).toHaveBeenCalledWith(mockOrder);
      expect(mockOrder.status).toBe(OrderStatus.CANCELLED);
    });

    it('should handle missing order gracefully', async () => {
      // Arrange
      const payload: PaymentFailedV1Payload = {
        orderId: 'non-existent-order',
        customerId: 'customer-123',
        amount: 20.0,
        currency: 'EUR',
        reason: 'Payment failed',
        failedAt: new Date().toISOString(),
      };

      const eventData = {
        payload,
        eventId: 'event-456',
        eventType: 'payment.failed.v1',
        version: 'v1',
        timestamp: new Date().toISOString(),
      };

      mockOrderRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(handler.handlePaymentFailed(eventData)).resolves.not.toThrow();
      expect(mockOrderRepository.save).not.toHaveBeenCalled();
    });
  });
});
