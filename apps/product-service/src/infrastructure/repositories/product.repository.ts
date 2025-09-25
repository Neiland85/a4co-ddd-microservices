import { Product } from '../../domain/aggregates/product.aggregate';
import { PrismaClient } from '../generated/prisma';

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  save(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
}

export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Product | null> {
    const productData = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!productData) return null;

    return Product.reconstruct({
      id: productData.id,
      productId: productData.id,
      name: productData.name,
      description: productData.description,
      sku: productData.sku || undefined,
      slug: productData.slug || undefined,
      price: Number(productData.price),
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
      currency: productData.currency,
      artisanId: productData.artisanId,
      categoryId: productData.categoryId,
      status: productData.status as any,
      availability: productData.availability as any,
      isHandmade: productData.isHandmade || undefined,
      isCustomizable: productData.isCustomizable,
      isDigital: productData.isDigital || undefined,
      requiresShipping: productData.requiresShipping || undefined,
      keywords: productData.keywords || [],
      metaTitle: productData.metaTitle || undefined,
      metaDescription: productData.metaDescription || undefined,
      craftingTimeHours: 0,
      sustainabilityScore: undefined,
      materials: [],
      dimensions: undefined,
      variants: [],
      images: [],
      tags: [],
      createdAt: productData.createdAt,
      updatedAt: productData.updatedAt,
    });
  }

  async findBySku(sku: string): Promise<Product | null> {
    const productData = await this.prisma.product.findUnique({
      where: { sku },
    });

    if (!productData) return null;

    return Product.reconstruct({
      id: productData.id,
      productId: productData.id,
      name: productData.name,
      description: productData.description,
      sku: productData.sku || undefined,
      slug: productData.slug || undefined,
      price: Number(productData.price),
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
      currency: productData.currency,
      artisanId: productData.artisanId,
      categoryId: productData.categoryId,
      status: productData.status as any,
      availability: productData.availability as any,
      isHandmade: productData.isHandmade || undefined,
      isCustomizable: productData.isCustomizable,
      isDigital: productData.isDigital || undefined,
      requiresShipping: productData.requiresShipping || undefined,
      keywords: productData.keywords || [],
      metaTitle: productData.metaTitle || undefined,
      metaDescription: productData.metaDescription || undefined,
      craftingTimeHours: 0,
      sustainabilityScore: undefined,
      materials: [],
      dimensions: undefined,
      variants: [],
      images: [],
      tags: [],
      createdAt: productData.createdAt,
      updatedAt: productData.updatedAt,
    });
  }

  async findBySlug(slug: string): Promise<Product | null> {
    const productData = await this.prisma.product.findUnique({
      where: { slug },
    });

    if (!productData) return null;

    return Product.reconstruct({
      id: productData.id,
      productId: productData.id,
      name: productData.name,
      description: productData.description,
      sku: productData.sku || undefined,
      slug: productData.slug || undefined,
      price: Number(productData.price),
      originalPrice: productData.originalPrice ? Number(productData.originalPrice) : undefined,
      currency: productData.currency,
      artisanId: productData.artisanId,
      categoryId: productData.categoryId,
      status: productData.status as any,
      availability: productData.availability as any,
      isHandmade: productData.isHandmade || undefined,
      isCustomizable: productData.isCustomizable,
      isDigital: productData.isDigital || undefined,
      requiresShipping: productData.requiresShipping || undefined,
      keywords: productData.keywords || [],
      metaTitle: productData.metaTitle || undefined,
      metaDescription: productData.metaDescription || undefined,
      craftingTimeHours: 0,
      sustainabilityScore: undefined,
      materials: [],
      dimensions: undefined,
      variants: [],
      images: [],
      tags: [],
      createdAt: productData.createdAt,
      updatedAt: productData.updatedAt,
    });
  }

  async save(product: Product): Promise<void> {
    const persistenceData = product.toPersistence();

    await this.prisma.product.create({
      data: {
        id: persistenceData.id,
        name: persistenceData.name,
        description: persistenceData.description,
        sku: persistenceData.sku,
        slug: persistenceData.slug,
        price: persistenceData.price,
        originalPrice: persistenceData.originalPrice,
        currency: persistenceData.currency,
        artisanId: persistenceData.artisanId,
        categoryId: persistenceData.categoryId,
        status: persistenceData.status as any,
        availability: persistenceData.availability as any,
        isHandmade: persistenceData.isHandmade,
        isCustomizable: persistenceData.isCustomizable,
        isDigital: persistenceData.isDigital,
        requiresShipping: persistenceData.requiresShipping,
        keywords: persistenceData.keywords,
        metaTitle: persistenceData.metaTitle,
        metaDescription: persistenceData.metaDescription,
      },
    });
  }

  async update(product: Product): Promise<void> {
    const persistenceData = product.toPersistence();

    await this.prisma.product.update({
      where: { id: persistenceData.id },
      data: {
        name: persistenceData.name,
        description: persistenceData.description,
        sku: persistenceData.sku,
        slug: persistenceData.slug,
        price: persistenceData.price,
        originalPrice: persistenceData.originalPrice,
        currency: persistenceData.currency,
        artisanId: persistenceData.artisanId,
        categoryId: persistenceData.categoryId,
        status: persistenceData.status as any,
        availability: persistenceData.availability as any,
        isHandmade: persistenceData.isHandmade,
        isCustomizable: persistenceData.isCustomizable,
        isDigital: persistenceData.isDigital,
        requiresShipping: persistenceData.requiresShipping,
        keywords: persistenceData.keywords,
        metaTitle: persistenceData.metaTitle,
        metaDescription: persistenceData.metaDescription,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }
}
