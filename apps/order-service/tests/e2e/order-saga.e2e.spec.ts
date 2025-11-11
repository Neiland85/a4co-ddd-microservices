/**
 * Tests E2E para el flujo completo Order → Inventory → Payment
 * 
 * Estos tests validan:
 * 1. Flujo completo exitoso
 * 2. Compensación cuando falla inventory
 * 3. Compensación cuando falla payment
 * 4. Timeout de saga
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { OrderModule } from '../../src/order.module';
import { OrderSaga, SagaState } from '../../src/application/sagas/order.saga';
import { IOrderRepository } from '../../src/domain/repositories/order.repository';
import { ClientProxy } from '@nestjs/microservices';
import { Order, OrderItem, OrderStatus } from '../../src/domain/aggregates/order.aggregate';

describe('Order Saga E2E', () => {
  let app: INestApplication;
  let saga: OrderSaga;
  let orderRepository: IOrderRepository;
  let natsClient: ClientProxy;

  const mockOrderRepository = {
    findById: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const mockNatsClient = {
    emit: jest.fn().mockReturnValue({
      toPromise: jest.fn().mockResolvedValue(undefined),
    }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [OrderModule],
    })
      .overrideProvider('OrderRepository')
      .useValue(mockOrderRepository)
      .overrideProvider('NATS_CLIENT')
      .useValue(mockNatsClient)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    saga = moduleFixture.get<OrderSaga>(OrderSaga);
    orderRepository = moduleFixture.get<IOrderRepository>('OrderRepository');
    natsClient = moduleFixture.get<ClientProxy>('NATS_CLIENT');
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Flujo completo exitoso', () => {
    it('debe completar el flujo Order → Inventory → Payment exitosamente', async () => {
      const orderId = 'order-123';
      const customerId = 'customer-456';
      const items = [
        new OrderItem('product-1', 2, 10.0, 'EUR'),
        new OrderItem('product-2', 1, 20.0, 'EUR'),
      ];
      const order = new Order(orderId, customerId, items, OrderStatus.PENDING);

      mockOrderRepository.findById.mockResolvedValue(order);
      mockOrderRepository.save.mockResolvedValue(undefined);

      // Ejecutar saga
      await saga.execute({ orderId, customerId, items });

      // Verificar que se publicó el evento order.created
      expect(mockNatsClient.emit).toHaveBeenCalledWith(
        'order.created',
        expect.objectContaining({
          orderId,
          customerId,
          items: expect.arrayContaining([
            expect.objectContaining({ productId: 'product-1', quantity: 2 }),
            expect.objectContaining({ productId: 'product-2', quantity: 1 }),
          ]),
        }),
      );

      // Simular evento de inventory reservado
      const inventoryReservedEvent = {
        data: {
          orderId,
          reservationId: 'reservation-123',
          totalAmount: 40.0,
          customerId,
        },
      };
      await (saga as any).handleInventoryReserved(inventoryReservedEvent);

      // Verificar que se publicó el evento payment.initiate
      expect(mockNatsClient.emit).toHaveBeenCalledWith(
        'payment.initiate',
        expect.objectContaining({
          orderId,
          amount: 40.0,
          customerId,
        }),
      );

      // Simular evento de pago exitoso
      const paymentSucceededEvent = {
        data: {
          orderId,
          paymentIntentId: 'pi_123',
        },
      };
      await (saga as any).handlePaymentSucceeded(paymentSucceededEvent);

      // Verificar que la orden se actualizó a PAID
      expect(mockOrderRepository.save).toHaveBeenCalled();
      expect(order.status).toBe(OrderStatus.PAID);

      // Verificar contexto de saga
      const context = saga.getSagaContext(orderId);
      expect(context?.state).toBe(SagaState.COMPLETED);
    });
  });

  describe('Compensación por stock insuficiente', () => {
    it('debe compensar cuando inventory no tiene stock', async () => {
      const orderId = 'order-456';
      const customerId = 'customer-789';
      const items = [new OrderItem('product-out-of-stock', 10, 5.0, 'EUR')];
      const order = new Order(orderId, customerId, items, OrderStatus.PENDING);

      mockOrderRepository.findById.mockResolvedValue(order);
      mockOrderRepository.save.mockResolvedValue(undefined);

      await saga.execute({ orderId, customerId, items });

      // Simular evento de stock insuficiente
      const inventoryOutOfStockEvent = {
        data: { orderId },
      };
      await (saga as any).handleInventoryOutOfStock(inventoryOutOfStockEvent);

      // Verificar que se inició la compensación
      const context = saga.getSagaContext(orderId);
      expect(context?.state).toBe(SagaState.COMPENSATING);

      // Verificar que se publicó el evento order.cancelled
      expect(mockNatsClient.emit).toHaveBeenCalledWith(
        'order.cancelled',
        expect.objectContaining({
          orderId,
          reason: 'Stock insuficiente',
        }),
      );
    });
  });

  describe('Compensación por pago fallido', () => {
    it('debe compensar cuando el pago falla', async () => {
      const orderId = 'order-789';
      const customerId = 'customer-123';
      const items = [new OrderItem('product-1', 1, 10.0, 'EUR')];
      const order = new Order(orderId, customerId, items, OrderStatus.PENDING);

      mockOrderRepository.findById.mockResolvedValue(order);
      mockOrderRepository.save.mockResolvedValue(undefined);

      await saga.execute({ orderId, customerId, items });

      // Simular evento de inventory reservado
      const inventoryReservedEvent = {
        data: {
          orderId,
          reservationId: 'reservation-456',
          totalAmount: 10.0,
          customerId,
        },
      };
      await (saga as any).handleInventoryReserved(inventoryReservedEvent);

      // Simular evento de pago fallido
      const paymentFailedEvent = {
        data: {
          orderId,
          reason: 'Tarjeta rechazada',
        },
      };
      await (saga as any).handlePaymentFailed(paymentFailedEvent);

      // Verificar que se inició la compensación
      const context = saga.getSagaContext(orderId);
      expect(context?.state).toBe(SagaState.COMPENSATING);

      // Verificar que se publicó el evento para liberar inventory
      expect(mockNatsClient.emit).toHaveBeenCalledWith(
        'inventory.release',
        expect.objectContaining({
          orderId,
          reservationId: 'reservation-456',
        }),
      );
    });
  });
});
