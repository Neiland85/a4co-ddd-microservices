import { AggregateRoot } from '@a4co/shared-utils/domain/aggregate-root';
import { DomainEvent } from '@a4co/shared-utils/domain/domain-event';
export declare class Money {
    readonly amount: number;
    readonly currency: string;
    constructor(amount: number, currency?: string);
    equals(other: Money): boolean;
    add(other: Money): Money;
    multiply(factor: number): Money;
    isGreaterThan(other: Money): boolean;
}
export declare class ProductImage {
    readonly url: string;
    readonly altText?: string | undefined;
    readonly type: ImageType;
    readonly isPrimary: boolean;
    readonly sortOrder: number;
    constructor(url: string, altText?: string | undefined, type?: ImageType, isPrimary?: boolean, sortOrder?: number);
    private isValidUrl;
}
export declare class ProductSpecification {
    readonly name: string;
    readonly value: string;
    readonly type: SpecificationType;
    readonly unit?: string | undefined;
    readonly category?: string | undefined;
    constructor(name: string, value: string, type?: SpecificationType, unit?: string | undefined, category?: string | undefined);
}
export declare class Dimensions {
    readonly length: number;
    readonly width: number;
    readonly height: number;
    readonly unit: string;
    constructor(length: number, width: number, height: number, unit?: string);
    volume(): number;
}
export declare enum ProductStatus {
    DRAFT = "DRAFT",
    PENDING_REVIEW = "PENDING_REVIEW",
    PUBLISHED = "PUBLISHED",
    ARCHIVED = "ARCHIVED",
    REJECTED = "REJECTED"
}
export declare enum ProductAvailability {
    AVAILABLE = "AVAILABLE",
    OUT_OF_STOCK = "OUT_OF_STOCK",
    DISCONTINUED = "DISCONTINUED",
    COMING_SOON = "COMING_SOON",
    PRE_ORDER = "PRE_ORDER"
}
export declare enum ImageType {
    GALLERY = "GALLERY",
    THUMBNAIL = "THUMBNAIL",
    HERO = "HERO",
    DETAIL = "DETAIL",
    LIFESTYLE = "LIFESTYLE"
}
export declare enum SpecificationType {
    TEXT = "TEXT",
    NUMBER = "NUMBER",
    BOOLEAN = "BOOLEAN",
    DATE = "DATE",
    URL = "URL",
    COLOR = "COLOR"
}
export declare class ProductCreatedEvent extends DomainEvent {
    constructor(productId: string, data: {
        name: string;
        price: Money;
        artisanId: string;
        categoryId: string;
        createdAt: Date;
    });
}
export declare class ProductPublishedEvent extends DomainEvent {
    constructor(productId: string, data: {
        name: string;
        price: Money;
        artisanId: string;
        publishedAt: Date;
    });
}
export declare class ProductPriceChangedEvent extends DomainEvent {
    constructor(productId: string, data: {
        previousPrice: Money;
        newPrice: Money;
        changedAt: Date;
    });
}
export declare class ProductDiscontinuedEvent extends DomainEvent {
    constructor(productId: string, data: {
        reason: string;
        discontinuedAt: Date;
    });
}
export declare class ProductVariant {
    readonly id: string;
    readonly name: string;
    readonly sku: string;
    private _price;
    readonly attributes: Record<string, any>;
    private _stockQuantity;
    readonly weight?: number | undefined;
    readonly dimensions?: Dimensions | undefined;
    private _isActive;
    readonly isDefault: boolean;
    constructor(id: string, name: string, sku: string, _price: Money, attributes: Record<string, any>, _stockQuantity?: number, weight?: number | undefined, dimensions?: Dimensions | undefined, _isActive?: boolean, isDefault?: boolean);
    get price(): Money;
    get stockQuantity(): number;
    get isActive(): boolean;
    updatePrice(newPrice: Money): void;
    updateStock(quantity: number): void;
    activate(): void;
    deactivate(): void;
    isInStock(): boolean;
}
export declare class Product extends AggregateRoot {
    readonly name: string;
    readonly description: string;
    readonly sku: string;
    readonly artisanId: string;
    readonly categoryId: string;
    readonly slug: string;
    readonly isHandmade: boolean;
    readonly isCustomizable: boolean;
    readonly isDigital: boolean;
    readonly requiresShipping: boolean;
    readonly tags: string[];
    readonly keywords: string[];
    readonly metaTitle?: string | undefined;
    readonly metaDescription?: string | undefined;
    readonly featured: boolean;
    private _status;
    private _availability;
    private _price;
    private _originalPrice?;
    private _variants;
    private _images;
    private _specifications;
    private _averageRating;
    private _reviewCount;
    private _totalSold;
    constructor(id: string, name: string, description: string, sku: string, price: Money, artisanId: string, categoryId: string, slug: string, originalPrice?: Money, isHandmade?: boolean, isCustomizable?: boolean, isDigital?: boolean, requiresShipping?: boolean, tags?: string[], keywords?: string[], metaTitle?: string | undefined, metaDescription?: string | undefined, featured?: boolean);
    get status(): ProductStatus;
    get availability(): ProductAvailability;
    get price(): Money;
    get originalPrice(): Money | undefined;
    get variants(): readonly ProductVariant[];
    get images(): readonly ProductImage[];
    get specifications(): readonly ProductSpecification[];
    get averageRating(): number;
    get reviewCount(): number;
    get totalSold(): number;
    publish(): void;
    archive(): void;
    updatePrice(newPrice: Money, originalPrice?: Money): void;
    discontinue(reason: string): void;
    markAsOutOfStock(): void;
    markAsAvailable(): void;
    addVariant(variant: ProductVariant): void;
    removeVariant(variantId: string): void;
    addImage(image: ProductImage): void;
    removeImage(imageUrl: string): void;
    addSpecification(specification: ProductSpecification): void;
    removeSpecification(name: string): void;
    updateRating(averageRating: number, reviewCount: number): void;
    incrementSoldCount(quantity?: number): void;
    hasDiscount(): boolean;
    getDiscountPercentage(): number;
    isPublished(): boolean;
    isAvailable(): boolean;
    canBePurchased(): boolean;
    getPrimaryImage(): ProductImage | undefined;
    getVariantBySku(sku: string): ProductVariant | undefined;
    getSpecificationsByCategory(category: string): ProductSpecification[];
}
//# sourceMappingURL=product.entity.d.ts.map