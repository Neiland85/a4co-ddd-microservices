import { Injectable, Logger } from '@nestjs/common';
import { Payment } from '../domain/entities/payment.entity';
import { Money } from '../domain/value-objects/money.vo';
import { IPaymentRepository } from '../domain/repositories/payment.repository';
import { PaymentDomainService } from '../domain/services/payment-domain.service';
import { StripeGateway } from '../infrastructure/stripe.gateway';
import { NatsService } from '../infrastructure/nats/nats.service';

export interface ProcessPaymentCommand {
  orderId: string;
  amount: Money;
  customerId: string;
  metadata?: Record<string, any>;
  sagaId?: string;
}

@Injectable()
export class ProcessPaymentUseCase {
  private readonly logger = new Logger(ProcessPaymentUseCase.name);

  constructor(
    private readonly paymentRepository: IPaymentRepository,
    private readonly paymentDomainService: PaymentDomainService,
    private readonly stripeGateway: StripeGateway,
    private readonly natsService: NatsService
  ) {}

  async execute(command: ProcessPaymentCommand): Promise<Payment> {
    this.logger.log(
      `Processing payment for order ${command.orderId}, amount: ${command.amount.amount} ${command.amount.currency}`
    );

    // 1. Validar límites de pago
    this.paymentDomainService.validatePaymentLimits(command.amount);

    // 2. Verificar si ya existe un pago para esta orden
    const existingPayment = await this.paymentRepository.findByOrderId(
      command.orderId
    );

    if (existingPayment && !existingPayment.isFinal()) {
      this.logger.warn(
        `Payment already exists for order ${command.orderId} with status ${existingPayment.status.toString()}`
      );
      return existingPayment;
    }

    // 3. Crear Payment aggregate
    const payment = Payment.create(
      command.orderId,
      command.amount,
      command.customerId,
      command.metadata,
      command.sagaId
    );

    // 4. Guardar payment inicial
    await this.paymentRepository.save(payment);

    // 5. Procesar el pago (marcar como PROCESSING)
    payment.process(command.sagaId);
    await this.paymentRepository.save(payment);

    // 6. Crear Payment Intent en Stripe
    try {
      const idempotencyKey = `${command.orderId}-${Date.now()}`;
      const stripePaymentIntent = await this.stripeGateway.createPaymentIntent({
        amount: command.amount,
        customerId: command.customerId,
        orderId: command.orderId,
        metadata: command.metadata,
        idempotencyKey,
      });

      // 7. Confirmar el Payment Intent automáticamente
      // En producción, esto normalmente se hace desde el frontend
      // Aquí lo hacemos automáticamente para simplificar el flujo
      const confirmedIntent = await this.stripeGateway.confirmPaymentIntent(
        stripePaymentIntent.id
      );

      // 8. Actualizar payment según el resultado
      if (confirmedIntent.status === 'succeeded') {
        payment.markAsSucceeded(confirmedIntent.id, command.sagaId);
      } else if (confirmedIntent.status === 'requires_payment_method') {
        // Si requiere método de pago, marcamos como fallido por ahora
        // En producción, esto debería esperar a que el cliente complete el pago
        payment.markAsFailed(
          'Payment requires payment method',
          command.sagaId
        );
      } else {
        payment.markAsFailed(
          `Payment status: ${confirmedIntent.status}`,
          command.sagaId
        );
      }

      // 9. Guardar payment actualizado
      await this.paymentRepository.save(payment);

      // 10. Publicar eventos a NATS
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
        `Payment processed successfully: ${payment.paymentId.toString()} for order ${command.orderId}`
      );

      return payment;
    } catch (error) {
      this.logger.error(
        `Error processing payment for order ${command.orderId}:`,
        error
      );

      // Marcar como fallido
      payment.markAsFailed(
        error instanceof Error ? error.message : String(error),
        command.sagaId
      );
      await this.paymentRepository.save(payment);

      // Publicar evento de fallo
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

      throw error;
    }
  }
}
