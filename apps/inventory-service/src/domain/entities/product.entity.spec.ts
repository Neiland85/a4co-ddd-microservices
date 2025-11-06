import { Product } from './product.entity';
import { StockQuantity, SKU } from '../value-objects';
import {
  InventoryReservedEvent,
  InventoryOutOfStockEvent,
  LowStockEvent,
  InventoryReleasedEvent,
  StockDeductedEvent,
} from '../events';

describe('Product Aggregate', () => {
  const createProduct = (overrides?: Partial<any>) => {
    return Product.create({
      name: 'Test Product',
      description: 'Test Description',
      sku: 'INV-1234',
      category: 'Test Category',
      unitPrice: 10.99,
      currency: 'USD',
      currentStock: 100,
      reservedStock: 0,
      minimumStock: 10,
      maximumStock: 1000,
      reorderPoint: 20,
      reorderQuantity: 50,
      isActive: true,
      artisanId: 'artisan_001',
      ...overrides,
    });
  };

  describe('reserveStock', () => {
    it('should reserve stock successfully and emit InventoryReservedEvent', () => {
      const product = createProduct({ currentStock: 100, reservedStock: 0 });
      const orderId = 'order_123';
      const quantity = StockQuantity.create(10);

      product.reserveStock(quantity, orderId);

      expect(product.reservedStock).toBe(10);
      expect(product.availableStock).toBe(90);

      const events = product.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(InventoryReservedEvent);
      expect(events[0].eventData.orderId).toBe(orderId);
      expect(events[0].eventData.quantity).toBe(10);
    });

    it('should throw error and emit InventoryOutOfStockEvent when insufficient stock', () => {
      const product = createProduct({ currentStock: 10, reservedStock: 0 });
      const orderId = 'order_123';
      const quantity = StockQuantity.create(20);

      expect(() => {
        product.reserveStock(quantity, orderId);
      }).toThrow('Cannot reserve');

      const events = product.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(InventoryOutOfStockEvent);
    });

    it('should emit LowStockEvent when stock falls below reorder point', () => {
      const product = createProduct({
        currentStock: 30,
        reservedStock: 0,
        reorderPoint: 20,
      });
      const orderId = 'order_123';
      const quantity = StockQuantity.create(15); // Stock quedará en 15, por debajo de reorderPoint

      product.reserveStock(quantity, orderId);

      const events = product.getUncommittedEvents();
      expect(events.length).toBeGreaterThanOrEqual(2);
      expect(events.some(e => e instanceof InventoryReservedEvent)).toBe(true);
      expect(events.some(e => e instanceof LowStockEvent)).toBe(true);
    });
  });

  describe('releaseStock', () => {
    it('should release stock and emit InventoryReleasedEvent', () => {
      const product = createProduct({ currentStock: 100, reservedStock: 20 });
      const orderId = 'order_123';
      const quantity = StockQuantity.create(10);
      const reason = 'Order cancelled';

      product.releaseStock(quantity, orderId, reason);

      expect(product.reservedStock).toBe(10);
      expect(product.availableStock).toBe(90);

      const events = product.getUncommittedEvents();
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(InventoryReleasedEvent);
      expect(events[0].eventData.orderId).toBe(orderId);
      expect(events[0].eventData.reason).toBe(reason);
    });

    it('should throw error when trying to release more than reserved', () => {
      const product = createProduct({ currentStock: 100, reservedStock: 10 });
      const quantity = StockQuantity.create(20);

      expect(() => {
        product.releaseStock(quantity, 'order_123', 'test');
      }).toThrow('Cannot release');
    });
  });

  describe('confirmReservation', () => {
    it('should deduct stock and emit StockDeductedEvent', () => {
      const product = createProduct({ currentStock: 100, reservedStock: 20 });
      const orderId = 'order_123';
      const quantity = StockQuantity.create(10);

      product.confirmReservation(quantity, orderId);

      expect(product.currentStock).toBe(90);
      expect(product.reservedStock).toBe(10);
      expect(product.availableStock).toBe(80);

      const events = product.getUncommittedEvents();
      expect(events.length).toBeGreaterThanOrEqual(1);
      expect(events.some(e => e instanceof StockDeductedEvent)).toBe(true);
    });
  });

  describe('computed properties', () => {
    it('should calculate availableStock correctly', () => {
      const product = createProduct({ currentStock: 100, reservedStock: 30 });
      expect(product.availableStock).toBe(70);
    });

    it('should return correct stockStatus', () => {
      const inStock = createProduct({ currentStock: 100, reservedStock: 0 });
      expect(inStock.stockStatus).toBe('in_stock');

      const lowStock = createProduct({
        currentStock: 15,
        reservedStock: 0,
        reorderPoint: 20,
      });
      expect(lowStock.stockStatus).toBe('low_stock');

      const outOfStock = createProduct({ currentStock: 10, reservedStock: 10 });
      expect(outOfStock.stockStatus).toBe('out_of_stock');
    });

    it('should detect needsRestock correctly', () => {
      const product = createProduct({
        currentStock: 15,
        reservedStock: 0,
        reorderPoint: 20,
      });
      expect(product.needsRestock).toBe(true);
    });
  });

  describe('value objects', () => {
    it('should use ProductId value object', () => {
      const product = createProduct();
      expect(product.productId).toBeDefined();
      expect(product.productId.value).toBe(product.id);
    });

    it('should use SKU value object', () => {
      const product = createProduct({ sku: 'INV-5678' });
      expect(product.sku).toBeInstanceOf(SKU);
      expect(product.sku.value).toBe('INV-5678');
    });

    it('should use StockQuantity value objects', () => {
      const product = createProduct({ currentStock: 100, reservedStock: 20 });
      expect(product.stock).toBeInstanceOf(StockQuantity);
      expect(product.reservedStockQuantity).toBeInstanceOf(StockQuantity);
      expect(product.availableStockQuantity).toBeInstanceOf(StockQuantity);
    });
  });
});
