import { AggregateRoot } from '@a4co/shared-utils';
import { ProductVariant } from '../entities/product-variant.entity';
import { ProductImage } from '../entities/product-image.entity';
import { ProductTag } from '../entities/product-tag.entity';
export declare enum ProductStatus {
    DRAFT = "draft",
    ACTIVE = "active",
    INACTIVE = "inactive",
    DISCONTINUED = "discontinued"
}
export declare enum ProductAvailability {
    IN_STOCK = "in_stock",
    OUT_OF_STOCK = "out_of_stock",
    MADE_TO_ORDER = "made_to_order",
    SEASONAL = "seasonal"
}
export declare class Product extends AggregateRoot {
    private readonly _productId;
    private _name;
    private _description;
    private _price;
    private readonly _categoryId;
    private readonly _artisanId;
    private _status;
    private _availability;
    private _variants;
    private _images;
    private _tags;
    private _craftingTimeHours;
    private _sustainabilityScore?;
    private _isCustomizable;
    private _materials;
    private _dimensions?;
    private constructor();
    static create(data: {
        name: string;
        description: string;
        price: number;
        currency: string;
        categoryId: string;
        artisanId: string;
        craftingTimeHours: number;
        materials: string[];
        isCustomizable?: boolean;
        sustainabilityScore?: number;
        dimensions?: {
            width: number;
            height: number;
            depth: number;
            weight: number;
        };
    }): Product;
    static reconstruct(data: {
        id: string;
        productId: string;
        name: string;
        description: string;
        price: number;
        currency: string;
        categoryId: string;
        artisanId: string;
        status: ProductStatus;
        availability: ProductAvailability;
        craftingTimeHours: number;
        sustainabilityScore?: number;
        isCustomizable: boolean;
        materials: string[];
        dimensions?: {
            width: number;
            height: number;
            depth: number;
            weight: number;
        };
        variants: any[];
        images: any[];
        tags: any[];
        createdAt: Date;
        updatedAt: Date;
    }): Product;
    get productId(): string;
    get name(): string;
    get description(): string;
    get price(): {
        amount: number;
        currency: string;
    };
    get categoryId(): string;
    get artisanId(): string;
    get status(): ProductStatus;
    get availability(): ProductAvailability;
    get variants(): ProductVariant[];
    get images(): ProductImage[];
    get tags(): ProductTag[];
    get craftingTimeHours(): number;
    get sustainabilityScore(): number | undefined;
    get isCustomizable(): boolean;
    get materials(): string[];
    get dimensions(): typeof this._dimensions;
    updateBasicInfo(data: {
        name?: string;
        description?: string;
        price?: number;
        currency?: string;
    }): void;
    addVariant(variantData: {
        name: string;
        description?: string;
        price?: number;
        currency?: string;
        sku?: string;
        attributes: Record<string, string>;
    }): void;
    addImage(imageData: {
        url: string;
        altText?: string;
        isPrimary?: boolean;
        sortOrder?: number;
    }): void;
    addTag(tagName: string): void;
    activate(): void;
    deactivate(reason?: string): void;
    setAvailability(availability: ProductAvailability): void;
    updateCraftingInfo(data: {
        craftingTimeHours?: number;
        materials?: string[];
        sustainabilityScore?: number;
        isCustomizable?: boolean;
    }): void;
    toPersistence(): {
        id: string;
        productId: string;
        name: string;
        description: string;
        price: number;
        currency: string;
        categoryId: string;
        artisanId: string;
        status: ProductStatus;
        availability: ProductAvailability;
        craftingTimeHours: number;
        sustainabilityScore?: number;
        isCustomizable: boolean;
        materials: string[];
        dimensions?: {
            width: number;
            height: number;
            depth: number;
            weight: number;
        };
        createdAt: Date;
        updatedAt: Date;
    };
}
//# sourceMappingURL=product.aggregate.d.ts.map