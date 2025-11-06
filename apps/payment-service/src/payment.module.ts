import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

// Controllers
import { PaymentController } from './presentation/payment.controller';
import { OrderEventsHandler } from './application/handlers/order-events.handler';

// Use Cases
import { ProcessPaymentUseCase } from './application/use-cases/process-payment.use-case';
import { RefundPaymentUseCase } from './application/use-cases/refund-payment.use-case';

// Domain Services
import { PaymentDomainService } from './domain/services/payment-domain.service';

// Infrastructure
import { PrismaPaymentRepository } from './infrastructure/repositories/prisma-payment.repository';
import { StripeGateway } from './infrastructure/stripe.gateway';

// Repository interfaces
import { PaymentRepository } from './domain/repositories/payment.repository';

// Event Bus
import { NatsEventBus } from '@a4co/shared-utils';

// NATS Configuration
const NATS_CONFIG = {
  servers: process.env.NATS_URL || 'nats://localhost:4222',
  token: process.env.NATS_AUTH_TOKEN || '',
  name: 'payment-service',
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    // NATS Microservices Client
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
    // Database - Proveedor personalizado de PrismaClient
    {
      provide: 'PrismaClient',
      useFactory: () => {
        // En producción, aquí se importaría el PrismaClient real
        // Por ahora simulamos la interfaz
        return {
          payment: {
            findUnique: async (args: any) => null,
            create: async (args: any) => ({}),
            update: async (args: any) => ({}),
            findFirst: async (args: any) => null,
            count: async (args?: any) => 0,
          },
        };
      },
    },

    // Event Bus
    {
      provide: NatsEventBus,
      useFactory: () => {
        const eventBus = new NatsEventBus({
          servers: NATS_CONFIG.servers,
          name: NATS_CONFIG.name,
        });
        // Conectar al iniciar
        eventBus.connect().catch(err => {
          console.error('Error connecting to NATS:', err);
        });
        return eventBus;
      },
    },

    // Repositories
    {
      provide: PaymentRepository,
      useFactory: (prismaClient: any) => {
        return new PrismaPaymentRepository(prismaClient);
      },
      inject: ['PrismaClient'],
    },

    // Infrastructure
    StripeGateway,

    // Domain Services
    PaymentDomainService,

    // Use Cases
    {
      provide: ProcessPaymentUseCase,
      useFactory: (
        paymentRepository: PaymentRepository,
        paymentDomainService: PaymentDomainService,
        stripeGateway: StripeGateway,
        eventBus: NatsEventBus
      ) => {
        return new ProcessPaymentUseCase(
          paymentRepository,
          paymentDomainService,
          stripeGateway,
          eventBus
        );
      },
      inject: [PaymentRepository, PaymentDomainService, StripeGateway, NatsEventBus],
    },
    {
      provide: RefundPaymentUseCase,
      useFactory: (
        paymentRepository: PaymentRepository,
        paymentDomainService: PaymentDomainService,
        stripeGateway: StripeGateway,
        eventBus: NatsEventBus
      ) => {
        return new RefundPaymentUseCase(
          paymentRepository,
          paymentDomainService,
          stripeGateway,
          eventBus
        );
      },
      inject: [PaymentRepository, PaymentDomainService, StripeGateway, NatsEventBus],
    },
  ],
  exports: [ProcessPaymentUseCase, RefundPaymentUseCase],
})
export class PaymentModule {}
