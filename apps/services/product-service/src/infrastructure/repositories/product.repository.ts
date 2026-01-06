import {
  Money,
  Product,
  ProductAvailability,
  ProductStatus,
} from '../../domain/entities/product.entity';
import { PrismaClient } from '../generated/prisma';

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findByIds(ids: string[]): Promise<Product[]>;
  findBySku(sku: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  findByArtisan(artisanId: string, page?: number, limit?: number): Promise<Product[]>;
  findByCategory(categoryId: string, page?: number, limit?: number): Promise<Product[]>;
  findFeatured(limit?: number): Promise<Product[]>;
  findPublished(page?: number, limit?: number): Promise<Product[]>;
  search(query: string, filters?: SearchFilters): Promise<Product[]>;
  save(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
  count(filters?: SearchFilters): Promise<number>;
}

export interface SearchFilters {
  categoryId?: string;
  artisanId?: string;
  status?: ProductStatus;
  availability?: ProductAvailability;
  priceMin?: number;
  priceMax?: number;
  featured?: boolean;
  tags?: string[];
}

export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Product | null> {
    const productData = await this.prisma.product.findUnique({
      where: { id },
      include: {
        variants: {
          // include: {
          //   images: true,
          // },
        },
        // images: true,
        // specifications: true,
        // category: true,
        // artisan: true,
        // inventory: true,
      },
    });

    if (!productData) {
      return null;
    }

    return this.mapToDomainEntity(productData);
  }

  async findByIds(ids: string[]): Promise<Product[]> {
    const productsData = await this.prisma.product.findMany({
      where: { id: { in: ids } },
    });

    return productsData.map(productData => this.mapToDomainEntity(productData));
  }

  async findBySku(sku: string): Promise<Product | null> {
    // SKU not implemented in current schema
    throw new Error('findBySku not implemented - SKU field not available in schema');
  }

  async findBySlug(slug: string): Promise<Product | null> {
    // Slug not implemented in current schema
    throw new Error('findBySlug not implemented - Slug field not available in schema');
  }

  async findByArtisan(artisanId: string, page: number = 1, limit: number = 10): Promise<Product[]> {
    const skip = (page - 1) * limit;

    const productsData = await this.prisma.product.findMany({
      where: { artisanId },
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
      where: { categoryId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    return productsData.map(productData => this.mapToDomainEntity(productData));
  }

  async findFeatured(limit: number = 10): Promise<Product[]> {
    // Featured not implemented in current schema
    return [];
  }

  async findPublished(page: number = 1, limit: number = 10): Promise<Product[]> {
    // Status not implemented in current schema
    return [];
  }

  async search(query: string, filters?: SearchFilters): Promise<Product[]> {
    const where: { [key: string]: unknown } = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    };

    if (filters) {
      if (filters.categoryId) {
        where['categoryId'] = filters.categoryId;
      }
      if (filters.artisanId) {
        where['artisanId'] = filters.artisanId;
      }
    }

    const productsData = await this.prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return productsData.map(productData => this.mapToDomainEntity(productData));
  }

  async save(product: Product): Promise<void> {
    await this.prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        description: product.description,
        sku: product.sku,
        price: product.price.amount,
        currency: product.price.currency,
        categoryId: product.categoryId,
        artisanId: product.artisanId,
        category: '', // Required field, using empty string for now
      },
    });
  }

  async update(product: Product): Promise<void> {
    await this.prisma.product.update({
      where: { id: product.id },
      data: {
        name: product.name,
        description: product.description,
        price: product.price.amount,
        currency: product.price.currency,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: { id },
    });
  }

  async count(filters?: SearchFilters): Promise<number> {
    const where: { [key: string]: unknown } = {};

    if (filters) {
      if (filters.categoryId) {
        where['categoryId'] = filters.categoryId;
      }
      if (filters.artisanId) {
        where['artisanId'] = filters.artisanId;
      }
    }

    return await this.prisma.product.count({ where });
  }

  // ========================================
  // MAPPERS - Convertir de Prisma a Domain Entity
  // ========================================

  private mapToDomainEntity(productData: {
    id: string;
    name: string;
    description: string;
    sku: string | null;
    price: { toNumber(): number };
    currency: string;
    categoryId: string;
    artisanId: string;
  }): Product {
    // Crear el objeto Money para el precio
    const price = new Money(productData.price.toNumber(), productData.currency);

    // Crear el producto base
    const product = new Product(
      productData.id,
      productData.name,
      productData.description,
      productData.sku || '',
      price,
      productData.artisanId,
      productData.categoryId,
      '', // slug
      undefined, // originalPrice
      false, // isHandmade
      false, // isCustomizable
      false, // isDigital
      true, // requiresShipping
      [], // tags
      [], // keywords
      undefined, // metaTitle
      undefined, // metaDescription
      false // featured
    );

    return product;
  }
}
