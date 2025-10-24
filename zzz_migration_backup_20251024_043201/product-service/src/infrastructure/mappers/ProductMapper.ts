import { Product } from '../../domain/entities/Product';
import { ProductId } from '../../domain/value-objects/ProductId';
import { ProductSku } from '../../domain/value-objects/ProductSku';
import { Money } from '../../domain/value-objects/Money';
import { ProductVariant } from '../../domain/entities/ProductVariant';
import { ProductImage } from '../../domain/value-objects/ProductImage';
import { ProductAttribute } from '../../domain/value-objects/ProductAttribute';
import {
  Product as PrismaProduct,
  ProductVariant as PrismaVariant,
  ProductImage as PrismaImage,
  ProductAttribute as PrismaAttribute,
} from '@prisma/client';

type ProductWithRelations = PrismaProduct & {
  variants: PrismaVariant[];
  images: PrismaImage[];
  attributes: PrismaAttribute[];
};

export class ProductMapper {
  /**
   * Convierte un producto del dominio a formato de persistencia
   */
  public toPersistence(product: Product): any {
    return {
      id: product.productId.toString(),
      sku: product.sku.value,
      name: product.name,
      description: product.description,
      price: product.price.amount,
      currency: product.price.currency,
      categoryId: product.categoryId,
      isActive: product.isActive,
      version: 1, // Se maneja con optimistic locking en la DB
      variants: product.variants.map(v => this.variantToPersistence(v)),
      images: product.images.map((img, index) => this.imageToPersistence(img, index)),
      attributes: product.attributes.map(attr => this.attributeToPersistence(attr)),
    };
  }

  /**
   * Convierte un producto de la base de datos a entidad de dominio
   */
  public async toDomain(raw: ProductWithRelations): Promise<Product> {
    // Crear value objects
    const productId = ProductId.create(raw.id).getValue();
    const sku = ProductSku.create(raw.sku).getValue();
    const price = Money.create({
      amount: raw.price.toNumber(),
      currency: raw.currency,
    }).getValue();

    // Mapear variantes
    const variants = await Promise.all(raw.variants.map(v => this.variantToDomain(v)));

    // Mapear imágenes
    const images = raw.images.map(img => this.imageToDomain(img));

    // Mapear atributos
    const attributes = raw.attributes.map(attr => this.attributeToDomain(attr));

    // Reconstruir la entidad de dominio
    const productOrError = Product.create(
      {
        sku: raw.sku,
        name: raw.name,
        description: raw.description || undefined,
        price: raw.price.toNumber(),
        currency: raw.currency,
        categoryId: raw.categoryId,
      },
      productId
    );

    if (productOrError.isFailure) {
      throw new Error(`Failed to create product from persistence: ${productOrError.error}`);
    }

    const product = productOrError.getValue();

    // Establecer el estado directamente (bypassing business rules para reconstrucción)
    // Esto es seguro porque estamos reconstruyendo desde un estado válido en la DB
    (product as any).props.isActive = raw.isActive;
    (product as any).props.variants = variants;
    (product as any).props.images = images;
    (product as any).props.attributes = attributes;

    // Marcar como "commited" para que no genere eventos al cargar
    product.markEventsAsCommitted();

    return product;
  }

  private variantToPersistence(variant: ProductVariant): any {
    return {
      id: variant.id,
      sku: variant.sku.value,
      name: variant.name,
      price: variant.price?.amount || null,
      stockQuantity: variant.stockQuantity,
      reservedQuantity: variant.reservedQuantity,
      attributes: variant.attributes,
      isActive: variant.isActive,
    };
  }

  private async variantToDomain(raw: PrismaVariant): Promise<ProductVariant> {
    const sku = ProductSku.create(raw.sku).getValue();
    const price = raw.price
      ? Money.create({
          amount: raw.price.toNumber(),
          currency: 'USD', // Asumimos la misma moneda que el producto
        }).getValue()
      : undefined;

    return ProductVariant.create({
      id: raw.id,
      sku: raw.sku,
      name: raw.name,
      price: raw.price?.toNumber(),
      currency: 'USD',
      stockQuantity: raw.stockQuantity,
      reservedQuantity: raw.reservedQuantity,
      attributes: raw.attributes as Record<string, any>,
      isActive: raw.isActive,
    }).getValue();
  }

  private imageToPersistence(image: ProductImage, sortOrder: number): any {
    return {
      id: image.id,
      url: image.url,
      alt: image.alt,
      isPrimary: image.isPrimary,
      sortOrder: sortOrder,
    };
  }

  private imageToDomain(raw: PrismaImage): ProductImage {
    return ProductImage.create({
      id: raw.id,
      url: raw.url,
      alt: raw.alt || undefined,
      isPrimary: raw.isPrimary,
      sortOrder: raw.sortOrder,
    }).getValue();
  }

  private attributeToPersistence(attribute: ProductAttribute): any {
    return {
      id: attribute.id,
      name: attribute.name,
      value: attribute.value,
      groupName: attribute.groupName,
    };
  }

  private attributeToDomain(raw: PrismaAttribute): ProductAttribute {
    return ProductAttribute.create({
      id: raw.id,
      name: raw.name,
      value: raw.value,
      groupName: raw.groupName || undefined,
    }).getValue();
  }

  /**
   * Mapeo de múltiples productos (para operaciones batch)
   */
  public async toDomainMany(raws: ProductWithRelations[]): Promise<Product[]> {
    return Promise.all(raws.map(raw => this.toDomain(raw)));
  }

  public toPersistenceMany(products: Product[]): any[] {
    return products.map(product => this.toPersistence(product));
  }
}
