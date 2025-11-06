import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './application/services/inventory.service';
import { PrismaProductRepository } from './infrastructure/repositories/prisma-product.repository';
import { CheckInventoryUseCase } from './application/use-cases/check-inventory.use-case';
import { ReserveStockUseCase } from './application/use-cases/reserve-stock.use-case';
import { ReleaseStockUseCase } from './application/use-cases/release-stock.use-case';
import { ConfirmStockUseCase } from './application/use-cases/confirm-stock.use-case';
import { OrderEventsHandler } from './application/handlers/order-events.handler';
import { EventPublisherService } from './infrastructure/events/event-publisher.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync([
      {
        name: 'NATS_CLIENT',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: configService.get<string>('NATS_URL') || 'nats://localhost:4222',
            name: 'inventory-service',
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [InventoryController, OrderEventsHandler],
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
    // Repository
    {
      provide: 'PRODUCT_REPOSITORY',
      useFactory: (prisma: PrismaClient, eventPublisher: EventPublisherService) => {
        const repo = new PrismaProductRepository(prisma, eventPublisher);
        return repo;
      },
      inject: ['PRISMA_CLIENT', EventPublisherService],
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
    {
      provide: ConfirmStockUseCase,
      useFactory: (repository: any) => {
        return new ConfirmStockUseCase(repository);
      },
      inject: ['PRODUCT_REPOSITORY'],
    },
    // Event Publisher
    EventPublisherService,
    // Service
    InventoryService,
  ],
})
export class InventoryModule {}

