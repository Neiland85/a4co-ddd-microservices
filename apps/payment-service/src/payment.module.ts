import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import { PAYMENT_REPOSITORY_TOKEN } from './application/application.constants';
import { OrderEventsHandler } from './application/handlers/order-events.handler';
import { PaymentEventPublisher } from './application/services/payment-event.publisher';
import { PaymentService } from './application/services/payment.service';
import { ProcessPaymentUseCase } from './application/use-cases/process-payment.use-case';
import { RefundPaymentUseCase } from './application/use-cases/refund-payment.use-case';
import { PaymentDomainService } from './domain/services/payment-domain.service';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { PrismaPaymentRepository } from './infrastructure/repositories/prisma-payment.repository';
import { StripeGateway } from './infrastructure/stripe.gateway';
import { SimulatedPaymentGateway } from './infrastructure/simulated-payment.gateway';
import { PaymentController } from './presentation/payment.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    // NATS Client: Necesario para emitir eventos y responder
    ClientsModule.register([
      {
        name: 'NATS_CLIENT',
        transport: Transport.NATS,
        options: {
          servers: [process.env['NATS_URL'] || 'nats://localhost:4222'],
          queue: 'payment-service-queue',
        },
      },
    ]),
  ],
  controllers: [PaymentController, OrderEventsHandler],
  providers: [
    // Core Services
    PaymentService,
    PaymentDomainService,
    PrismaService,

    // Payment Gateway - Use simulated for testing or Stripe for production
    {
      provide: StripeGateway,
      useFactory: () => {
        const useSimulated = process.env['USE_SIMULATED_PAYMENT'] === 'true';
        if (useSimulated) {
          return new SimulatedPaymentGateway() as any;
        }
        return new StripeGateway();
      },
    },

    // Repositories
    {
      provide: PAYMENT_REPOSITORY_TOKEN,
      useFactory: (prisma: PrismaService) => {
        return new PrismaPaymentRepository(prisma);
      },
      inject: [PrismaService],
    },

    // Event Bus (NestJS ClientProxy)
    {
      provide: 'NATS_EVENT_BUS',
      useFactory: () => {
        // For now, return null - we'll implement proper event bus later
        return null;
      },
    },

    // Event Publisher
    {
      provide: PaymentEventPublisher,
      useFactory: (natsClient: ClientProxy) => {
        return new PaymentEventPublisher(natsClient);
      },
      inject: ['NATS_CLIENT'],
    },

    // Use Cases
    ProcessPaymentUseCase,
    RefundPaymentUseCase,
  ],
  exports: [PaymentService, ProcessPaymentUseCase, RefundPaymentUseCase, ClientsModule],
})
export class PaymentModule { }
