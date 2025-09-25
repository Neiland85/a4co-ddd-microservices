import { Product } from '../../domain/entities/product.entity';
import { IProductRepository } from '../../infrastructure/repositories/product.repository';
import { IEventBus } from '@a4co/shared-utils/events/event-bus';
export interface CreateProductDTO {
    name: string;
    description: string;
    sku: string;
    price: number;
    originalPrice?: number;
    currency?: string;
    artisanId: string;
    categoryId: string;
    slug: string;
    isHandmade?: boolean;
    isCustomizable?: boolean;
    isDigital?: boolean;
    requiresShipping?: boolean;
    tags?: string[];
    keywords?: string[];
    metaTitle?: string;
    metaDescription?: string;
    featured?: boolean;
}
export interface UpdateProductDTO {
    id: string;
    name?: string;
    description?: string;
    price?: number;
    originalPrice?: number;
    tags?: string[];
    keywords?: string[];
    metaTitle?: string;
    metaDescription?: string;
    featured?: boolean;
}
export interface AddVariantDTO {
    productId: string;
    name: string;
    sku: string;
    price: number;
    attributes: Record<string, any>;
    stockQuantity?: number;
    weight?: number;
    dimensions?: {
        length: number;
        width: number;
        height: number;
        unit?: string;
    };
    isDefault?: boolean;
}
export interface AddImageDTO {
    productId: string;
    url: string;
    altText?: string;
    type?: string;
    isPrimary?: boolean;
    sortOrder?: number;
}
export interface AddSpecificationDTO {
    productId: string;
    name: string;
    value: string;
    type?: string;
    unit?: string;
    category?: string;
}
export interface ProductSearchDTO {
    query?: string;
    categoryId?: string;
    artisanId?: string;
    priceMin?: number;
    priceMax?: number;
    featured?: boolean;
    tags?: string[];
    page?: number;
    limit?: number;
}
export declare class ProductService {
    private readonly productRepository;
    private readonly eventBus;
    constructor(productRepository: IProductRepository, eventBus: IEventBus);
    createProduct(dto: CreateProductDTO): Promise<Product>;
    updateProduct(dto: UpdateProductDTO): Promise<Product>;
    getProductById(id: string): Promise<Product | null>;
    getProductBySku(sku: string): Promise<Product | null>;
    getProductBySlug(slug: string): Promise<Product | null>;
    deleteProduct(id: string): Promise<void>;
    publishProduct(id: string): Promise<void>;
    archiveProduct(id: string): Promise<void>;
    discontinueProduct(id: string, reason: string): Promise<void>;
    markProductOutOfStock(id: string): Promise<void>;
    markProductAvailable(id: string): Promise<void>;
    addVariant(dto: AddVariantDTO): Promise<void>;
    removeVariant(productId: string, variantId: string): Promise<void>;
    addImage(dto: AddImageDTO): Promise<void>;
    removeImage(productId: string, imageUrl: string): Promise<void>;
    addSpecification(dto: AddSpecificationDTO): Promise<void>;
    removeSpecification(productId: string, specificationName: string): Promise<void>;
    searchProducts(dto: ProductSearchDTO): Promise<{
        products: Product[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getFeaturedProducts(limit?: number): Promise<Product[]>;
    getProductsByArtisan(artisanId: string, page?: number, limit?: number): Promise<Product[]>;
    getProductsByCategory(categoryId: string, page?: number, limit?: number): Promise<Product[]>;
    updateProductRating(productId: string, averageRating: number, reviewCount: number): Promise<void>;
    incrementSoldCount(productId: string, quantity?: number): Promise<void>;
    private publishDomainEvents;
    private generateId;
}
//# sourceMappingURL=product.service.d.ts.map