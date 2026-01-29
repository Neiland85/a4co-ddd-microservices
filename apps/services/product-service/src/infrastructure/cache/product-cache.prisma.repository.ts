import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ProductCachePort } from '../../application/ports/product-cache.port';

type ProductRecord = Record<string, unknown> & { id: string };

type ProductDelegate = {
  findMany(args: Record<string, unknown>): Promise<ProductRecord[]>;
  findUnique(args: { where: Record<string, unknown> }): Promise<ProductRecord | null>;
};

@Injectable()
export class ProductCachePrismaRepository implements ProductCachePort {
  constructor(private readonly prisma: PrismaService) {}

  private get product(): ProductDelegate {
    return (this.prisma as unknown as { product: ProductDelegate }).product;
  }

  async getCachedProducts(): Promise<unknown[]> {
    const rows = await this.product.findMany({
      take: 100, // límite defensivo
    });

    return rows;
  }

  async getProductFromCache(productId: string): Promise<unknown> {
    return await this.product.findUnique({ where: { id: productId } });
  }

  async setProductInCache(productId: string, productData: unknown): Promise<void> {
    // TODO: Implementar lógica de guardado en Prisma/Redis
  }

  async invalidateProductCache(productId: string): Promise<void> {
    // TODO: Implementar lógica de invalidación en Prisma/Redis
  }
}
