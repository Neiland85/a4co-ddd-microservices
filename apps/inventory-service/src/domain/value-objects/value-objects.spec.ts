import { ProductId } from '../value-objects/product-id.vo';
import { StockQuantity } from '../value-objects/stock-quantity.vo';
import { SKU } from '../value-objects/sku.vo';
import { WarehouseLocation } from '../value-objects/warehouse-location.vo';

describe('Value Objects', () => {
  describe('ProductId', () => {
    it('should create a valid ProductId', () => {
      const id = ProductId.create('product-123');
      expect(id.value).toBe('product-123');
    });

    it('should throw error for empty ProductId', () => {
      expect(() => ProductId.create('')).toThrow('ProductId cannot be empty');
    });

    it('should create ProductId from UUID', () => {
      const uuid = '123e4567-e89b-12d3-a456-426614174000';
      const id = ProductId.fromUUID(uuid);
      expect(id.value).toBe(uuid);
    });

    it('should throw error for invalid UUID', () => {
      expect(() => ProductId.fromUUID('invalid-uuid')).toThrow('Invalid UUID format');
    });

    it('should compare ProductIds correctly', () => {
      const id1 = ProductId.create('product-123');
      const id2 = ProductId.create('product-123');
      const id3 = ProductId.create('product-456');
      expect(id1.equals(id2)).toBe(true);
      expect(id1.equals(id3)).toBe(false);
    });
  });

  describe('StockQuantity', () => {
    it('should create a valid StockQuantity', () => {
      const quantity = StockQuantity.create(10);
      expect(quantity.value).toBe(10);
    });

    it('should throw error for negative quantity', () => {
      expect(() => StockQuantity.create(-1)).toThrow('Stock quantity cannot be negative');
    });

    it('should create zero StockQuantity', () => {
      const quantity = StockQuantity.zero();
      expect(quantity.value).toBe(0);
    });

    it('should add StockQuantities', () => {
      const q1 = StockQuantity.create(10);
      const q2 = StockQuantity.create(5);
      const result = q1.add(q2);
      expect(result.value).toBe(15);
    });

    it('should subtract StockQuantities', () => {
      const q1 = StockQuantity.create(10);
      const q2 = StockQuantity.create(3);
      const result = q1.subtract(q2);
      expect(result.value).toBe(7);
    });

    it('should throw error when subtracting more than available', () => {
      const q1 = StockQuantity.create(10);
      const q2 = StockQuantity.create(15);
      expect(() => q1.subtract(q2)).toThrow('Cannot subtract: result would be negative');
    });

    it('should compare StockQuantities correctly', () => {
      const q1 = StockQuantity.create(10);
      const q2 = StockQuantity.create(5);
      expect(q1.isGreaterThan(q2)).toBe(true);
      expect(q2.isLessThan(q1)).toBe(true);
    });
  });

  describe('SKU', () => {
    it('should create a valid SKU', () => {
      const sku = SKU.create('INV-1234');
      expect(sku.value).toBe('INV-1234');
    });

    it('should throw error for invalid SKU format', () => {
      expect(() => SKU.create('invalid')).toThrow('SKU must match pattern');
      expect(() => SKU.create('inv-1234')).toThrow('SKU must match pattern');
      expect(() => SKU.create('INV-12')).toThrow('SKU must match pattern');
    });

    it('should validate SKU format', () => {
      expect(SKU.validate('INV-1234')).toBe(true);
      expect(SKU.validate('ABC-9999')).toBe(true);
      expect(SKU.validate('invalid')).toBe(false);
    });

    it('should compare SKUs correctly', () => {
      const sku1 = SKU.create('INV-1234');
      const sku2 = SKU.create('INV-1234');
      const sku3 = SKU.create('INV-5678');
      expect(sku1.equals(sku2)).toBe(true);
      expect(sku1.equals(sku3)).toBe(false);
    });
  });

  describe('WarehouseLocation', () => {
    it('should create a valid WarehouseLocation', () => {
      const location = WarehouseLocation.create('Warehouse-A');
      expect(location.warehouse).toBe('Warehouse-A');
    });

    it('should create WarehouseLocation with aisle and shelf', () => {
      const location = WarehouseLocation.create('Warehouse-A', 'A1', 'S2');
      expect(location.warehouse).toBe('Warehouse-A');
      expect(location.aisle).toBe('A1');
      expect(location.shelf).toBe('S2');
    });

    it('should throw error for empty warehouse', () => {
      expect(() => WarehouseLocation.create('')).toThrow('Warehouse name cannot be empty');
    });

    it('should format location string correctly', () => {
      const location = WarehouseLocation.create('Warehouse-A', 'A1', 'S2');
      expect(location.toString()).toContain('Warehouse-A');
      expect(location.toString()).toContain('A1');
      expect(location.toString()).toContain('S2');
    });

    it('should compare WarehouseLocations correctly', () => {
      const loc1 = WarehouseLocation.create('Warehouse-A', 'A1', 'S2');
      const loc2 = WarehouseLocation.create('Warehouse-A', 'A1', 'S2');
      const loc3 = WarehouseLocation.create('Warehouse-B');
      expect(loc1.equals(loc2)).toBe(true);
      expect(loc1.equals(loc3)).toBe(false);
    });
  });
});
