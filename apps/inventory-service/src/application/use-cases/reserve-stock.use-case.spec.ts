import { ReserveStockUseCase } from './reserve-stock.use-case';
import { Product } from '../../domain/entities/product.entity';
import { ProductRepository } from '../../infrastructure/repositories/product.repository';
import { StockQuantity } from '../../domain/value-objects';
import {
  InventoryReservedEvent,
  InventoryOutOfStockEvent,
} from '../../domain/events';

describe('ReserveStockUseCase', () => {
  let useCase: ReserveStockUseCase;
  let mockRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    mockRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      findByIds: jest.fn(),
      findBySKU: jest.fn(),
      findLowStockProducts: jest.fn(),
      findByWarehouse: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
      findByCategory: jest.fn(),
      findByArtisan: jest.fn(),
      findLowStock: jest.fn(),
      findOutOfStock: jest.fn(),
    };

    useCase = new ReserveStockUseCase(mockRepository);
  });

  describe('execute', () => {
    it('should reserve stock successfully', async () => {
      const product = Product.create({
        name: 'Test Product',
        sku: 'INV-1234',
        category: 'Test',
        unitPrice: 10,
        currency: 'USD',
        currentStock: 100,
        reservedStock: 0,
        minimumStock: 10,
        maximumStock: 1000,
        isActive: true,
        artisanId: 'artisan_001',
      });

      mockRepository.findById.mockResolvedValue(product);
      mockRepository.save.mockResolvedValue(undefined);

      const request = {
        productId: product.id,
        quantity: 10,
        orderId: 'order_123',
        customerId: 'customer_123',
        expiresAt: new Date(Date.now() + 3600000),
      };

      const result = await useCase.execute(request);

      expect(result.success).toBe(true);
      expect(result.quantity).toBe(10);
      expect(mockRepository.save).toHaveBeenCalled();
      
      const savedProduct = mockRepository.save.mock.calls[0][0];
      const events = savedProduct.getUncommittedEvents();
      expect(events.some(e => e instanceof InventoryReservedEvent)).toBe(true);
    });

    it('should return failure when insufficient stock', async () => {
      const product = Product.create({
        name: 'Test Product',
        sku: 'INV-1234',
        category: 'Test',
        unitPrice: 10,
        currency: 'USD',
        currentStock: 5,
        reservedStock: 0,
        minimumStock: 10,
        maximumStock: 1000,
        isActive: true,
        artisanId: 'artisan_001',
      });

      mockRepository.findById.mockResolvedValue(product);

      const request = {
        productId: product.id,
        quantity: 10,
        orderId: 'order_123',
        customerId: 'customer_123',
        expiresAt: new Date(Date.now() + 3600000),
      };

      const result = await useCase.execute(request);

      expect(result.success).toBe(false);
      expect(result.message).toContain('Cannot reserve');
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when product not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const request = {
        productId: 'non_existent',
        quantity: 10,
        orderId: 'order_123',
        customerId: 'customer_123',
        expiresAt: new Date(Date.now() + 3600000),
      };

      await expect(useCase.execute(request)).rejects.toThrow('not found');
    });

    it('should throw error when product is inactive', async () => {
      const product = Product.create({
        name: 'Test Product',
        sku: 'INV-1234',
        category: 'Test',
        unitPrice: 10,
        currency: 'USD',
        currentStock: 100,
        reservedStock: 0,
        minimumStock: 10,
        maximumStock: 1000,
        isActive: false,
        artisanId: 'artisan_001',
      });

      mockRepository.findById.mockResolvedValue(product);

      const request = {
        productId: product.id,
        quantity: 10,
        orderId: 'order_123',
        customerId: 'customer_123',
        expiresAt: new Date(Date.now() + 3600000),
      };

      await expect(useCase.execute(request)).rejects.toThrow('not active');
    });
  });
});
