import { CheckInventoryUseCase } from './check-inventory.use-case';
import { Product } from '../../domain/entities/product.entity';

describe('CheckInventoryUseCase', () => {
  let useCase: CheckInventoryUseCase;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      findByIds: jest.fn(),
    };
    useCase = new CheckInventoryUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should return inventory details for valid product', async () => {
      const mockProduct = Product.create({
        name: 'Test Product',
        sku: 'TEST-001',
        category: 'Test',
        unitPrice: 29.99,
        currency: 'EUR',
        currentStock: 100,
        reservedStock: 10,
        minimumStock: 20,
        maximumStock: 500,
        isActive: true,
        artisanId: 'artisan-123',
      });

      mockRepository.findById.mockResolvedValue(mockProduct);

      const result = await useCase.execute({ productId: 'test-id' });

      expect(result).toMatchObject({
        productId: mockProduct.id,
        name: 'Test Product',
        sku: 'TEST-001',
        currentStock: 100,
        reservedStock: 10,
        availableStock: 90,
        stockStatus: 'in_stock',
        needsRestock: false,
      });
      expect(mockRepository.findById).toHaveBeenCalledWith('test-id');
    });

    it('should throw error when product not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        useCase.execute({ productId: 'invalid-id' })
      ).rejects.toThrow('Product with id invalid-id not found');
    });

    it('should indicate low stock correctly', async () => {
      const mockProduct = Product.create({
        name: 'Low Stock Product',
        sku: 'LOW-001',
        category: 'Test',
        unitPrice: 19.99,
        currency: 'EUR',
        currentStock: 25,
        reservedStock: 5,
        minimumStock: 20,
        maximumStock: 100,
        isActive: true,
        artisanId: 'artisan-123',
      });

      mockRepository.findById.mockResolvedValue(mockProduct);

      const result = await useCase.execute({ productId: 'test-id' });

      expect(result.stockStatus).toBe('low_stock');
      expect(result.needsRestock).toBe(true);
    });
  });

  describe('executeBulk', () => {
    it('should return empty result for empty product IDs', async () => {
      const result = await useCase.executeBulk({ productIds: [] });

      expect(result).toEqual({
        products: [],
        summary: {
          totalProducts: 0,
          inStock: 0,
          lowStock: 0,
          outOfStock: 0,
          discontinued: 0,
        },
      });
    });

    it('should return inventory for multiple products', async () => {
      const products = [
        Product.create({
          ...baseProps,
          name: 'Product 1',
          currentStock: 100,
          reservedStock: 10,
          minimumStock: 20,
        }),
        Product.create({
          ...baseProps,
          name: 'Product 2',
          currentStock: 15,
          reservedStock: 0,
          minimumStock: 20,
        }),
        Product.create({
          ...baseProps,
          name: 'Product 3',
          currentStock: 0,
          reservedStock: 0,
        }),
      ];

      mockRepository.findByIds.mockResolvedValue(products);

      const result = await useCase.executeBulk({
        productIds: ['id1', 'id2', 'id3'],
      });

      expect(result.products).toHaveLength(3);
      expect(result.summary).toEqual({
        totalProducts: 3,
        inStock: 1,
        lowStock: 1,
        outOfStock: 1,
        discontinued: 0,
      });
    });
  });
});

