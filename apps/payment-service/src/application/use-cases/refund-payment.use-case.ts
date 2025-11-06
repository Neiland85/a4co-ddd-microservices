import { Injectable, Logger, Inject } from '@nestjs/common';
import { Payment } from '../../domain/entities';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { PaymentDomainService } from '../../domain/services/payment-domain.service';
import { StripeGateway } from '../../infrastructure/stripe.gateway';
import { PaymentRefundedEvent } from '../../domain/events';

export interface RefundPaymentCommand {
  orderId: string;
  reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer';
  partialAmount?: { amount: number; currency: string };
}

@Injectable()
export class RefundPaymentUseCase {
  private readonly logger = new Logger(RefundPaymentUseCase.name);

  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly paymentDomainService: PaymentDomainService,
    private readonly stripeGateway: StripeGateway,
    @Inject('NATS_EVENT_BUS') private readonly eventBus: any
  ) {}

  async execute(command: RefundPaymentCommand): Promise<Payment> {
    this.logger.log(`Processing refund for order ${command.orderId}`);

    // Buscar payment por orderId
    const payment = await this.paymentRepository.findByOrderId(command.orderId);
    if (!payment) {
      throw new Error(`Payment not found for order ${command.orderId}`);
    }

    // Validar que se puede reembolsar
    if (!this.paymentDomainService.canRefundPayment(payment)) {
      throw new Error(`Payment cannot be refunded. Current status: ${payment.status}`);
    }

    if (!payment.stripePaymentIntentId) {
      throw new Error(`Payment does not have a Stripe Payment Intent ID`);
    }

    try {
      // Calcular monto de reembolso
      const refundAmount = command.partialAmount
        ? this.paymentDomainService.calculateRefundAmount(
            payment,
            new (await import('../../domain/value-objects')).Money(
              command.partialAmount.amount,
              command.partialAmount.currency as any
            )
          )
        : this.paymentDomainService.calculateRefundAmount(payment);

      // Crear reembolso en Stripe
      const refund = await this.stripeGateway.refundPayment({
        paymentIntentId: payment.stripePaymentIntentId,
        amount: refundAmount,
        reason: command.reason,
        metadata: {
          orderId: command.orderId,
          refundedAt: new Date().toISOString(),
        },
      });

      // Actualizar payment aggregate
      payment.refund(refund.id, command.reason);

      // Guardar payment
      await this.paymentRepository.save(payment);

      // Publicar evento de reembolso
      const refundedEvent = new PaymentRefundedEvent(
        payment.paymentId.value,
        payment.orderId,
        payment.amount,
        refundAmount,
        refund.id,
        command.reason
      );

      // Publicar a NATS usando el event bus
      if (this.eventBus && typeof this.eventBus.publish === 'function') {
        await this.eventBus.publish('payment.refunded', {
          eventId: refundedEvent.eventId,
          eventType: refundedEvent.eventType(),
          timestamp: refundedEvent.occurredOn,
          data: refundedEvent.eventData,
        });
      }

      this.logger.log(`Refund completed for order ${command.orderId}, refund ID: ${refund.id}`);

      return payment;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Error processing refund: ${errorMessage}`);
      throw new Error(`Failed to process refund: ${errorMessage}`);
    }
  }
}
