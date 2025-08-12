import { Product } from '../../../../src/domain/entities/Product';

describe('Product Entity', () => {
  let validProduct: Product;

  beforeEach(() => {
    validProduct = new Product(
      'prod_123',
      'Aceite de Oliva',
      'aceite',
      true,
      12.5,
      'botella 500ml',
      'Aceite de primera presión',
      'Cooperativa San José',
      { municipality: 'Úbeda', coordinates: [38.0138, -3.3706] },
      ['/images/aceite.jpg'],
      ['Denominación de Origen'],
      true,
      150,
      '2024-11-15'
    );
  });

  describe('Constructor', () => {
    it('should create a product with all properties', () => {
      expect(validProduct.id).toBe('prod_123');
      expect(validProduct.name).toBe('Aceite de Oliva');
      expect(validProduct.category).toBe('aceite');
      expect(validProduct.seasonal).toBe(true);
      expect(validProduct.price).toBe(12.5);
      expect(validProduct.unit).toBe('botella 500ml');
      expect(validProduct.description).toBe('Aceite de primera presión');
      expect(validProduct.producer).toBe('Cooperativa San José');
      expect(validProduct.location).toEqual({ municipality: 'Úbeda', coordinates: [38.0138, -3.3706] });
      expect(validProduct.images).toEqual(['/images/aceite.jpg']);
      expect(validProduct.certifications).toEqual(['Denominación de Origen']);
      expect(validProduct.available).toBe(true);
      expect(validProduct.stock).toBe(150);
      expect(validProduct.harvestDate).toBe('2024-11-15');
    });

    it('should create a product with minimal properties', () => {
      const minimalProduct = new Product(
        'prod_456',
        'Queso',
        'queso',
        false
      );

      expect(minimalProduct.id).toBe('prod_456');
      expect(minimalProduct.name).toBe('Queso');
      expect(minimalProduct.category).toBe('queso');
      expect(minimalProduct.seasonal).toBe(false);
      expect(minimalProduct.images).toEqual([]);
      expect(minimalProduct.certifications).toEqual([]);
      expect(minimalProduct.available).toBe(true);
    });
  });

  describe('validate()', () => {
    it('should pass validation for valid product', () => {
      expect(() => validProduct.validate()).not.toThrow();
    });

    it('should throw error when name is empty', () => {
      const invalidProduct = new Product('prod_123', '', 'aceite', true);
      expect(() => invalidProduct.validate()).toThrow('Product name is required');
    });

    it('should throw error when name is only whitespace', () => {
      const invalidProduct = new Product('prod_123', '   ', 'aceite', true);
      expect(() => invalidProduct.validate()).toThrow('Product name is required');
    });

    it('should throw error when category is empty', () => {
      const invalidProduct = new Product('prod_123', 'Aceite', '', true);
      expect(() => invalidProduct.validate()).toThrow('Product category is required');
    });

    it('should throw error when category is only whitespace', () => {
      const invalidProduct = new Product('prod_123', 'Aceite', '   ', true);
      expect(() => invalidProduct.validate()).toThrow('Product category is required');
    });

    it('should throw error when price is negative', () => {
      const invalidProduct = new Product('prod_123', 'Aceite', 'aceite', true, -5);
      expect(() => invalidProduct.validate()).toThrow('Product price cannot be negative');
    });

    it('should not throw error when price is zero', () => {
      const validProduct = new Product('prod_123', 'Aceite', 'aceite', true, 0);
      expect(() => validProduct.validate()).not.toThrow();
    });

    it('should throw error when stock is negative', () => {
      const invalidProduct = new Product('prod_123', 'Aceite', 'aceite', true, 10, 'unit', 'desc', 'producer', {}, [], [], true, -5);
      expect(() => invalidProduct.validate()).toThrow('Product stock cannot be negative');
    });

    it('should not throw error when stock is zero', () => {
      const validProduct = new Product('prod_123', 'Aceite', 'aceite', true, 10, 'unit', 'desc', 'producer', {}, [], [], true, 0);
      expect(() => validProduct.validate()).not.toThrow();
    });
  });

  describe('updateStock()', () => {
    it('should update stock successfully', () => {
      const originalStock = validProduct.stock;
      validProduct.updateStock(200);
      expect(validProduct.stock).toBe(200);
      expect(validProduct.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw error when new stock is negative', () => {
      expect(() => validProduct.updateStock(-10)).toThrow('Stock cannot be negative');
      expect(validProduct.stock).toBe(150); // Stock should remain unchanged
    });

    it('should allow zero stock', () => {
      validProduct.updateStock(0);
      expect(validProduct.stock).toBe(0);
    });
  });

  describe('toggleAvailability()', () => {
    it('should toggle availability from true to false', () => {
      expect(validProduct.available).toBe(true);
      validProduct.toggleAvailability();
      expect(validProduct.available).toBe(false);
      expect(validProduct.updatedAt).toBeInstanceOf(Date);
    });

    it('should toggle availability from false to true', () => {
      validProduct.available = false;
      validProduct.toggleAvailability();
      expect(validProduct.available).toBe(true);
    });
  });

  describe('addImage()', () => {
    it('should add new image', () => {
      const originalImages = [...validProduct.images];
      validProduct.addImage('/images/new-image.jpg');
      expect(validProduct.images).toContain('/images/new-image.jpg');
      expect(validProduct.images).toHaveLength(originalImages.length + 1);
      expect(validProduct.updatedAt).toBeInstanceOf(Date);
    });

    it('should not add duplicate image', () => {
      const originalImages = [...validProduct.images];
      validProduct.addImage('/images/aceite.jpg'); // Already exists
      expect(validProduct.images).toEqual(originalImages);
      expect(validProduct.images).toHaveLength(originalImages.length);
    });
  });

  describe('addCertification()', () => {
    it('should add new certification', () => {
      const originalCertifications = [...validProduct.certifications];
      validProduct.addCertification('Ecológico');
      expect(validProduct.certifications).toContain('Ecológico');
      expect(validProduct.certifications).toHaveLength(originalCertifications.length + 1);
      expect(validProduct.updatedAt).toBeInstanceOf(Date);
    });

    it('should not add duplicate certification', () => {
      const originalCertifications = [...validProduct.certifications];
      validProduct.addCertification('Denominación de Origen'); // Already exists
      expect(validProduct.certifications).toEqual(originalCertifications);
      expect(validProduct.certifications).toHaveLength(originalCertifications.length);
    });
  });
}); 