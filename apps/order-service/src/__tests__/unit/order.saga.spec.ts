import { Test, TestingModule } from '@nestjs/testing';
import { OrderSaga, PaymentSucceededEvent, PaymentFailedEvent, InventoryReservedEvent, InventoryOutOfStockEvent } from '../../application/sagas/order.saga';
import { IOrderRepository } from '../../domain';
import { Order, OrderId, OrderItem, OrderStatusEnum } from '../../domain/aggregates/order.aggregate';
import { ClientProxy } from '@nestjs/microservices';

describe('OrderSaga', () => {
  let saga: OrderSaga;
  let orderRepository: jest.Mocked<IOrderRepository>;
  let natsClient: jest.Mocked<ClientProxy>;

  beforeEach(async () => {
    const mockOrderRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      findByCustomerId: jest.fn(),
      findAll: jest.fn(),
    };

    const mockNatsClient = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderSaga,
        {
          provide: 'IOrderRepository',
          useValue: mockOrderRepository,
        },
        {
          provide: 'NATS_CLIENT',
          useValue: mockNatsClient,
        },
      ],
    }).compile();

    saga = module.get<OrderSaga>(OrderSaga);
    orderRepository = module.get('IOrderRepository');
    natsClient = module.get('NATS_CLIENT');
  });

  describe('handlePaymentSucceeded', () => {
    it('should confirm payment and request inventory reservation', async () => {
      const order = new Order('order-1', 'customer-1', [
        new OrderItem('product1', 1, 10.0),
      ]);
      orderRepository.findById.mockResolvedValue(order);
      orderRepository.save.mockResolvedValue(undefined);

      const event: PaymentSucceededEvent = {
        orderId: 'order-1',
        paymentId: 'payment-1',
        amount: 10.0,
        currency: 'EUR',
        timestamp: new Date(),
      };

      await saga.handlePaymentSucceeded(event);

      expect(orderRepository.findById).toHaveBeenCalledWith(new OrderId('order-1'));
      expect(order.status).toBe(OrderStatusEnum.PAYMENT_CONFIRMED);
      expect(orderRepository.save).toHaveBeenCalled();
      expect(natsClient.emit).toHaveBeenCalledWith('inventory.reserve', expect.any(Object));
    });

    it('should handle order not found', async () => {
      orderRepository.findById.mockResolvedValue(null);

      const event: PaymentSucceededEvent = {
        orderId: 'order-999',
        paymentId: 'payment-1',
        amount: 10.0,
        currency: 'EUR',
        timestamp: new Date(),
      };

      await saga.handlePaymentSucceeded(event);

      expect(orderRepository.findById).toHaveBeenCalled();
      expect(orderRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('handlePaymentFailed', () => {
    it('should cancel order when payment fails', async () => {
      const order = new Order('order-1', 'customer-1', [
        new OrderItem('product1', 1, 10.0),
      ]);
      orderRepository.findById.mockResolvedValue(order);
      orderRepository.save.mockResolvedValue(undefined);

      const event: PaymentFailedEvent = {
        orderId: 'order-1',
        paymentId: 'payment-1',
        reason: 'Insufficient funds',
        timestamp: new Date(),
      };

      await saga.handlePaymentFailed(event);

      expect(order.status).toBe(OrderStatusEnum.CANCELLED);
      expect(order.cancelledReason).toContain('Insufficient funds');
      expect(orderRepository.save).toHaveBeenCalled();
    });
  });

  describe('handleInventoryReserved', () => {
    it('should complete order when inventory is reserved', async () => {
      const order = new Order('order-1', 'customer-1', [
        new OrderItem('product1', 1, 10.0),
      ]);
      order.confirmPayment();
      orderRepository.findById.mockResolvedValue(order);
      orderRepository.save.mockResolvedValue(undefined);

      const event: InventoryReservedEvent = {
        orderId: 'order-1',
        reservationId: 'reservation-1',
        items: [{ productId: 'product1', quantity: 1 }],
        timestamp: new Date(),
      };

      await saga.handleInventoryReserved(event);

      expect(order.status).toBe(OrderStatusEnum.COMPLETED);
      expect(orderRepository.save).toHaveBeenCalledTimes(2);
      expect(natsClient.emit).toHaveBeenCalledWith('order.completed', expect.any(Object));
    });
  });

  describe('handleInventoryOutOfStock', () => {
    it('should request refund and cancel order when inventory is out of stock', async () => {
      const order = new Order('order-1', 'customer-1', [
        new OrderItem('product1', 1, 10.0),
      ]);
      order.confirmPayment();
      orderRepository.findById.mockResolvedValue(order);
      orderRepository.save.mockResolvedValue(undefined);

      const event: InventoryOutOfStockEvent = {
        orderId: 'order-1',
        items: [
          {
            productId: 'product1',
            requestedQuantity: 1,
            availableQuantity: 0,
          },
        ],
        timestamp: new Date(),
      };

      await saga.handleInventoryOutOfStock(event);

      expect(order.status).toBe(OrderStatusEnum.CANCELLED);
      expect(natsClient.emit).toHaveBeenCalledWith('payment.refund', expect.any(Object));
      expect(orderRepository.save).toHaveBeenCalled();
    });
  });
});
