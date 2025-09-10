import { Product } from '../../domain/entities/product.entity';
export interface ReserveStockRequest {
    productId: string;
    quantity: number;
    orderId: string;
    customerId: string;
    expiresAt: Date;
}
export interface ReserveStockResponse {
    success: boolean;
    reservationId: string;
    productId: string;
    quantity: number;
    availableStock: number;
    expiresAt: Date;
    message?: string;
}
export interface ProductRepository {
    findById(id: string): Promise<Product | null>;
    save(product: Product): Promise<void>;
}
export declare class ReserveStockUseCase {
    private productRepository;
    constructor(productRepository: ProductRepository);
    execute(request: ReserveStockRequest): Promise<ReserveStockResponse>;
}
//# sourceMappingURL=reserve-stock.use-case.d.ts.map