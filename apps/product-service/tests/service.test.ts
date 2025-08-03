import { ProductService } from './../service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    service = new ProductService();
    // Mock console.log para evitar output en tests
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('constructor', () => {
    it('should create an instance with correct service name', () => {
      expect(service).toBeDefined();
      expect(service).toBeInstanceOf(ProductService);
    });
  });

  describe('addProduct', () => {
    it('should add a product successfully', () => {
      const result = service.addProduct('Product A', 29.99);
      expect(result).toContain('Product created successfully');
      expect(result).toContain('Product A');
      expect(result).toContain('29.99');
    });

    it('should validate product name', () => {
      expect(() => service.addProduct('', 29.99)).toThrow('name is required');
    });

    it('should validate product price', () => {
      expect(() => service.addProduct('Product A', null as any)).toThrow('price is required');
    });
  });

  describe('getProduct', () => {
    it('should retrieve a product successfully', () => {
      const result = service.getProduct('Product A');
      expect(result).toContain('Product retrieved successfully');
      expect(result).toContain('Product A');
    });

    it('should validate product name', () => {
      expect(() => service.getProduct('')).toThrow('Invalid name');
    });
  })

  describe('error handling', () => {
    it('should handle errors gracefully', () => {
      const invalidData = null as any;
      
      expect(() => {
        service.addProduct(invalidData, invalidData)
      }).toThrow();
    });
  });

  describe('logging', () => {
    it('should log operations', () => {
      service.addProduct('Product A', 29.99);
      
      expect(console.log).toHaveBeenCalled();
    });
  });
});