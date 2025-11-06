import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PaymentController } from './presentation/payment.controller';
import { PaymentService } from './application/services/payment.service';
import { OrderEventsHandler } from './application/handlers/order-events.handler';

// Domain
import { PaymentDomainService } from './domain/services/payment-domain.service';

// Infrastructure
import { StripeGateway } from './infrastructure/stripe.gateway';
import { PrismaPaymentRepository } from './infrastructure/repositories/prisma-payment.repository';
import { IPaymentRepository } from './domain/repositories/payment.repository';

// Use Cases
import { ProcessPaymentUseCase } from './application/use-cases/process-payment.use-case';
import { RefundPaymentUseCase } from './application/use-cases/refund-payment.use-case';

// NATS Configuration
const NATS_CONFIG = {
  servers: process.env.NATS_SERVERS?.split(',') || ['nats://localhost:4222'],
  name: 'payment-service',
};

// NatsEventBus Provider Factory
const createNatsEventBus = async () => {
  try {
    const { NatsEventBus } = require('@a4co/shared-utils');
    const eventBus = new NatsEventBus({
      servers: NATS_CONFIG.servers,
      name: NATS_CONFIG.name,
    });
    await eventBus.connect();
    return eventBus;
  } catch (error) {
    console.error('Error creating NatsEventBus:', error);
    // Retornar un mock para desarrollo
    return {
      publish: async (subject: string, data: any) => {
        console.log(`[MOCK] Publishing to ${subject}:`, data);
      },
    };
  }
};

// PrismaService Provider Factory
const createPrismaService = () => {
  // Intentar importar PrismaService desde el paquete compartido
  try {
    const { PrismaService } = require('@a4co/prisma');
    return new PrismaService();
  } catch {
    // Si no existe, crear una implementación básica
    // En producción, esto debería estar en un paquete compartido
    const { PrismaClient } = require('@prisma/client');
    return new PrismaClient();
  }
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
    PaymentService,
    PaymentDomainService,
    StripeGateway,
    {
      provide: 'NATS_EVENT_BUS',
      useFactory: createNatsEventBus,
    },
    {
      provide: 'PrismaService',
      useFactory: createPrismaService,
    },
    {
      provide: 'IPaymentRepository',
      useClass: PrismaPaymentRepository,
    },
    ProcessPaymentUseCase,
    RefundPaymentUseCase,
  ],
  exports: [PaymentService, ProcessPaymentUseCase, RefundPaymentUseCase],
})
export class PaymentModule {}
