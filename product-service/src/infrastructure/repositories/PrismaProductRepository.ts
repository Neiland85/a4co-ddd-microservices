import { PrismaClient, Product as PrismaProduct, Prisma } from '@prisma/client';
import { Product } from '../../domain/entities/Product';
import { ProductId } from '../../domain/value-objects/ProductId';
import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { ProductMapper } from '../mappers/ProductMapper';
import { DomainEvents } from '../../domain/shared/DomainEvents';
import { Result } from '../../domain/shared/Result';

export class PrismaProductRepository implements ProductRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly mapper: ProductMapper
  ) {}

  async findById(id: ProductId): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id: id.toString() },
      include: {
        variants: true,
        images: {
          orderBy: { sortOrder: 'asc' }
        },
        attributes: true,
        category: true
      }
    });

    if (!product) {
      return null;
    }

    return this.mapper.toDomain(product);
  }

  async findBySku(sku: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { sku },
      include: {
        variants: true,
        images: {
          orderBy: { sortOrder: 'asc' }
        },
        attributes: true,
        category: true
      }
    });

    if (!product) {
      return null;
    }

    return this.mapper.toDomain(product);
  }

  async findByCategory(categoryId: string, options?: {
    skip?: number;
    take?: number;
    onlyActive?: boolean;
  }): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: {
        categoryId,
        ...(options?.onlyActive ? { isActive: true } : {})
      },
      skip: options?.skip,
      take: options?.take,
      include: {
        variants: true,
        images: {
          orderBy: { sortOrder: 'asc' }
        },
        attributes: true,
        category: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return Promise.all(products.map(p => this.mapper.toDomain(p)));
  }

  async search(criteria: {
    query?: string;
    categoryIds?: string[];
    minPrice?: number;
    maxPrice?: number;
    isActive?: boolean;
    skip?: number;
    take?: number;
  }): Promise<{ products: Product[]; total: number }> {
    const where: Prisma.ProductWhereInput = {
      AND: [
        criteria.query ? {
          OR: [
            { name: { contains: criteria.query, mode: 'insensitive' } },
            { description: { contains: criteria.query, mode: 'insensitive' } },
            { sku: { contains: criteria.query, mode: 'insensitive' } }
          ]
        } : {},
        criteria.categoryIds ? {
          categoryId: { in: criteria.categoryIds }
        } : {},
        criteria.minPrice !== undefined ? {
          price: { gte: criteria.minPrice }
        } : {},
        criteria.maxPrice !== undefined ? {
          price: { lte: criteria.maxPrice }
        } : {},
        criteria.isActive !== undefined ? {
          isActive: criteria.isActive
        } : {}
      ]
    };

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip: criteria.skip,
        take: criteria.take,
        include: {
          variants: true,
          images: {
            orderBy: { sortOrder: 'asc' }
          },
          attributes: true,
          category: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.product.count({ where })
    ]);

    const domainProducts = await Promise.all(
      products.map(p => this.mapper.toDomain(p))
    );

    return { products: domainProducts, total };
  }

  async save(product: Product): Promise<void> {
    const data = this.mapper.toPersistence(product);
    
    await this.prisma.$transaction(async (tx) => {
      // Guardar o actualizar el producto
      await tx.product.upsert({
        where: { id: product.productId.toString() },
        create: {
          id: data.id,
          sku: data.sku,
          name: data.name,
          description: data.description,
          price: data.price,
          currency: data.currency,
          categoryId: data.categoryId,
          isActive: data.isActive,
          version: data.version
        },
        update: {
          name: data.name,
          description: data.description,
          price: data.price,
          currency: data.currency,
          categoryId: data.categoryId,
          isActive: data.isActive,
          version: { increment: 1 } // Optimistic locking
        }
      });

      // Sincronizar variantes
      await this.syncVariants(tx, product.productId.toString(), data.variants);

      // Sincronizar imágenes
      await this.syncImages(tx, product.productId.toString(), data.images);

      // Sincronizar atributos
      await this.syncAttributes(tx, product.productId.toString(), data.attributes);

      // Guardar eventos de dominio
      await this.saveDomainEvents(tx, product);
    });

    // Publicar eventos después de la transacción
    DomainEvents.dispatchEventsForAggregate(product.productId);
  }

  async delete(id: ProductId): Promise<void> {
    await this.prisma.product.delete({
      where: { id: id.toString() }
    });
  }

  async exists(id: ProductId): Promise<boolean> {
    const count = await this.prisma.product.count({
      where: { id: id.toString() }
    });
    return count > 0;
  }

  private async syncVariants(
    tx: Prisma.TransactionClient,
    productId: string,
    variants: any[]
  ): Promise<void> {
    // Obtener variantes existentes
    const existingVariants = await tx.productVariant.findMany({
      where: { productId }
    });

    const existingIds = existingVariants.map(v => v.id);
    const newIds = variants.map(v => v.id);

    // Eliminar variantes que ya no existen
    const toDelete = existingIds.filter(id => !newIds.includes(id));
    if (toDelete.length > 0) {
      await tx.productVariant.deleteMany({
        where: { id: { in: toDelete } }
      });
    }

    // Crear o actualizar variantes
    for (const variant of variants) {
      await tx.productVariant.upsert({
        where: { id: variant.id },
        create: {
          id: variant.id,
          productId,
          sku: variant.sku,
          name: variant.name,
          price: variant.price,
          stockQuantity: variant.stockQuantity,
          reservedQuantity: variant.reservedQuantity,
          attributes: variant.attributes,
          isActive: variant.isActive
        },
        update: {
          name: variant.name,
          price: variant.price,
          stockQuantity: variant.stockQuantity,
          reservedQuantity: variant.reservedQuantity,
          attributes: variant.attributes,
          isActive: variant.isActive
        }
      });
    }
  }

  private async syncImages(
    tx: Prisma.TransactionClient,
    productId: string,
    images: any[]
  ): Promise<void> {
    // Eliminar todas las imágenes existentes
    await tx.productImage.deleteMany({
      where: { productId }
    });

    // Crear nuevas imágenes
    if (images.length > 0) {
      await tx.productImage.createMany({
        data: images.map(img => ({
          id: img.id,
          productId,
          url: img.url,
          alt: img.alt,
          isPrimary: img.isPrimary,
          sortOrder: img.sortOrder
        }))
      });
    }
  }

  private async syncAttributes(
    tx: Prisma.TransactionClient,
    productId: string,
    attributes: any[]
  ): Promise<void> {
    // Eliminar todos los atributos existentes
    await tx.productAttribute.deleteMany({
      where: { productId }
    });

    // Crear nuevos atributos
    if (attributes.length > 0) {
      await tx.productAttribute.createMany({
        data: attributes.map(attr => ({
          id: attr.id,
          productId,
          name: attr.name,
          value: attr.value,
          groupName: attr.groupName
        }))
      });
    }
  }

  private async saveDomainEvents(
    tx: Prisma.TransactionClient,
    product: Product
  ): Promise<void> {
    const events = product.getUncommittedEvents();
    
    if (events.length > 0) {
      await tx.domainEvent.createMany({
        data: events.map(event => ({
          aggregateId: product.productId.toString(),
          eventType: event.constructor.name,
          eventData: JSON.stringify(event),
          occurredAt: event.occurredAt
        }))
      });
    }
  }

  // Método para procesamiento batch
  async saveMany(products: Product[]): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      for (const product of products) {
        await this.save(product);
      }
    });
  }

  // Método para verificar stock disponible
  async checkStockAvailability(
    productId: ProductId,
    variantId?: string
  ): Promise<{ available: boolean; quantity: number }> {
    if (variantId) {
      const variant = await this.prisma.productVariant.findUnique({
        where: { id: variantId }
      });

      if (!variant) {
        return { available: false, quantity: 0 };
      }

      const available = variant.stockQuantity - variant.reservedQuantity;
      return {
        available: available > 0,
        quantity: available
      };
    }

    // Si no se especifica variante, devolver el total del producto
    const variants = await this.prisma.productVariant.findMany({
      where: { productId: productId.toString() }
    });

    const totalAvailable = variants.reduce(
      (sum, v) => sum + (v.stockQuantity - v.reservedQuantity),
      0
    );

    return {
      available: totalAvailable > 0,
      quantity: totalAvailable
    };
  }
}