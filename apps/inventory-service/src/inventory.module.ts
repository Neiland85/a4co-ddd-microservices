import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './application/services/inventory.service';
import { PrismaProductRepository } from './infrastructure/repositories/prisma-product.repository';
import { ProductRepositoryWithEvents } from './infrastructure/repositories/product-repository-with-events';
import { CheckInventoryUseCase } from './application/use-cases/check-inventory.use-case';
import { ReserveStockUseCase } from './application/use-cases/reserve-stock.use-case';
import { ReleaseStockUseCase } from './application/use-cases/release-stock.use-case';
import { ConfirmStockUseCase } from './application/use-cases/confirm-stock.use-case';
import { OrderEventsHandler } from './application/handlers/order-events.handler';
import { EventPublisherService } from './infrastructure/events/event-publisher.service';
import { DomainEventDispatcher } from './infrastructure/events/domain-event-dispatcher.service';

const NATS_CONFIG = {
  servers: process.env.NATS_URL || 'nats://localhost:4222',
  token: process.env.NATS_AUTH_TOKEN || '',
  name: 'inventory-service',
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'NATS_CLIENT',
        transport: Transport.NATS,
        options: NATS_CONFIG,
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
    // Base Repository
    {
      provide: 'BASE_PRODUCT_REPOSITORY',
      useFactory: (prisma: PrismaClient) => {
        return new PrismaProductRepository(prisma);
      },
      inject: ['PRISMA_CLIENT'],
    },
    // Repository with Event Dispatching
    {
      provide: 'PRODUCT_REPOSITORY',
      useFactory: (baseRepository: any, dispatcher: DomainEventDispatcher) => {
        return new ProductRepositoryWithEvents(baseRepository, dispatcher);
      },
      inject: ['BASE_PRODUCT_REPOSITORY', DomainEventDispatcher],
    },
    // Event Services
    EventPublisherService,
    DomainEventDispatcher,
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
    // Service
    InventoryService,
  ],
})
export class InventoryModule {}

