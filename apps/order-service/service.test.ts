import { CreateOrderDTO, GetOrderDTO, OrderService } from './src/application/services/service';
import { IOrderRepository } from './src/domain';

describe('OrderService', () => {
  let service: OrderService;
  let mockOrderRepository: jest.Mocked<IOrderRepository>;

  beforeEach(() => {
    mockOrderRepository = {
      findById: jest.fn(),
      findAll: jest.fn(),
      save: jest.fn(),
    };
    service = new OrderService(mockOrderRepository);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance with correct service name', () => {
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(OrderService);
    });
  });

  describe('createOrder', () => {
    it('should create an order successfully', async() => {
      const createOrderDto: CreateOrderDTO = {
        orderId: 'ORD-001',
        customerId: 'CUST-001',
        items: [
          {
            productId: 'PROD-001',
            quantity: 2,
            unitPrice: 10.99,
            currency: 'EUR',
          },
        ],
      };

      mockOrderRepository.findById.mockResolvedValue(null);
      mockOrderRepository.save.mockResolvedValue();

      const result = await service.createOrder(createOrderDto);

      expect(result).toBeDefined();
      expect(mockOrderRepository.findById).toHaveBeenCalled();
      expect(mockOrderRepository.save).toHaveBeenCalled();
    });

    it('should throw error for existing order', async() => {
      const createOrderDto: CreateOrderDTO = {
        orderId: 'ORD-001',
        customerId: 'CUST-001',
        items: [
          {
            productId: 'PROD-001',
            quantity: 1,
            unitPrice: 10.99,
          },
        ],
      };

      mockOrderRepository.findById.mockResolvedValue({} as any);

      await expect(service.createOrder(createOrderDto)).rejects.toThrow(
        'Order with id ORD-001 already exists',
      );
    });
  });

  describe('getOrder', () => {
    it('should retrieve an order successfully', async() => {
      const getOrderDto: GetOrderDTO = {
        orderId: 'ORD-001',
      };

      const mockOrder = {} as any;
      mockOrderRepository.findById.mockResolvedValue(mockOrder);

      const result = await service.getOrder(getOrderDto);

      expect(result).toBe(mockOrder);
      expect(mockOrderRepository.findById).toHaveBeenCalled();
    });

    it('should throw error for non-existing order', async() => {
      const getOrderDto: GetOrderDTO = {
        orderId: 'ORD-001',
      };

      mockOrderRepository.findById.mockResolvedValue(null);

      await expect(service.getOrder(getOrderDto)).rejects.toThrow(
        'Order with id ORD-001 not found',
      );
    });
  });

  describe('error handling', () => {
    it('should handle errors gracefully', async() => {
      const invalidData: CreateOrderDTO = {
        orderId: '',
        customerId: 'CUST-001',
        items: [],
      };

      await expect(service.createOrder(invalidData)).rejects.toThrow();
    });
  });

  describe('logging', () => {
    it('should log operations', async() => {
      const createOrderDto: CreateOrderDTO = {
        orderId: 'ORD-001',
        customerId: 'CUST-001',
        items: [
          {
            productId: 'PROD-001',
            quantity: 1,
            unitPrice: 10.99,
          },
        ],
      };

      mockOrderRepository.findById.mockResolvedValue(null);
      mockOrderRepository.save.mockResolvedValue();

      await service.createOrder(createOrderDto);

      expect(console.log).toHaveBeenCalled();
    });
  });
});
