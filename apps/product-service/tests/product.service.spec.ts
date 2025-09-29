import {
  Price,
  ProductDescription,
  ProductId,
  ProductName,
} from '../src/domain/value-objects/product-value-objects';

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
        'Product description cannot exceed 2000 characters'
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
