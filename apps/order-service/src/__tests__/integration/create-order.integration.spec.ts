import { Test, TestingModule } from '@nestjs/testing';
import { CreateOrderUseCase } from '../../application/use-cases/create-order.use-case';
import { IOrderRepository } from '../../domain';
import { Order, OrderId, OrderItem } from '../../domain/aggregates/order.aggregate';
import { ClientProxy } from '@nestjs/microservices';

describe('CreateOrderUseCase Integration', () => {
  let useCase: CreateOrderUseCase;
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
        CreateOrderUseCase,
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

    useCase = module.get<CreateOrderUseCase>(CreateOrderUseCase);
    orderRepository = module.get('IOrderRepository');
    natsClient = module.get('NATS_CLIENT');
  });

  it('should create order and publish events', async () => {
    orderRepository.save.mockResolvedValue(undefined);

    const dto = {
      customerId: 'customer-1',
      items: [
        {
          productId: 'product1',
          quantity: 2,
          unitPrice: 10.0,
          currency: 'EUR',
        },
      ],
    };

    const orderId = await useCase.execute(dto);

    expect(orderId).toBeDefined();
    expect(orderRepository.save).toHaveBeenCalled();
    expect(natsClient.emit).toHaveBeenCalledWith('order.created', expect.any(Object));
    expect(natsClient.emit).toHaveBeenCalledWith('payment.request', expect.any(Object));
  });

  it('should throw error if customerId is empty', async () => {
    const dto = {
      customerId: '',
      items: [
        {
          productId: 'product1',
          quantity: 1,
          unitPrice: 10.0,
        },
      ],
    };

    await expect(useCase.execute(dto)).rejects.toThrow('CustomerId is required');
  });

  it('should throw error if items array is empty', async () => {
    const dto = {
      customerId: 'customer-1',
      items: [],
    };

    await expect(useCase.execute(dto)).rejects.toThrow('Order must have at least one item');
  });

  it('should create order with multiple items', async () => {
    orderRepository.save.mockResolvedValue(undefined);

    const dto = {
      customerId: 'customer-1',
      items: [
        {
          productId: 'product1',
          quantity: 2,
          unitPrice: 10.0,
        },
        {
          productId: 'product2',
          quantity: 1,
          unitPrice: 20.0,
        },
      ],
    };

    const orderId = await useCase.execute(dto);

    expect(orderId).toBeDefined();
    const savedOrder = (orderRepository.save as jest.Mock).mock.calls[0][0] as Order;
    expect(savedOrder.items).toHaveLength(2);
    expect(savedOrder.totalAmount).toBe(40.0);
  });
});
