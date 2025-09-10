import { Product } from '../../domain/entities/product.entity';
export interface ReleaseStockRequest {
    productId: string;
    quantity: number;
    reservationId?: string;
    reason: string;
}
export interface ReleaseStockResponse {
    success: boolean;
    productId: string;
    quantity: number;
    availableStock: number;
    message?: string;
}
export interface ProductRepository {
    findById(id: string): Promise<Product | null>;
    save(product: Product): Promise<void>;
}
export declare class ReleaseStockUseCase {
    private productRepository;
    constructor(productRepository: ProductRepository);
    execute(request: ReleaseStockRequest): Promise<ReleaseStockResponse>;
}
//# sourceMappingURL=release-stock.use-case.d.ts.map