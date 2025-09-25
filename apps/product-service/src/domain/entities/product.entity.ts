import { AggregateRoot, DomainEvent } from '../base-classes';

// ========================================
// VALUE OBJECTS
// ========================================

export class Money {
  constructor(
    public readonly amount: number,
    public readonly currency: string = 'EUR'
  ) {
    if (amount < 0) {
      throw new Error('Money amount cannot be negative');
    }
    if (!currency || currency.length !== 3) {
      throw new Error('Currency must be a valid 3-letter code');
    }
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }

  isGreaterThan(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new Error('Cannot compare different currencies');
    }
    return this.amount > other.amount;
  }
}

export class ProductImage {
  constructor(
    public readonly url: string,
    public readonly altText?: string,
    public readonly type: ImageType = ImageType.GALLERY,
    public readonly isPrimary: boolean = false,
    public readonly sortOrder: number = 0
  ) {
    if (!url || !this.isValidUrl(url)) {
      throw new Error('Invalid image URL');
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}

export class ProductSpecification {
  constructor(
    public readonly name: string,
    public readonly value: string,
    public readonly type: SpecificationType = SpecificationType.TEXT,
    public readonly unit?: string,
    public readonly category?: string
  ) {
    if (!name.trim()) {
      throw new Error('Specification name cannot be empty');
    }
    if (!value.trim()) {
      throw new Error('Specification value cannot be empty');
    }
  }
}

export class Dimensions {
  constructor(
    public readonly length: number,
    public readonly width: number,
    public readonly height: number,
    public readonly unit: string = 'cm'
  ) {
    if (length <= 0 || width <= 0 || height <= 0) {
      throw new Error('Dimensions must be positive numbers');
    }
  }

  volume(): number {
    return this.length * this.width * this.height;
  }
}

// ========================================
// ENUMS
// ========================================

export enum ProductStatus {
  DRAFT = 'DRAFT',
  PENDING_REVIEW = 'PENDING_REVIEW',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  REJECTED = 'REJECTED',
}

export enum ProductAvailability {
  AVAILABLE = 'AVAILABLE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  DISCONTINUED = 'DISCONTINUED',
  COMING_SOON = 'COMING_SOON',
  PRE_ORDER = 'PRE_ORDER',
}

export enum ImageType {
  GALLERY = 'GALLERY',
  THUMBNAIL = 'THUMBNAIL',
  HERO = 'HERO',
  DETAIL = 'DETAIL',
  LIFESTYLE = 'LIFESTYLE',
}

export enum SpecificationType {
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  BOOLEAN = 'BOOLEAN',
  DATE = 'DATE',
  URL = 'URL',
  COLOR = 'COLOR',
}

// ========================================
// DOMAIN EVENTS
// ========================================

export class ProductCreatedEvent extends DomainEvent {
  constructor(
    public readonly productId: string,
    public readonly data: {
      name: string;
      price: Money;
      artisanId: string;
      categoryId: string;
      createdAt: Date;
    }
  ) {
    super();
  }

  eventType(): string {
    return 'ProductCreated';
  }
}

export class ProductPublishedEvent extends DomainEvent {
  constructor(
    public readonly productId: string,
    public readonly data: {
      name: string;
      price: Money;
      artisanId: string;
      publishedAt: Date;
    }
  ) {
    super();
  }

  eventType(): string {
    return 'ProductPublished';
  }
}

export class ProductPriceChangedEvent extends DomainEvent {
  constructor(
    public readonly productId: string,
    public readonly data: {
      previousPrice: Money;
      newPrice: Money;
      changedAt: Date;
    }
  ) {
    super();
  }

  eventType(): string {
    return 'ProductPriceChanged';
  }
}

export class ProductDiscontinuedEvent extends DomainEvent {
  constructor(
    public readonly productId: string,
    public readonly data: {
      reason: string;
      discontinuedAt: Date;
    }
  ) {
    super();
  }

  eventType(): string {
    return 'ProductDiscontinued';
  }
}

// ========================================
// PRODUCT VARIANT ENTITY
// ========================================

export class ProductVariant {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly sku: string,
    private _price: Money,
    public readonly attributes: Record<string, any>,
    private _stockQuantity: number = 0,
    public readonly weight?: number,
    public readonly dimensions?: Dimensions,
    private _isActive: boolean = true,
    public readonly isDefault: boolean = false
  ) {
    if (!name.trim()) {
      throw new Error('Variant name cannot be empty');
    }
    if (!sku.trim()) {
      throw new Error('Variant SKU cannot be empty');
    }
    if (_stockQuantity < 0) {
      throw new Error('Stock quantity cannot be negative');
    }
  }

  get price(): Money {
    return this._price;
  }

  get stockQuantity(): number {
    return this._stockQuantity;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  updatePrice(newPrice: Money): void {
    this._price = newPrice;
  }

  updateStock(quantity: number): void {
    if (quantity < 0) {
      throw new Error('Stock quantity cannot be negative');
    }
    this._stockQuantity = quantity;
  }

  activate(): void {
    this._isActive = true;
  }

  deactivate(): void {
    this._isActive = false;
  }

  isInStock(): boolean {
    return this._stockQuantity > 0 && this._isActive;
  }
}

// ========================================
// PRODUCT AGGREGATE ROOT
// ========================================

export class Product extends AggregateRoot {
  private _status: ProductStatus;
  private _availability: ProductAvailability;
  private _price: Money;
  private _originalPrice?: Money;
  private _variants: ProductVariant[] = [];
  private _images: ProductImage[] = [];
  private _specifications: ProductSpecification[] = [];
  private _averageRating: number = 0;
  private _reviewCount: number = 0;
  private _totalSold: number = 0;

  constructor(
    id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly sku: string,
    price: Money,
    public readonly artisanId: string,
    public readonly categoryId: string,
    public readonly slug: string,
    originalPrice?: Money,
    public readonly isHandmade: boolean = true,
    public readonly isCustomizable: boolean = false,
    public readonly isDigital: boolean = false,
    public readonly requiresShipping: boolean = true,
    public readonly tags: string[] = [],
    public readonly keywords: string[] = [],
    public readonly metaTitle?: string,
    public readonly metaDescription?: string,
    public readonly featured: boolean = false
  ) {
    super(id);

    // Validaciones de dominio
    if (!name.trim()) {
      throw new Error('Product name cannot be empty');
    }
    if (!sku.trim()) {
      throw new Error('Product SKU cannot be empty');
    }
    if (!artisanId.trim()) {
      throw new Error('Artisan ID cannot be empty');
    }
    if (!categoryId.trim()) {
      throw new Error('Category ID cannot be empty');
    }
    if (!slug.trim()) {
      throw new Error('Product slug cannot be empty');
    }

    this._price = price;
    if (originalPrice !== undefined) {
      this._originalPrice = originalPrice;
    }
    this._status = ProductStatus.DRAFT;
    this._availability = ProductAvailability.AVAILABLE;

    // Evento de dominio
    this.addDomainEvent(
      new ProductCreatedEvent(id, {
        name,
        price,
        artisanId,
        categoryId,
        createdAt: new Date(),
      })
    );
  }

  // ========================================
  // GETTERS
  // ========================================

  get status(): ProductStatus {
    return this._status;
  }

  get availability(): ProductAvailability {
    return this._availability;
  }

  get price(): Money {
    return this._price;
  }

  get originalPrice(): Money | undefined {
    return this._originalPrice;
  }

  get variants(): readonly ProductVariant[] {
    return this._variants;
  }

  get images(): readonly ProductImage[] {
    return this._images;
  }

  get specifications(): readonly ProductSpecification[] {
    return this._specifications;
  }

  get averageRating(): number {
    return this._averageRating;
  }

  get reviewCount(): number {
    return this._reviewCount;
  }

  get totalSold(): number {
    return this._totalSold;
  }

  // ========================================
  // BUSINESS METHODS
  // ========================================

  publish(): void {
    if (this._status === ProductStatus.PUBLISHED) {
      throw new Error('Product is already published');
    }

    if (this._images.length === 0) {
      throw new Error('Product must have at least one image to be published');
    }

    this._status = ProductStatus.PUBLISHED;

    this.addDomainEvent(
      new ProductPublishedEvent(this.id, {
        name: this.name,
        price: this._price,
        artisanId: this.artisanId,
        publishedAt: new Date(),
      })
    );
  }

  archive(): void {
    if (this._status === ProductStatus.ARCHIVED) {
      throw new Error('Product is already archived');
    }

    this._status = ProductStatus.ARCHIVED;
    this._availability = ProductAvailability.DISCONTINUED;
  }

  updatePrice(newPrice: Money, originalPrice?: Money): void {
    const previousPrice = this._price;
    this._price = newPrice;
    if (originalPrice !== undefined) {
      this._originalPrice = originalPrice;
    }

    this.addDomainEvent(
      new ProductPriceChangedEvent(this.id, {
        previousPrice,
        newPrice,
        changedAt: new Date(),
      })
    );
  }

  discontinue(reason: string): void {
    this._availability = ProductAvailability.DISCONTINUED;

    this.addDomainEvent(
      new ProductDiscontinuedEvent(this.id, {
        reason,
        discontinuedAt: new Date(),
      })
    );
  }

  markAsOutOfStock(): void {
    this._availability = ProductAvailability.OUT_OF_STOCK;
  }

  markAsAvailable(): void {
    this._availability = ProductAvailability.AVAILABLE;
  }

  addVariant(variant: ProductVariant): void {
    // Verificar que no exista un variant con el mismo SKU
    if (this._variants.some(v => v.sku === variant.sku)) {
      throw new Error('A variant with this SKU already exists');
    }

    // Si es el primer variant y es default, o no hay variants default
    if (variant.isDefault || !this._variants.some(v => v.isDefault)) {
      this._variants = this._variants.map(
        v =>
          new ProductVariant(
            v.id,
            v.name,
            v.sku,
            v.price,
            v.attributes,
            v.stockQuantity,
            v.weight,
            v.dimensions,
            v.isActive,
            false
          )
      );
    }

    this._variants.push(variant);
  }

  removeVariant(variantId: string): void {
    const index = this._variants.findIndex(v => v.id === variantId);
    if (index === -1) {
      throw new Error('Variant not found');
    }

    this._variants.splice(index, 1);
  }

  addImage(image: ProductImage): void {
    // Si es la primera imagen o se marca como primary, hacer que sea la única primary
    if (image.isPrimary || this._images.length === 0) {
      this._images = this._images.map(
        img => new ProductImage(img.url, img.altText, img.type, false, img.sortOrder)
      );
    }

    this._images.push(image);
    this._images.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  removeImage(imageUrl: string): void {
    const index = this._images.findIndex(img => img.url === imageUrl);
    if (index === -1) {
      throw new Error('Image not found');
    }

    this._images.splice(index, 1);
  }

  addSpecification(specification: ProductSpecification): void {
    // Verificar que no exista una especificación con el mismo nombre
    if (this._specifications.some(spec => spec.name === specification.name)) {
      throw new Error('A specification with this name already exists');
    }

    this._specifications.push(specification);
  }

  removeSpecification(name: string): void {
    const index = this._specifications.findIndex(spec => spec.name === name);
    if (index === -1) {
      throw new Error('Specification not found');
    }

    this._specifications.splice(index, 1);
  }

  updateRating(averageRating: number, reviewCount: number): void {
    if (averageRating < 0 || averageRating > 5) {
      throw new Error('Rating must be between 0 and 5');
    }
    if (reviewCount < 0) {
      throw new Error('Review count cannot be negative');
    }

    this._averageRating = averageRating;
    this._reviewCount = reviewCount;
  }

  incrementSoldCount(quantity: number = 1): void {
    if (quantity <= 0) {
      throw new Error('Sold quantity must be positive');
    }

    this._totalSold += quantity;
  }

  hasDiscount(): boolean {
    return this._originalPrice !== undefined && this._originalPrice.isGreaterThan(this._price);
  }

  getDiscountPercentage(): number {
    if (!this.hasDiscount() || !this._originalPrice) {
      return 0;
    }

    return Math.round(
      ((this._originalPrice.amount - this._price.amount) / this._originalPrice.amount) * 100
    );
  }

  isPublished(): boolean {
    return this._status === ProductStatus.PUBLISHED;
  }

  isAvailable(): boolean {
    return this._availability === ProductAvailability.AVAILABLE && this.isPublished();
  }

  canBePurchased(): boolean {
    return (
      this.isAvailable() && (this._variants.length === 0 || this._variants.some(v => v.isInStock()))
    );
  }

  getPrimaryImage(): ProductImage | undefined {
    return this._images.find(img => img.isPrimary) || this._images[0];
  }

  getVariantBySku(sku: string): ProductVariant | undefined {
    return this._variants.find(v => v.sku === sku);
  }

  getSpecificationsByCategory(category: string): ProductSpecification[] {
    return this._specifications.filter(spec => spec.category === category);
  }
}
