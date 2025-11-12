import { ClientProxy } from '@nestjs/microservices';
import { of } from 'rxjs';
import { Order, OrderItem, OrderStatusEnum } from '../../src/domain/aggregates/order.aggregate';
import { InMemoryOrderRepository } from '../../src/infrastructure/repositories/order.repository';
import { OrderSaga } from '../../src/application/sagas/order.saga';

describe('OrderSaga integration', () => {
  let repository: InMemoryOrderRepository;
  let clientProxy: ClientProxy;
  let emittedEvents: Array<{ pattern: string; data: unknown }>;
  let saga: OrderSaga;
  let order: Order;

  beforeEach(async () => {
    repository = new InMemoryOrderRepository();
    emittedEvents = [];
    clientProxy = {
      emit: jest.fn((pattern: string, data: unknown) => {
        emittedEvents.push({ pattern, data });
        return of(data);
      }),
      connect: jest.fn().mockResolvedValue(undefined),
      close: jest.fn(),
    } as unknown as ClientProxy;
    saga = new OrderSaga(repository, clientProxy);

    order = new Order({
      id: 'order-1',
      customerId: 'customer-1',
      items: [new OrderItem('product-1', 2, 10)],
    });

    await repository.save(order);
    emittedEvents.length = 0;
  });

  it('should request payment after inventory is reserved', async () => {
    await saga.onInventoryReserved({
      orderId: 'order-1',
      customerId: 'customer-1',
      reservations: [
        { reservationId: 'res-1', productId: 'product-1', quantity: 2 },
      ],
      totalAmount: 20,
      timestamp: new Date().toISOString(),
    });

    const paymentRequest = emittedEvents.find(event => event.pattern === 'payments.process_request');
    expect(paymentRequest).toBeDefined();
    expect(paymentRequest?.data).toMatchObject({
      orderId: 'order-1',
      amount: { value: 20, currency: 'EUR' },
    });
  });

  it('should complete order after payment succeeded and emit orders.completed', async () => {
    await saga.onInventoryReserved({
      orderId: 'order-1',
      customerId: 'customer-1',
      reservations: [
        { reservationId: 'res-1', productId: 'product-1', quantity: 2 },
      ],
      totalAmount: 20,
      timestamp: new Date().toISOString(),
    });
    emittedEvents.length = 0;

    await saga.onPaymentSucceeded({
      orderId: 'order-1',
      paymentId: 'pay-1',
      amount: { value: 20, currency: 'EUR' },
      timestamp: new Date().toISOString(),
    });

    const completed = emittedEvents.find(event => event.pattern === 'orders.completed');
    expect(completed).toBeDefined();
    expect((completed?.data as { paymentId?: string })?.paymentId).toBe('pay-1');
    const storedOrder = await repository.findById('order-1');
    expect(storedOrder?.status).toBe(OrderStatusEnum.COMPLETED);
  });

  it('should compensate inventory and trigger refund on payment failure', async () => {
    await saga.onInventoryReserved({
      orderId: 'order-1',
      customerId: 'customer-1',
      reservations: [
        { reservationId: 'res-1', productId: 'product-1', quantity: 2 },
      ],
      totalAmount: 20,
      timestamp: new Date().toISOString(),
    });
    emittedEvents.length = 0;

    await saga.onPaymentFailed({
      orderId: 'order-1',
      paymentId: 'pay-1',
      reason: 'card_declined',
      timestamp: new Date().toISOString(),
    });

    const release = emittedEvents.find(event => event.pattern === 'inventory.release');
    const refund = emittedEvents.find(event => event.pattern === 'payment.refund');

    expect(release).toBeDefined();
    expect((release?.data as { reservationId?: string })?.reservationId).toBe('res-1');
    expect(refund).toBeDefined();
    expect((refund?.data as { paymentId?: string })?.paymentId).toBe('pay-1');

    const storedOrder = await repository.findById('order-1');
    expect(storedOrder?.status).toBe(OrderStatusEnum.FAILED);
  });
});
