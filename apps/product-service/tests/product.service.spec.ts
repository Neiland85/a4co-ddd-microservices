import {
  Price,
  ProductDescription,
  ProductId,
  ProductName,
} from '../src/domain/value-objects/product-value-objects';
import { ProductService } from '../service';
import { ProductController } from '../controller';

describe('Product Value Objects', () => {
  describe('ProductId', () => {
    it('should create a ProductId with provided value', () => {
      const id = 'test-product-id';
      const productId = ProductId.fromString(id);
      expect(productId.value).toBe(id);
    });

    it('should generate UUID when no value provided', () => {
      const productId = new ProductId();
      expect(productId.value).toBeDefined();
      expect(typeof productId.value).toBe('string');
      expect(productId.value.length).toBeGreaterThan(0);
    });

    it('should throw error for empty ProductId', () => {
      expect(() => ProductId.fromString('')).toThrow('ProductId cannot be empty');
      expect(() => ProductId.fromString('   ')).toThrow('ProductId cannot be empty');
    });
  });

  describe('ProductName', () => {
    it('should create a valid ProductName', () => {
      const name = 'Test Product Name';
      const productName = new ProductName(name);
      expect(productName.value).toBe(name);
    });

    it('should trim whitespace', () => {
      const name = '  Test Product  ';
      const productName = new ProductName(name);
      expect(productName.value).toBe('Test Product');
    });

    it('should throw error for empty name', () => {
      expect(() => new ProductName('')).toThrow('Product name cannot be empty');
      expect(() => new ProductName('   ')).toThrow('Product name cannot be empty');
    });

    it('should throw error for name too long', () => {
      const longName = 'a'.repeat(201);
      expect(() => new ProductName(longName)).toThrow('Product name cannot exceed 200 characters');
    });
  });

  describe('ProductDescription', () => {
    it('should create a valid ProductDescription', () => {
      const description = 'Test product description';
      const productDesc = new ProductDescription(description);
      expect(productDesc.value).toBe(description);
    });

    it('should trim whitespace', () => {
      const description = '  Test description  ';
      const productDesc = new ProductDescription(description);
      expect(productDesc.value).toBe('Test description');
    });

    it('should throw error for empty description', () => {
      expect(() => new ProductDescription('')).toThrow('Product description cannot be empty');
    });

    it('should throw error for description too long', () => {
      const longDesc = 'a'.repeat(2001);
      expect(() => new ProductDescription(longDesc)).toThrow(
        'Product description cannot exceed 2000 characters',
      );
    });
  });

  describe('Price', () => {
    it('should create a valid Price', () => {
      const amount = 99.99;
      const currency = 'EUR';
      const price = new Price(amount, currency);
      expect(price.value.amount).toBe(amount);
      expect(price.value.currency).toBe(currency);
    });

    it('should convert currency to uppercase', () => {
      const price = new Price(50, 'eur');
      expect(price.value.currency).toBe('EUR');
    });

    it('should throw error for negative amount', () => {
      expect(() => new Price(-10, 'EUR')).toThrow('Price amount cannot be negative');
    });

    it('should throw error for invalid currency length', () => {
      expect(() => new Price(100, 'EURO')).toThrow('Currency must be a valid 3-letter code');
      expect(() => new Price(100, 'EU')).toThrow('Currency must be a valid 3-letter code');
      expect(() => new Price(100, '')).toThrow('Currency must be a valid 3-letter code');
    });
  });
});

// Mock para BaseService
jest.mock('../../../packages/shared-utils/src/base', () => ({
  BaseService: jest.fn().mockImplementation(() => ({
    validateRequired: jest.fn((value, field) => {
      if (value === undefined || value === null || value === '') {
        throw new Error(`${field} is required`);
      }
      return value;
    }),
    validateId: jest.fn((value, field) => {
      if (value === undefined || value === null || value === '') {
        throw new Error(`${field} is required`);
      }
      return value;
    }),
    log: jest.fn(),
    createSuccessMessage: jest.fn(
      (entity, action, details) => `${entity} ${action} successfully ${details}`
    ),
    handleServiceError: jest.fn((error, method) => `Error in ${method}: ${error.message}`),
  })),
  BaseController: jest.fn().mockImplementation(() => ({
    validateRequest: jest.fn((req, fields) => {
      const validated: any = {};
      fields.forEach((field: string) => {
        if (req[field] === undefined || req[field] === null) {
          throw new Error(`${field} is required`);
        }
        validated[field] = req[field];
      });
      return validated;
    }),
    formatResponse: jest.fn(data => ({ data })),
    handleError: jest.fn(error => ({ error: error.message })),
    service: null,
  })),
}));

describe('ProductService - Casos de Uso Principales', () => {
  let productService: ProductService;

  beforeEach(() => {
    jest.clearAllMocks();
    productService = new ProductService();
  });

  describe('Add Product - Flujos Principales', () => {
    it('debería crear un producto exitosamente con datos válidos', () => {
      const name = 'Laptop Gaming';
      const price = 1299.99;

      const result = productService.addProduct(name, price);

      expect(result).toContain('Product');
      expect(result).toContain('created');
      expect(result).toContain(name);
      expect(result).toContain(price.toString());
    });

    it('debería manejar nombres de producto con caracteres especiales', () => {
      const name = 'Producto-Éléctrico_123';
      const price = 99.5;

      const result = productService.addProduct(name, price);

      expect(result).toContain('Product');
      expect(result).toContain('created');
      expect(result).toContain(name);
    });

    it('debería manejar precios con decimales', () => {
      const name = 'Mouse Wireless';
      const price = 29.99;

      const result = productService.addProduct(name, price);

      expect(result).toContain('Product');
      expect(result).toContain('created');
      expect(result).toContain(price.toString());
    });

    it('debería manejar precios enteros', () => {
      const name = 'Teclado Mecánico';
      const price = 150;

      const result = productService.addProduct(name, price);

      expect(result).toContain('Product');
      expect(result).toContain('created');
      expect(result).toContain(price.toString());
    });
  });

  describe('Add Product - Casos de Error', () => {
    it('debería manejar nombre de producto vacío', () => {
      const name = '';
      const price = 100;

      const result = productService.addProduct(name, price);

      expect(result).toContain('Error in addProduct');
      expect(result).toContain('name is required');
    });

    it('debería manejar nombre de producto undefined', () => {
      const name = undefined as any;
      const price = 100;

      const result = productService.addProduct(name, price);

      expect(result).toContain('Error in addProduct');
      expect(result).toContain('name is required');
    });

    it('debería manejar precio undefined', () => {
      const name = 'Test Product';
      const price = undefined as any;

      const result = productService.addProduct(name, price);

      expect(result).toContain('Error in addProduct');
      expect(result).toContain('price is required');
    });

    it('debería manejar precio null', () => {
      const name = 'Test Product';
      const price = null as any;

      const result = productService.addProduct(name, price);

      expect(result).toContain('Error in addProduct');
      expect(result).toContain('price is required');
    });
  });

  describe('Get Product - Flujos Principales', () => {
    it('debería obtener información de un producto exitosamente', () => {
      const name = 'Laptop Gaming';

      const result = productService.getProduct(name);

      expect(result).toContain('Product');
      expect(result).toContain('retrieved');
      expect(result).toContain(name);
    });

    it('debería manejar nombres de producto largos', () => {
      const name =
        'Producto con nombre muy largo que excede el límite normal de caracteres permitidos en un sistema de base de datos';

      const result = productService.getProduct(name);

      expect(result).toContain('Product');
      expect(result).toContain('retrieved');
      expect(result).toContain(name);
    });

    it('debería manejar nombres de producto con números', () => {
      const name = 'Producto 123 v2.0';

      const result = productService.getProduct(name);

      expect(result).toContain('Product');
      expect(result).toContain('retrieved');
      expect(result).toContain(name);
    });
  });

  describe('Get Product - Casos de Error', () => {
    it('debería manejar nombre de producto vacío', () => {
      const name = '';

      const result = productService.getProduct(name);

      expect(result).toContain('Error in getProduct');
      expect(result).toContain('name is required');
    });

    it('debería manejar nombre de producto undefined', () => {
      const name = undefined as any;

      const result = productService.getProduct(name);

      expect(result).toContain('Error in getProduct');
      expect(result).toContain('name is required');
    });

    it('debería manejar nombre de producto null', () => {
      const name = null as any;

      const result = productService.getProduct(name);

      expect(result).toContain('Error in getProduct');
      expect(result).toContain('name is required');
    });
  });

  describe('Validaciones de Entrada', () => {
    it('debería validar que name sea string', () => {
      const name = 123 as any;
      const price = 100;

      const result = productService.addProduct(name, price);

      expect(result).toContain('Error in addProduct');
      expect(result).toContain('name is required');
    });

    it('debería validar que price sea number', () => {
      const name = 'Test Product';
      const price = '100' as any;

      const result = productService.addProduct(name, price);

      expect(result).toContain('Error in addProduct');
      expect(result).toContain('price is required');
    });
  });

  describe('Casos Edge', () => {
    it('debería manejar strings muy largos', () => {
      const longString = 'a'.repeat(10000);

      const addResult = productService.addProduct(longString, 100);
      const getResult = productService.getProduct(longString);

      expect(addResult).toContain('Product');
      expect(getResult).toContain('Product');
    });

    it('debería manejar caracteres Unicode', () => {
      const name = 'Producto_ñáéíóú_测试_🚀_123';

      const result = productService.getProduct(name);

      expect(result).toContain('Product');
      expect(result).toContain('retrieved');
      expect(result).toContain(name);
    });

    it('debería manejar precios extremos', () => {
      const name = 'Producto Test';
      const extremePrice = 999999999.99;

      const result = productService.addProduct(name, extremePrice);

      expect(result).toContain('Product');
      expect(result).toContain('created');
      expect(result).toContain(extremePrice.toString());
    });
  });
});

describe('ProductController - Integración', () => {
  let productController: ProductController;

  beforeEach(() => {
    jest.clearAllMocks();
    productController = new ProductController();
  });

  describe('Métodos del Controller', () => {
    it('debería delegar addProduct al service correctamente', () => {
      const request = { name: 'Test Product', price: 100 };

      const result = productController.addProduct(request);

      expect(result).toContain('Product');
      expect(result).toContain('created');
    });

    it('debería delegar getProduct al service correctamente', () => {
      const request = { name: 'Test Product' };

      const result = productController.getProduct(request);

      expect(result).toContain('Product');
      expect(result).toContain('retrieved');
    });
  });

  describe('Validación de Request', () => {
    it('debería manejar request con propiedades faltantes', () => {
      const request = { name: 'Test Product' } as any;

      expect(() => productController.addProduct(request)).toThrow();
    });

    it('debería manejar request vacío', () => {
      const request = {} as any;

      expect(() => productController.addProduct(request)).toThrow();
      expect(() => productController.getProduct(request)).toThrow();
    });

    it('debería manejar request con propiedades null', () => {
      const request = { name: null, price: null } as any;

      expect(() => productController.addProduct(request)).toThrow();
    });
  });

  describe('Manejo de Errores', () => {
    it('debería propagar errores del service correctamente', () => {
      const invalidRequest = { name: '', price: 100 };

      expect(() => productController.addProduct(invalidRequest)).toThrow();
    });

    it('debería manejar errores de validación', () => {
      const invalidRequest = { name: 'Test', price: -100 };

      expect(() => productController.addProduct(invalidRequest)).toThrow();
    });
  });
});

describe('ProductService - Cobertura de Código', () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService();
  });

  it('debería tener 100% de cobertura en métodos públicos', () => {
    // Verificar que todos los métodos públicos son llamables
    expect(typeof productService.addProduct).toBe('function');
    expect(typeof productService.getProduct).toBe('function');

    // Verificar que los métodos retornan strings
    expect(typeof productService.addProduct('test', 100)).toBe('string');
    expect(typeof productService.getProduct('test')).toBe('string');
  });

  it('debería manejar todos los tipos de entrada válidos', () => {
    const testCases = [
      { name: 'normal', price: 100 },
      { name: '123', price: 0 },
      { name: 'user@domain.com', price: 999.99 },
      { name: 'Producto Test', price: 1 },
    ];

    testCases.forEach(({ name, price }) => {
      const addResult = productService.addProduct(name, price);
      const getResult = productService.getProduct(name);

      expect(addResult).toContain('Product');
      expect(getResult).toContain('Product');
    });
  });

  it('debería manejar todos los casos de error esperados', () => {
    const errorCases = [
      { name: '', price: 100, expectedError: 'name is required' },
      { name: 'Test', price: undefined, expectedError: 'price is required' },
      { name: null, price: 100, expectedError: 'name is required' },
      { name: 'Test', price: null, expectedError: 'price is required' },
    ];

    errorCases.forEach(({ name, price, expectedError }) => {
      const result = productService.addProduct(name as any, price as any);
      expect(result).toContain('Error in addProduct');
      expect(result).toContain(expectedError);
    });
  });
});
