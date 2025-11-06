import { ReserveStockUseCase } from '../application/use-cases/reserve-stock.use-case';
import { ReleaseStockUseCase } from '../application/use-cases/release-stock.use-case';
import { ConfirmStockUseCase } from '../application/use-cases/confirm-stock.use-case';
import { InMemoryProductRepository } from '../../infrastructure/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';

describe('Inventory Saga Integration', () => {
  let repository: InMemoryProductRepository;
  let reserveStockUseCase: ReserveStockUseCase;
  let releaseStockUseCase: ReleaseStockUseCase;
  let confirmStockUseCase: ConfirmStockUseCase;
  let product: Product;

  beforeEach(() => {
    repository = new InMemoryProductRepository();
    reserveStockUseCase = new ReserveStockUseCase(repository);
    releaseStockUseCase = new ReleaseStockUseCase(repository);
    confirmStockUseCase = new ConfirmStockUseCase(repository);

    // Create a test product
    product = Product.create({
      name: 'Test Product',
      sku: 'INV-1234',
      category: 'Test',
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

    repository.save(product);
  });

  describe('Complete Saga Flow', () => {
    it('should complete full saga: reserve -> confirm', async () => {
      const orderId = 'order-123';
      const sagaId = 'saga-123';

      // Step 1: Reserve stock (after payment succeeded)
      const reserveResult = await reserveStockUseCase.execute({
        productId: product.id.value,
        quantity: 20,
        orderId,
        customerId: 'customer-123',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        sagaId,
      });

      expect(reserveResult.success).toBe(true);
      expect(reserveResult.availableStock).toBe(80);

      // Verify product state
      const productAfterReserve = await repository.findById(product.id.value);
      expect(productAfterReserve?.reservedStock.value).toBe(20);
      expect(productAfterReserve?.availableStock.value).toBe(80);

      // Step 2: Confirm stock (after order completed)
      const confirmResult = await confirmStockUseCase.execute({
        productId: product.id.value,
        quantity: 20,
        orderId,
        sagaId,
      });

      expect(confirmResult.success).toBe(true);
      expect(confirmResult.currentStock).toBe(80);

      // Verify final state
      const productAfterConfirm = await repository.findById(product.id.value);
      expect(productAfterConfirm?.stock.value).toBe(80);
      expect(productAfterConfirm?.reservedStock.value).toBe(0);
    });

    it('should handle compensation: reserve -> release', async () => {
      const orderId = 'order-456';
      const sagaId = 'saga-456';

      // Step 1: Reserve stock
      const reserveResult = await reserveStockUseCase.execute({
        productId: product.id.value,
        quantity: 30,
        orderId,
        customerId: 'customer-123',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        sagaId,
      });

      expect(reserveResult.success).toBe(true);

      // Step 2: Release stock (compensation after order cancelled)
      const releaseResult = await releaseStockUseCase.execute({
        productId: product.id.value,
        quantity: 30,
        orderId,
        reason: 'Order cancelled by customer',
        sagaId,
      });

      expect(releaseResult.success).toBe(true);
      expect(releaseResult.availableStock).toBe(100);

      // Verify final state
      const productAfterRelease = await repository.findById(product.id.value);
      expect(productAfterRelease?.reservedStock.value).toBe(0);
      expect(productAfterRelease?.stock.value).toBe(100);
    });

    it('should handle out of stock scenario', async () => {
      const orderId = 'order-789';
      const sagaId = 'saga-789';

      // Try to reserve more than available
      const reserveResult = await reserveStockUseCase.execute({
        productId: product.id.value,
        quantity: 150, // More than available (100)
        orderId,
        customerId: 'customer-123',
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        sagaId,
      });

      expect(reserveResult.success).toBe(false);
      expect(reserveResult.message).toContain('Cannot reserve');
    });
  });
});
