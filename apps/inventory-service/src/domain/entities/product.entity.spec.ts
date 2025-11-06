import { Product } from '../entities/product.entity';
import { ProductId } from '../value-objects/product-id.vo';
import { StockQuantity } from '../value-objects/stock-quantity.vo';
import { SKU } from '../value-objects/sku.vo';
import {
  InventoryReservedEvent,
  InventoryOutOfStockEvent,
  InventoryReleasedEvent,
  StockDeductedEvent,
  LowStockEvent,
} from '../events';

describe('Product Aggregate', () => {
  let product: Product;

  beforeEach(() => {
    product = Product.create({
      name: 'Test Product',
      description: 'Test Description',
      sku: 'INV-1234',
      category: 'Test Category',
      unitPrice: 10.99,
      currency: 'USD',
      stock: 100,
      reservedStock: 0,
      minimumStock: 10,
      maximumStock: 1000,
      reorderPoint: 20,
      reorderQuantity: 50,
      isActive: true,
      artisanId: 'artisan-123',
    });
  });

  describe('Creation', () => {
    it('should create a Product aggregate', () => {
      expect(product).toBeDefined();
      expect(product.id).toBeInstanceOf(ProductId);
      expect(product.name).toBe('Test Product');
      expect(product.stock.value).toBe(100);
    });

    it('should calculate availableStock correctly', () => {
      expect(product.availableStock.value).toBe(100);
      product.reserveStock(StockQuantity.create(30), 'order-123');
      expect(product.availableStock.value).toBe(70);
    });

    it('should determine stockStatus correctly', () => {
      expect(product.stockStatus).toBe('in_stock');
      product.reserveStock(StockQuantity.create(95), 'order-123');
      expect(product.stockStatus).toBe('low_stock');
    });
  });

  describe('Stock Reservation', () => {
    it('should reserve stock successfully', () => {
      const quantity = StockQuantity.create(20);
      product.reserveStock(quantity, 'order-123');

      expect(product.reservedStock.value).toBe(20);
      expect(product.availableStock.value).toBe(80);
      expect(product.getUncommittedEvents().length).toBeGreaterThan(0);
      expect(
        product.getUncommittedEvents().some(e => e instanceof InventoryReservedEvent)
      ).toBe(true);
    });

    it('should emit InventoryReservedEvent when stock is reserved', () => {
      const quantity = StockQuantity.create(20);
      product.reserveStock(quantity, 'order-123');

      const events = product.getUncommittedEvents();
      const reservedEvent = events.find(e => e instanceof InventoryReservedEvent);
      expect(reservedEvent).toBeDefined();
      expect(reservedEvent?.eventData.orderId).toBe('order-123');
    });

    it('should throw error when trying to reserve more than available', () => {
      const quantity = StockQuantity.create(150);
      expect(() => product.reserveStock(quantity, 'order-123')).toThrow();
    });

    it('should emit InventoryOutOfStockEvent when stock is insufficient', () => {
      const quantity = StockQuantity.create(150);
      try {
        product.reserveStock(quantity, 'order-123');
      } catch (error) {
        // Expected to throw
      }

      const events = product.getUncommittedEvents();
      const outOfStockEvent = events.find(e => e instanceof InventoryOutOfStockEvent);
      expect(outOfStockEvent).toBeDefined();
    });

    it('should emit LowStockEvent when stock falls below reorderPoint', () => {
      // Reserve enough to trigger low stock
      const quantity = StockQuantity.create(85); // 100 - 85 = 15, which is < 20 (reorderPoint)
      product.reserveStock(quantity, 'order-123');

      const events = product.getUncommittedEvents();
      const lowStockEvent = events.find(e => e instanceof LowStockEvent);
      expect(lowStockEvent).toBeDefined();
    });
  });

  describe('Stock Release', () => {
    beforeEach(() => {
      product.reserveStock(StockQuantity.create(30), 'order-123');
      product.clearEvents();
    });

    it('should release stock successfully', () => {
      const quantity = StockQuantity.create(20);
      product.releaseStock(quantity, 'order-123', 'Cancelled');

      expect(product.reservedStock.value).toBe(10);
      expect(product.availableStock.value).toBe(90);
      expect(
        product.getUncommittedEvents().some(e => e instanceof InventoryReleasedEvent)
      ).toBe(true);
    });

    it('should emit InventoryReleasedEvent when stock is released', () => {
      const quantity = StockQuantity.create(20);
      product.releaseStock(quantity, 'order-123', 'Cancelled');

      const events = product.getUncommittedEvents();
      const releasedEvent = events.find(e => e instanceof InventoryReleasedEvent);
      expect(releasedEvent).toBeDefined();
      expect(releasedEvent?.eventData.reason).toBe('Cancelled');
    });

    it('should throw error when trying to release more than reserved', () => {
      const quantity = StockQuantity.create(50);
      expect(() => product.releaseStock(quantity, 'order-123', 'Test')).toThrow();
    });
  });

  describe('Stock Confirmation', () => {
    beforeEach(() => {
      product.reserveStock(StockQuantity.create(30), 'order-123');
      product.clearEvents();
    });

    it('should confirm reservation and deduct stock', () => {
      const quantity = StockQuantity.create(20);
      product.confirmReservation(quantity, 'order-123');

      expect(product.stock.value).toBe(80);
      expect(product.reservedStock.value).toBe(10);
      expect(
        product.getUncommittedEvents().some(e => e instanceof StockDeductedEvent)
      ).toBe(true);
    });

    it('should emit StockDeductedEvent when reservation is confirmed', () => {
      const quantity = StockQuantity.create(20);
      product.confirmReservation(quantity, 'order-123');

      const events = product.getUncommittedEvents();
      const deductedEvent = events.find(e => e instanceof StockDeductedEvent);
      expect(deductedEvent).toBeDefined();
    });

    it('should throw error when trying to confirm more than reserved', () => {
      const quantity = StockQuantity.create(50);
      expect(() => product.confirmReservation(quantity, 'order-123')).toThrow();
    });
  });

  describe('Event Management', () => {
    it('should track uncommitted events', () => {
      product.reserveStock(StockQuantity.create(20), 'order-123');
      expect(product.getUncommittedEvents().length).toBeGreaterThan(0);
    });

    it('should clear events after publishing', () => {
      product.reserveStock(StockQuantity.create(20), 'order-123');
      expect(product.getUncommittedEvents().length).toBeGreaterThan(0);

      product.clearEvents();
      expect(product.getUncommittedEvents().length).toBe(0);
    });
  });
});
