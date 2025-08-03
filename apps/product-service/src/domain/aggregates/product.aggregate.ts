import { AggregateRoot } from '@a4co/shared-utils';
import { ProductId, ProductName, ProductDescription, Price, CategoryId } from '../value-objects/product-value-objects';
import { ProductVariant } from '../entities/product-variant.entity';
import { ProductImage } from '../entities/product-image.entity';
import { ProductTag } from '../entities/product-tag.entity';
import {
  ProductCreatedEvent,
  ProductUpdatedEvent,
  ProductVariantAddedEvent,
  ProductDeactivatedEvent,
} from '../events/product-events';

export enum ProductStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISCONTINUED = 'discontinued',
}

export enum ProductAvailability {
  IN_STOCK = 'in_stock',
  OUT_OF_STOCK = 'out_of_stock',
  MADE_TO_ORDER = 'made_to_order',
  SEASONAL = 'seasonal',
}

export class Product extends AggregateRoot {
  private constructor(
    id: string,
    private readonly _productId: ProductId,
    private _name: ProductName,
    private _description: ProductDescription,
    private _price: Price,
    private readonly _categoryId: CategoryId,
    private readonly _artisanId: string,
    private _status: ProductStatus = ProductStatus.DRAFT,
    private _availability: ProductAvailability = ProductAvailability.IN_STOCK,
    private _variants: ProductVariant[] = [],
    private _images: ProductImage[] = [],
    private _tags: ProductTag[] = [],
    private _craftingTimeHours: number = 0,
    private _sustainabilityScore?: number,
    private _isCustomizable: boolean = false,
    private _materials: string[] = [],
    private _dimensions?: {
      width: number;
      height: number;
      depth: number;
      weight: number;
    },
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id);
    if (createdAt) (this as any).createdAt = createdAt;
    if (updatedAt) (this as any).updatedAt = updatedAt;
  }

  // Factory method para crear nuevo producto
  public static create(data: {
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
  }): Product {
    const productId = new ProductId();
    const name = new ProductName(data.name);
    const description = new ProductDescription(data.description);
    const price = new Price(data.price, data.currency);
    const categoryId = new CategoryId(data.categoryId);

    const product = new Product(
      productId.value,
      productId,
      name,
      description,
      price,
      categoryId,
      data.artisanId,
      ProductStatus.DRAFT,
      ProductAvailability.IN_STOCK,
      [],
      [],
      [],
      data.craftingTimeHours,
      data.sustainabilityScore,
      data.isCustomizable || false,
      data.materials,
      data.dimensions
    );

    // Emitir evento de dominio
    product.addDomainEvent(
      new ProductCreatedEvent(product.id, {
        productId: productId.value,
        name: name.value,
        description: description.value,
        price: price.amount,
        currency: price.currency,
        categoryId: categoryId.value,
        artisanId: data.artisanId,
        craftingTimeHours: data.craftingTimeHours,
        materials: data.materials,
        isCustomizable: data.isCustomizable || false,
        createdAt: product.createdAt,
      })
    );

    return product;
  }

  // Factory method para reconstruir desde persistencia
  public static reconstruct(data: {
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
  }): Product {
    return new Product(
      data.id,
      new ProductId(data.productId),
      new ProductName(data.name),
      new ProductDescription(data.description),
      new Price(data.price, data.currency),
      new CategoryId(data.categoryId),
      data.artisanId,
      data.status,
      data.availability,
      data.variants.map(v => ProductVariant.reconstruct(v)),
      data.images.map(i => ProductImage.reconstruct(i)),
      data.tags.map(t => ProductTag.reconstruct(t)),
      data.craftingTimeHours,
      data.sustainabilityScore,
      data.isCustomizable,
      data.materials,
      data.dimensions,
      data.createdAt,
      data.updatedAt
    );
  }

  // Getters
  public get productId(): string {
    return this._productId.value;
  }

  public get name(): string {
    return this._name.value;
  }

  public get description(): string {
    return this._description.value;
  }

  public get price(): { amount: number; currency: string } {
    return {
      amount: this._price.amount,
      currency: this._price.currency,
    };
  }

  public get categoryId(): string {
    return this._categoryId.value;
  }

  public get artisanId(): string {
    return this._artisanId;
  }

  public get status(): ProductStatus {
    return this._status;
  }

  public get availability(): ProductAvailability {
    return this._availability;
  }

  public get variants(): ProductVariant[] {
    return [...this._variants];
  }

  public get images(): ProductImage[] {
    return [...this._images];
  }

  public get tags(): ProductTag[] {
    return [...this._tags];
  }

  public get craftingTimeHours(): number {
    return this._craftingTimeHours;
  }

  public get sustainabilityScore(): number | undefined {
    return this._sustainabilityScore;
  }

  public get isCustomizable(): boolean {
    return this._isCustomizable;
  }

  public get materials(): string[] {
    return [...this._materials];
  }

  public get dimensions(): typeof this._dimensions {
    return this._dimensions ? { ...this._dimensions } : undefined;
  }

  // Métodos de negocio
  public updateBasicInfo(data: {
    name?: string;
    description?: string;
    price?: number;
    currency?: string;
  }): void {
    const oldData = {
      name: this._name.value,
      description: this._description.value,
      price: this._price.amount,
      currency: this._price.currency,
    };

    if (data.name) {
      this._name = new ProductName(data.name);
    }
    if (data.description) {
      this._description = new ProductDescription(data.description);
    }
    if (data.price && data.currency) {
      this._price = new Price(data.price, data.currency);
    }

    this.touch();

    this.addDomainEvent(
      new ProductUpdatedEvent(this.id, {
        productId: this._productId.value,
        changedFields: Object.keys(data),
        oldValues: oldData,
        newValues: {
          name: this._name.value,
          description: this._description.value,
          price: this._price.amount,
          currency: this._price.currency,
        },
        updatedAt: this.updatedAt,
      })
    );
  }

  public addVariant(variantData: {
    name: string;
    description?: string;
    price?: number;
    currency?: string;
    sku?: string;
    attributes: Record<string, string>;
  }): void {
    const variant = ProductVariant.create({
      productId: this.id,
      name: variantData.name,
      description: variantData.description,
      price: variantData.price || this._price.amount,
      currency: variantData.currency || this._price.currency,
      sku: variantData.sku,
      attributes: variantData.attributes,
    });

    this._variants.push(variant);
    this.touch();

    this.addDomainEvent(
      new ProductVariantAddedEvent(this.id, {
        productId: this._productId.value,
        variantId: variant.id,
        variantName: variant.name,
        variantPrice: variant.price,
        attributes: variant.attributes,
        addedAt: new Date(),
      })
    );
  }

  public addImage(imageData: {
    url: string;
    altText?: string;
    isPrimary?: boolean;
    sortOrder?: number;
  }): void {
    // Si es imagen primaria, quitar primary de las demás
    if (imageData.isPrimary) {
      this._images.forEach(img => img.setPrimary(false));
    }

    const image = ProductImage.create({
      productId: this.id,
      url: imageData.url,
      altText: imageData.altText || this._name.value,
      isPrimary: imageData.isPrimary || this._images.length === 0,
      sortOrder: imageData.sortOrder || this._images.length,
    });

    this._images.push(image);
    this.touch();
  }

  public addTag(tagName: string): void {
    // Verificar que el tag no existe ya
    const existingTag = this._tags.find(tag => tag.name === tagName);
    if (existingTag) return;

    const tag = ProductTag.create({
      productId: this.id,
      name: tagName,
    });

    this._tags.push(tag);
    this.touch();
  }

  public activate(): void {
    if (this._status === ProductStatus.ACTIVE) {
      throw new Error('Product is already active');
    }

    this._status = ProductStatus.ACTIVE;
    this.touch();
  }

  public deactivate(reason?: string): void {
    if (this._status === ProductStatus.INACTIVE) {
      throw new Error('Product is already inactive');
    }

    this._status = ProductStatus.INACTIVE;
    this.touch();

    this.addDomainEvent(
      new ProductDeactivatedEvent(this.id, {
        productId: this._productId.value,
        reason: reason || 'Manual deactivation',
        deactivatedAt: new Date(),
      })
    );
  }

  public setAvailability(availability: ProductAvailability): void {
    this._availability = availability;
    this.touch();
  }

  public updateCraftingInfo(data: {
    craftingTimeHours?: number;
    materials?: string[];
    sustainabilityScore?: number;
    isCustomizable?: boolean;
  }): void {
    if (data.craftingTimeHours !== undefined) {
      this._craftingTimeHours = data.craftingTimeHours;
    }
    if (data.materials) {
      this._materials = [...data.materials];
    }
    if (data.sustainabilityScore !== undefined) {
      this._sustainabilityScore = data.sustainabilityScore;
    }
    if (data.isCustomizable !== undefined) {
      this._isCustomizable = data.isCustomizable;
    }

    this.touch();
  }

  // Método para persistencia
  public toPersistence(): {
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
  } {
    return {
      id: this.id,
      productId: this._productId.value,
      name: this._name.value,
      description: this._description.value,
      price: this._price.amount,
      currency: this._price.currency,
      categoryId: this._categoryId.value,
      artisanId: this._artisanId,
      status: this._status,
      availability: this._availability,
      craftingTimeHours: this._craftingTimeHours,
      sustainabilityScore: this._sustainabilityScore,
      isCustomizable: this._isCustomizable,
      materials: this._materials,
      dimensions: this._dimensions,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}