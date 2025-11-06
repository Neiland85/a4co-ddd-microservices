import { Injectable, Logger } from '@nestjs/common';
import { PaymentRepository } from '../domain/repositories/payment.repository';
import { PaymentDomainService } from '../domain/services/payment-domain.service';
import { StripeGateway } from '../infrastructure/stripe.gateway';
import { Payment } from '../domain/entities/payment.entity';
import { Money, PaymentId } from '../domain/value-objects';
import { NatsEventBus } from '@a4co/shared-utils';

@Injectable()
export class ProcessPaymentUseCase {
  private readonly logger = new Logger(ProcessPaymentUseCase.name);

  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentDomainService: PaymentDomainService,
    private readonly stripeGateway: StripeGateway,
    private readonly eventBus: NatsEventBus
  ) {}

  async execute(
    orderId: string,
    amount: Money,
    customerId: string,
    metadata: Record<string, any> = {},
    sagaId?: string
  ): Promise<Payment> {
    this.logger.log(`Processing payment for order ${orderId}`);

    // Validar límites de pago
    this.paymentDomainService.validatePaymentLimits(amount);

    // Verificar si ya existe un pago para esta orden
    const existingPayment = await this.paymentRepository.findByOrderId(orderId);
    if (existingPayment && !existingPayment.isFinal()) {
      throw new Error(`Payment already exists for order ${orderId} and is not final`);
    }

    // Crear Payment aggregate
    const payment = Payment.create(orderId, amount, customerId, metadata, undefined, sagaId);

    // Guardar payment inicial
    await this.paymentRepository.save(payment);

    try {
      // Marcar como procesando
      payment.process(sagaId);
      await this.paymentRepository.save(payment);

      // Crear Payment Intent en Stripe
      const stripePaymentIntent = await this.stripeGateway.createPaymentIntent(
        amount,
        customerId,
        orderId,
        metadata
      );

      // Confirmar el payment intent (en producción esto se haría con confirmación del cliente)
      // Por ahora lo confirmamos automáticamente
      const confirmedIntent = await this.stripeGateway.confirmPaymentIntent(stripePaymentIntent.id);

      // Actualizar payment según respuesta de Stripe
      if (confirmedIntent.status === 'succeeded') {
        payment.markAsSucceeded(confirmedIntent.id, sagaId);
      } else if (confirmedIntent.status === 'requires_payment_method') {
        payment.markAsFailed('Payment method required', sagaId);
      } else {
        payment.markAsFailed(`Payment intent status: ${confirmedIntent.status}`, sagaId);
      }

      // Guardar payment actualizado
      await this.paymentRepository.save(payment);

      // Publicar eventos de dominio a NATS
      await this.publishDomainEvents(payment, sagaId);

      this.logger.log(`Payment ${payment.paymentId.value} processed successfully for order ${orderId}`);
      return payment;
    } catch (error) {
      this.logger.error(`Error processing payment: ${error instanceof Error ? error.message : String(error)}`);
      
      // Marcar como fallido
      payment.markAsFailed(
        error instanceof Error ? error.message : 'Unknown error',
        sagaId
      );
      await this.paymentRepository.save(payment);
      await this.publishDomainEvents(payment, sagaId);
      
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
      if (event.eventType === 'PaymentSucceededEvent') {
        await this.eventBus.publish('payment.succeeded', eventData);
      } else if (event.eventType === 'PaymentFailedEvent') {
        await this.eventBus.publish('payment.failed', eventData);
      } else if (event.eventType === 'PaymentCreatedEvent') {
        await this.eventBus.publish('payment.created', eventData);
      } else if (event.eventType === 'PaymentProcessingEvent') {
        await this.eventBus.publish('payment.processing', eventData);
      }

      this.logger.log(`Published event ${event.eventType} to NATS`);
    }

    // Limpiar eventos después de publicarlos
    payment.clearDomainEvents();
  }
}
