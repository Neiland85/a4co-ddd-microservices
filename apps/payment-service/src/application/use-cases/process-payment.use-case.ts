import { Injectable, Logger } from '@nestjs/common';
import { Payment } from '../domain/entities/payment.entity';
import { PaymentRepository } from '../domain/repositories/payment.repository';
import { PaymentDomainService } from '../domain/services/payment-domain.service';
import { StripeGateway } from '../../infrastructure/stripe.gateway';
import { NatsEventPublisher } from '../../infrastructure/events/nats-event-publisher';
import { Money } from '../domain/value-objects/money.vo';
import { PaymentId } from '../domain/value-objects/payment-id.vo';
import { getLogger } from '@a4co/observability';

@Injectable()
export class ProcessPaymentUseCase {
  private readonly logger = getLogger(ProcessPaymentUseCase.name);

  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentDomainService: PaymentDomainService,
    private readonly stripeGateway: StripeGateway,
    private readonly eventPublisher: NatsEventPublisher
  ) {}

  async execute(
    orderId: string,
    amount: Money,
    customerId: string,
    metadata?: Record<string, any>
  ): Promise<Payment> {
    this.logger.info(`Processing payment for order ${orderId}`, {
      orderId,
      amount: amount.amount,
      currency: amount.currency,
      customerId,
    });

    // Validar límites de pago
    this.paymentDomainService.validatePaymentLimits(amount);
    this.paymentDomainService.validateCustomerId(customerId);

    // Verificar si ya existe un pago para esta orden (idempotencia)
    const existingPayment = await this.paymentRepository.findByOrderId(orderId);
    if (existingPayment && existingPayment.isFinal()) {
      this.logger.warn(`Payment already exists and is final for order ${orderId}`);
      return existingPayment;
    }

    // Crear Payment aggregate
    const payment = Payment.create({
      orderId,
      amount,
      customerId,
      metadata,
    });

      // Guardar inicialmente
      await this.paymentRepository.save(payment);
      
      // Publicar eventos iniciales
      const initialEvents = payment.getUncommittedEvents();
      await this.eventPublisher.publishAll(initialEvents);
      payment.clearDomainEvents();

      try {
        // Marcar como procesando
        payment.process();
        await this.paymentRepository.save(payment);
        
        // Publicar evento de procesamiento
        const processingEvents = payment.getUncommittedEvents();
        await this.eventPublisher.publishAll(processingEvents);
        payment.clearDomainEvents();

      // Crear Payment Intent en Stripe
      const stripeIntent = await this.stripeGateway.createPaymentIntent({
        amount: amount.toCents(),
        currency: amount.currency.toLowerCase(),
        customer: customerId,
        metadata: {
          orderId,
          paymentId: payment.paymentId.toString(),
          ...metadata,
        },
      });

      // Marcar como exitoso
      payment.markAsSucceeded(stripeIntent.id);
      await this.paymentRepository.save(payment);

      // Publicar eventos de dominio
      const events = payment.getUncommittedEvents();
      await this.eventPublisher.publishAll(events);
      payment.clearDomainEvents();

      this.logger.info(`Payment succeeded for order ${orderId}`, {
        paymentId: payment.paymentId.toString(),
        stripeIntentId: stripeIntent.id,
      });

      return payment;
    } catch (error) {
      this.logger.error(`Payment failed for order ${orderId}`, {
        error: error.message,
        stack: error.stack,
      });

      // Marcar como fallido
      payment.markAsFailed(
        error.message || 'Payment processing failed'
      );
      await this.paymentRepository.save(payment);

      // Publicar evento de fallo
      const failureEvents = payment.getUncommittedEvents();
      await this.eventPublisher.publishAll(failureEvents);
      payment.clearDomainEvents();

      throw error;
    }
  }
}
