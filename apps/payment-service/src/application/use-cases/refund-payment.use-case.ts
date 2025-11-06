import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PaymentRepository } from '../domain/repositories/payment.repository';
import { PaymentDomainService } from '../domain/services/payment-domain.service';
import { StripeGateway } from '../infrastructure/stripe.gateway';
import { Payment } from '../domain/entities/payment.entity';
import { Money } from '../domain/value-objects';
import { NatsEventBus } from '@a4co/shared-utils';

@Injectable()
export class RefundPaymentUseCase {
  private readonly logger = new Logger(RefundPaymentUseCase.name);

  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentDomainService: PaymentDomainService,
    private readonly stripeGateway: StripeGateway,
    private readonly eventBus: NatsEventBus
  ) {}

  async execute(
    orderId: string,
    refundAmount?: Money,
    sagaId?: string
  ): Promise<Payment> {
    this.logger.log(`Processing refund for order ${orderId}`);

    // Buscar payment por orderId
    const payment = await this.paymentRepository.findByOrderId(orderId);
    if (!payment) {
      throw new NotFoundException(`Payment not found for order ${orderId}`);
    }

    // Validar que se puede reembolsar
    if (!this.paymentDomainService.canRefundPayment(payment)) {
      throw new Error(`Payment ${payment.paymentId.value} cannot be refunded`);
    }

    if (!payment.stripePaymentIntentId) {
      throw new Error('Payment does not have a Stripe Payment Intent ID');
    }

    try {
      // Calcular monto de reembolso
      const amountToRefund = refundAmount || this.paymentDomainService.calculateRefundAmount(payment);

      // Validar monto de reembolso
      this.paymentDomainService.validateRefundAmount(payment, amountToRefund);

      // Llamar Stripe refund API
      const stripeRefund = await this.stripeGateway.refundPayment(
        payment.stripePaymentIntentId.value,
        amountToRefund.amount,
        'requested_by_customer'
      );

      // Actualizar payment
      payment.refund(amountToRefund, sagaId);
      await this.paymentRepository.save(payment);

      // Publicar eventos de dominio a NATS
      await this.publishDomainEvents(payment, sagaId);

      this.logger.log(`Payment ${payment.paymentId.value} refunded successfully for order ${orderId}`);
      return payment;
    } catch (error) {
      this.logger.error(`Error refunding payment: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  private async publishDomainEvents(payment: Payment, sagaId?: string): Promise<void> {
    const events = payment.domainEvents;
    
    for (const event of events) {
      const eventData = {
        eventId: event.eventId,
        eventType: event.eventType,
        timestamp: event.occurredOn,
        data: event.eventData,
        aggregateId: event.aggregateId,
        sagaId: sagaId || event.sagaId,
      };

      // Publicar según el tipo de evento
      if (event.eventType === 'PaymentRefundedEvent') {
        await this.eventBus.publish('payment.refunded', eventData);
      }

      this.logger.log(`Published event ${event.eventType} to NATS`);
    }

    // Limpiar eventos después de publicarlos
    payment.clearDomainEvents();
  }
}
