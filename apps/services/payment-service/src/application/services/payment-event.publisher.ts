import { DomainEvent } from '@a4co/shared-utils';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  Payment,
  PaymentCreatedEvent,
  PaymentDomainEvent,
  PaymentEventPayload,
  PaymentFailedEvent,
  PaymentProcessingEvent,
  PaymentRefundedEvent,
  PaymentSucceededEvent,
} from '@a4co/domain-payment';
import {
  PaymentConfirmedV1Event,
  PaymentFailedV1Event,
  PaymentRefundedV1Event,
  PAYMENT_CONFIRMED_V1,
  PAYMENT_FAILED_V1,
  PAYMENT_REFUNDED_V1,
} from '@a4co/shared-events';

const PAYMENT_EVENT_SUBJECT_MAP = new Map<Function, string>([
  [PaymentCreatedEvent, 'payment.initiated.v1'],
  [PaymentProcessingEvent, 'payment.processing.v1'],
  [PaymentSucceededEvent, PAYMENT_CONFIRMED_V1],
  [PaymentFailedEvent, PAYMENT_FAILED_V1],
  [PaymentRefundedEvent, PAYMENT_REFUNDED_V1],
]);

@Injectable()
export class PaymentEventPublisher {
  private readonly logger = new Logger(PaymentEventPublisher.name);

  constructor(
    @Inject('NATS_CLIENT')
    private readonly natsClient: ClientProxy,
  ) {}

  public async publishPaymentEvents(payment: Payment): Promise<void> {
    const events = payment.getUncommittedEvents();

    for (const event of events) {
      await this.publishEvent(event);
    }

    payment.clearEvents();
  }

  private async publishEvent(event: DomainEvent): Promise<void> {
    const subject = this.mapSubject(event);

    if (!subject) {
      this.logger.warn(`No NATS subject mapping found for event ${event.eventType}`);
      return;
    }

    const domainEvent = event as PaymentDomainEvent<PaymentEventPayload>;
    const payload = domainEvent.payload ?? (event.eventData as PaymentEventPayload);

    // Use shared-events for standardized event format
    if (event instanceof PaymentSucceededEvent) {
      const sharedEvent = new PaymentConfirmedV1Event({
        paymentId: payload.paymentId,
        orderId: payload.orderId,
        customerId: payload.customerId,
        amount: payload.amount,
        currency: payload.currency,
        transactionId: payload.stripePaymentIntentId,
        confirmedAt: new Date().toISOString(),
      });
      this.natsClient.emit(subject, sharedEvent.toJSON());
      this.logger.log(`📤 Published ${subject} for order ${payload.orderId}`);
    } else if (event instanceof PaymentFailedEvent) {
      const sharedEvent = new PaymentFailedV1Event({
        orderId: payload.orderId,
        customerId: payload.customerId,
        amount: payload.amount,
        currency: payload.currency,
        reason: 'Payment processing failed',
        failedAt: new Date().toISOString(),
      });
      this.natsClient.emit(subject, sharedEvent.toJSON());
      this.logger.log(`📤 Published ${subject} for order ${payload.orderId}`);
    } else if (event instanceof PaymentRefundedEvent) {
      const sharedEvent = new PaymentRefundedV1Event({
        paymentId: payload.paymentId,
        orderId: payload.orderId,
        customerId: payload.customerId,
        amount: payload.amount,
        currency: payload.currency,
        reason: 'Order cancelled',
        refundedAt: new Date().toISOString(),
      });
      this.natsClient.emit(subject, sharedEvent.toJSON());
      this.logger.log(`📤 Published ${subject} for order ${payload.orderId}`);
    } else {
      // For other events, use old format
      const message = {
        eventId: event.eventId,
        eventType: event.eventType,
        aggregateId: event.aggregateId,
        timestamp: event.occurredOn.toISOString(),
        data: {
          paymentId: payload.paymentId,
          orderId: payload.orderId,
          amount: payload.amount,
          currency: payload.currency,
          status: payload.status,
          customerId: payload.customerId,
          stripePaymentIntentId: payload.stripePaymentIntentId,
          timestamp: payload.timestamp.toISOString(),
        },
        metadata: {
          eventVersion: event.eventVersion,
          sagaId: event.sagaId,
        },
      };
      this.natsClient.emit(subject, message);
      this.logger.log(`Published ${event.eventType} to ${subject}`);
    }
  }

  private mapSubject(event: DomainEvent): string | undefined {
    for (const [eventConstructor, subject] of PAYMENT_EVENT_SUBJECT_MAP.entries()) {
      if (event instanceof eventConstructor) {
        return subject;
      }
    }

    return undefined;
  }
}
