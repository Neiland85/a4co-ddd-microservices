import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './application/services/inventory.service';
import { PrismaProductRepository } from './infrastructure/repositories/prisma-product.repository';
import { PrismaStockReservationRepository } from './infrastructure/repositories/stock-reservation.repository';
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
          servers: [process.env.NATS_URL || 'nats://localhost:4222'],
          queue: 'inventory-service-queue',
        },
      },
    ]),
  ],
  controllers: [InventoryController, ReserveStockHandler],
  providers: [
    // Prisma Client
    {
      provide: 'PRISMA_CLIENT',
      useFactory: () => {
        const prisma = new PrismaClient({
          log: ['query', 'info', 'warn', 'error'],
        });
        return prisma;
      },
    },
    // Repositories
    {
      provide: 'PRODUCT_REPOSITORY',
      useFactory: (prisma: PrismaClient) => {
        return new PrismaProductRepository(prisma);
      },
      inject: ['PRISMA_CLIENT'],
    },
    {
      provide: 'STOCK_RESERVATION_REPOSITORY',
      useFactory: (prisma: PrismaClient) => {
        return new PrismaStockReservationRepository(prisma);
      },
      inject: ['PRISMA_CLIENT'],
    },
    // Use Cases
    {
      provide: CheckInventoryUseCase,
      useFactory: (repository: any) => {
        return new CheckInventoryUseCase(repository);
      },
      inject: ['PRODUCT_REPOSITORY'],
    },
    {
      provide: ReserveStockUseCase,
      useFactory: (repository: any) => {
        return new ReserveStockUseCase(repository);
      },
      inject: ['PRODUCT_REPOSITORY'],
    },
    {
      provide: ReleaseStockUseCase,
      useFactory: (repository: any) => {
        return new ReleaseStockUseCase(repository);
      },
      inject: ['PRODUCT_REPOSITORY'],
    },
    // Service
    InventoryService,
  ],
})
export class InventoryModule {}

