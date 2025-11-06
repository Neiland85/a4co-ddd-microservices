import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { PaymentController } from './presentation/payment.controller';
import { PaymentService } from './application/services/payment.service';
import { OrderEventsHandler } from './application/handlers/order-events.handler';
import { ProcessPaymentUseCase } from './application/use-cases/process-payment.use-case';
import { RefundPaymentUseCase } from './application/use-cases/refund-payment.use-case';
import { IPaymentRepository } from './domain/repositories/payment.repository';
import { PrismaPaymentRepository } from './infrastructure/repositories/prisma-payment.repository';
import { PaymentDomainService } from './domain/services/payment-domain.service';
import { StripeGateway } from './infrastructure/stripe.gateway';
import { NatsModule } from './infrastructure/nats/nats.module';
import { NatsService } from './infrastructure/nats/nats.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NatsModule,
  ],
  controllers: [PaymentController, OrderEventsHandler],
  providers: [
    PaymentService,
    PaymentDomainService,
    StripeGateway,
    NatsService,
    {
      provide: 'PrismaClient',
      useFactory: () => {
        return new PrismaClient({
          log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
        });
      },
    },
    {
      provide: IPaymentRepository,
      useFactory: (prisma: PrismaClient) => {
        return new PrismaPaymentRepository(prisma);
      },
      inject: ['PrismaClient'],
    },
    {
      provide: ProcessPaymentUseCase,
      useFactory: (
        repository: IPaymentRepository,
        domainService: PaymentDomainService,
        stripeGateway: StripeGateway,
        natsService: NatsService
      ) => {
        return new ProcessPaymentUseCase(repository, domainService, stripeGateway, natsService);
      },
      inject: [IPaymentRepository, PaymentDomainService, StripeGateway, NatsService],
    },
    {
      provide: RefundPaymentUseCase,
      useFactory: (
        repository: IPaymentRepository,
        domainService: PaymentDomainService,
        stripeGateway: StripeGateway,
        natsService: NatsService
      ) => {
        return new RefundPaymentUseCase(repository, domainService, stripeGateway, natsService);
      },
      inject: [IPaymentRepository, PaymentDomainService, StripeGateway, NatsService],
    },
  ],
  exports: [PaymentService, ProcessPaymentUseCase, RefundPaymentUseCase],
})
export class PaymentModule {}
