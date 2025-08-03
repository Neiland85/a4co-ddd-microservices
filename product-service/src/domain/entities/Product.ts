import { AggregateRoot } from '../shared/AggregateRoot';
import { DomainEvent } from '../shared/DomainEvent';
import { Result } from '../shared/Result';
import { Money } from '../value-objects/Money';
import { ProductId } from '../value-objects/ProductId';
import { ProductSku } from '../value-objects/ProductSku';
import { ProductVariant } from './ProductVariant';
import { ProductImage } from '../value-objects/ProductImage';
import { ProductAttribute } from '../value-objects/ProductAttribute';

interface ProductProps {
  sku: ProductSku;
  name: string;
  description?: string;
  price: Money;
  categoryId: string;
  isActive: boolean;
  variants: ProductVariant[];
  images: ProductImage[];
  attributes: ProductAttribute[];
}

export class Product extends AggregateRoot<ProductProps> {
  private constructor(props: ProductProps, id?: ProductId) {
    super(props, id);
  }

  get productId(): ProductId {
    return this._id as ProductId;
  }

  get sku(): ProductSku {
    return this.props.sku;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get price(): Money {
    return this.props.price;
  }

  get categoryId(): string {
    return this.props.categoryId;
  }

  get isActive(): boolean {
    return this.props.isActive;
  }

  get variants(): ProductVariant[] {
    return this.props.variants;
  }

  get images(): ProductImage[] {
    return this.props.images;
  }

  get attributes(): ProductAttribute[] {
    return this.props.attributes;
  }

  public static create(props: {
    sku: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    categoryId: string;
  }, id?: ProductId): Result<Product> {
    // Validaciones de negocio
    if (!props.name || props.name.trim().length === 0) {
      return Result.fail<Product>('Product name is required');
    }

    if (props.price < 0) {
      return Result.fail<Product>('Product price cannot be negative');
    }

    // Crear value objects
    const skuOrError = ProductSku.create(props.sku);
    if (skuOrError.isFailure) {
      return Result.fail<Product>(skuOrError.error as string);
    }

    const moneyOrError = Money.create({
      amount: props.price,
      currency: props.currency
    });
    if (moneyOrError.isFailure) {
      return Result.fail<Product>(moneyOrError.error as string);
    }

    const product = new Product({
      sku: skuOrError.getValue(),
      name: props.name,
      description: props.description,
      price: moneyOrError.getValue(),
      categoryId: props.categoryId,
      isActive: true,
      variants: [],
      images: [],
      attributes: []
    }, id);

    // Agregar evento de dominio
    if (!id) {
      product.addDomainEvent(new ProductCreatedEvent(product));
    }

    return Result.ok<Product>(product);
  }

  public updatePrice(newPrice: Money): Result<void> {
    if (newPrice.amount < 0) {
      return Result.fail<void>('Price cannot be negative');
    }

    const oldPrice = this.props.price;
    this.props.price = newPrice;

    this.addDomainEvent(new ProductPriceUpdatedEvent(
      this.productId,
      oldPrice,
      newPrice
    ));

    return Result.ok<void>();
  }

  public activate(): void {
    if (!this.props.isActive) {
      this.props.isActive = true;
      this.addDomainEvent(new ProductActivatedEvent(this.productId));
    }
  }

  public deactivate(): void {
    if (this.props.isActive) {
      this.props.isActive = false;
      this.addDomainEvent(new ProductDeactivatedEvent(this.productId));
    }
  }

  public addVariant(variant: ProductVariant): Result<void> {
    // Verificar que no exista un variante con el mismo SKU
    const existingVariant = this.props.variants.find(
      v => v.sku.value === variant.sku.value
    );

    if (existingVariant) {
      return Result.fail<void>('Variant with this SKU already exists');
    }

    this.props.variants.push(variant);
    this.addDomainEvent(new ProductVariantAddedEvent(this.productId, variant));

    return Result.ok<void>();
  }

  public removeVariant(variantId: string): Result<void> {
    const variantIndex = this.props.variants.findIndex(
      v => v.id.toString() === variantId
    );

    if (variantIndex === -1) {
      return Result.fail<void>('Variant not found');
    }

    const removedVariant = this.props.variants[variantIndex];
    this.props.variants.splice(variantIndex, 1);
    
    this.addDomainEvent(new ProductVariantRemovedEvent(this.productId, removedVariant.id));

    return Result.ok<void>();
  }

  public addImage(image: ProductImage): Result<void> {
    // Si es la primera imagen, hacerla primaria
    if (this.props.images.length === 0) {
      image.makePrimary();
    } else if (image.isPrimary) {
      // Si es primaria, quitar el flag de las demás
      this.props.images.forEach(img => img.makeSecondary());
    }

    this.props.images.push(image);
    return Result.ok<void>();
  }

  public updateCategory(newCategoryId: string): void {
    const oldCategoryId = this.props.categoryId;
    this.props.categoryId = newCategoryId;
    
    this.addDomainEvent(new ProductCategoryChangedEvent(
      this.productId,
      oldCategoryId,
      newCategoryId
    ));
  }

  public getTotalStock(): number {
    return this.props.variants.reduce(
      (total, variant) => total + variant.availableQuantity,
      0
    );
  }

  public isInStock(): boolean {
    return this.getTotalStock() > 0;
  }
}

// Domain Events
class ProductCreatedEvent extends DomainEvent {
  constructor(public readonly product: Product) {
    super();
  }
}

class ProductPriceUpdatedEvent extends DomainEvent {
  constructor(
    public readonly productId: ProductId,
    public readonly oldPrice: Money,
    public readonly newPrice: Money
  ) {
    super();
  }
}

class ProductActivatedEvent extends DomainEvent {
  constructor(public readonly productId: ProductId) {
    super();
  }
}

class ProductDeactivatedEvent extends DomainEvent {
  constructor(public readonly productId: ProductId) {
    super();
  }
}

class ProductVariantAddedEvent extends DomainEvent {
  constructor(
    public readonly productId: ProductId,
    public readonly variant: ProductVariant
  ) {
    super();
  }
}

class ProductVariantRemovedEvent extends DomainEvent {
  constructor(
    public readonly productId: ProductId,
    public readonly variantId: string
  ) {
    super();
  }
}

class ProductCategoryChangedEvent extends DomainEvent {
  constructor(
    public readonly productId: ProductId,
    public readonly oldCategoryId: string,
    public readonly newCategoryId: string
  ) {
    super();
  }
}