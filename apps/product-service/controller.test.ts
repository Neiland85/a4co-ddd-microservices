import { ProductController } from './controller';
import { ProductService } from './service';

// Mock the ProductService
jest.mock('./service');

describe('ProductController', () => {
  let controller: ProductController;
  let mockProductService: jest.Mocked<ProductService>;

  beforeEach(() => {
    jest.clearAllMocks();
    controller = new ProductController();
    mockProductService = (controller as any).productService as jest.Mocked<ProductService>;
  });

  describe('addProduct', () => {
    it('should add a product with valid data', () => {
      const request = { name: 'Laptop', price: 999.99 };
      const expectedResult = 'Producto Laptop agregado con precio 999.99.';
      
      mockProductService.addProduct.mockReturnValue(expectedResult);

      const result = controller.addProduct(request);

      expect(mockProductService.addProduct).toHaveBeenCalledWith('Laptop', 999.99);
      expect(result).toBe(expectedResult);
    });

    it('should handle zero price', () => {
      const request = { name: 'Free Product', price: 0 };
      const expectedResult = 'Producto Free Product agregado con precio 0.';
      
      mockProductService.addProduct.mockReturnValue(expectedResult);

      const result = controller.addProduct(request);

      expect(mockProductService.addProduct).toHaveBeenCalledWith('Free Product', 0);
      expect(result).toBe(expectedResult);
    });

    it('should handle negative price', () => {
      const request = { name: 'Discounted Product', price: -10.50 };
      const expectedResult = 'Producto Discounted Product agregado con precio -10.5.';
      
      mockProductService.addProduct.mockReturnValue(expectedResult);

      const result = controller.addProduct(request);

      expect(mockProductService.addProduct).toHaveBeenCalledWith('Discounted Product', -10.50);
      expect(result).toBe(expectedResult);
    });

    it('should handle special characters in product name', () => {
      const request = { name: 'Café "Premium" & More', price: 15.99 };
      const expectedResult = 'Producto Café "Premium" & More agregado con precio 15.99.';
      
      mockProductService.addProduct.mockReturnValue(expectedResult);

      const result = controller.addProduct(request);

      expect(mockProductService.addProduct).toHaveBeenCalledWith('Café "Premium" & More', 15.99);
      expect(result).toBe(expectedResult);
    });

    it('should handle decimal precision in price', () => {
      const request = { name: 'Precision Product', price: 123.456789 };
      const expectedResult = 'Producto Precision Product agregado con precio 123.456789.';
      
      mockProductService.addProduct.mockReturnValue(expectedResult);

      const result = controller.addProduct(request);

      expect(mockProductService.addProduct).toHaveBeenCalledWith('Precision Product', 123.456789);
      expect(result).toBe(expectedResult);
    });

    it('should propagate service errors', () => {
      const request = { name: 'Error Product', price: 100 };
      const serviceError = new Error('Product creation failed');
      
      mockProductService.addProduct.mockImplementation(() => {
        throw serviceError;
      });

      expect(() => controller.addProduct(request)).toThrow('Product creation failed');
      expect(mockProductService.addProduct).toHaveBeenCalledWith('Error Product', 100);
    });
  });

  describe('getProduct', () => {
    it('should get product information with valid name', () => {
      const request = { name: 'Laptop' };
      const expectedResult = 'Información del producto Laptop.';
      
      mockProductService.getProduct.mockReturnValue(expectedResult);

      const result = controller.getProduct(request);

      expect(mockProductService.getProduct).toHaveBeenCalledWith('Laptop');
      expect(result).toBe(expectedResult);
    });

    it('should handle empty product name', () => {
      const request = { name: '' };
      const expectedResult = 'Información del producto .';
      
      mockProductService.getProduct.mockReturnValue(expectedResult);

      const result = controller.getProduct(request);

      expect(mockProductService.getProduct).toHaveBeenCalledWith('');
      expect(result).toBe(expectedResult);
    });

    it('should handle unicode characters in product name', () => {
      const request = { name: '香水 - Perfume' };
      const expectedResult = 'Información del producto 香水 - Perfume.';
      
      mockProductService.getProduct.mockReturnValue(expectedResult);

      const result = controller.getProduct(request);

      expect(mockProductService.getProduct).toHaveBeenCalledWith('香水 - Perfume');
      expect(result).toBe(expectedResult);
    });

    it('should propagate service errors', () => {
      const request = { name: 'NonexistentProduct' };
      const serviceError = new Error('Product not found');
      
      mockProductService.getProduct.mockImplementation(() => {
        throw serviceError;
      });

      expect(() => controller.getProduct(request)).toThrow('Product not found');
      expect(mockProductService.getProduct).toHaveBeenCalledWith('NonexistentProduct');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null/undefined values', () => {
      const addRequest = { name: null as any, price: undefined as any };
      const getRequest = { name: undefined as any };
      
      mockProductService.addProduct.mockReturnValue('Producto null agregado con precio undefined.');
      mockProductService.getProduct.mockReturnValue('Información del producto undefined.');

      controller.addProduct(addRequest);
      controller.getProduct(getRequest);

      expect(mockProductService.addProduct).toHaveBeenCalledWith(null, undefined);
      expect(mockProductService.getProduct).toHaveBeenCalledWith(undefined);
    });

    it('should handle very large numbers', () => {
      const request = { name: 'Expensive Product', price: Number.MAX_SAFE_INTEGER };
      const expectedResult = `Producto Expensive Product agregado con precio ${Number.MAX_SAFE_INTEGER}.`;
      
      mockProductService.addProduct.mockReturnValue(expectedResult);

      const result = controller.addProduct(request);

      expect(mockProductService.addProduct).toHaveBeenCalledWith('Expensive Product', Number.MAX_SAFE_INTEGER);
      expect(result).toBe(expectedResult);
    });

    it('should handle special numeric values', () => {
      const infinityRequest = { name: 'Infinity Product', price: Infinity };
      const nanRequest = { name: 'NaN Product', price: NaN };
      
      mockProductService.addProduct.mockReturnValue('Infinity result');
      controller.addProduct(infinityRequest);
      expect(mockProductService.addProduct).toHaveBeenCalledWith('Infinity Product', Infinity);

      mockProductService.addProduct.mockReturnValue('NaN result');
      controller.addProduct(nanRequest);
      expect(mockProductService.addProduct).toHaveBeenCalledWith('NaN Product', NaN);
    });
  });
});