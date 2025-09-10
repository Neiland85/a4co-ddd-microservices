import { InventoryServicePort } from '../ports/inventory.ports';
import { Product } from '../../domain/entities/product.entity';
import { InventoryRepositoryPort } from '../ports/inventory.ports';
export declare class InventoryService implements InventoryServicePort {
    private repository;
    private checkInventoryUseCase;
    private reserveStockUseCase;
    private releaseStockUseCase;
    constructor(repository: InventoryRepositoryPort);
    checkInventory(request: {
        productId: string;
    }): Promise<any>;
    bulkCheckInventory(request: {
        productIds: string[];
    }): Promise<any>;
    reserveStock(request: any): Promise<any>;
    releaseStock(request: any): Promise<any>;
    getProductById(id: string): Promise<Product | null>;
    getAllProducts(): Promise<Product[]>;
    getLowStockProducts(): Promise<Product[]>;
    getOutOfStockProducts(): Promise<Product[]>;
}
//# sourceMappingURL=inventory.service.d.ts.map