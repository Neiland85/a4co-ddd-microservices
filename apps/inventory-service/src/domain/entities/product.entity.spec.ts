import { Product, ProductProps } from './product.entity';

describe('Product Entity', () => {
  const baseProps: Omit<ProductProps, 'id' | 'createdAt' | 'updatedAt'> = {
    name: 'Test Product',
    description: 'Test Description',
    sku: 'TEST-SKU-001',
    category: 'Test Category',
    brand: 'Test Brand',
    unitPrice: 29.99,
    currency: 'EUR',
    currentStock: 100,
    reservedStock: 10,
    minimumStock: 20,
    maximumStock: 500,
    isActive: true,
    artisanId: 'artisan-123',
  };

  describe('Product Creation', () => {
    it('should create a product with valid properties', () => {
      const product = Product.create(baseProps);

      expect(product.name).toBe(baseProps.name);
      expect(product.sku).toBe(baseProps.sku);
      expect(product.currentStock).toBe(100);
      expect(product.isActive).toBe(true);
      expect(product.id).toBeDefined();
      expect(product.createdAt).toBeInstanceOf(Date);
    });

    it('should generate unique IDs for different products', () => {
      const product1 = Product.create(baseProps);
      const product2 = Product.create(baseProps);

      expect(product1.id).not.toBe(product2.id);
    });
  });

  describe('Available Stock Calculation', () => {
    it('should calculate available stock correctly', () => {
      const product = Product.create(baseProps);

      expect(product.availableStock).toBe(90); // 100 - 10
    });

    it('should return 0 when all stock is reserved', () => {
      const product = Product.create({
        ...baseProps,
        currentStock: 50,
        reservedStock: 50,
      });

      expect(product.availableStock).toBe(0);
    });
  });

  describe('Stock Status', () => {
    it('should return "in_stock" when stock is above minimum', () => {
      const product = Product.create({
        ...baseProps,
        currentStock: 100,
        reservedStock: 10,
        minimumStock: 20,
      });

      expect(product.stockStatus).toBe('in_stock');
    });

    it('should return "low_stock" when available stock equals minimum', () => {
      const product = Product.create({
        ...baseProps,
        currentStock: 30,
        reservedStock: 10,
        minimumStock: 20,
      });

      expect(product.stockStatus).toBe('low_stock');
    });

    it('should return "out_of_stock" when available stock is 0', () => {
      const product = Product.create({
        ...baseProps,
        currentStock: 10,
        reservedStock: 10,
      });

      expect(product.stockStatus).toBe('out_of_stock');
    });

    it('should return "discontinued" when product is inactive', () => {
      const product = Product.create({
        ...baseProps,
        isActive: false,
      });

      expect(product.stockStatus).toBe('discontinued');
    });
  });

  describe('Stock Reservation', () => {
    it('should reserve stock when sufficient quantity available', () => {
      const product = Product.create(baseProps);
      const initialReserved = product.reservedStock;

      product.reserveStock(20);

      expect(product.reservedStock).toBe(initialReserved + 20);
      expect(product.availableStock).toBe(70); // 100 - 10 - 20
    });

    it('should throw error when trying to reserve more than available', () => {
      const product = Product.create({
        ...baseProps,
        currentStock: 50,
        reservedStock: 40,
      });

      expect(() => product.reserveStock(20)).toThrow(
        'Cannot reserve 20 units. Available: 10'
      );
    });

    it('should not reserve stock for inactive products', () => {
      const product = Product.create({
        ...baseProps,
        isActive: false,
      });

      expect(() => product.reserveStock(10)).toThrow();
    });
  });

  describe('Stock Release', () => {
    it('should release reserved stock', () => {
      const product = Product.create(baseProps);

      product.releaseStock(5);

      expect(product.reservedStock).toBe(5);
      expect(product.availableStock).toBe(95);
    });

    it('should throw error when trying to release more than reserved', () => {
      const product = Product.create({
        ...baseProps,
        reservedStock: 5,
      });

      expect(() => product.releaseStock(10)).toThrow(
        'Cannot release 10 units. Reserved: 5'
      );
    });
  });

  describe('Stock Updates', () => {
    it('should update stock to new value', () => {
      const product = Product.create(baseProps);

      product.updateStock(150, 'Inventory recount');

      expect(product.currentStock).toBe(150);
    });

    it('should throw error when setting negative stock', () => {
      const product = Product.create(baseProps);

      expect(() => product.updateStock(-10, 'Test')).toThrow(
        'Stock cannot be negative'
      );
    });

    it('should adjust stock by positive amount', () => {
      const product = Product.create(baseProps);

      product.adjustStock(50, 'New shipment arrived');

      expect(product.currentStock).toBe(150);
    });

    it('should adjust stock by negative amount', () => {
      const product = Product.create(baseProps);

      product.adjustStock(-30, 'Damaged units');

      expect(product.currentStock).toBe(70);
    });
  });

  describe('Product Activation', () => {
    it('should deactivate product', () => {
      const product = Product.create(baseProps);

      product.deactivate();

      expect(product.isActive).toBe(false);
      expect(product.stockStatus).toBe('discontinued');
    });

    it('should activate product', () => {
      const product = Product.create({
        ...baseProps,
        isActive: false,
      });

      product.activate();

      expect(product.isActive).toBe(true);
    });
  });

  describe('Pricing Updates', () => {
    it('should update product price', () => {
      const product = Product.create(baseProps);

      product.updatePricing(39.99);

      expect(product.unitPrice).toBe(39.99);
    });

    it('should update price and currency', () => {
      const product = Product.create(baseProps);

      product.updatePricing(25.99, 'USD');

      expect(product.unitPrice).toBe(25.99);
      expect(product.currency).toBe('USD');
    });

    it('should throw error for negative price', () => {
      const product = Product.create(baseProps);

      expect(() => product.updatePricing(-10)).toThrow(
        'Price cannot be negative'
      );
    });
  });

  describe('Serialization', () => {
    it('should serialize to JSON correctly', () => {
      const product = Product.create(baseProps);
      const json = product.toJSON();

      expect(json).toMatchObject({
        name: baseProps.name,
        sku: baseProps.sku,
        currentStock: baseProps.currentStock,
        isActive: baseProps.isActive,
      });
      expect(json.id).toBeDefined();
      expect(json.createdAt).toBeInstanceOf(Date);
    });
  });

  describe('Needs Restock', () => {
    it('should indicate restock needed when below minimum', () => {
      const product = Product.create({
        ...baseProps,
        currentStock: 25,
        reservedStock: 10,
        minimumStock: 20,
      });

      expect(product.needsRestock).toBe(true);
    });

    it('should not need restock when above minimum', () => {
      const product = Product.create({
        ...baseProps,
        currentStock: 100,
        reservedStock: 10,
        minimumStock: 20,
      });

      expect(product.needsRestock).toBe(false);
    });
  });
});

