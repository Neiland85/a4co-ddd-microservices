import { ProductId } from '../../../../src/domain/value-objects/ProductId';

describe('ProductId Value Object', () => {
  describe('Constructor', () => {
    it('should create ProductId with valid format', () => {
      const productId = new ProductId('prod_123');
      expect(productId.id).toBe('prod_123');
    });

    it('should create ProductId with underscore', () => {
      const productId = new ProductId('prod_123_456');
      expect(productId.id).toBe('prod_123_456');
    });

    it('should create ProductId with hyphen', () => {
      const productId = new ProductId('prod_123-456');
      expect(productId.id).toBe('prod_123-456');
    });

    it('should create ProductId with numbers', () => {
      const productId = new ProductId('prod_123456');
      expect(productId.id).toBe('prod_123456');
    });

    it('should create ProductId with mixed characters', () => {
      const productId = new ProductId('prod_abc123_def-456');
      expect(productId.id).toBe('prod_abc123_def-456');
    });
  });

  describe('Validation', () => {
    it('should throw error when id is empty', () => {
      expect(() => new ProductId('')).toThrow('Product ID cannot be empty');
    });

    it('should throw error when id is only whitespace', () => {
      expect(() => new ProductId('   ')).toThrow('Product ID cannot be empty');
    });

    it('should throw error when id does not start with prod_', () => {
      expect(() => new ProductId('product_123')).toThrow('Invalid Product ID format');
    });

    it('should throw error when id starts with PROD_', () => {
      expect(() => new ProductId('PROD_123')).toThrow('Invalid Product ID format');
    });

    it('should throw error when id contains special characters', () => {
      expect(() => new ProductId('prod_123@456')).toThrow('Invalid Product ID format');
    });

    it('should throw error when id contains spaces', () => {
      expect(() => new ProductId('prod_123 456')).toThrow('Invalid Product ID format');
    });

    it('should throw error when id contains dots', () => {
      expect(() => new ProductId('prod_123.456')).toThrow('Invalid Product ID format');
    });

    it('should throw error when id contains slashes', () => {
      expect(() => new ProductId('prod_123/456')).toThrow('Invalid Product ID format');
    });
  });

  describe('equals()', () => {
    it('should return true for same ProductId', () => {
      const productId1 = new ProductId('prod_123');
      const productId2 = new ProductId('prod_123');
      expect(productId1.equals(productId2)).toBe(true);
    });

    it('should return false for different ProductId', () => {
      const productId1 = new ProductId('prod_123');
      const productId2 = new ProductId('prod_456');
      expect(productId1.equals(productId2)).toBe(false);
    });

    it('should return false when comparing with null', () => {
      const productId = new ProductId('prod_123');
      expect(productId.equals(null as any)).toBe(false);
    });
  });

  describe('toString()', () => {
    it('should return the id as string', () => {
      const productId = new ProductId('prod_123');
      expect(productId.toString()).toBe('prod_123');
    });
  });

  describe('generate()', () => {
    it('should generate a valid ProductId', () => {
      const productId = ProductId.generate();
      expect(productId).toBeInstanceOf(ProductId);
      expect(productId.id).toMatch(/^prod_\d+_[a-z0-9]+$/);
    });

    it('should generate unique ProductIds', () => {
      const productId1 = ProductId.generate();
      const productId2 = ProductId.generate();
      expect(productId1.equals(productId2)).toBe(false);
    });

    it('should generate ProductId with timestamp and random string', () => {
      const productId = ProductId.generate();
      const parts = productId.id.split('_');
      expect(parts).toHaveLength(3);
      expect(parts[0]).toBe('prod');
      expect(parts[1]).toMatch(/^\d+$/); // timestamp
      expect(parts[2]).toMatch(/^[a-z0-9]+$/); // random string
    });

    it('should generate ProductId with different timestamps', () => {
      const productId1 = ProductId.generate();
      // Simulate time passing
      jest.advanceTimersByTime(1000);
      const productId2 = ProductId.generate();
      expect(productId1.id).not.toBe(productId2.id);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long valid ProductId', () => {
      const longId = 'prod_' + 'a'.repeat(100);
      const productId = new ProductId(longId);
      expect(productId.id).toBe(longId);
    });

    it('should handle ProductId with only prod_ prefix', () => {
      const productId = new ProductId('prod_');
      expect(productId.id).toBe('prod_');
    });

    it('should handle ProductId with single character after prefix', () => {
      const productId = new ProductId('prod_a');
      expect(productId.id).toBe('prod_a');
    });
  });
}); 