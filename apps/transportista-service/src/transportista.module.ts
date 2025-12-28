import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Infrastructure
import { PrismaModule } from './infrastructure/prisma/prisma.module.js';
import { PrismaService } from './infrastructure/prisma/prisma.service.js';
import { PrismaShipmentRepository } from './infrastructure/repositories/prisma-shipment.repository.js';
import { PrismaTransportistaRepository } from './infrastructure/repositories/prisma-transportista.repository.js';
import { OrderEventsHandler } from './infrastructure/event-handlers/order-events.handler.js';

// Application
import { CreateShipmentUseCase } from './application/use-cases/create-shipment.use-case.js';
import { AssignShipmentUseCase } from './application/use-cases/assign-shipment.use-case.js';
import { UpdateShipmentStatusUseCase } from './application/use-cases/update-shipment-status.use-case.js';
import { RandomAssignmentStrategy } from './application/strategies/random-assignment.strategy.js';

// Presentation
import { ShipmentController } from './presentation/controllers/shipment.controller.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
  ],
  controllers: [
    ShipmentController,
    OrderEventsHandler, // Event handlers are also controllers
  ],
  providers: [
    // Prisma
    PrismaService,

    // Repositories
    {
      provide: 'ShipmentRepository',
      useClass: PrismaShipmentRepository,
    },
    {
      provide: 'TransportistaRepository',
      useClass: PrismaTransportistaRepository,
    },

    // Strategies
    {
      provide: 'AssignmentStrategy',
      useClass: RandomAssignmentStrategy,
    },

    // Use Cases
    CreateShipmentUseCase,
    AssignShipmentUseCase,
    UpdateShipmentStatusUseCase,
  ],
})
export class TransportistaModule {}
