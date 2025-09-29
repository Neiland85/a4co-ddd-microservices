import { AggregateRoot } from '../base-classes';
import { ProductImage } from '../entities/product-image.entity';
import { ProductTag } from '../entities/product-tag.entity';
import { ProductVariant } from '../entities/product-variant.entity';
import {
  ProductCreatedEvent,
  ProductDeactivatedEvent,
  ProductUpdatedEvent,
  ProductVariantAddedEvent,
} from '../events/product-events';
import {
  CategoryId,
  Price,
  ProductCategory,
  ProductDescription,
  ProductId,
  ProductName,
  SKU,
  Slug,
  Stock,
} from '../value-objects/product-value-objects';

export enum ProductStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DISCONTINUED = 'DISCONTINUED',
}

export enum ProductAvailability {
  IN_STOCK = 'IN_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  MADE_TO_ORDER = 'MADE_TO_ORDER',
  SEASONAL = 'SEASONAL',
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
    private _stock: Stock,
    private _category: ProductCategory,
    private _sku?: SKU,
    private _slug?: Slug,
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
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
  }

  // Factory method para crear nuevo producto
  public static create(data: {
    name: string;
    description: string;
    sku?: string;
    price: number;
    originalPrice?: number;
    currency: string;
    categoryId: string;
    category?: string;
    stock?: number;
    artisanId: string;
    slug?: string;
    isHandmade?: boolean;
    isCustomizable?: boolean;
    isDigital?: boolean;
    requiresShipping?: boolean;
    keywords?: string[];
    metaTitle?: string;
    metaDescription?: string;
    craftingTimeHours?: number;
    materials?: string[];
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
    const stock = new Stock(data.stock ?? 0);
    const category = new ProductCategory(data.category ?? 'other');
    const sku = data.sku ? new SKU(data.sku) : undefined;
    const slug = data.slug ? new Slug(data.slug) : Slug.generateFromName(data.name);

    const product = new Product(
      productId.value,
      productId,
      name,
      description,
      price,
      categoryId,
      data.artisanId,
      stock,
      category,
      sku,
      slug,
      ProductStatus.DRAFT,
      ProductAvailability.IN_STOCK,
      [],
      [],
      [],
      data.craftingTimeHours || 0,
      data.sustainabilityScore,
      data.isCustomizable || false,
      data.materials || [],
      data.dimensions,
    );

    // Add additional properties that aren't in constructor but needed for persistence
    (product as any)._sku = data.sku;
    (product as any)._slug = data.slug;
    (product as any)._originalPrice = data.originalPrice;
    (product as any)._isHandmade = data.isHandmade;
    (product as any)._isDigital = data.isDigital;
    (product as any)._requiresShipping = data.requiresShipping;
    (product as any)._keywords = data.keywords;
    (product as any)._metaTitle = data.metaTitle;
    (product as any)._metaDescription = data.metaDescription;

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
        craftingTimeHours: data.craftingTimeHours || 0,
        materials: data.materials || [],
        isCustomizable: data.isCustomizable || false,
        createdAt: product.createdAt,
      }),
    );

    return product;
  }

  // Factory method para reconstruir desde persistencia
  public static reconstruct(data: {
    id: string;
    productId: string;
    name: string;
    description: string;
    sku?: string;
    slug?: string;
    price: number;
    originalPrice?: number;
    currency: string;
    categoryId: string;
    category?: string;
    stock?: number;
    artisanId: string;
    status: ProductStatus;
    availability: ProductAvailability;
    isHandmade?: boolean;
    isCustomizable: boolean;
    isDigital?: boolean;
    requiresShipping?: boolean;
    keywords?: string[];
    metaTitle?: string;
    metaDescription?: string;
    craftingTimeHours: number;
    sustainabilityScore?: number;
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
    const product = new Product(
      data.id,
      new ProductId(data.productId),
      new ProductName(data.name),
      new ProductDescription(data.description),
      new Price(data.price, data.currency),
      new CategoryId(data.categoryId),
      data.artisanId,
      new Stock(data.stock ?? 0),
      new ProductCategory(data.category ?? 'other'),
      data.sku ? new SKU(data.sku) : undefined,
      data.slug ? new Slug(data.slug) : undefined,
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
      data.updatedAt,
    );

    // Add additional properties
    (product as any)._sku = data.sku;
    (product as any)._slug = data.slug;
    (product as any)._originalPrice = data.originalPrice;
    (product as any)._isHandmade = data.isHandmade;
    (product as any)._isDigital = data.isDigital;
    (product as any)._requiresShipping = data.requiresShipping;
    (product as any)._keywords = data.keywords;
    (product as any)._metaTitle = data.metaTitle;
    (product as any)._metaDescription = data.metaDescription;

    return product;
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

  public get category(): string {
    return this._category.value;
  }

  public get stock(): number {
    return this._stock.value;
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

  public get tags(): string[] {
    return this._tags.map(tag => tag.name);
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

  // Getters adicionales para compatibilidad con repository
  public get sku(): string {
    return this._sku?.value || `${this._productId.value}-default`;
  }

  public get originalPrice(): Price | undefined {
    return undefined; // No implementado aún
  }

  public get slug(): string {
    return this._slug?.value || this._productId.value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  public get isHandmade(): boolean {
    return true; // Asumiendo que todos son handmade por defecto
  }

  public get isDigital(): boolean {
    return false; // No implementado aún
  }

  // Domain methods for stock management
  public addStock(quantity: number): void {
    this._stock = this._stock.add(quantity);
    this.updateAvailability();
    this.touch();
  }

  public removeStock(quantity: number): void {
    this._stock = this._stock.subtract(quantity);
    this.updateAvailability();
    this.touch();
  }

  public isInStock(): boolean {
    return this._stock.isAvailable();
  }

  public isLowStock(): boolean {
    return this._stock.isLow();
  }

  private updateAvailability(): void {
    if (this._stock.value === 0) {
      this._availability = ProductAvailability.OUT_OF_STOCK;
    } else if (this._stock.isLow()) {
      this._availability = ProductAvailability.SEASONAL; // Usando SEASONAL para low stock
    } else {
      this._availability = ProductAvailability.IN_STOCK;
    }
  }

  public get requiresShipping(): boolean {
    return !this._isCustomizable; // Lógica simple
  }

  public get keywords(): string[] {
    return []; // No implementado aún
  }

  public get metaTitle(): string | undefined {
    return undefined; // No implementado aún
  }

  public get metaDescription(): string | undefined {
    return undefined; // No implementado aún
  }

  public get featured(): boolean {
    return false; // No implementado aún
  }

  public get averageRating(): number {
    return 0; // No implementado aún
  }

  public get reviewCount(): number {
    return 0; // No implementado aún
  }

  public get totalSold(): number {
    return 0; // No implementado aún
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
      // Regenerar slug si no se especificó uno custom
      if (
        !this._slug ||
        this._slug.value === oldData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      ) {
        this._slug = Slug.generateFromName(data.name);
      }
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
      }),
    );
  }

  public updateSku(sku: SKU): void {
    this._sku = sku;
    this.touch();
  }

  public updateSlug(slug: Slug): void {
    this._slug = slug;
    this.touch();
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
        variantName: variant.name || 'Unnamed Variant',
        variantPrice: variant.price,
        attributes: variant.attributes,
        addedAt: new Date(),
      }),
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
      }),
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
    sku?: string;
    slug?: string;
    price: number;
    originalPrice?: number;
    currency: string;
    categoryId: string;
    category: string;
    stock: number;
    artisanId: string;
    status: ProductStatus;
    availability: ProductAvailability;
    isHandmade?: boolean;
    isCustomizable: boolean;
    isDigital?: boolean;
    requiresShipping?: boolean;
    keywords?: string[];
    metaTitle?: string;
    metaDescription?: string;
    craftingTimeHours: number;
    sustainabilityScore?: number;
    materials: string[];
    dimensions?:
      | {
          width: number;
          height: number;
          depth: number;
          weight: number;
        }
      | undefined;
    variants: any[];
    images: any[];
    tags: any[];
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.id,
      productId: this._productId.value,
      name: this._name.value,
      description: this._description.value,
      sku: (this as any)._sku,
      slug: (this as any)._slug,
      price: this._price.amount,
      originalPrice: (this as any)._originalPrice,
      currency: this._price.currency,
      categoryId: this._categoryId.value,
      category: this._category.value,
      stock: this._stock.value,
      artisanId: this._artisanId,
      status: this._status,
      availability: this._availability,
      isHandmade: (this as any)._isHandmade,
      isCustomizable: this._isCustomizable,
      isDigital: (this as any)._isDigital,
      requiresShipping: (this as any)._requiresShipping,
      keywords: (this as any)._keywords,
      metaTitle: (this as any)._metaTitle,
      metaDescription: (this as any)._metaDescription,
      craftingTimeHours: this._craftingTimeHours,
      sustainabilityScore: this._sustainabilityScore || undefined,
      materials: this._materials,
      dimensions: this._dimensions,
      variants: this._variants,
      images: this._images,
      tags: this._tags,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
