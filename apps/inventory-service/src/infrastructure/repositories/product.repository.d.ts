import { Product } from '../../domain/entities/product.entity';
export interface ProductRepository {
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
export declare class InMemoryProductRepository implements ProductRepository {
    private products;
    constructor();
    private initializeSampleData;
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
//# sourceMappingURL=product.repository.d.ts.map