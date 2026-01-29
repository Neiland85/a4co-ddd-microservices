import { Module } from '@nestjs/common';
import { OrderEventsHandler } from './application/handlers/order-events.handler';
import { ProcessPaymentUseCase } from './application/use-cases/process-payment.use-case';
import { RefundPaymentUseCase } from './application/use-cases/refund-payment.use-case';
import { PaymentEventPublisher } from './application/services/payment-event.publisher';
import { PrismaService } from './infrastructure/prisma/prisma.service';

@Module({
  controllers: [OrderEventsHandler],
  providers: [PrismaService, ProcessPaymentUseCase, RefundPaymentUseCase, PaymentEventPublisher],
})
export class PaymentModule {}
