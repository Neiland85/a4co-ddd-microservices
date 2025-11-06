import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderUseCase } from '../../application/use-cases/create-order.use-case';
import { IOrderRepository } from '../../domain';
import { Order, OrderItem, OrderId } from '../../domain/aggregates/order.aggregate';
import { ClientProxy } from '@nestjs/microservices';
import { EventSubjects } from '@a4co/shared-utils';

describe('CreateOrderUseCase', () => {
    let useCase: CreateOrderUseCase;
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
                CreateOrderUseCase,
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

        useCase = module.get<CreateOrderUseCase>(CreateOrderUseCase);
        orderRepository = module.get('IOrderRepository');
        natsClient = module.get('NATS_CLIENT');
    });

    it('debe crear una orden y publicar evento OrderCreated', async () => {
        orderRepository.findById.mockResolvedValue(null);

        const dto = {
            orderId: 'order-1',
            customerId: 'customer-1',
            items: [
                {
                    productId: 'product-1',
                    quantity: 2,
                    unitPrice: 10.0,
                    currency: 'EUR',
                },
            ],
        };

        const result = await useCase.execute(dto);

        expect(result.id).toBe('order-1');
        expect(result.customerId).toBe('customer-1');
        expect(result.status).toBe('PENDING');
        expect(orderRepository.save).toHaveBeenCalled();
        expect(natsClient.emit).toHaveBeenCalledWith(
            EventSubjects.ORDER_CREATED,
            expect.objectContaining({
                orderId: 'order-1',
                customerId: 'customer-1',
            }),
        );
    });

    it('debe lanzar error si la orden ya existe', async () => {
        const existingOrder = new Order('order-1', 'customer-1', [
            new OrderItem('product-1', 1, 10.0),
        ]);
        orderRepository.findById.mockResolvedValue(existingOrder);

        const dto = {
            orderId: 'order-1',
            customerId: 'customer-1',
            items: [
                {
                    productId: 'product-1',
                    quantity: 1,
                    unitPrice: 10.0,
                },
            ],
        };

        await expect(useCase.execute(dto)).rejects.toThrow('already exists');
    });
});
