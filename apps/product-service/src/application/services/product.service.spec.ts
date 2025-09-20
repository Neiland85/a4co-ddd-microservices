
import { ProductService, CreateProductDTO } from './product.service';
import { IProductRepository } from '../../../infrastructure/repositories/product.repository';
import { IEventBus } from '@a4co/shared-utils/events/event-bus';
import { Product, Money } from '../../../domain/entities/product.entity';

ddescribe('ProductService', () => {
  let productService: ProductService;
  let productRepository: jest.Mocked<IProductRepository>;
  let eventBus: jest.Mocked<IEventBus>;

  beforeEach(() => {
    productRepository = {
      findBySku: jest.fn(),
      findBySlug: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      delete: jest.fn(),
      findFeatured: jest.fn(),
      findByArtisan: jest.fn(),
      findByCategory: jest.fn(),
      findPublished: jest.fn(),
      search: jest.fn(),
      count: jest.fn(),
    };
    eventBus = {
      publish: jest.fn(),
      subscribe: jest.fn(),
    };
    productService = new ProductService(productRepository, eventBus);
  });

  describe('createProduct', () => {
    it('should create a product successfully', async () => {
      const dto: CreateProductDTO = {
        name: 'Test Product',
        description: 'Test Description',
        sku: 'TEST-001',
        price: 100,
        artisanId: 'artisan-1',
        categoryId: 'category-1',
        slug: 'test-product',
      };

      productRepository.findBySku.mockResolvedValue(null);
      productRepository.findBySlug.mockResolvedValue(null);

      const product = await productService.createProduct(dto);

      expect(product).toBeInstanceOf(Product);
      expect(product.name).toBe(dto.name);
      expect(product.price).toEqual(new Money(dto.price, 'EUR'));
      it('should throw an error if SKU already exists', async () => {
      const dto: CreateProductDTO = {
        name: 'Test Product',
        description: 'Test Description',
        sku: 'TEST-001',
        price: 100,
        artisanId: 'artisan-1',
        categoryId: 'category-1',
        slug: 'test-product',
      };

      productRepository.findBySku.mockResolvedValue({} as Product);

      await expect(productService.createProduct(dto)).rejects.toThrow('Product with SKU \'TEST-001\' already exists');
    });

    it('should throw an error if slug already exists', async () => {
      const dto: CreateProductDTO = {
        name: 'Test Product',
        description: 'Test Description',
        sku: 'TEST-001',
        price: 100,
        artisanId: 'artisan-1',
        categoryId: 'category-1',
        slug: 'test-product',
      };

      productRepository.findBySku.mockResolvedValue(null);
      productRepository.findBySlug.mockResolvedValue({} as Product);

      await expect(productService.createProduct(dto)).rejects.toThrow('Product with slug \'test-product\' already exists');
    });
  });
});
