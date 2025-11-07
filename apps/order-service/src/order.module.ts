import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

// Application Layer
import { OrderSaga } from './application/sagas/order.saga';
import { CreateOrderUseCase } from './application/use-cases/create-order.use-case';
import { OrderService } from './application/services/service';

// Infrastructure Layer
import { InMemoryOrderRepository } from './infrastructure/repositories/order.repository';
import { OrderController } from './presentation/controllers/controller';

// Metrics & Observability
import { OrderMetricsService } from './infrastructure/metrics/order-metrics.service';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // NATS Client for Event Bus
    ClientsModule.register([
      {
        name: 'NATS_CLIENT',
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS_URL || 'nats://localhost:4222'],
          queue: 'order-service-queue',
        },
      },
    ]),
  ],

  controllers: [OrderController],

  providers: [
    // Application Services
    OrderService,
    CreateOrderUseCase,
    OrderSaga,

    // Repositories
    {
      provide: 'OrderRepository',
      useClass: InMemoryOrderRepository,
    },

    // Metrics
    OrderMetricsService,

    // Event Bus (injected from NATS_CLIENT)
    {
      provide: 'EventBus',
      useFactory: (natsClient) => natsClient,
      inject: ['NATS_CLIENT'],
    },
  ],

  exports: [
    OrderService,
    OrderSaga,
    'OrderRepository',
    OrderMetricsService,
  ],
})
export class OrderModule {}
