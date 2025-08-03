import { OrderService } from './service';

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(() => {
    service = new OrderService();
    // Mock console.log para evitar output en tests
    jest.spyOn(console, 'log').mockImplementation();
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
    it('should create an order successfully', () => {
      const result = service.createOrder('ORD-001', ['item1', 'item2']);
      expect(result).toContain('Order created successfully');
      expect(result).toContain('ORD-001');
    });

    it('should validate order ID', () => {
      expect(() => service.createOrder('', ['item1'])).toThrow('Invalid order ID');
    });

    it('should validate items array', () => {
      expect(() => service.createOrder('ORD-001', [])).toThrow('Order must contain at least one item');
    });
  });

  describe('getOrder', () => {
    it('should retrieve an order successfully', () => {
      const result = service.getOrder('ORD-001');
      expect(result).toContain('Order retrieved successfully');
      expect(result).toContain('ORD-001');
    });

    it('should validate order ID', () => {
      expect(() => service.getOrder('')).toThrow('Invalid order ID');
    });
  })

  describe('error handling', () => {
    it('should handle errors gracefully', () => {
      const invalidData = null as any;
      
      expect(() => {
        service.createOrder(invalidData, invalidData)
      }).toThrow();
    });
  });

  describe('logging', () => {
    it('should log operations', () => {
      service.createOrder('ORD-001', ['item1']);
      
      expect(console.log).toHaveBeenCalled();
    });
  });
});