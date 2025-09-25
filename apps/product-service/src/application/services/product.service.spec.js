"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_service_1 = require("./product.service");
const product_entity_1 = require("../../../domain/entities/product.entity");
describe('ProductService', () => {
    let productService;
    let productRepository;
    let eventBus;
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
        productService = new product_service_1.ProductService(productRepository, eventBus);
    });
    describe('createProduct', () => {
        it('should create a product successfully', async () => {
            const dto = {
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
            expect(product).toBeInstanceOf(product_entity_1.Product);
            expect(product.name).toBe(dto.name);
            expect(product.price).toEqual(new product_entity_1.Money(dto.price, 'EUR'));
        });
        it('should throw an error if SKU already exists', async () => {
            const dto = {
                name: 'Test Product',
                description: 'Test Description',
                sku: 'TEST-001',
                price: 100,
                artisanId: 'artisan-1',
                categoryId: 'category-1',
                slug: 'test-product',
            };
            productRepository.findBySku.mockResolvedValue({});
            await expect(productService.createProduct(dto)).rejects.toThrow('Product with SKU \'TEST-001\' already exists');
        });
        it('should throw an error if slug already exists', async () => {
            const dto = {
                name: 'Test Product',
                description: 'Test Description',
                sku: 'TEST-001',
                price: 100,
                artisanId: 'artisan-1',
                categoryId: 'category-1',
                slug: 'test-product',
            };
            productRepository.findBySku.mockResolvedValue(null);
            productRepository.findBySlug.mockResolvedValue({});
            await expect(productService.createProduct(dto)).rejects.toThrow('Product with slug \'test-product\' already exists');
        });
    });
});
//# sourceMappingURL=product.service.spec.js.map