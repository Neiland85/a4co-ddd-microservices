import { Product } from '../../domain/entities/product.entity';
import { 
  CheckInventoryRequest, 
  CheckInventoryResponse,
  BulkCheckInventoryRequest,
  BulkCheckInventoryResponse 
} from '../use-cases/check-inventory.use-case';
import { 
  ReserveStockRequest, 
  ReserveStockResponse 
} from '../use-cases/reserve-stock.use-case';
import { 
  ReleaseStockRequest, 
  ReleaseStockResponse 
} from '../use-cases/release-stock.use-case';

export interface InventoryServicePort {
  checkInventory(request: CheckInventoryRequest): Promise<CheckInventoryResponse>;
  bulkCheckInventory(request: BulkCheckInventoryRequest): Promise<BulkCheckInventoryResponse>;
  reserveStock(request: ReserveStockRequest): Promise<ReserveStockResponse>;
  releaseStock(request: ReleaseStockRequest): Promise<ReleaseStockResponse>;
  getProductById(id: string): Promise<Product | null>;
  getAllProducts(): Promise<Product[]>;
  getLowStockProducts(): Promise<Product[]>;
  getOutOfStockProducts(): Promise<Product[]>;
}

export interface InventoryRepositoryPort {
  findById(id: string): Promise<Product | null>;
  findByIds(ids: string[]): Promise<Product[]>;
  save(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Product[]>;
  findByCategory(category: string): Promise<Product[]>;
  findByArtisan(artisanId: string): Promise<Product[]>;
  findLowStock(): Promise<Product[]>;
  findOutOfStock(): Promise<Product[]>;
}
