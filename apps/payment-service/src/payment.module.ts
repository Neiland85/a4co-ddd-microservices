import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PaymentService } from './application/services/payment.service';
import { PaymentEventPublisher } from './application/services/payment-event.publisher';
import { ProcessPaymentUseCase } from './application/use-cases/process-payment.use-case';
import { RefundPaymentUseCase } from './application/use-cases/refund-payment.use-case';
import { PaymentDomainService } from './domain/services/payment-domain.service';
import { PrismaPaymentRepository } from './infrastructure/repositories/prisma-payment.repository';
import { StripeGateway } from './infrastructure/stripe.gateway';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { PaymentController } from './presentation/payment.controller';
import { StripeGateway } from './infrastructure/stripe.gateway';
import { PaymentEventPublisher } from './application/services/payment-event.publisher';
import { ProcessPaymentUseCase } from './application/use-cases/process-payment.use-case';
import { RefundPaymentUseCase } from './application/use-cases/refund-payment.use-case';
import { OrderEventsHandler } from './application/handlers/order-events.handler';
import { PaymentDomainService } from './domain/services/payment-domain.service';
import { PrismaPaymentRepository } from './infrastructure/repositories/prisma-payment.repository';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { PAYMENT_REPOSITORY_TOKEN } from './application/application.constants';
import { NatsEventBus } from '@a4co/shared-utils';

@Module({
  imports: [
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
          queue: 'payment-service-queue',
        },
      },
    ]),
  ],
  controllers: [PaymentController, OrderEventsHandler],
  providers: [
    // Services
    PaymentService,
    PaymentDomainService,
    StripeGateway,

    // Prisma
    PrismaService,

    // Repositories
    {
      provide: PAYMENT_REPOSITORY_TOKEN,
      useFactory: (prisma: PrismaService) => {
        return new PrismaPaymentRepository(prisma);
      },
      inject: [PrismaService],
    },

    // Event Bus
    {
      provide: 'NATS_EVENT_BUS',
      useFactory: () => {
        return new NatsEventBus({
          servers: process.env.NATS_URL || 'nats://localhost:4222',
          name: 'payment-service-event-bus',
        });
      },
    },

    // Event Publisher
    {
      provide: PaymentEventPublisher,
      useFactory: (eventBus: NatsEventBus) => {
        return new PaymentEventPublisher(eventBus);
      },
      inject: ['NATS_EVENT_BUS'],
    },

    // Use Cases
    ProcessPaymentUseCase,
    RefundPaymentUseCase,
  ],
  exports: [PaymentService, ProcessPaymentUseCase, RefundPaymentUseCase],
})
export class PaymentModule {}
