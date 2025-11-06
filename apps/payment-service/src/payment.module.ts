import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PaymentService } from './application/services/payment.service';
import { PaymentController } from './presentation/payment.controller';
import { OrderEventsHandler } from './application/handlers/order-events.handler';

// Domain
import { PaymentDomainService } from './domain/services/payment-domain.service';

// Infrastructure
import { PrismaService } from './infrastructure/database/prisma.service';
import { PrismaPaymentRepository } from './infrastructure/repositories/prisma-payment.repository';
import { PaymentRepository } from './domain/repositories/payment.repository';
import { StripeGateway } from './infrastructure/stripe.gateway';
import { NatsEventPublisher } from './infrastructure/events/nats-event-publisher';

// Use Cases
import { ProcessPaymentUseCase } from './application/use-cases/process-payment.use-case';
import { RefundPaymentUseCase } from './application/use-cases/refund-payment.use-case';

const NATS_CONFIG = {
  servers: process.env.NATS_URL || 'nats://localhost:4222',
  token: process.env.NATS_AUTH_TOKEN || '',
  name: 'payment-service',
};

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NATS_CLIENT',
        transport: Transport.NATS,
        options: NATS_CONFIG,
      },
    ]),
  ],
  controllers: [PaymentController, OrderEventsHandler],
  providers: [
    // Application Services
    PaymentService,

    // Use Cases
    ProcessPaymentUseCase,
    RefundPaymentUseCase,

    // Domain Services
    PaymentDomainService,

    // Infrastructure
    PrismaService,
    StripeGateway,
    NatsEventPublisher,

    // Repositories
    {
      provide: PaymentRepository,
      useClass: PrismaPaymentRepository,
    },
  ],
  exports: [PaymentService, PaymentRepository],
})
export class PaymentModule {}
