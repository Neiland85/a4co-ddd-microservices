import { Test, TestingModule } from '@nestjs/testing';
import { OrderSaga } from '../../application/sagas/order.saga';
import { IOrderRepository } from '../../domain';
import { Order, OrderItem, OrderStatus, OrderId } from '../../domain/aggregates/order.aggregate';
import { ClientProxy } from '@nestjs/microservices';

describe('OrderSaga', () => {
    let saga: OrderSaga;
    let orderRepository: jest.Mocked<IOrderRepository>;
    let natsClient: jest.Mocked<ClientProxy>;

    beforeEach(async () => {
        const mockRepository: jest.Mocked<IOrderRepository> = {
            save: jest.fn(),
            findById: jest.fn(),
            findByCustomerId: jest.fn(),
            findAll: jest.fn(),
        };

        const mockNatsClient: jest.Mocked<ClientProxy> = {
            emit: jest.fn(),
        } as any;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                OrderSaga,
                {
                    provide: 'IOrderRepository',
                    useValue: mockRepository,
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
        it('debe confirmar el pago y solicitar reserva de inventario', async () => {
            const order = new Order('order-1', 'customer-1', [
                new OrderItem('product-1', 1, 10.0),
            ]);
            orderRepository.findById.mockResolvedValue(order);

            await saga.handlePaymentSucceeded({
                orderId: 'order-1',
                paymentId: 'payment-1',
                amount: 10.0,
                currency: 'EUR',
                timestamp: new Date(),
            });

            expect(order.status).toBe(OrderStatus.PAYMENT_CONFIRMED);
            expect(orderRepository.save).toHaveBeenCalledWith(order);
            expect(natsClient.emit).toHaveBeenCalledWith(
                'inventory.reserve.requested.v1',
                expect.objectContaining({
                    orderId: 'order-1',
                }),
            );
        });

        it('debe manejar error si la orden no existe', async () => {
            orderRepository.findById.mockResolvedValue(null);

            await saga.handlePaymentSucceeded({
                orderId: 'order-1',
                paymentId: 'payment-1',
                amount: 10.0,
                currency: 'EUR',
                timestamp: new Date(),
            });

            expect(orderRepository.save).not.toHaveBeenCalled();
        });
    });

    describe('handlePaymentFailed', () => {
        it('debe cancelar la orden cuando el pago falla', async () => {
            const order = new Order('order-1', 'customer-1', [
                new OrderItem('product-1', 1, 10.0),
            ]);
            orderRepository.findById.mockResolvedValue(order);

            await saga.handlePaymentFailed({
                orderId: 'order-1',
                paymentId: 'payment-1',
                reason: 'Insufficient funds',
                timestamp: new Date(),
            });

            expect(order.status).toBe(OrderStatus.CANCELLED);
            expect(orderRepository.save).toHaveBeenCalledWith(order);
        });
    });

    describe('handleInventoryReserved', () => {
        it('debe completar la orden cuando el inventario es reservado', async () => {
            const order = new Order('order-1', 'customer-1', [
                new OrderItem('product-1', 1, 10.0),
            ]);
            order.confirmPayment();
            orderRepository.findById.mockResolvedValue(order);

            await saga.handleInventoryReserved({
                orderId: 'order-1',
                reservationId: 'reservation-1',
                items: [{ productId: 'product-1', quantity: 1 }],
                timestamp: new Date(),
            });

            expect(order.status).toBe(OrderStatus.COMPLETED);
            expect(orderRepository.save).toHaveBeenCalledWith(order);
            expect(natsClient.emit).toHaveBeenCalled();
        });
    });

    describe('handleInventoryOutOfStock', () => {
        it('debe solicitar reembolso y cancelar la orden', async () => {
            const order = new Order('order-1', 'customer-1', [
                new OrderItem('product-1', 1, 10.0),
            ]);
            order.confirmPayment();
            orderRepository.findById.mockResolvedValue(order);

            await saga.handleInventoryOutOfStock({
                orderId: 'order-1',
                productId: 'product-1',
                requestedQuantity: 1,
                availableQuantity: 0,
                timestamp: new Date(),
            });

            expect(order.status).toBe(OrderStatus.CANCELLED);
            expect(orderRepository.save).toHaveBeenCalledWith(order);
            expect(natsClient.emit).toHaveBeenCalledWith(
                expect.stringContaining('refund'),
                expect.objectContaining({
                    orderId: 'order-1',
                }),
            );
        });
    });
});
