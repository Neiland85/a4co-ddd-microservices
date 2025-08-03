import { PrismaClient, Product as PrismaProduct, Prisma } from '@prisma/client';
import { 
  Product, 
  ProductId, 
  ProductVariant,
  Money,
  SKU,
  ProductStatus,
  VariantStatus
} from '../../domain/entities/Product';
import { IProductRepository } from '../../domain/repositories/IProductRepository';
import { Category, CategoryId } from '../../domain/entities/Category';
import { DomainEvent } from '../../domain/events/DomainEvent';

export class ProductRepository implements IProductRepository {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly eventStore: IEventStore
  ) {}

  async findById(id: ProductId): Promise<Product | null> {
    const data = await this.prisma.product.findUnique({
      where: { id: id.value },
      include: {
        variants: {
          include: {
            inventory: true,
            attributes: true,
            reservations: {
              where: {
                status: 'ACTIVE',
                expiresAt: { gte: new Date() }
              }
            }
          }
        },
        category: true,
        images: {
          orderBy: { position: 'asc' }
        },
        attributes: true
      }
    });

    if (!data) return null;

    return this.toDomainModel(data);
  }

  async findBySku(sku: SKU): Promise<Product | null> {
    const variant = await this.prisma.productVariant.findUnique({
      where: { sku: sku.value },
      include: {
        product: {
          include: {
            variants: {
              include: {
                inventory: true,
                attributes: true,
                reservations: {
                  where: {
                    status: 'ACTIVE',
                    expiresAt: { gte: new Date() }
                  }
                }
              }
            },
            category: true,
            images: {
              orderBy: { position: 'asc' }
            },
            attributes: true
          }
        }
      }
    });

    if (!variant) return null;

    return this.toDomainModel(variant.product);
  }

  async findByCategory(categoryId: CategoryId, options?: {
    limit?: number;
    offset?: number;
    includeInactive?: boolean;
  }): Promise<Product[]> {
    const where: Prisma.ProductWhereInput = {
      categoryId: categoryId.value,
      ...(options?.includeInactive ? {} : { status: 'ACTIVE' })
    };

    const products = await this.prisma.product.findMany({
      where,
      include: {
        variants: {
          include: {
            inventory: true,
            attributes: true,
            reservations: {
              where: {
                status: 'ACTIVE',
                expiresAt: { gte: new Date() }
              }
            }
          }
        },
        category: true,
        images: {
          orderBy: { position: 'asc' }
        },
        attributes: true
      },
      skip: options?.offset,
      take: options?.limit,
      orderBy: { createdAt: 'desc' }
    });

    return products.map(p => this.toDomainModel(p));
  }

  async save(product: Product): Promise<void> {
    const events = product.getUncommittedEvents();
    
    await this.prisma.$transaction(async (tx) => {
      // Save product data
      const productData = this.toPersistenceModel(product);
      
      await tx.product.upsert({
        where: { id: product.id.value },
        create: productData,
        update: {
          name: productData.name,
          description: productData.description,
          brand: productData.brand,
          categoryId: productData.categoryId,
          status: productData.status,
          updatedAt: new Date()
        }
      });

      // Save variants
      for (const variant of product.variants) {
        const variantData = this.variantToPersistence(variant, product.id);
        
        await tx.productVariant.upsert({
          where: { id: variant.id },
          create: variantData,
          update: {
            name: variantData.name,
            price: variantData.price,
            compareAtPrice: variantData.compareAtPrice,
            cost: variantData.cost,
            barcode: variantData.barcode,
            weight: variantData.weight,
            weightUnit: variantData.weightUnit,
            status: variantData.status,
            updatedAt: new Date()
          }
        });

        // Update inventory if stock changed
        if (variant.stock !== undefined) {
          await tx.inventory.upsert({
            where: { variantId: variant.id },
            create: {
              variantId: variant.id,
              quantity: variant.stock.quantity,
              reservedQuantity: variant.stock.reserved,
              location: variant.stock.location || 'default'
            },
            update: {
              quantity: variant.stock.quantity,
              reservedQuantity: variant.stock.reserved
            }
          });
        }

        // Save variant attributes
        await tx.variantAttribute.deleteMany({
          where: { variantId: variant.id }
        });
        
        for (const [name, value] of Object.entries(variant.attributes || {})) {
          await tx.variantAttribute.create({
            data: {
              variantId: variant.id,
              name,
              value: String(value)
            }
          });
        }
      }

      // Save product attributes
      await tx.productAttribute.deleteMany({
        where: { productId: product.id.value }
      });
      
      for (const [name, value] of Object.entries(product.attributes || {})) {
        await tx.productAttribute.create({
          data: {
            productId: product.id.value,
            name,
            value: String(value)
          }
        });
      }

      // Save images
      await tx.productImage.deleteMany({
        where: { productId: product.id.value }
      });
      
      for (const [index, image] of product.images.entries()) {
        await tx.productImage.create({
          data: {
            productId: product.id.value,
            url: image.url,
            alt: image.alt,
            position: index
          }
        });
      }

      // Store domain events
      for (const event of events) {
        await this.eventStore.append(event);
      }
    });

    // Mark events as committed
    product.markEventsAsCommitted();
  }

  async delete(id: ProductId): Promise<void> {
    await this.prisma.product.delete({
      where: { id: id.value }
    });
  }

  async reserveStock(
    variantId: string,
    quantity: number,
    orderId: string,
    expirationMinutes: number = 30
  ): Promise<string> {
    return await this.prisma.$transaction(async (tx) => {
      // Check available stock
      const inventory = await tx.inventory.findUnique({
        where: { variantId }
      });

      if (!inventory) {
        throw new Error('Variant not found');
      }

      const availableQuantity = inventory.quantity - inventory.reservedQuantity;
      if (availableQuantity < quantity) {
        throw new Error('Insufficient stock');
      }

      // Create reservation
      const reservation = await tx.stockReservation.create({
        data: {
          variantId,
          orderId,
          quantity,
          expiresAt: new Date(Date.now() + expirationMinutes * 60 * 1000),
          status: 'ACTIVE'
        }
      });

      // Update reserved quantity
      await tx.inventory.update({
        where: { variantId },
        data: {
          reservedQuantity: {
            increment: quantity
          }
        }
      });

      // Record stock movement
      await tx.stockMovement.create({
        data: {
          inventoryId: inventory.id,
          type: 'SALE',
          quantity: -quantity,
          reason: `Reserved for order ${orderId}`,
          reference: orderId,
          userId: 'system' // Should come from context
        }
      });

      return reservation.id;
    });
  }

  async releaseStock(reservationId: string): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const reservation = await tx.stockReservation.findUnique({
        where: { id: reservationId },
        include: { variant: { include: { inventory: true } } }
      });

      if (!reservation || reservation.status !== 'ACTIVE') {
        return; // Already released or doesn't exist
      }

      // Update reservation status
      await tx.stockReservation.update({
        where: { id: reservationId },
        data: { status: 'CANCELLED' }
      });

      // Update inventory
      await tx.inventory.update({
        where: { id: reservation.variant.inventory!.id },
        data: {
          reservedQuantity: {
            decrement: reservation.quantity
          }
        }
      });

      // Record stock movement
      await tx.stockMovement.create({
        data: {
          inventoryId: reservation.variant.inventory!.id,
          type: 'ADJUSTMENT',
          quantity: 0, // No actual stock change, just reservation
          reason: `Released reservation ${reservationId}`,
          reference: reservation.orderId,
          userId: 'system'
        }
      });
    });
  }

  async cleanupExpiredReservations(): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const expiredReservations = await tx.stockReservation.findMany({
        where: {
          status: 'ACTIVE',
          expiresAt: { lt: new Date() }
        },
        include: { variant: { include: { inventory: true } } }
      });

      for (const reservation of expiredReservations) {
        await tx.stockReservation.update({
          where: { id: reservation.id },
          data: { status: 'EXPIRED' }
        });

        if (reservation.variant.inventory) {
          await tx.inventory.update({
            where: { id: reservation.variant.inventory.id },
            data: {
              reservedQuantity: {
                decrement: reservation.quantity
              }
            }
          });
        }
      }
    });
  }

  private toDomainModel(data: any): Product {
    const variants = data.variants.map((v: any) => ({
      id: v.id,
      sku: new SKU(v.sku),
      name: v.name,
      price: Money.fromDecimal(v.price),
      compareAtPrice: v.compareAtPrice ? Money.fromDecimal(v.compareAtPrice) : undefined,
      cost: v.cost ? Money.fromDecimal(v.cost) : undefined,
      barcode: v.barcode,
      weight: v.weight,
      weightUnit: v.weightUnit,
      status: v.status as VariantStatus,
      attributes: v.attributes.reduce((acc: any, attr: any) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {}),
      stock: v.inventory ? {
        quantity: v.inventory.quantity,
        reserved: v.inventory.reservedQuantity,
        available: v.inventory.quantity - v.inventory.reservedQuantity,
        location: v.inventory.location
      } : undefined
    }));

    const category = new Category(
      new CategoryId(data.category.id),
      data.category.name,
      data.category.slug,
      data.category.parentId ? new CategoryId(data.category.parentId) : undefined
    );

    const product = Product.reconstitute(
      new ProductId(data.id),
      data.name,
      data.description,
      data.brand,
      category,
      variants,
      data.status as ProductStatus,
      data.createdAt,
      data.updatedAt
    );

    // Add attributes
    data.attributes.forEach((attr: any) => {
      product.setAttribute(attr.name, attr.value);
    });

    // Add images
    data.images.forEach((img: any) => {
      product.addImage(img.url, img.alt);
    });

    return product;
  }

  private toPersistenceModel(product: Product): any {
    return {
      id: product.id.value,
      name: product.name,
      description: product.description,
      brand: product.brand,
      categoryId: product.category.id.value,
      status: product.status
    };
  }

  private variantToPersistence(variant: ProductVariant, productId: ProductId): any {
    return {
      id: variant.id,
      productId: productId.value,
      sku: variant.sku.value,
      name: variant.name,
      price: variant.price.toDecimal(),
      compareAtPrice: variant.compareAtPrice?.toDecimal(),
      cost: variant.cost?.toDecimal(),
      barcode: variant.barcode,
      weight: variant.weight,
      weightUnit: variant.weightUnit,
      status: variant.status
    };
  }
}

// Event Store interface
interface IEventStore {
  append(event: DomainEvent): Promise<void>;
}