import { Injectable, Logger, Inject } from '@nestjs/common';
import { Payment } from '../../domain/entities';
import { Money, PaymentId } from '../../domain/value-objects';
import { IPaymentRepository } from '../../domain/repositories/payment.repository';
import { PaymentDomainService } from '../../domain/services/payment-domain.service';
import { StripeGateway } from '../../infrastructure/stripe.gateway';
import { PaymentSucceededEvent, PaymentFailedEvent } from '../../domain/events';

export interface ProcessPaymentCommand {
  orderId: string;
  amount: Money;
  customerId: string;
  metadata?: Record<string, any>;
  idempotencyKey?: string;
}

@Injectable()
export class ProcessPaymentUseCase {
  private readonly logger = new Logger(ProcessPaymentUseCase.name);

  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly paymentDomainService: PaymentDomainService,
    private readonly stripeGateway: StripeGateway,
    @Inject('NATS_EVENT_BUS') private readonly eventBus: any
  ) {}

  async execute(command: ProcessPaymentCommand): Promise<Payment> {
    this.logger.log(`Processing payment for order ${command.orderId}`);

    // Verificar si ya existe un pago para esta orden (idempotencia)
    const existingPayment = await this.paymentRepository.findByOrderId(command.orderId);
    if (existingPayment && existingPayment.isFinal()) {
      this.logger.warn(`Payment already exists and is final for order ${command.orderId}`);
      return existingPayment;
    }

    // Validar límites de pago
    this.paymentDomainService.validatePaymentLimits(command.amount);

    // Crear o recuperar payment aggregate
    let payment: Payment;
    if (existingPayment) {
      payment = existingPayment;
    } else {
      payment = Payment.create({
        orderId: command.orderId,
        amount: command.amount,
        customerId: command.customerId,
        metadata: command.metadata,
      });
    }

    // Validar que se puede procesar
    if (!this.paymentDomainService.canProcessPayment(payment)) {
      throw new Error(`Payment cannot be processed. Current status: ${payment.status}`);
    }

    // Marcar como procesando
    payment.process();

    try {
      // Crear Payment Intent en Stripe
      const paymentIntent = await this.stripeGateway.createPaymentIntent({
        amount: command.amount,
        customerId: command.customerId,
        orderId: command.orderId,
        metadata: command.metadata,
        idempotencyKey: command.idempotencyKey || `order-${command.orderId}`,
      });

      // Confirmar el pago (en modo test, esto puede requerir acción del cliente)
      // Por ahora, asumimos que el pago se confirma automáticamente
      const confirmedIntent = await this.stripeGateway.confirmPaymentIntent(paymentIntent.id);

      // Verificar el estado del pago
      if (this.stripeGateway.isPaymentSucceeded(confirmedIntent)) {
        payment.markAsSucceeded(confirmedIntent.id);
        this.logger.log(`Payment succeeded for order ${command.orderId}`);

        // Publicar evento de éxito
        const succeededEvent = new PaymentSucceededEvent(
          payment.paymentId.value,
          payment.orderId,
          payment.amount,
          confirmedIntent.id,
          payment.customerId,
          payment.metadata
        );

        // Publicar a NATS usando el event bus
        if (this.eventBus && typeof this.eventBus.publish === 'function') {
          await this.eventBus.publish('payment.succeeded', {
            eventId: succeededEvent.eventId,
            eventType: succeededEvent.eventType(),
            timestamp: succeededEvent.occurredOn,
            data: succeededEvent.eventData,
          });
        }
      } else if (this.stripeGateway.isPaymentFailed(confirmedIntent)) {
        const reason = confirmedIntent.last_payment_error?.message || 'Payment failed';
        payment.markAsFailed(reason);
        this.logger.error(`Payment failed for order ${command.orderId}: ${reason}`);

        // Publicar evento de fallo
        const failedEvent = new PaymentFailedEvent(
          payment.paymentId.value,
          payment.orderId,
          payment.amount,
          reason,
          payment.customerId,
          payment.metadata
        );

        // Publicar a NATS usando el event bus
        if (this.eventBus && typeof this.eventBus.publish === 'function') {
          await this.eventBus.publish('payment.failed', {
            eventId: failedEvent.eventId,
            eventType: failedEvent.eventType(),
            timestamp: failedEvent.occurredOn,
            data: failedEvent.eventData,
          });
        }
      } else {
        // Estado pendiente, esperar webhook
        this.logger.log(`Payment pending for order ${command.orderId}`);
      }

      // Guardar payment
      await this.paymentRepository.save(payment);

      return payment;
    } catch (error) {
      // Marcar como fallido
      const errorMessage = error instanceof Error ? error.message : String(error);
      payment.markAsFailed(errorMessage);
      await this.paymentRepository.save(payment);

      // Publicar evento de fallo
      const failedEvent = new PaymentFailedEvent(
        payment.paymentId.value,
        payment.orderId,
        payment.amount,
        errorMessage,
        payment.customerId,
        payment.metadata
      );

      // Publicar a NATS usando el event bus
      if (this.eventBus && typeof this.eventBus.publish === 'function') {
        await this.eventBus.publish('payment.failed', {
          eventId: failedEvent.eventId,
          eventType: failedEvent.eventType(),
          timestamp: failedEvent.occurredOn,
          data: failedEvent.eventData,
        });
      }

      this.logger.error(`Error processing payment: ${errorMessage}`);
      throw error;
    }
  }
}
