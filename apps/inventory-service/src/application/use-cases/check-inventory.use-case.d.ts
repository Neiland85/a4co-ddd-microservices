import { Product } from '../../domain/entities/product.entity';
export interface CheckInventoryRequest {
    productId: string;
}
export interface CheckInventoryResponse {
    productId: string;
    name: string;
    sku: string;
    currentStock: number;
    reservedStock: number;
    availableStock: number;
    stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
    needsRestock: boolean;
    unitPrice: number;
    currency: string;
    isActive: boolean;
}
export interface BulkCheckInventoryRequest {
    productIds: string[];
}
export interface BulkCheckInventoryResponse {
    products: CheckInventoryResponse[];
    summary: {
        totalProducts: number;
        inStock: number;
        lowStock: number;
        outOfStock: number;
        discontinued: number;
    };
}
export interface ProductRepository {
    findById(id: string): Promise<Product | null>;
    findByIds(ids: string[]): Promise<Product[]>;
}
export declare class CheckInventoryUseCase {
    private productRepository;
    constructor(productRepository: ProductRepository);
    execute(request: CheckInventoryRequest): Promise<CheckInventoryResponse>;
    executeBulk(request: BulkCheckInventoryRequest): Promise<BulkCheckInventoryResponse>;
}
//# sourceMappingURL=check-inventory.use-case.d.ts.map