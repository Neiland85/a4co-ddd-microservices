import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Payment } from '../domain/entities/payment.entity';
import { IPaymentRepository } from '../domain/repositories/payment.repository';
import { PaymentDomainService } from '../domain/services/payment-domain.service';
import { StripeGateway } from '../infrastructure/stripe.gateway';
import { NatsService } from '../infrastructure/nats/nats.service';

export interface RefundPaymentCommand {
  orderId: string;
  reason?: string;
  sagaId?: string;
}

@Injectable()
export class RefundPaymentUseCase {
  private readonly logger = new Logger(RefundPaymentUseCase.name);

  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly paymentDomainService: PaymentDomainService,
    private readonly stripeGateway: StripeGateway,
    private readonly natsService: NatsService
  ) {}

  async execute(command: RefundPaymentCommand): Promise<Payment> {
    this.logger.log(`Processing refund for order ${command.orderId}`);

    // 1. Buscar payment por orderId
    const payment = await this.paymentRepository.findByOrderId(command.orderId);

    if (!payment) {
      throw new NotFoundException(
        `Payment not found for order ${command.orderId}`
      );
    }

    // 2. Validar que se puede reembolsar
    if (!this.paymentDomainService.canRefundPayment(payment)) {
      throw new Error(
        `Payment cannot be refunded. Current status: ${payment.status.toString()}`
      );
    }

    // 3. Calcular monto de reembolso
    const refundAmount = this.paymentDomainService.calculateRefundAmount(
      payment
    );

    // 4. Verificar que tiene stripePaymentIntentId
    if (!payment.stripePaymentIntentId) {
      throw new Error('Payment does not have a Stripe Payment Intent ID');
    }

    // 5. Crear reembolso en Stripe
    try {
      const stripeRefund = await this.stripeGateway.refundPayment({
        paymentIntentId: payment.stripePaymentIntentId.toString(),
        amount: refundAmount,
        reason: command.reason || 'requested_by_customer',
        metadata: {
          orderId: command.orderId,
          refundedAt: new Date().toISOString(),
        },
      });

      // 6. Actualizar payment aggregate
      payment.refund(stripeRefund.id, command.sagaId);

      // 7. Guardar payment actualizado
      await this.paymentRepository.save(payment);

      // 8. Publicar eventos a NATS
      const events = payment.getUncommittedEvents();
      for (const event of events) {
        await this.natsService.publish(
          `payment.${event.eventType.toLowerCase()}`,
          {
            eventId: event.eventId,
            eventType: event.eventType,
            aggregateId: event.aggregateId,
            eventVersion: event.eventVersion,
            occurredOn: event.occurredOn,
            eventData: event.eventData,
            sagaId: event.sagaId,
          }
        );
      }

      payment.clearDomainEvents();

      this.logger.log(
        `Refund processed successfully for payment ${payment.paymentId.toString()}`
      );

      return payment;
    } catch (error) {
      this.logger.error(
        `Error processing refund for order ${command.orderId}:`,
        error
      );
      throw new Error(
        `Failed to process refund: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
