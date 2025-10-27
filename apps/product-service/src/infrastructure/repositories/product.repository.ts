import {
  Product,
  ProductAvailability,
  ProductStatus,
} from '../../domain/aggregates/product.aggregate';
import type { $Enums } from '../generated/prisma';
import { PrismaClient } from '../generated/prisma';
import { PrismaClient } from '../generated/prisma';
import {
  Product,
  ProductVariant,
  ProductImage,
  ProductSpecification,
  Money,
  Dimensions,
  ProductStatus,
  ProductAvailability,
  ImageType,
  SpecificationType,
} from '../../domain/entities/product.entity';

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  save(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
}

export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Product | null> {
    const productData = await this.prisma.product.findUnique({
      where: { id },
      include: {
        variants: {
          include: {
            images: true,
          },
        },
        images: true,
        specifications: true,
        category: true,
        artisan: true,
        inventory: true,
      },
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
      category: productData.category,
      stock: productData.stock,
      status: productData.status as ProductStatus,
      availability: productData.availability as ProductAvailability,
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
    return this.mapToDomainEntity(productData);
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    const productsData = await this.prisma.product.findMany({
      where: { id: { in: ids } },
      include: {
        variants: {
          include: {
            images: true,
          },
        },
        images: true,
        specifications: true,
        category: true,
        artisan: true,
        inventory: true,
      },
    });
  }

  async findBySku(sku: string): Promise<Product | null> {
    const productData = await this.prisma.product.findUnique({
      where: { sku },
      include: {
        variants: {
          include: {
            images: true,
          },
        },
        images: true,
        specifications: true,
        category: true,
        artisan: true,
        inventory: true,
      },
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
      category: productData.category,
      stock: productData.stock,
      status: productData.status as ProductStatus,
      availability: productData.availability as ProductAvailability,
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
      include: {
        variants: {
          include: {
            images: true,
          },
        },
        images: true,
        specifications: true,
        category: true,
        artisan: true,
        inventory: true,
      },
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
      category: productData.category,
      stock: productData.stock,
      status: productData.status as ProductStatus,
      availability: productData.availability as ProductAvailability,
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

  async findAll(): Promise<Product[]> {
    const productsData = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return productsData.map(productData =>
      Product.reconstruct({
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
        category: productData.category,
        stock: productData.stock,
        status: productData.status as ProductStatus,
        availability: productData.availability as ProductAvailability,
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
        createdAt: productData.createdAt,
        updatedAt: productData.updatedAt,
        tags: [],
      }),
    );
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
        category: persistenceData.category,
        stock: persistenceData.stock,
        status: persistenceData.status as $Enums.ProductStatus,
        availability: persistenceData.availability as $Enums.ProductAvailability,
        isHandmade: persistenceData.isHandmade,
        isCustomizable: persistenceData.isCustomizable,
        isDigital: persistenceData.isDigital,
        requiresShipping: persistenceData.requiresShipping,
        keywords: persistenceData.keywords,
        metaTitle: persistenceData.metaTitle,
        metaDescription: persistenceData.metaDescription,
      },
  async findByArtisan(artisanId: string, page: number = 1, limit: number = 10): Promise<Product[]> {
    const skip = (page - 1) * limit;

    const productsData = await this.prisma.product.findMany({
      where: { artisanId },
      include: {
        variants: {
          include: {
            images: true,
          },
        },
        images: true,
        specifications: true,
        category: true,
        artisan: true,
        inventory: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return productsData.map(productData => this.mapToDomainEntity(productData));
  }

  async findByCategory(
    categoryId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<Product[]> {
    const skip = (page - 1) * limit;

    const productsData = await this.prisma.product.findMany({
      where: {
        OR: [{ categoryId }, { categories: { some: { categoryId } } }],
      },
      include: {
        variants: {
          include: {
            images: true,
          },
        },
        images: true,
        specifications: true,
        category: true,
        artisan: true,
        inventory: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return productsData.map(productData => this.mapToDomainEntity(productData));
  }

  async findFeatured(limit: number = 10): Promise<Product[]> {
    const productsData = await this.prisma.product.findMany({
      where: {
        featured: true,
        status: 'PUBLISHED',
        availability: 'AVAILABLE',
      },
      include: {
        variants: {
          include: {
            images: true,
          },
        },
        images: true,
        specifications: true,
        category: true,
        artisan: true,
        inventory: true,
      },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return productsData.map(productData => this.mapToDomainEntity(productData));
  }

  async findPublished(page: number = 1, limit: number = 10): Promise<Product[]> {
    const skip = (page - 1) * limit;

    const productsData = await this.prisma.product.findMany({
      where: {
        status: 'PUBLISHED',
        availability: 'AVAILABLE',
      },
      include: {
        variants: {
          include: {
            images: true,
          },
        },
        images: true,
        specifications: true,
        category: true,
        artisan: true,
        inventory: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return productsData.map(productData => this.mapToDomainEntity(productData));
  }

  async search(query: string, filters?: SearchFilters): Promise<Product[]> {
    const where: any = {
      AND: [
        {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            { tags: { hasSome: [query] } },
            { keywords: { hasSome: [query] } },
          ],
        },
      ],
    };

    if (filters) {
      if (filters.categoryId) {
        where.AND.push({ categoryId: filters.categoryId });
      }
      if (filters.artisanId) {
        where.AND.push({ artisanId: filters.artisanId });
      }
      if (filters.status) {
        where.AND.push({ status: filters.status });
      }
      if (filters.availability) {
        where.AND.push({ availability: filters.availability });
      }
      if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
        const priceFilter: any = {};
        if (filters.priceMin !== undefined) {
          priceFilter.gte = filters.priceMin;
        }
        if (filters.priceMax !== undefined) {
          priceFilter.lte = filters.priceMax;
        }
        where.AND.push({ price: priceFilter });
      }
      if (filters.featured !== undefined) {
        where.AND.push({ featured: filters.featured });
      }
      if (filters.tags && filters.tags.length > 0) {
        where.AND.push({ tags: { hasSome: filters.tags } });
      }
    }

    const productsData = await this.prisma.product.findMany({
      where,
      include: {
        variants: {
          include: {
            images: true,
          },
        },
        images: true,
        specifications: true,
        category: true,
        artisan: true,
        inventory: true,
      },
      orderBy: [{ featured: 'desc' }, { averageRating: 'desc' }, { createdAt: 'desc' }],
    });

    return productsData.map(productData => this.mapToDomainEntity(productData));
  }

  async save(product: Product): Promise<void> {
    await this.prisma.$transaction(async tx => {
      // Crear el producto principal
      await tx.product.create({
        data: {
          id: product.id,
          name: product.name,
          description: product.description,
          sku: product.sku,
          price: product.price.amount,
          originalPrice: product.originalPrice?.amount,
          currency: product.price.currency,
          categoryId: product.categoryId,
          artisanId: product.artisanId,
          slug: product.slug,
          status: product.status,
          availability: product.availability,
          isHandmade: product.isHandmade,
          isCustomizable: product.isCustomizable,
          isDigital: product.isDigital,
          requiresShipping: product.requiresShipping,
          tags: product.tags,
          keywords: product.keywords,
          metaTitle: product.metaTitle,
          metaDescription: product.metaDescription,
          featured: product.featured,
          averageRating: product.averageRating,
          reviewCount: product.reviewCount,
          totalSold: product.totalSold,
        },
      });

      // Crear variantes
      if (product.variants.length > 0) {
        await tx.productVariant.createMany({
          data: product.variants.map(variant => ({
            id: variant.id,
            productId: product.id,
            name: variant.name,
            sku: variant.sku,
            price: variant.price.amount,
            originalPrice: variant.price.amount, // Asumiendo que originalPrice es igual a price para variants
            attributes: variant.attributes,
            stockQuantity: variant.stockQuantity,
            weight: variant.weight,
            dimensions: variant.dimensions
              ? {
                  length: variant.dimensions.length,
                  width: variant.dimensions.width,
                  height: variant.dimensions.height,
                  unit: variant.dimensions.unit,
                }
              : undefined,
            isActive: variant.isActive,
            isDefault: variant.isDefault,
          })),
        });
      }

      // Crear imágenes
      if (product.images.length > 0) {
        await tx.productImage.createMany({
          data: product.images.map((image, index) => ({
            productId: product.id,
            url: image.url,
            altText: image.altText,
            type: image.type,
            isPrimary: image.isPrimary,
            sortOrder: image.sortOrder || index,
          })),
        });
      }

      // Crear especificaciones
      if (product.specifications.length > 0) {
        await tx.productSpecification.createMany({
          data: product.specifications.map(spec => ({
            productId: product.id,
            name: spec.name,
            value: spec.value,
            type: spec.type,
            unit: spec.unit,
            category: spec.category,
          })),
        });
      }
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
        category: persistenceData.category,
        stock: persistenceData.stock,
        status: persistenceData.status as $Enums.ProductStatus,
        availability: persistenceData.availability as $Enums.ProductAvailability,
        isHandmade: persistenceData.isHandmade,
        isCustomizable: persistenceData.isCustomizable,
        isDigital: persistenceData.isDigital,
        requiresShipping: persistenceData.requiresShipping,
        keywords: persistenceData.keywords,
        metaTitle: persistenceData.metaTitle,
        metaDescription: persistenceData.metaDescription,
      },
    await this.prisma.$transaction(async tx => {
      // Actualizar producto principal
      await tx.product.update({
        where: { id: product.id },
        data: {
          name: product.name,
          description: product.description,
          price: product.price.amount,
          originalPrice: product.originalPrice?.amount,
          currency: product.price.currency,
          status: product.status,
          availability: product.availability,
          tags: product.tags,
          keywords: product.keywords,
          metaTitle: product.metaTitle,
          metaDescription: product.metaDescription,
          featured: product.featured,
          averageRating: product.averageRating,
          reviewCount: product.reviewCount,
          totalSold: product.totalSold,
        },
      });

      // Eliminar y recrear variantes (enfoque simple)
      await tx.productVariant.deleteMany({
        where: { productId: product.id },
      });

      if (product.variants.length > 0) {
        await tx.productVariant.createMany({
          data: product.variants.map(variant => ({
            id: variant.id,
            productId: product.id,
            name: variant.name,
            sku: variant.sku,
            price: variant.price.amount,
            attributes: variant.attributes,
            stockQuantity: variant.stockQuantity,
            weight: variant.weight,
            dimensions: variant.dimensions
              ? {
                  length: variant.dimensions.length,
                  width: variant.dimensions.width,
                  height: variant.dimensions.height,
                  unit: variant.dimensions.unit,
                }
              : undefined,
            isActive: variant.isActive,
            isDefault: variant.isDefault,
          })),
        });
      }

      // Eliminar y recrear imágenes
      await tx.productImage.deleteMany({
        where: { productId: product.id },
      });

      if (product.images.length > 0) {
        await tx.productImage.createMany({
          data: product.images.map((image, index) => ({
            productId: product.id,
            url: image.url,
            altText: image.altText,
            type: image.type,
            isPrimary: image.isPrimary,
            sortOrder: image.sortOrder || index,
          })),
        });
      }

      // Eliminar y recrear especificaciones
      await tx.productSpecification.deleteMany({
        where: { productId: product.id },
      });

      if (product.specifications.length > 0) {
        await tx.productSpecification.createMany({
          data: product.specifications.map(spec => ({
            productId: product.id,
            name: spec.name,
            value: spec.value,
            type: spec.type,
            unit: spec.unit,
            category: spec.category,
          })),
        });
      }
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  async count(filters?: SearchFilters): Promise<number> {
    const where: any = {};

    if (filters) {
      if (filters.categoryId) {
        where.categoryId = filters.categoryId;
      }
      if (filters.artisanId) {
        where.artisanId = filters.artisanId;
      }
      if (filters.status) {
        where.status = filters.status;
      }
      if (filters.availability) {
        where.availability = filters.availability;
      }
      if (filters.featured !== undefined) {
        where.featured = filters.featured;
      }
    }

    return await this.prisma.product.count({ where });
  }

  // MAPPERS - Convertir de Prisma a Domain Entity

  private mapToDomainEntity(productData: any): Product {
    // Crear el objeto Money para el precio
    const price = new Money(productData.price.toNumber(), productData.currency);
    const originalPrice = productData.originalPrice
      ? new Money(productData.originalPrice.toNumber(), productData.currency)
      : undefined;

    // Crear el producto base
    const product = new Product(
      productData.id,
      productData.name,
      productData.description,
      productData.sku,
      price,
      productData.artisanId,
      productData.categoryId,
      productData.slug,
      originalPrice,
      productData.isHandmade,
      productData.isCustomizable,
      productData.isDigital,
      productData.requiresShipping,
      productData.tags,
      productData.keywords,
      productData.metaTitle,
      productData.metaDescription,
      productData.featured
    );

    // Establecer estado interno usando reflexión (hack para DDD puro)
    (product as any)._status = productData.status as ProductStatus;
    (product as any)._availability = productData.availability as ProductAvailability;
    (product as any)._averageRating = productData.averageRating;
    (product as any)._reviewCount = productData.reviewCount;
    (product as any)._totalSold = productData.totalSold;

    // Agregar variantes
    if (productData.variants) {
      productData.variants.forEach((variantData: any) => {
        const variant = new ProductVariant(
          variantData.id,
          variantData.name,
          variantData.sku,
          new Money(variantData.price.toNumber(), productData.currency),
          variantData.attributes,
          variantData.stockQuantity,
          variantData.weight,
          variantData.dimensions
            ? new Dimensions(
                variantData.dimensions.length,
                variantData.dimensions.width,
                variantData.dimensions.height,
                variantData.dimensions.unit
              )
            : undefined,
          variantData.isActive,
          variantData.isDefault
        );

        product.addVariant(variant);
      });
    }

    // Agregar imágenes
    if (productData.images) {
      productData.images.forEach((imageData: any) => {
        const image = new ProductImage(
          imageData.url,
          imageData.altText,
          imageData.type as ImageType,
          imageData.isPrimary,
          imageData.sortOrder
        );

        product.addImage(image);
      });
    }

    // Agregar especificaciones
    if (productData.specifications) {
      productData.specifications.forEach((specData: any) => {
        const specification = new ProductSpecification(
          specData.name,
          specData.value,
          specData.type as SpecificationType,
          specData.unit,
          specData.category
        );

        product.addSpecification(specification);
      });
    }

    return product;
  }
}
