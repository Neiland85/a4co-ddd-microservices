import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './application/services/inventory.service';
import { PrismaProductRepository } from './infrastructure/repositories/prisma-product.repository';
import { PrismaStockReservationRepository } from './infrastructure/repositories/stock-reservation.repository';
import { ProductRepository } from './infrastructure/repositories/product.repository';
import { CheckInventoryUseCase } from './application/use-cases/check-inventory.use-case';
import { ReserveStockUseCase } from './application/use-cases/reserve-stock.use-case';
import { ReleaseStockUseCase } from './application/use-cases/release-stock.use-case';
import { ReserveStockHandler } from './application/handlers/reserve-stock.handler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // NATS Client for Event Bus
    ClientsModule.register([
      {
        name: 'NATS_CLIENT',
        transport: Transport.NATS,
        options: {
          servers: [process.env['NATS_URL'] || 'nats://localhost:4222'],
          queue: 'inventory-service-queue',
        },
      },
    ]),
  ],
  controllers: [InventoryController, ReserveStockHandler],
  providers: [
    {
      provide: 'PRISMA_CLIENT',
      useFactory: () => {
        const connectionString = process.env['DATABASE_URL'];
        const pool = new Pool({ connectionString });
        const adapter = new PrismaPg(pool);
        const prisma = new PrismaClient({ adapter });
        return prisma;
      },
    },
    // Repositories
    {
      provide: 'PRODUCT_REPOSITORY',
      useFactory: (prisma: PrismaClient) => new PrismaProductRepository(prisma),
      inject: ['PRISMA_CLIENT'],
    },
    {
      provide: 'STOCK_RESERVATION_REPOSITORY',
      useFactory: (prisma: PrismaClient) => new PrismaStockReservationRepository(prisma),
      inject: ['PRISMA_CLIENT'],
    },
    // Use Cases
    {
      provide: CheckInventoryUseCase,
      useFactory: (repository: ProductRepository) => new CheckInventoryUseCase(repository),
      inject: ['PRODUCT_REPOSITORY'],
    },
    {
      provide: ReserveStockUseCase,
      useFactory: (repository: ProductRepository) => new ReserveStockUseCase(repository),
      inject: ['PRODUCT_REPOSITORY'],
    },
    {
      provide: ReleaseStockUseCase,
      useFactory: (repository: ProductRepository) => new ReleaseStockUseCase(repository),
      inject: ['PRODUCT_REPOSITORY'],
    },
    InventoryService,
  ],
})
export class InventoryModule {}
