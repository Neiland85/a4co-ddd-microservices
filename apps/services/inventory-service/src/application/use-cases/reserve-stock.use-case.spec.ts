import { ReserveStockUseCase } from './reserve-stock.use-case';
import { Product } from '../../domain/entities/product.entity';

describe('ReserveStockUseCase', () => {
  let useCase: ReserveStockUseCase;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      save: jest.fn(),
    };
    useCase = new ReserveStockUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should successfully reserve stock', async () => {
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
      mockRepository.save.mockResolvedValue(undefined);

      const result = await useCase.execute({
        productId: 'test-id',
        quantity: 20,
        orderId: 'order-123',
        customerId: 'customer-456',
        expiresAt: new Date(),
      });

      expect(result.success).toBe(true);
      expect(result.message).toContain('reserved successfully');
      expect(mockRepository.save).toHaveBeenCalledWith(mockProduct);
    });

    it('should fail when product not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await useCase.execute({
        productId: 'invalid-id',
        quantity: 10,
        orderId: 'order-123',
        customerId: 'customer-456',
        expiresAt: new Date(),
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('not found');
    });

    it('should fail when insufficient stock', async () => {
      const mockProduct = Product.create({
        name: 'Test Product',
        sku: 'TEST-001',
        category: 'Test',
        unitPrice: 29.99,
        currency: 'EUR',
        currentStock: 10,
        reservedStock: 5,
        minimumStock: 20,
        maximumStock: 500,
        isActive: true,
        artisanId: 'artisan-123',
      });

      mockRepository.findById.mockResolvedValue(mockProduct);

      const result = await useCase.execute({
        productId: 'test-id',
        quantity: 20,
        orderId: 'order-123',
        customerId: 'customer-456',
        expiresAt: new Date(),
      });

      expect(result.success).toBe(false);
      expect(result.message).toContain('Insufficient stock');
    });
  });
});

