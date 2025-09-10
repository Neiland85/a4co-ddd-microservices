import { PrismaClient } from '../generated/prisma';
import { Product, ProductStatus, ProductAvailability } from '../../domain/entities/product.entity';
export interface IProductRepository {
    findById(id: string): Promise<Product | null>;
    findByIds(ids: string[]): Promise<Product[]>;
    findBySku(sku: string): Promise<Product | null>;
    findBySlug(slug: string): Promise<Product | null>;
    findByArtisan(artisanId: string, page?: number, limit?: number): Promise<Product[]>;
    findByCategory(categoryId: string, page?: number, limit?: number): Promise<Product[]>;
    findFeatured(limit?: number): Promise<Product[]>;
    findPublished(page?: number, limit?: number): Promise<Product[]>;
    search(query: string, filters?: SearchFilters): Promise<Product[]>;
    save(product: Product): Promise<void>;
    update(product: Product): Promise<void>;
    delete(id: string): Promise<void>;
    count(filters?: SearchFilters): Promise<number>;
}
export interface SearchFilters {
    categoryId?: string;
    artisanId?: string;
    status?: ProductStatus;
    availability?: ProductAvailability;
    priceMin?: number;
    priceMax?: number;
    featured?: boolean;
    tags?: string[];
}
export declare class PrismaProductRepository implements IProductRepository {
    private readonly prisma;
    constructor(prisma: PrismaClient);
    findById(id: string): Promise<Product | null>;
    findByIds(ids: string[]): Promise<Product[]>;
    findBySku(sku: string): Promise<Product | null>;
    findBySlug(slug: string): Promise<Product | null>;
    findByArtisan(artisanId: string, page?: number, limit?: number): Promise<Product[]>;
    findByCategory(categoryId: string, page?: number, limit?: number): Promise<Product[]>;
    findFeatured(limit?: number): Promise<Product[]>;
    findPublished(page?: number, limit?: number): Promise<Product[]>;
    search(query: string, filters?: SearchFilters): Promise<Product[]>;
    save(product: Product): Promise<void>;
    update(product: Product): Promise<void>;
    delete(id: string): Promise<void>;
    count(filters?: SearchFilters): Promise<number>;
    private mapToDomainEntity;
}
//# sourceMappingURL=product.repository.d.ts.map