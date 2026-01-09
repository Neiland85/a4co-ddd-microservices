import {
  ProductImage,
  ProductSpecification,
  ProductCreatedEvent,
  ProductPublishedEvent,
  ProductPriceChangedEvent,
  ProductDiscontinuedEvent,
} from '../src/domain/entities/product.entity';

describe('Product Domain Entities', () => {
  describe('ProductImage', () => {
    it('should import ProductImage class', () => {
      expect(ProductImage).toBeDefined();
    });
  });

  describe('ProductSpecification', () => {
    it('should import ProductSpecification class', () => {
      expect(ProductSpecification).toBeDefined();
    });
  });

  describe('ProductCreatedEvent', () => {
    it('should import ProductCreatedEvent class', () => {
      expect(ProductCreatedEvent).toBeDefined();
    });
  });

  describe('ProductPublishedEvent', () => {
    it('should import ProductPublishedEvent class', () => {
      expect(ProductPublishedEvent).toBeDefined();
    });
  });

  describe('ProductPriceChangedEvent', () => {
    it('should import ProductPriceChangedEvent class', () => {
      expect(ProductPriceChangedEvent).toBeDefined();
    });
  });

  describe('ProductDiscontinuedEvent', () => {
    it('should import ProductDiscontinuedEvent class', () => {
      expect(ProductDiscontinuedEvent).toBeDefined();
    });
  });
});
