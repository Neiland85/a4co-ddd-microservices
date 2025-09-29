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
    });

    it('should validate product name', () => {
      const result = service.addProduct('', 29.99);
      expect(result).toContain('Error creating product');
      expect(result).toContain('name is required');
    });

    it('should validate product price', () => {
      const result = service.addProduct('Product A', 0);
      expect(result).toContain('Error creating product');
      expect(result).toContain('price is required');
    });
  });

  describe('getProduct', () => {
    it('should retrieve a product successfully', () => {
      const result = service.getProduct('Product A');
      expect(result).toContain('Product retrieved');
      expect(result).toContain('Product A');
    });

    it('should validate product name', () => {
      const result = service.getProduct('');
      expect(result).toContain('Error getting product');
      expect(result).toContain('name is required');
    });
  });

  describe('error handling', () => {
    it('should handle errors gracefully', () => {
      const invalidData = null as any;
      const result = service.addProduct(invalidData, invalidData);
      expect(result).toContain('Error creating product');
    });
  });

  describe('logging', () => {
    it('should log operations', () => {
      service.addProduct('Product A', 29.99);

      expect(console.log).toHaveBeenCalled();
    });
  });
});
