import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ProductController } from './product.controller';

// Application
import { ProductService } from './application/services/product.service';

// Ports
import { PRODUCT_CACHE_PORT } from './application/ports/product-cache.port';

// Infrastructure
import { PrismaService } from './common/prisma/prisma.service';
import { ProductCachePrismaRepository } from './infrastructure/cache/product-cache.prisma.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [ProductController],
  providers: [
    // Infra base
    PrismaService,

    // Infra cache implementation
    ProductCachePrismaRepository,

    // Port → Adapter binding
    {
      provide: PRODUCT_CACHE_PORT,
      useExisting: ProductCachePrismaRepository,
    },

    // Application service
    ProductService,
  ],
  exports: [ProductService],
})
export class ProductModule {}
