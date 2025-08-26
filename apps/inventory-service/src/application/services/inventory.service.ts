import { InventoryServicePort } from '../ports/inventory.ports';
import { CheckInventoryUseCase } from '../use-cases/check-inventory.use-case';
import { ReserveStockUseCase } from '../use-cases/reserve-stock.use-case';
import { ReleaseStockUseCase } from '../use-cases/release-stock.use-case';
import { Product } from '../../domain/entities/product.entity';
import { InventoryRepositoryPort } from '../ports/inventory.ports';

export class InventoryService implements InventoryServicePort {
  private checkInventoryUseCase: CheckInventoryUseCase;
  private reserveStockUseCase: ReserveStockUseCase;
  private releaseStockUseCase: ReleaseStockUseCase;

  constructor(private repository: InventoryRepositoryPort) {
    this.checkInventoryUseCase = new CheckInventoryUseCase(repository);
    this.reserveStockUseCase = new ReserveStockUseCase(repository);
    this.releaseStockUseCase = new ReleaseStockUseCase(repository);
  }

  async checkInventory(request: { productId: string }): Promise<any> {
    return this.checkInventoryUseCase.execute(request);
  }

  async bulkCheckInventory(request: { productIds: string[] }): Promise<any> {
    return this.checkInventoryUseCase.executeBulk(request);
  }

  async reserveStock(request: any): Promise<any> {
    return this.reserveStockUseCase.execute(request);
  }

  async releaseStock(request: any): Promise<any> {
    return this.releaseStockUseCase.execute(request);
  }

  async getProductById(id: string): Promise<Product | null> {
    return this.repository.findById(id);
  }

  async getAllProducts(): Promise<Product[]> {
    return this.repository.findAll();
  }

  async getLowStockProducts(): Promise<Product[]> {
    return this.repository.findLowStock();
  }

  async getOutOfStockProducts(): Promise<Product[]> {
    return this.repository.findOutOfStock();
  }
}
