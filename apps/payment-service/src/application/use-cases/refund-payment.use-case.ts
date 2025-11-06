import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PaymentRepository } from '../domain/repositories/payment.repository';
import { PaymentDomainService } from '../domain/services/payment-domain.service';
import { StripeGateway } from '../../infrastructure/stripe.gateway';
import { NatsEventPublisher } from '../../infrastructure/events/nats-event-publisher';
import { Money } from '../domain/value-objects/money.vo';
import { getLogger } from '@a4co/observability';

@Injectable()
export class RefundPaymentUseCase {
  private readonly logger = getLogger(RefundPaymentUseCase.name);

  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentDomainService: PaymentDomainService,
    private readonly stripeGateway: StripeGateway,
    private readonly eventPublisher: NatsEventPublisher
  ) {}

  async execute(
    orderId: string,
    refundAmount?: Money,
    reason?: string
  ): Promise<void> {
    this.logger.info(`Processing refund for order ${orderId}`, {
      orderId,
      refundAmount: refundAmount?.amount,
    });

    // Buscar pago por orderId
    const payment = await this.paymentRepository.findByOrderId(orderId);
    if (!payment) {
      throw new NotFoundException(`Payment not found for order ${orderId}`);
    }

    // Validar que se puede reembolsar
    if (!payment.canBeRefunded()) {
      throw new BadRequestException(
        `Payment cannot be refunded. Current status: ${payment.status}`
      );
    }

    if (!payment.stripePaymentIntentId) {
      throw new BadRequestException(
        'Payment does not have a Stripe Payment Intent ID'
      );
    }

    try {
      // Calcular monto de reembolso
      const actualRefundAmount = this.paymentDomainService.calculateRefundAmount(
        payment,
        refundAmount
      );

      // Procesar reembolso en Stripe
      const stripeRefund = await this.stripeGateway.refundPayment(
        payment.stripePaymentIntentId,
        {
          amount: actualRefundAmount.toCents(),
          reason: reason || 'requested_by_customer',
          metadata: {
            orderId,
            paymentId: payment.paymentId.toString(),
            originalAmount: payment.amount.amount,
          },
        }
      );

      // Actualizar payment aggregate
      payment.refund(stripeRefund.id, actualRefundAmount, reason);
      await this.paymentRepository.save(payment);

      // Publicar evento de reembolso
      const refundEvents = payment.getUncommittedEvents();
      await this.eventPublisher.publishAll(refundEvents);
      payment.clearDomainEvents();

      this.logger.info(`Refund processed successfully for order ${orderId}`, {
        paymentId: payment.paymentId.toString(),
        refundId: stripeRefund.id,
        refundAmount: actualRefundAmount.amount,
      });
    } catch (error) {
      this.logger.error(`Refund failed for order ${orderId}`, {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}
