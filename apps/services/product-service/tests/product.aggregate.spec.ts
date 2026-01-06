import {
  Product,
  ProductAvailability,
  ProductStatus,
} from '../src/domain/aggregates/product.aggregate';

describe('Product Aggregate', () => {
  describe('Stock Management', () => {
    it('should create product with default stock', () => {
      const product = Product.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        currency: 'EUR',
        categoryId: 'cat-123',
        artisanId: 'artisan-123',
      });

      expect(product.stock).toBe(0);
      expect(product.isInStock()).toBe(false);
    });

    it('should create product with specified stock', () => {
      const product = Product.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        currency: 'EUR',
        categoryId: 'cat-123',
        artisanId: 'artisan-123',
        stock: 10,
      });

      expect(product.stock).toBe(10);
      expect(product.isInStock()).toBe(true);
    });

    it('should add stock correctly', () => {
      const product = Product.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        currency: 'EUR',
        categoryId: 'cat-123',
        artisanId: 'artisan-123',
        stock: 5,
      });

      product.addStock(3);
      expect(product.stock).toBe(8);
      expect(product.isInStock()).toBe(true);
    });

    it('should remove stock correctly', () => {
      const product = Product.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        currency: 'EUR',
        categoryId: 'cat-123',
        artisanId: 'artisan-123',
        stock: 10,
      });

      product.removeStock(3);
      expect(product.stock).toBe(7);
      expect(product.isInStock()).toBe(true);
    });

    it('should detect low stock', () => {
      const product = Product.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        currency: 'EUR',
        categoryId: 'cat-123',
        artisanId: 'artisan-123',
        stock: 2,
      });

      expect(product.isLowStock()).toBe(true);
    });

    it('should update availability when stock changes', () => {
      const product = Product.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        currency: 'EUR',
        categoryId: 'cat-123',
        artisanId: 'artisan-123',
        stock: 10,
      });

      expect(product.availability).toBe('IN_STOCK');

      product.removeStock(10); // Stock becomes 0
      expect(product.availability).toBe('OUT_OF_STOCK');

      product.addStock(15); // Stock becomes 15
      expect(product.availability).toBe('IN_STOCK');
    });
  });

  describe('ProductCategory', () => {
    it('should create product with default category', () => {
      const product = Product.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        currency: 'EUR',
        categoryId: 'cat-123',
        artisanId: 'artisan-123',
      });

      expect(product.category).toBe('other');
    });

    it('should create product with specified category', () => {
      const product = Product.create({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        currency: 'EUR',
        categoryId: 'cat-123',
        artisanId: 'artisan-123',
        category: 'CERAMICS',
      });

      expect(product.category).toBe('ceramics');
    });
  });

  describe('Reconstruction', () => {
    it('should reconstruct product with stock and category', () => {
      const product = Product.reconstruct({
        id: 'prod-123',
        productId: 'prod-123',
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        currency: 'EUR',
        categoryId: 'cat-123',
        category: 'TEXTILES',
        stock: 25,
        artisanId: 'artisan-123',
        status: ProductStatus.ACTIVE,
        availability: ProductAvailability.IN_STOCK,
        isHandmade: true,
        isCustomizable: false,
        isDigital: false,
        requiresShipping: true,
        keywords: [],
        metaTitle: 'Test Product',
        metaDescription: 'Test Description',
        craftingTimeHours: 5,
        sustainabilityScore: 85,
        materials: ['cotton'],
        variants: [],
        images: [],
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(product.stock).toBe(25);
      expect(product.category).toBe('textiles');
      expect(product.isInStock()).toBe(true);
    });

    it('should reconstruct with default values', () => {
      const product = Product.reconstruct({
        id: 'prod-123',
        productId: 'prod-123',
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        currency: 'EUR',
        categoryId: 'cat-123',
        artisanId: 'artisan-123',
        status: ProductStatus.ACTIVE,
        availability: ProductAvailability.IN_STOCK,
        isHandmade: true,
        isCustomizable: false,
        isDigital: false,
        requiresShipping: true,
        keywords: [],
        metaTitle: 'Test Product',
        metaDescription: 'Test Description',
        craftingTimeHours: 5,
        sustainabilityScore: 85,
        materials: ['cotton'],
        variants: [],
        images: [],
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(product.stock).toBe(0);
      expect(product.category).toBe('other');
    });
  });
});
