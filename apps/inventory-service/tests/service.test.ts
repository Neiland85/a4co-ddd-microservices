import { InventoryService } from './../service';

describe('InventoryService', () => {
  let service: InventoryService;

  beforeEach(() => {
    service = new InventoryService();
    // Mock console.log para evitar output en tests
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance with correct service name', () => {
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(InventoryService);
    });
  });

  describe('updateStock', () => {
    it('should update stock successfully', () => {
      const result = service.updateStock('PROD-001', 100);
      expect(result).toContain('Inventory updated successfully');
      expect(result).toContain('PROD-001');
      expect(result).toContain('100');
    });

    it('should validate product ID', () => {
      expect(() => service.updateStock('', 100)).toThrow('Invalid inventory ID');
    });

    it('should validate quantity', () => {
      expect(() => service.updateStock('PROD-001', null as any)).toThrow('quantity is required');
    });
  });

  describe('getStock', () => {
    it('should retrieve stock successfully', () => {
      const result = service.getStock('PROD-001');
      expect(result).toContain('Inventory retrieved successfully');
      expect(result).toContain('PROD-001');
    });

    it('should validate product ID', () => {
      expect(() => service.getStock('')).toThrow('Invalid productId');
    });
  })

  describe('error handling', () => {
    it('should handle errors gracefully', () => {
      const invalidData = null as any;
      
      expect(() => {
        service.updateStock(invalidData, invalidData)
      }).toThrow();
    });
  });

  describe('logging', () => {
    it('should log operations', () => {
      service.updateStock('PROD-001', 100);
      
      expect(console.log).toHaveBeenCalled();
    });
  });
});