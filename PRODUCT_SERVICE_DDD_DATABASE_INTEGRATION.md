# 🗄️ INTEGRACIÓN DDD CON BASE DE DATOS - PRODUCT SERVICE
**Proyecto:** A4CO DDD Marketplace Local de Jaén  
**Fecha:** Enero 2025  
**Enfoque:** Domain-Driven Design + Prisma ORM

## 🎯 RESUMEN EJECUTIVO

Este documento detalla la implementación de persistencia DDD para el **product-service**, diseñando un esquema de base de datos que refleje fielmente el modelo de dominio, respetando aggregates, entidades y value objects, con implementación de repositorios usando Prisma ORM.

### Principios DDD en Persistencia:
- **Agregados como unidades de consistencia**: Cada agregado se persiste como una transacción atómica
- **Separación dominio-infraestructura**: El dominio no depende de detalles de persistencia
- **Mapeo dominio-relacional**: Los objetos de dominio se mapean correctamente a tablas relacionales
- **Integridad referencial**: Las reglas de negocio se reflejan en constraints de BD

---

## 🏗️ MODELO DE DOMINIO DEL PRODUCT SERVICE

### Product Aggregate Root

```typescript
// apps/product-service/src/domain/aggregates/product.aggregate.ts
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
```

### Value Objects

```typescript
// apps/product-service/src/domain/value-objects/product-value-objects.ts
import { ValueObject } from '@a4co/shared-utils';
import { v4 as uuidv4 } from 'uuid';

export class ProductId extends ValueObject<string> {
  constructor(value?: string) {
    super(value || uuidv4());
  }

  public static fromString(value: string): ProductId {
    if (!value || value.trim().length === 0) {
      throw new Error('ProductId cannot be empty');
    }
    return new ProductId(value);
  }
}

export class ProductName extends ValueObject<string> {
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }
    if (value.length > 200) {
      throw new Error('Product name cannot exceed 200 characters');
    }
    super(value.trim());
  }
}

export class ProductDescription extends ValueObject<string> {
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('Product description cannot be empty');
    }
    if (value.length > 2000) {
      throw new Error('Product description cannot exceed 2000 characters');
    }
    super(value.trim());
  }
}

export class Price extends ValueObject<{ amount: number; currency: string }> {
  constructor(amount: number, currency: string) {
    if (amount < 0) {
      throw new Error('Price amount cannot be negative');
    }
    if (!currency || currency.length !== 3) {
      throw new Error('Currency must be a valid 3-letter code');
    }
    super({ amount, currency: currency.toUpperCase() });
  }

  public get amount(): number {
    return this._value.amount;
  }

  public get currency(): string {
    return this._value.currency;
  }

  public add(other: Price): Price {
    if (this.currency !== other.currency) {
      throw new Error('Cannot add prices with different currencies');
    }
    return new Price(this.amount + other.amount, this.currency);
  }

  public multiply(factor: number): Price {
    return new Price(this.amount * factor, this.currency);
  }
}

export class CategoryId extends ValueObject<string> {
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('CategoryId cannot be empty');
    }
    super(value);
  }
}

export class SKU extends ValueObject<string> {
  constructor(value: string) {
    if (!value || value.trim().length === 0) {
      throw new Error('SKU cannot be empty');
    }
    if (!/^[A-Z0-9-_]+$/i.test(value)) {
      throw new Error('SKU can only contain alphanumeric characters, hyphens, and underscores');
    }
    super(value.toUpperCase());
  }
}
```

### Entidades

```typescript
// apps/product-service/src/domain/entities/product-variant.entity.ts
import { BaseEntity } from '@a4co/shared-utils';
import { Price, SKU } from '../value-objects/product-value-objects';

export class ProductVariant extends BaseEntity {
  private constructor(
    id: string,
    private readonly _productId: string,
    private _name: string,
    private _description?: string,
    private _price: Price,
    private _sku?: SKU,
    private _attributes: Record<string, string> = {},
    private _isActive: boolean = true,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id);
    if (createdAt) (this as any).createdAt = createdAt;
    if (updatedAt) (this as any).updatedAt = updatedAt;
  }

  public static create(data: {
    productId: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    sku?: string;
    attributes: Record<string, string>;
  }): ProductVariant {
    return new ProductVariant(
      uuidv4(),
      data.productId,
      data.name,
      data.description,
      new Price(data.price, data.currency),
      data.sku ? new SKU(data.sku) : undefined,
      data.attributes
    );
  }

  public static reconstruct(data: {
    id: string;
    productId: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    sku?: string;
    attributes: Record<string, string>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): ProductVariant {
    return new ProductVariant(
      data.id,
      data.productId,
      data.name,
      data.description,
      new Price(data.price, data.currency),
      data.sku ? new SKU(data.sku) : undefined,
      data.attributes,
      data.isActive,
      data.createdAt,
      data.updatedAt
    );
  }

  // Getters
  public get productId(): string {
    return this._productId;
  }

  public get name(): string {
    return this._name;
  }

  public get description(): string | undefined {
    return this._description;
  }

  public get price(): number {
    return this._price.amount;
  }

  public get currency(): string {
    return this._price.currency;
  }

  public get sku(): string | undefined {
    return this._sku?.value;
  }

  public get attributes(): Record<string, string> {
    return { ...this._attributes };
  }

  public get isActive(): boolean {
    return this._isActive;
  }

  // Métodos de negocio
  public updateName(name: string): void {
    this._name = name;
    this.touch();
  }

  public updatePrice(amount: number, currency: string): void {
    this._price = new Price(amount, currency);
    this.touch();
  }

  public updateAttribute(key: string, value: string): void {
    this._attributes[key] = value;
    this.touch();
  }

  public activate(): void {
    this._isActive = true;
    this.touch();
  }

  public deactivate(): void {
    this._isActive = false;
    this.touch();
  }

  public toPersistence(): {
    id: string;
    productId: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    sku?: string;
    attributes: Record<string, string>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.id,
      productId: this._productId,
      name: this._name,
      description: this._description,
      price: this._price.amount,
      currency: this._price.currency,
      sku: this._sku?.value,
      attributes: this._attributes,
      isActive: this._isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

// apps/product-service/src/domain/entities/product-image.entity.ts
import { BaseEntity } from '@a4co/shared-utils';

export class ProductImage extends BaseEntity {
  private constructor(
    id: string,
    private readonly _productId: string,
    private _url: string,
    private _altText: string,
    private _isPrimary: boolean = false,
    private _sortOrder: number = 0,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id);
    if (createdAt) (this as any).createdAt = createdAt;
    if (updatedAt) (this as any).updatedAt = updatedAt;
  }

  public static create(data: {
    productId: string;
    url: string;
    altText: string;
    isPrimary?: boolean;
    sortOrder?: number;
  }): ProductImage {
    return new ProductImage(
      uuidv4(),
      data.productId,
      data.url,
      data.altText,
      data.isPrimary || false,
      data.sortOrder || 0
    );
  }

  public static reconstruct(data: {
    id: string;
    productId: string;
    url: string;
    altText: string;
    isPrimary: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
  }): ProductImage {
    return new ProductImage(
      data.id,
      data.productId,
      data.url,
      data.altText,
      data.isPrimary,
      data.sortOrder,
      data.createdAt,
      data.updatedAt
    );
  }

  // Getters
  public get productId(): string {
    return this._productId;
  }

  public get url(): string {
    return this._url;
  }

  public get altText(): string {
    return this._altText;
  }

  public get isPrimary(): boolean {
    return this._isPrimary;
  }

  public get sortOrder(): number {
    return this._sortOrder;
  }

  // Métodos de negocio
  public setPrimary(isPrimary: boolean): void {
    this._isPrimary = isPrimary;
    this.touch();
  }

  public updateSortOrder(sortOrder: number): void {
    this._sortOrder = sortOrder;
    this.touch();
  }

  public toPersistence(): {
    id: string;
    productId: string;
    url: string;
    altText: string;
    isPrimary: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.id,
      productId: this._productId,
      url: this._url,
      altText: this._altText,
      isPrimary: this._isPrimary,
      sortOrder: this._sortOrder,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

// apps/product-service/src/domain/entities/product-tag.entity.ts
import { BaseEntity } from '@a4co/shared-utils';

export class ProductTag extends BaseEntity {
  private constructor(
    id: string,
    private readonly _productId: string,
    private _name: string,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id);
    if (createdAt) (this as any).createdAt = createdAt;
    if (updatedAt) (this as any).updatedAt = updatedAt;
  }

  public static create(data: {
    productId: string;
    name: string;
  }): ProductTag {
    return new ProductTag(
      uuidv4(),
      data.productId,
      data.name.toLowerCase().trim()
    );
  }

  public static reconstruct(data: {
    id: string;
    productId: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }): ProductTag {
    return new ProductTag(
      data.id,
      data.productId,
      data.name,
      data.createdAt,
      data.updatedAt
    );
  }

  // Getters
  public get productId(): string {
    return this._productId;
  }

  public get name(): string {
    return this._name;
  }

  public toPersistence(): {
    id: string;
    productId: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.id,
      productId: this._productId,
      name: this._name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
```

---

## 🗄️ ESQUEMA DE BASE DE DATOS CON PRISMA

### Prisma Schema Completo

```prisma
// apps/product-service/prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/infrastructure/generated/prisma"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// AGREGADO PRINCIPAL - PRODUCTS
model Product {
  // Identificadores
  id         String @id @default(uuid()) @db.Uuid
  productId  String @unique @default(uuid()) @db.Uuid // Business ID
  
  // Información básica
  name        String @db.VarChar(200)
  description String @db.Text
  
  // Precio
  price    Decimal @db.Decimal(10, 2)
  currency String  @db.VarChar(3) @default("EUR")
  
  // Relaciones externas
  categoryId String @db.Uuid
  artisanId  String @db.Uuid
  
  // Estados
  status       ProductStatus       @default(DRAFT)
  availability ProductAvailability @default(IN_STOCK)
  
  // Información de artesanía
  craftingTimeHours   Int     @default(0)
  sustainabilityScore Int?    @db.SmallInt // 0-100
  isCustomizable      Boolean @default(false)
  
  // Arrays JSON para simplicidad
  materials String[] @default([])
  
  // Dimensiones (JSON para flexibilidad)
  dimensions Json?
  
  // Timestamps
  createdAt DateTime @default(now()) @db.Timestamptz
  updatedAt DateTime @updatedAt @db.Timestamptz
  
  // ENTIDADES DEL AGREGADO
  variants ProductVariant[]
  images   ProductImage[]
  tags     ProductTag[]
  
  // Índices
  @@index([categoryId])
  @@index([artisanId])
  @@index([status])
  @@index([availability])
  @@index([name])
  @@index([createdAt])
  @@map("products")
}

// ENTIDAD - PRODUCT VARIANTS
model ProductVariant {
  // Identificadores
  id        String @id @default(uuid()) @db.Uuid
  productId String @db.Uuid
  
  // Información básica
  name        String  @db.VarChar(200)
  description String? @db.Text
  
  // Precio específico de la variante
  price    Decimal @db.Decimal(10, 2)
  currency String  @db.VarChar(3) @default("EUR")
  
  // SKU único por variante
  sku String? @unique @db.VarChar(100)
  
  // Atributos específicos (JSON para flexibilidad)
  attributes Json @default("{}")
  
  // Estado
  isActive Boolean @default(true)
  
  // Timestamps
  createdAt DateTime @default(now()) @db.Timestamptz
  updatedAt DateTime @updatedAt @db.Timestamptz
  
  // Relación con Product (parte del agregado)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  // Índices
  @@index([productId])
  @@index([isActive])
  @@index([sku])
  @@map("product_variants")
}

// ENTIDAD - PRODUCT IMAGES
model ProductImage {
  // Identificadores
  id        String @id @default(uuid()) @db.Uuid
  productId String @db.Uuid
  
  // Información de la imagen
  url     String @db.VarChar(500)
  altText String @db.VarChar(200)
  
  // Ordenamiento y características
  isPrimary Boolean @default(false)
  sortOrder Int     @default(0)
  
  // Timestamps
  createdAt DateTime @default(now()) @db.Timestamptz
  updatedAt DateTime @updatedAt @db.Timestamptz
  
  // Relación con Product (parte del agregado)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  // Índices
  @@index([productId])
  @@index([isPrimary])
  @@index([sortOrder])
  @@map("product_images")
}

// ENTIDAD - PRODUCT TAGS
model ProductTag {
  // Identificadores
  id        String @id @default(uuid()) @db.Uuid
  productId String @db.Uuid
  
  // Información del tag
  name String @db.VarChar(50)
  
  // Timestamps
  createdAt DateTime @default(now()) @db.Timestamptz
  updatedAt DateTime @updatedAt @db.Timestamptz
  
  // Relación con Product (parte del agregado)
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  // Índices
  @@index([productId])
  @@index([name])
  @@unique([productId, name]) // Un producto no puede tener el mismo tag duplicado
  @@map("product_tags")
}

// TABLA DE REFERENCIA - CATEGORIES (externa al agregado)
model Category {
  id          String  @id @default(uuid()) @db.Uuid
  name        String  @db.VarChar(100)
  description String? @db.Text
  parentId    String? @db.Uuid
  
  // Jerarquía
  parent   Category?  @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children Category[] @relation("CategoryHierarchy")
  
  // Timestamps
  createdAt DateTime @default(now()) @db.Timestamptz
  updatedAt DateTime @updatedAt @db.Timestamptz
  
  @@index([parentId])
  @@map("categories")
}

// ENUMS
enum ProductStatus {
  DRAFT
  ACTIVE
  INACTIVE
  DISCONTINUED
}

enum ProductAvailability {
  IN_STOCK
  OUT_OF_STOCK
  MADE_TO_ORDER
  SEASONAL
}
```

### Migraciones de Base de Datos

```sql
-- Migration: 001_create_products_schema.sql
-- Create initial products schema with all tables and relationships

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'ACTIVE', 'INACTIVE', 'DISCONTINUED');
CREATE TYPE "ProductAvailability" AS ENUM ('IN_STOCK', 'OUT_OF_STOCK', 'MADE_TO_ORDER', 'SEASONAL');

-- Categories table (reference data)
CREATE TABLE "categories" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "parentId" UUID REFERENCES "categories"("id"),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Main Products table (Aggregate Root)
CREATE TABLE "products" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "productId" UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(10, 2) NOT NULL CHECK ("price" >= 0),
    "currency" VARCHAR(3) NOT NULL DEFAULT 'EUR',
    "categoryId" UUID NOT NULL,
    "artisanId" UUID NOT NULL,
    "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
    "availability" "ProductAvailability" NOT NULL DEFAULT 'IN_STOCK',
    "craftingTimeHours" INTEGER NOT NULL DEFAULT 0 CHECK ("craftingTimeHours" >= 0),
    "sustainabilityScore" SMALLINT CHECK ("sustainabilityScore" >= 0 AND "sustainabilityScore" <= 100),
    "isCustomizable" BOOLEAN NOT NULL DEFAULT FALSE,
    "materials" TEXT[] NOT NULL DEFAULT '{}',
    "dimensions" JSONB,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Product Variants table (Entity)
CREATE TABLE "product_variants" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "productId" UUID NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
    "name" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10, 2) NOT NULL CHECK ("price" >= 0),
    "currency" VARCHAR(3) NOT NULL DEFAULT 'EUR',
    "sku" VARCHAR(100) UNIQUE,
    "attributes" JSONB NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Product Images table (Entity)
CREATE TABLE "product_images" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "productId" UUID NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
    "url" VARCHAR(500) NOT NULL,
    "altText" VARCHAR(200) NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT FALSE,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Product Tags table (Entity)
CREATE TABLE "product_tags" (
    "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "productId" UUID NOT NULL REFERENCES "products"("id") ON DELETE CASCADE,
    "name" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE("productId", "name")
);

-- Indexes for performance
CREATE INDEX "idx_products_categoryId" ON "products"("categoryId");
CREATE INDEX "idx_products_artisanId" ON "products"("artisanId");
CREATE INDEX "idx_products_status" ON "products"("status");
CREATE INDEX "idx_products_availability" ON "products"("availability");
CREATE INDEX "idx_products_name" ON "products"("name");
CREATE INDEX "idx_products_createdAt" ON "products"("createdAt");

CREATE INDEX "idx_product_variants_productId" ON "product_variants"("productId");
CREATE INDEX "idx_product_variants_isActive" ON "product_variants"("isActive");
CREATE INDEX "idx_product_variants_sku" ON "product_variants"("sku");

CREATE INDEX "idx_product_images_productId" ON "product_images"("productId");
CREATE INDEX "idx_product_images_isPrimary" ON "product_images"("isPrimary");
CREATE INDEX "idx_product_images_sortOrder" ON "product_images"("sortOrder");

CREATE INDEX "idx_product_tags_productId" ON "product_tags"("productId");
CREATE INDEX "idx_product_tags_name" ON "product_tags"("name");

CREATE INDEX "idx_categories_parentId" ON "categories"("parentId");

-- Triggers for updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON "products" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON "product_variants" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_images_updated_at BEFORE UPDATE ON "product_images" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_tags_updated_at BEFORE UPDATE ON "product_tags" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON "categories" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Constraints and business rules
ALTER TABLE "products" ADD CONSTRAINT "chk_products_currency_format" CHECK ("currency" ~ '^[A-Z]{3}$');
ALTER TABLE "product_variants" ADD CONSTRAINT "chk_product_variants_currency_format" CHECK ("currency" ~ '^[A-Z]{3}$');

-- Comment tables for documentation
COMMENT ON TABLE "products" IS 'Main product aggregate root containing all product information';
COMMENT ON TABLE "product_variants" IS 'Product variants with different attributes and pricing';
COMMENT ON TABLE "product_images" IS 'Product images with ordering and primary image designation';
COMMENT ON TABLE "product_tags" IS 'Product tags for categorization and search';
COMMENT ON TABLE "categories" IS 'Product categories with hierarchical structure';
```

---

## 🔄 IMPLEMENTACIÓN DEL REPOSITORIO

### Repository Interface

```typescript
// apps/product-service/src/domain/repositories/product.repository.ts
import { Product } from '../aggregates/product.aggregate';
import { ProductId } from '../value-objects/product-value-objects';

export interface ProductRepository {
  // Métodos básicos de agregado
  save(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  findByProductId(productId: ProductId): Promise<Product | null>;
  delete(id: string): Promise<void>;
  
  // Consultas de negocio
  findByArtisanId(artisanId: string, options?: PaginationOptions): Promise<Product[]>;
  findByCategoryId(categoryId: string, options?: PaginationOptions): Promise<Product[]>;
  findActiveProducts(options?: PaginationOptions): Promise<Product[]>;
  
  // Búsquedas avanzadas
  searchProducts(criteria: ProductSearchCriteria): Promise<ProductSearchResult>;
  findByPriceRange(minPrice: number, maxPrice: number, currency: string): Promise<Product[]>;
  findByMaterials(materials: string[]): Promise<Product[]>;
  findCustomizableProducts(): Promise<Product[]>;
  
  // Métricas y validaciones
  countByArtisanId(artisanId: string): Promise<number>;
  existsByName(name: string, excludeId?: string): Promise<boolean>;
  findDuplicateSKUs(sku: string): Promise<Product[]>;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProductSearchCriteria {
  query?: string;
  categoryId?: string;
  artisanId?: string;
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
  materials?: string[];
  isCustomizable?: boolean;
  availability?: string;
  tags?: string[];
  sustainabilityScore?: {
    min?: number;
    max?: number;
  };
  pagination?: PaginationOptions;
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}
```

### Prisma Repository Implementation

```typescript
// apps/product-service/src/infrastructure/repositories/prisma-product.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient, Prisma } from '../generated/prisma';
import { ProductRepository, ProductSearchCriteria, ProductSearchResult, PaginationOptions } from '../../domain/repositories/product.repository';
import { Product, ProductStatus, ProductAvailability } from '../../domain/aggregates/product.aggregate';
import { ProductId } from '../../domain/value-objects/product-value-objects';
import { Logger } from '@a4co/shared-utils';

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  private readonly logger = new Logger(PrismaProductRepository.name);

  constructor(private readonly prisma: PrismaClient) {}

  async save(product: Product): Promise<void> {
    const productData = product.toPersistence();
    
    try {
      await this.prisma.$transaction(async (tx) => {
        // Upsert del producto principal
        await tx.product.upsert({
          where: { id: productData.id },
          update: {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            currency: productData.currency,
            status: productData.status,
            availability: productData.availability,
            craftingTimeHours: productData.craftingTimeHours,
            sustainabilityScore: productData.sustainabilityScore,
            isCustomizable: productData.isCustomizable,
            materials: productData.materials,
            dimensions: productData.dimensions as Prisma.JsonValue,
            updatedAt: productData.updatedAt,
          },
          create: {
            id: productData.id,
            productId: productData.productId,
            name: productData.name,
            description: productData.description,
            price: productData.price,
            currency: productData.currency,
            categoryId: productData.categoryId,
            artisanId: productData.artisanId,
            status: productData.status,
            availability: productData.availability,
            craftingTimeHours: productData.craftingTimeHours,
            sustainabilityScore: productData.sustainabilityScore,
            isCustomizable: productData.isCustomizable,
            materials: productData.materials,
            dimensions: productData.dimensions as Prisma.JsonValue,
            createdAt: productData.createdAt,
            updatedAt: productData.updatedAt,
          },
        });

        // Manejar variantes (eliminar existentes y crear nuevas)
        await tx.productVariant.deleteMany({
          where: { productId: productData.id },
        });

        const variants = product.variants.map(v => v.toPersistence());
        if (variants.length > 0) {
          await tx.productVariant.createMany({
            data: variants,
          });
        }

        // Manejar imágenes
        await tx.productImage.deleteMany({
          where: { productId: productData.id },
        });

        const images = product.images.map(i => i.toPersistence());
        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images,
          });
        }

        // Manejar tags
        await tx.productTag.deleteMany({
          where: { productId: productData.id },
        });

        const tags = product.tags.map(t => t.toPersistence());
        if (tags.length > 0) {
          await tx.productTag.createMany({
            data: tags,
          });
        }
      });

      this.logger.debug(`Product ${product.id} saved successfully`);
    } catch (error) {
      this.logger.error(`Failed to save product ${product.id}`, error);
      throw new Error(`Failed to save product: ${error.message}`);
    }
  }

  async findById(id: string): Promise<Product | null> {
    try {
      const productData = await this.prisma.product.findUnique({
        where: { id },
        include: {
          variants: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          tags: true,
        },
      });

      if (!productData) {
        return null;
      }

      return this.mapToDomainProduct(productData);
    } catch (error) {
      this.logger.error(`Failed to find product by id ${id}`, error);
      throw new Error(`Failed to find product: ${error.message}`);
    }
  }

  async findByProductId(productId: ProductId): Promise<Product | null> {
    try {
      const productData = await this.prisma.product.findUnique({
        where: { productId: productId.value },
        include: {
          variants: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          tags: true,
        },
      });

      if (!productData) {
        return null;
      }

      return this.mapToDomainProduct(productData);
    } catch (error) {
      this.logger.error(`Failed to find product by productId ${productId.value}`, error);
      throw new Error(`Failed to find product: ${error.message}`);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.product.delete({
        where: { id },
      });
      this.logger.debug(`Product ${id} deleted successfully`);
    } catch (error) {
      this.logger.error(`Failed to delete product ${id}`, error);
      throw new Error(`Failed to delete product: ${error.message}`);
    }
  }

  async findByArtisanId(artisanId: string, options?: PaginationOptions): Promise<Product[]> {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = options || {};
    
    try {
      const productsData = await this.prisma.product.findMany({
        where: { artisanId },
        include: {
          variants: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          tags: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      });

      return productsData.map(p => this.mapToDomainProduct(p));
    } catch (error) {
      this.logger.error(`Failed to find products by artisan ${artisanId}`, error);
      throw new Error(`Failed to find products: ${error.message}`);
    }
  }

  async findByCategoryId(categoryId: string, options?: PaginationOptions): Promise<Product[]> {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = options || {};
    
    try {
      const productsData = await this.prisma.product.findMany({
        where: { 
          categoryId,
          status: ProductStatus.ACTIVE 
        },
        include: {
          variants: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          tags: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      });

      return productsData.map(p => this.mapToDomainProduct(p));
    } catch (error) {
      this.logger.error(`Failed to find products by category ${categoryId}`, error);
      throw new Error(`Failed to find products: ${error.message}`);
    }
  }

  async findActiveProducts(options?: PaginationOptions): Promise<Product[]> {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = options || {};
    
    try {
      const productsData = await this.prisma.product.findMany({
        where: { 
          status: ProductStatus.ACTIVE,
          availability: {
            in: [ProductAvailability.IN_STOCK, ProductAvailability.MADE_TO_ORDER]
          }
        },
        include: {
          variants: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          tags: true,
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      });

      return productsData.map(p => this.mapToDomainProduct(p));
    } catch (error) {
      this.logger.error('Failed to find active products', error);
      throw new Error(`Failed to find products: ${error.message}`);
    }
  }

  async searchProducts(criteria: ProductSearchCriteria): Promise<ProductSearchResult> {
    const { pagination = { page: 1, limit: 20 } } = criteria;
    const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = pagination;
    
    try {
      // Construir filtros dinámicamente
      const where: Prisma.ProductWhereInput = {};
      
      if (criteria.query) {
        where.OR = [
          { name: { contains: criteria.query, mode: 'insensitive' } },
          { description: { contains: criteria.query, mode: 'insensitive' } },
          { materials: { has: criteria.query } },
        ];
      }
      
      if (criteria.categoryId) {
        where.categoryId = criteria.categoryId;
      }
      
      if (criteria.artisanId) {
        where.artisanId = criteria.artisanId;
      }
      
      if (criteria.minPrice || criteria.maxPrice) {
        where.price = {};
        if (criteria.minPrice) where.price.gte = criteria.minPrice;
        if (criteria.maxPrice) where.price.lte = criteria.maxPrice;
      }
      
      if (criteria.currency) {
        where.currency = criteria.currency;
      }
      
      if (criteria.materials && criteria.materials.length > 0) {
        where.materials = {
          hasSome: criteria.materials,
        };
      }
      
      if (criteria.isCustomizable !== undefined) {
        where.isCustomizable = criteria.isCustomizable;
      }
      
      if (criteria.availability) {
        where.availability = criteria.availability as ProductAvailability;
      }
      
      if (criteria.sustainabilityScore) {
        where.sustainabilityScore = {};
        if (criteria.sustainabilityScore.min) {
          where.sustainabilityScore.gte = criteria.sustainabilityScore.min;
        }
        if (criteria.sustainabilityScore.max) {
          where.sustainabilityScore.lte = criteria.sustainabilityScore.max;
        }
      }
      
      if (criteria.tags && criteria.tags.length > 0) {
        where.tags = {
          some: {
            name: {
              in: criteria.tags,
            },
          },
        };
      }

      // Ejecutar consulta con conteo total
      const [productsData, total] = await this.prisma.$transaction([
        this.prisma.product.findMany({
          where,
          include: {
            variants: true,
            images: {
              orderBy: { sortOrder: 'asc' },
            },
            tags: true,
          },
          orderBy: { [sortBy]: sortOrder },
          skip: (page - 1) * limit,
          take: limit,
        }),
        this.prisma.product.count({ where }),
      ]);

      const products = productsData.map(p => this.mapToDomainProduct(p));
      
      return {
        products,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      this.logger.error('Failed to search products', error);
      throw new Error(`Failed to search products: ${error.message}`);
    }
  }

  async findByPriceRange(minPrice: number, maxPrice: number, currency: string): Promise<Product[]> {
    try {
      const productsData = await this.prisma.product.findMany({
        where: {
          price: {
            gte: minPrice,
            lte: maxPrice,
          },
          currency,
          status: ProductStatus.ACTIVE,
        },
        include: {
          variants: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          tags: true,
        },
        orderBy: { price: 'asc' },
      });

      return productsData.map(p => this.mapToDomainProduct(p));
    } catch (error) {
      this.logger.error(`Failed to find products by price range ${minPrice}-${maxPrice} ${currency}`, error);
      throw new Error(`Failed to find products: ${error.message}`);
    }
  }

  async findByMaterials(materials: string[]): Promise<Product[]> {
    try {
      const productsData = await this.prisma.product.findMany({
        where: {
          materials: {
            hasSome: materials,
          },
          status: ProductStatus.ACTIVE,
        },
        include: {
          variants: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          tags: true,
        },
      });

      return productsData.map(p => this.mapToDomainProduct(p));
    } catch (error) {
      this.logger.error(`Failed to find products by materials ${materials.join(', ')}`, error);
      throw new Error(`Failed to find products: ${error.message}`);
    }
  }

  async findCustomizableProducts(): Promise<Product[]> {
    try {
      const productsData = await this.prisma.product.findMany({
        where: {
          isCustomizable: true,
          status: ProductStatus.ACTIVE,
        },
        include: {
          variants: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          tags: true,
        },
      });

      return productsData.map(p => this.mapToDomainProduct(p));
    } catch (error) {
      this.logger.error('Failed to find customizable products', error);
      throw new Error(`Failed to find products: ${error.message}`);
    }
  }

  async countByArtisanId(artisanId: string): Promise<number> {
    try {
      return await this.prisma.product.count({
        where: { artisanId },
      });
    } catch (error) {
      this.logger.error(`Failed to count products by artisan ${artisanId}`, error);
      throw new Error(`Failed to count products: ${error.message}`);
    }
  }

  async existsByName(name: string, excludeId?: string): Promise<boolean> {
    try {
      const where: Prisma.ProductWhereInput = {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      };
      
      if (excludeId) {
        where.id = { not: excludeId };
      }

      const count = await this.prisma.product.count({ where });
      return count > 0;
    } catch (error) {
      this.logger.error(`Failed to check if product exists by name ${name}`, error);
      throw new Error(`Failed to check product existence: ${error.message}`);
    }
  }

  async findDuplicateSKUs(sku: string): Promise<Product[]> {
    try {
      const productsData = await this.prisma.product.findMany({
        where: {
          variants: {
            some: {
              sku: {
                equals: sku,
                mode: 'insensitive',
              },
            },
          },
        },
        include: {
          variants: true,
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          tags: true,
        },
      });

      return productsData.map(p => this.mapToDomainProduct(p));
    } catch (error) {
      this.logger.error(`Failed to find duplicate SKUs for ${sku}`, error);
      throw new Error(`Failed to find duplicate SKUs: ${error.message}`);
    }
  }

  private mapToDomainProduct(productData: any): Product {
    return Product.reconstruct({
      id: productData.id,
      productId: productData.productId,
      name: productData.name,
      description: productData.description,
      price: Number(productData.price),
      currency: productData.currency,
      categoryId: productData.categoryId,
      artisanId: productData.artisanId,
      status: productData.status,
      availability: productData.availability,
      craftingTimeHours: productData.craftingTimeHours,
      sustainabilityScore: productData.sustainabilityScore,
      isCustomizable: productData.isCustomizable,
      materials: productData.materials,
      dimensions: productData.dimensions,
      variants: productData.variants || [],
      images: productData.images || [],
      tags: productData.tags || [],
      createdAt: productData.createdAt,
      updatedAt: productData.updatedAt,
    });
  }
}
```

---

## 🧪 EJEMPLO DE USO DEL REPOSITORIO

### Application Service

```typescript
// apps/product-service/src/application/services/product-application.service.ts
import { Injectable } from '@nestjs/common';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/aggregates/product.aggregate';
import { ProductId } from '../../domain/value-objects/product-value-objects';
import { Logger } from '@a4co/shared-utils';
import { EnhancedEventBus } from '@a4co/shared-utils';

@Injectable()
export class ProductApplicationService {
  private readonly logger = new Logger(ProductApplicationService.name);

  constructor(
    private readonly productRepository: ProductRepository,
    private readonly eventBus: EnhancedEventBus
  ) {}

  async createProduct(command: CreateProductCommand): Promise<{ productId: string }> {
    this.logger.debug('Creating new product', { artisanId: command.artisanId, name: command.name });

    try {
      // Validar que no exista un producto con el mismo nombre para el artesano
      const existingProducts = await this.productRepository.findByArtisanId(command.artisanId);
      const duplicateName = existingProducts.some(p => 
        p.name.toLowerCase() === command.name.toLowerCase()
      );
      
      if (duplicateName) {
        throw new Error('Product with this name already exists for this artisan');
      }

      // Crear el agregado Product
      const product = Product.create({
        name: command.name,
        description: command.description,
        price: command.price,
        currency: command.currency,
        categoryId: command.categoryId,
        artisanId: command.artisanId,
        craftingTimeHours: command.craftingTimeHours,
        materials: command.materials,
        isCustomizable: command.isCustomizable,
        sustainabilityScore: command.sustainabilityScore,
        dimensions: command.dimensions,
      });

      // Agregar variantes si las hay
      if (command.variants && command.variants.length > 0) {
        for (const variantData of command.variants) {
          product.addVariant(variantData);
        }
      }

      // Agregar imágenes si las hay
      if (command.images && command.images.length > 0) {
        for (const imageData of command.images) {
          product.addImage(imageData);
        }
      }

      // Agregar tags si los hay
      if (command.tags && command.tags.length > 0) {
        for (const tag of command.tags) {
          product.addTag(tag);
        }
      }

      // Persistir el agregado
      await this.productRepository.save(product);

      // Publicar eventos de dominio
      const events = product.getUncommittedEvents();
      for (const event of events) {
        await this.eventBus.publishDomainEvent(`product.${event.eventType.toLowerCase()}`, event);
      }
      product.clearEvents();

      this.logger.info('Product created successfully', { 
        productId: product.id,
        businessId: product.productId 
      });

      return { productId: product.productId };

    } catch (error) {
      this.logger.error('Failed to create product', error);
      throw error;
    }
  }

  async updateProduct(command: UpdateProductCommand): Promise<void> {
    this.logger.debug('Updating product', { productId: command.productId });

    try {
      // Buscar el producto
      const product = await this.productRepository.findByProductId(
        new ProductId(command.productId)
      );
      
      if (!product) {
        throw new Error('Product not found');
      }

      // Verificar que el artesano sea el propietario
      if (product.artisanId !== command.artisanId) {
        throw new Error('Unauthorized: You can only update your own products');
      }

      // Actualizar información básica
      if (command.name || command.description || command.price || command.currency) {
        product.updateBasicInfo({
          name: command.name,
          description: command.description,
          price: command.price,
          currency: command.currency,
        });
      }

      // Actualizar información de artesanía
      if (command.craftingTimeHours || command.materials || command.sustainabilityScore !== undefined || command.isCustomizable !== undefined) {
        product.updateCraftingInfo({
          craftingTimeHours: command.craftingTimeHours,
          materials: command.materials,
          sustainabilityScore: command.sustainabilityScore,
          isCustomizable: command.isCustomizable,
        });
      }

      // Persistir cambios
      await this.productRepository.save(product);

      // Publicar eventos de dominio
      const events = product.getUncommittedEvents();
      for (const event of events) {
        await this.eventBus.publishDomainEvent(`product.${event.eventType.toLowerCase()}`, event);
      }
      product.clearEvents();

      this.logger.info('Product updated successfully', { productId: command.productId });

    } catch (error) {
      this.logger.error('Failed to update product', error);
      throw error;
    }
  }

  async searchProducts(query: ProductSearchQuery): Promise<ProductSearchResult> {
    this.logger.debug('Searching products', { query: query.query, filters: query.filters });

    try {
      const searchCriteria = {
        query: query.query,
        categoryId: query.filters?.categoryId,
        artisanId: query.filters?.artisanId,
        minPrice: query.filters?.minPrice,
        maxPrice: query.filters?.maxPrice,
        currency: query.filters?.currency,
        materials: query.filters?.materials,
        isCustomizable: query.filters?.isCustomizable,
        availability: query.filters?.availability,
        tags: query.filters?.tags,
        sustainabilityScore: query.filters?.sustainabilityScore,
        pagination: {
          page: query.page || 1,
          limit: query.limit || 20,
          sortBy: query.sortBy || 'createdAt',
          sortOrder: query.sortOrder || 'desc',
        },
      };

      const result = await this.productRepository.searchProducts(searchCriteria);

      this.logger.debug('Products search completed', { 
        total: result.total, 
        page: result.page,
        resultsCount: result.products.length 
      });

      return {
        products: result.products.map(p => ({
          id: p.productId,
          name: p.name,
          description: p.description,
          price: p.price,
          artisanId: p.artisanId,
          categoryId: p.categoryId,
          status: p.status,
          availability: p.availability,
          craftingTimeHours: p.craftingTimeHours,
          sustainabilityScore: p.sustainabilityScore,
          isCustomizable: p.isCustomizable,
          materials: p.materials,
          primaryImage: p.images.find(img => img.isPrimary)?.url,
          createdAt: p.createdAt,
        })),
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
      };

    } catch (error) {
      this.logger.error('Failed to search products', error);
      throw error;
    }
  }
}

// DTOs y Commands
export interface CreateProductCommand {
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
  variants?: Array<{
    name: string;
    description?: string;
    price?: number;
    currency?: string;
    sku?: string;
    attributes: Record<string, string>;
  }>;
  images?: Array<{
    url: string;
    altText?: string;
    isPrimary?: boolean;
    sortOrder?: number;
  }>;
  tags?: string[];
}

export interface UpdateProductCommand {
  productId: string;
  artisanId: string;
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  craftingTimeHours?: number;
  materials?: string[];
  sustainabilityScore?: number;
  isCustomizable?: boolean;
}

export interface ProductSearchQuery {
  query?: string;
  filters?: {
    categoryId?: string;
    artisanId?: string;
    minPrice?: number;
    maxPrice?: number;
    currency?: string;
    materials?: string[];
    isCustomizable?: boolean;
    availability?: string;
    tags?: string[];
    sustainabilityScore?: {
      min?: number;
      max?: number;
    };
  };
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
```

---

## 🔧 CONFIGURACIÓN Y DEPLOYMENT

### Environment Configuration

```typescript
// apps/product-service/src/config/database.config.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseConfig {
  constructor(private configService: ConfigService) {}

  get databaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL') || 
           'postgresql://postgres:password@localhost:5432/a4co_products?schema=public';
  }

  get maxConnections(): number {
    return this.configService.get<number>('DB_MAX_CONNECTIONS') || 10;
  }

  get connectionTimeout(): number {
    return this.configService.get<number>('DB_CONNECTION_TIMEOUT') || 5000;
  }

  get queryTimeout(): number {
    return this.configService.get<number>('DB_QUERY_TIMEOUT') || 10000;
  }

  get logLevel(): string {
    return this.configService.get<string>('DB_LOG_LEVEL') || 'warn';
  }
}
```

### Module Configuration

```typescript
// apps/product-service/src/product.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaClient } from './infrastructure/generated/prisma';
import { PrismaProductRepository } from './infrastructure/repositories/prisma-product.repository';
import { ProductApplicationService } from './application/services/product-application.service';
import { ProductController } from './presentation/controllers/product.controller';
import { DatabaseConfig } from './config/database.config';
import { EnhancedEventBus } from '@a4co/shared-utils';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [
    DatabaseConfig,
    {
      provide: PrismaClient,
      useFactory: (config: DatabaseConfig) => {
        return new PrismaClient({
          datasources: {
            db: {
              url: config.databaseUrl,
            },
          },
          log: [config.logLevel as any],
        });
      },
      inject: [DatabaseConfig],
    },
    {
      provide: 'ProductRepository',
      useClass: PrismaProductRepository,
    },
    ProductApplicationService,
    EnhancedEventBus,
  ],
  controllers: [ProductController],
  exports: [ProductApplicationService],
})
export class ProductModule {}
```

### Docker Configuration

```dockerfile
# apps/product-service/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/product-service/package*.json ./apps/product-service/
COPY packages/shared-utils/package*.json ./packages/shared-utils/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY apps/product-service ./apps/product-service
COPY packages/shared-utils ./packages/shared-utils

# Generate Prisma client
WORKDIR /app/apps/product-service
RUN npx prisma generate

# Build application
RUN npm run build

FROM node:18-alpine AS runtime

WORKDIR /app

# Copy built application
COPY --from=builder /app/apps/product-service/dist ./dist
COPY --from=builder /app/apps/product-service/prisma ./prisma
COPY --from=builder /app/apps/product-service/node_modules ./node_modules
COPY --from=builder /app/packages/shared-utils ./packages/shared-utils

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Run migrations and start app
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
```

---

## 📊 MÉTRICAS Y PERFORMANCE

### Database Performance Monitoring

```typescript
// apps/product-service/src/infrastructure/monitoring/database-metrics.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma';
import { Counter, Histogram, register } from 'prom-client';

@Injectable()
export class DatabaseMetrics {
  private queryDuration = new Histogram({
    name: 'product_service_db_query_duration_seconds',
    help: 'Duration of database queries in seconds',
    labelNames: ['operation', 'table', 'status'],
    buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  });

  private queryCount = new Counter({
    name: 'product_service_db_query_total',
    help: 'Total number of database queries',
    labelNames: ['operation', 'table', 'status'],
  });

  private connectionPool = new Histogram({
    name: 'product_service_db_connection_pool_size',
    help: 'Database connection pool size',
    labelNames: ['status'],
  });

  constructor() {
    register.registerMetric(this.queryDuration);
    register.registerMetric(this.queryCount);
    register.registerMetric(this.connectionPool);
  }

  recordQuery(operation: string, table: string, duration: number, status: 'success' | 'error'): void {
    this.queryDuration.labels(operation, table, status).observe(duration);
    this.queryCount.labels(operation, table, status).inc();
  }

  recordConnectionPoolSize(activeConnections: number, idleConnections: number): void {
    this.connectionPool.labels('active').observe(activeConnections);
    this.connectionPool.labels('idle').observe(idleConnections);
  }
}
```

---

## 📋 CONCLUSIONES

### ✅ **Modelo de Dominio Sólido**
- **Product Aggregate** como raíz de agregado con entidades ProductVariant, ProductImage, ProductTag
- **Value Objects** robustos con validaciones de negocio (ProductId, Price, SKU)
- **Eventos de dominio** para comunicación asíncrona y auditoría

### ✅ **Esquema de Base de Datos Consistente**
- **Mapeo dominio-relacional** que preserva la integridad del modelo DDD
- **Constraínts y índices** optimizados para performance y consistencia
- **Transacciones atómicas** para mantener consistencia del agregado

### ✅ **Repository Pattern Robusto**
- **Separación clara** entre dominio e infraestructura
- **Queries optimizadas** con Prisma ORM y PostgreSQL
- **Búsquedas avanzadas** con filtros complejos y paginación

### ✅ **Performance y Escalabilidad**
- **Índices estratégicos** para consultas frecuentes
- **Paginación eficiente** para grandes volúmenes de datos
- **Métricas de monitoreo** para observabilidad de la base de datos

**Esta implementación establece una base sólida para el product-service que puede manejar el crecimiento del marketplace manteniendo la integridad del modelo de dominio y excelente performance.**