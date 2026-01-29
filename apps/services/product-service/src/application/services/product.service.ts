import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import {
  PRODUCT_CACHE_PORT,
  type ProductCachePort,
} from '../ports/product-cache.port';

export type ProductRecord = Record<string, unknown> & { id: string };

// ========================================
// DTOs (Data Transfer Objects)
// ========================================

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  artisanId: string;
  category: string;
  currency?: string;
  stock?: number;
  slug?: string;
  lowStockThreshold?: number;
  status?: string;
}

export interface UpdateProductDTO {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  currency?: string;
  slug?: string;
  category?: string;
  stock?: number;
  lowStockThreshold?: number;
  status?: string;
}

type ProductDelegate = {
  create(args: { data: Record<string, unknown> }): Promise<ProductRecord>;
  update(args: {
    where: Record<string, unknown>;
    data: Record<string, unknown>;
  }): Promise<ProductRecord>;
  findUnique(args: {
    where: Record<string, unknown>;
    select?: Record<string, boolean>;
  }): Promise<ProductRecord | null>;
  delete(args: { where: Record<string, unknown> }): Promise<ProductRecord>;
};

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(PRODUCT_CACHE_PORT) private readonly productCache: ProductCachePort,
  ) {}

  private get product(): ProductDelegate {
    return (this.prisma as unknown as { product: ProductDelegate }).product;
  }

  async createProduct(dto: CreateProductDTO): Promise<ProductRecord> {
    const slug = dto.slug ?? this.slugify(dto.name);

    const created = await this.product.create({
      data: {
        artisanId: dto.artisanId,
        name: dto.name,
        slug,
        description: dto.description,
        price: dto.price,
        currency: dto.currency ?? 'EUR',
        category: dto.category,
        stock: dto.stock ?? 0,
        lowStockThreshold: dto.lowStockThreshold ?? 10,
        status: dto.status,
      },
    });

    await this.productCache.invalidateProductCache(created.id);
    return created;
  }

  async updateProduct(dto: UpdateProductDTO): Promise<ProductRecord> {
    try {
      const updated = await this.product.update({
        where: { id: dto.id },
        data: {
          name: dto.name,
          description: dto.description,
          slug: dto.slug,
          price: dto.price,
          currency: dto.currency,
          category: dto.category,
          stock: dto.stock,
          lowStockThreshold: dto.lowStockThreshold,
          status: dto.status,
        },
      });

      await this.productCache.invalidateProductCache(updated.id);
      return updated;
    } catch {
      throw new Error(`Product with id ${dto.id} not found`);
    }
  }

  async findById(id: string): Promise<ProductRecord | null> {
    const cached = await this.productCache.getProductFromCache(id);
    if (cached && typeof cached === 'object') {
      return cached as ProductRecord;
    }

    const product = await this.product.findUnique({ where: { id } });
    if (product) {
      await this.productCache.setProductInCache(id, product);
    }

    return product;
  }

  async findBySku(sku: string): Promise<ProductRecord | null> {
    // Nota: el esquema actual no tiene campo `sku`; usamos `slug` como alias.
    return await this.product.findUnique({ where: { slug: sku } });
  }

  async findBySlug(slug: string): Promise<ProductRecord | null> {
    return await this.product.findUnique({ where: { slug } });
  }

  async deleteProduct(id: string): Promise<void> {
    await this.product.delete({ where: { id } });
    await this.productCache.invalidateProductCache(id);
  }

  async addStockToProduct(productId: string, quantity: number): Promise<ProductRecord> {
    const updated = await this.product.update({
      where: { id: productId },
      data: { stock: { increment: quantity } },
    });

    await this.productCache.invalidateProductCache(productId);
    return updated;
  }

  async removeStockFromProduct(productId: string, quantity: number): Promise<ProductRecord> {
    const updated = await this.product.update({
      where: { id: productId },
      data: { stock: { decrement: quantity } },
    });

    await this.productCache.invalidateProductCache(productId);
    return updated;
  }

  async getProductStock(
    productId: string,
  ): Promise<{ stock: number; isInStock: boolean; isLowStock: boolean }> {
    const product = await this.product.findUnique({
      where: { id: productId },
      select: { stock: true, lowStockThreshold: true },
    });

    if (!product) {
      throw new Error(`Product with id ${productId} not found`);
    }

    const stock = typeof product.stock === 'number' ? product.stock : 0;
    const lowStockThreshold =
      typeof product.lowStockThreshold === 'number' ? product.lowStockThreshold : 10;

    return {
      stock,
      isInStock: stock > 0,
      isLowStock: stock < lowStockThreshold,
    };
  }

  async publishProduct(id: string): Promise<ProductRecord> {
    const updated = await this.product.update({
      where: { id },
      data: { status: 'PUBLISHED' },
    });

    await this.productCache.invalidateProductCache(id);
    return updated;
  }

  async archiveProduct(id: string): Promise<ProductRecord> {
    const updated = await this.product.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });

    await this.productCache.invalidateProductCache(id);
    return updated;
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
}
