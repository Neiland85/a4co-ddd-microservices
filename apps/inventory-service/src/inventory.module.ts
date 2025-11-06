import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './application/services/inventory.service';
import { PrismaProductRepository } from './infrastructure/repositories/prisma-product.repository';
import { CheckInventoryUseCase } from './application/use-cases/check-inventory.use-case';
import { ReserveStockUseCase } from './application/use-cases/reserve-stock.use-case';
import { ReleaseStockUseCase } from './application/use-cases/release-stock.use-case';
import { ConfirmStockUseCase } from './application/use-cases/confirm-stock.use-case';
import { EventPublisherService } from './infrastructure/events/event-publisher.service';
import { AggregateEventPublisher } from './infrastructure/events/aggregate-event-publisher.service';
import { OrderEventsHandler } from './application/handlers/order-events.handler';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
      useFactory: (prisma: PrismaClient) => {
        return new PrismaProductRepository(prisma);
      },
      inject: ['PRISMA_CLIENT'],
    },
    // Event Publisher
    EventPublisherService,
    AggregateEventPublisher,
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
      useFactory: (repository: any, eventPublisher: AggregateEventPublisher) => {
        const useCase = new ReserveStockUseCase(repository);
        // Wrap execute to publish events after save
        const originalExecute = useCase.execute.bind(useCase);
        useCase.execute = async (request) => {
          const result = await originalExecute(request);
          // Get product and publish events
          const product = await repository.findById(request.productId);
          if (product) {
            await eventPublisher.publishAggregateEvents(product);
          }
          return result;
        };
        return useCase;
      },
      inject: ['PRODUCT_REPOSITORY', AggregateEventPublisher],
    },
    {
      provide: ReleaseStockUseCase,
      useFactory: (repository: any, eventPublisher: AggregateEventPublisher) => {
        const useCase = new ReleaseStockUseCase(repository);
        const originalExecute = useCase.execute.bind(useCase);
        useCase.execute = async (request) => {
          const result = await originalExecute(request);
          const product = await repository.findById(request.productId);
          if (product) {
            await eventPublisher.publishAggregateEvents(product);
          }
          return result;
        };
        return useCase;
      },
      inject: ['PRODUCT_REPOSITORY', AggregateEventPublisher],
    },
    {
      provide: ConfirmStockUseCase,
      useFactory: (repository: any, eventPublisher: AggregateEventPublisher) => {
        const useCase = new ConfirmStockUseCase(repository);
        const originalExecute = useCase.execute.bind(useCase);
        useCase.execute = async (request) => {
          const result = await originalExecute(request);
          const product = await repository.findById(request.productId);
          if (product) {
            await eventPublisher.publishAggregateEvents(product);
          }
          return result;
        };
        return useCase;
      },
      inject: ['PRODUCT_REPOSITORY', AggregateEventPublisher],
    },
    // Service
    InventoryService,
  ],
})
export class InventoryModule {}
