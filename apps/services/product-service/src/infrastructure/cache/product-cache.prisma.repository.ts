import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { ProductCachePort } from '../../application/ports/product-cache.port';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class ProductCachePrismaRepository implements ProductCachePort {
  constructor(private readonly prisma: PrismaService) {}

  async getCachedProducts(): Promise<Product[]> {
    const rows = await this.prisma.product.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take: 100, // límite defensivo
    });

    // ⚠️ Aquí NO se hace lógica de dominio compleja
    // Si Product tiene factory → úsala aquí
    return rows.map((row) =>
      Product.restore({
        id: row.id,
        name: row.name,
        price: row.price,
        stock: row.stock,
        sku: row.sku,
      }),
    );
  }

  async getProductFromCache(productId: string): Promise<any> {
    // TODO: Implementar lógica de obtención desde Prisma/Redis
    return null;
  }

  async setProductInCache(productId: string, productData: any): Promise<void> {
    // TODO: Implementar lógica de guardado en Prisma/Redis
  }

  async invalidateProductCache(productId: string): Promise<void> {
    // TODO: Implementar lógica de invalidación en Prisma/Redis
  }
}
