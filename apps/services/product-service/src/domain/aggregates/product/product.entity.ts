import { AggregateRoot } from '@a4co/shared-utils';

import {
  ProductArchivedEvent,
  ProductCreatedEvent,
  ProductPriceChangedEvent,
  ProductPublishedEvent,
} from '../../events/product-domain-events';
import {
  CategoryId,
  Price,
  ProductDescription,
  ProductId,
  ProductName,
  SKU,
  Slug,
  Stock,
} from '../../value-objects/product-value-objects';
import { Product } from '../../aggregates/product/product.entity';

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

export interface ProductSnapshot {
  id: string;
  name: string;
  description: string;
  price: { amount: number; currency: string };
  stock: number;
  sku: string;
  slug: string;
  artisanId: string;
  categoryId: string;
  status: ProductStatus;
  availability: ProductAvailability;
  isCustomizable: boolean;
  isDigital: boolean;
  requiresShipping: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProductProps {
  name: ProductName;
  description: ProductDescription;
  price: Price;
  stock: Stock;
  sku: SKU;
  slug: Slug;
  artisanId: string;
  categoryId: CategoryId;
  status: ProductStatus;
  availability: ProductAvailability;
  isCustomizable: boolean;
  isDigital: boolean;
  requiresShipping: boolean;
  featured: boolean;
}

type ProductTimestamps = {
  createdAt: Date;
  updatedAt: Date;
};

type ProductCreateProps = {
  id?: ProductId;
  name: ProductName;
  description: ProductDescription;
  price: Price;
  stock: Stock;
  sku: SKU;
  slug: Slug;
  artisanId: string;
  categoryId: CategoryId;
  isCustomizable?: boolean;
  isDigital?: boolean;
  requiresShipping?: boolean;
  featured?: boolean;
};

export class Product extends AggregateRoot {
  private readonly _productId: ProductId;
  private _name: ProductName;
  private _description: ProductDescription;
  private _price: Price;
  private _stock: Stock;
  private _sku: SKU;
  private _slug: Slug;
  private readonly _artisanId: string;
  private readonly _categoryId: CategoryId;
  private _status: ProductStatus;
  private _availability: ProductAvailability;
  private _isCustomizable: boolean;
  private _isDigital: boolean;
  private _requiresShipping: boolean;
  private _featured: boolean;

  private constructor(id: ProductId, props: ProductProps, timestamps: ProductTimestamps) {
    super({ id: id.value, createdAt: timestamps.createdAt, updatedAt: timestamps.updatedAt });
    this._productId = id;
    this._name = props.name;
    this._description = props.description;
    this._price = props.price;
    this._stock = props.stock;
    this._sku = props.sku;
    this._slug = props.slug;
    this._artisanId = props.artisanId;
    this._categoryId = props.categoryId;
    this._status = props.status;
    this._availability = props.availability;
    this._isCustomizable = props.isCustomizable;
    this._isDigital = props.isDigital;
    this._requiresShipping = props.requiresShipping;
    this._featured = props.featured;
  }

  public static create(props: ProductCreateProps): Product {
    const productId = props.id ?? ProductId.create();
    const now = new Date();
    const product = new Product(
      productId,
      {
        name: props.name,
        description: props.description,
        price: props.price,
        stock: props.stock,
        sku: props.sku,
        slug: props.slug,
        artisanId: props.artisanId,
        categoryId: props.categoryId,
        status: ProductStatus.DRAFT,
        availability: ProductAvailability.AVAILABLE,
        isCustomizable: props.isCustomizable ?? false,
        isDigital: props.isDigital ?? false,
        requiresShipping: props.requiresShipping ?? true,
        featured: props.featured ?? false,
      },
      {
        createdAt: now,
        updatedAt: now,
      },
    );

    product.addDomainEvent(new ProductCreatedEvent(product.productId.value));

    return product;
  }

  public static restore(snapshot: ProductSnapshot): Product {
    return new Product(
      ProductId.create(snapshot.id),
      {
        name: ProductName.create(snapshot.name),
        description: ProductDescription.create(snapshot.description),
        price: Price.create(snapshot.price.amount, snapshot.price.currency),
        stock: Stock.create(snapshot.stock),
        sku: SKU.create(snapshot.sku),
        slug: Slug.create(snapshot.slug),
        artisanId: snapshot.artisanId,
        categoryId: CategoryId.create(snapshot.categoryId),
        status: snapshot.status,
        availability: snapshot.availability,
        isCustomizable: snapshot.isCustomizable,
        isDigital: snapshot.isDigital,
        requiresShipping: snapshot.requiresShipping,
        featured: snapshot.featured,
      },
      {
        createdAt: new Date(snapshot.createdAt),
        updatedAt: new Date(snapshot.updatedAt),
      },
    );
  }

  public changePrice(newPrice: Price): void {
    if (newPrice.amount === this._price.amount && newPrice.currency === this._price.currency) {
      return;
    }

    this._price = newPrice;
    this.touch();
    this.addDomainEvent(new ProductPriceChangedEvent(this.productId.value));
  }

  public rename(newName: ProductName): void {
    if (newName.value === this._name.value) {
      return;
    }

    this._name = newName;
    this.touch();
  }

  public updateDescription(newDescription: ProductDescription): void {
    if (newDescription.value === this._description.value) {
      return;
    }

    this._description = newDescription;
    this.touch();
  }

  public changeSlug(newSlug: Slug): void {
    if (newSlug.value === this._slug.value) {
      return;
    }

    this._slug = newSlug;
    this.touch();
  }

  public setCustomization(isCustomizable: boolean): void {
    if (this._isCustomizable === isCustomizable) {
      return;
    }

    this._isCustomizable = isCustomizable;
    this.touch();
  }

  public setDigital(isDigital: boolean): void {
    if (this._isDigital === isDigital) {
      return;
    }

    this._isDigital = isDigital;
    this.touch();
  }

  public setRequiresShipping(requiresShipping: boolean): void {
    if (this._requiresShipping === requiresShipping) {
      return;
    }

    this._requiresShipping = requiresShipping;
    this.touch();
  }

  public setFeatured(featured: boolean): void {
    if (this._featured === featured) {
      return;
    }

    this._featured = featured;
    this.touch();
  }

  public publish(): void {
    if (this._status === ProductStatus.PUBLISHED) {
      return;
    }

    this._status = ProductStatus.PUBLISHED;
    this._availability = ProductAvailability.AVAILABLE;
    this.touch();
    this.addDomainEvent(new ProductPublishedEvent(this.productId.value));
  }

  public archive(): void {
    if (this._status === ProductStatus.ARCHIVED) {
      return;
    }

    this._status = ProductStatus.ARCHIVED;
    this._availability = ProductAvailability.DISCONTINUED;
    this.touch();
    this.addDomainEvent(new ProductArchivedEvent(this.productId.value));
  }

  public increaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Stock increment must be positive');
    }
    this._stock = this._stock.add(quantity);
    this.touch();
  }

  public decreaseStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Stock decrement must be positive');
    }
    this._stock = this._stock.subtract(quantity);
    if (this._stock.value === 0) {
      this._availability = ProductAvailability.OUT_OF_STOCK;
    }
    this.touch();
  }

  public toSnapshot(): ProductSnapshot {
    return {
      id: this.productId.value,
      name: this._name.value,
      description: this._description.value,
      price: { amount: this._price.amount, currency: this._price.currency },
      stock: this._stock.value,
      sku: this._sku.value,
      slug: this._slug.value,
      artisanId: this._artisanId,
      categoryId: this._categoryId.value,
      status: this._status,
      availability: this._availability,
      isCustomizable: this._isCustomizable,
      isDigital: this._isDigital,
      requiresShipping: this._requiresShipping,
      featured: this._featured,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }

  public get productId(): ProductId {
    return this._productId;
  }

  public get name(): string {
    return this._name.value;
  }

  public get description(): string {
    return this._description.value;
  }

  public get price(): Price {
    return this._price;
  }

  public get stock(): number {
    return this._stock.value;
  }

  public get sku(): string {
    return this._sku.value;
  }

  public get slug(): string {
    return this._slug.value;
  }

  public get artisanId(): string {
    return this._artisanId;
  }

  public get categoryId(): string {
    return this._categoryId.value;
  }

  public get status(): ProductStatus {
    return this._status;
  }

  public get availability(): ProductAvailability {
    return this._availability;
  }

  public get isCustomizable(): boolean {
    return this._isCustomizable;
  }

  public get isDigital(): boolean {
    return this._isDigital;
  }

  public get featured(): boolean {
    return this._featured;
  }

  /**
   * Indica si el producto está activo/publicado.
   */
  public isActive(): boolean {
    return this._status === ProductStatus.PUBLISHED;
  }

  public get isActive(): boolean {
    return this.isActive();
  }
}

export class PricingPolicy {
  static assertHasValidPrice(product: Product): void {
    if (!product.price || product.price.amount <= 0) {
      throw new Error('Product price must be greater than zero');
    }
  }
}
