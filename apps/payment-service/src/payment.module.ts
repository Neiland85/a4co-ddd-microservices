import { Module, Inject } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport, ClientProxy } from '@nestjs/microservices';
import { PAYMENT_REPOSITORY_TOKEN, NATS_EVENT_BUS_TOKEN } from './application/application.constants';
import { OrderEventsHandler } from './application/handlers/order-events.handler';
import { PaymentService } from './application/services/payment.service';
import { PaymentEventPublisher } from './application/services/payment-event.publisher';
import { ProcessPaymentUseCase } from './application/use-cases/process-payment.use-case';
import { RefundPaymentUseCase } from './application/use-cases/refund-payment.use-case';
import { PaymentDomainService } from './domain/services/payment-domain.service';
import { PrismaPaymentRepository } from './infrastructure/repositories/prisma-payment.repository';
import { StripeGateway } from './infrastructure/stripe.gateway';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { PaymentController } from './presentation/payment.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    ClientsModule.register([
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.NATS,
        options: {
          servers: [process.env.NATS_URL || 'nats://localhost:4222'],
          queue: 'payment_queue',
        },
      },
    ]),
  ],
  controllers: [PaymentController],
  providers: [
    PaymentService,
    PaymentDomainService,
    ProcessPaymentUseCase,
    RefundPaymentUseCase,
    PaymentEventPublisher,
    OrderEventsHandler,
    StripeGateway,
    {
      provide: PAYMENT_REPOSITORY_TOKEN,
      useClass: PrismaPaymentRepository,
    },
    {
      provide: NATS_EVENT_BUS_TOKEN,
      useFactory: (paymentServiceClient: ClientProxy) => paymentServiceClient,
      inject: ['PAYMENT_SERVICE'],
    },
  ],
  exports: [PaymentService, PAYMENT_REPOSITORY_TOKEN],
})
export class PaymentModule {}
