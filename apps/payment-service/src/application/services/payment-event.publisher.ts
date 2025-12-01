import { DomainEvent } from '@a4co/shared-utils';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Payment } from '../../domain/entities/payment.entity';
import {
  PaymentCreatedEvent,
  PaymentDomainEvent,
  PaymentEventPayload,
  PaymentFailedEvent,
  PaymentProcessingEvent,
  PaymentRefundedEvent,
  PaymentSucceededEvent,
} from '../../domain/events';

const PAYMENT_EVENT_SUBJECT_MAP = new Map<Function, string>([
  [PaymentCreatedEvent, 'payment.initiated.v1'],
  [PaymentProcessingEvent, 'payment.processing.v1'],
  [PaymentSucceededEvent, 'payment.succeeded.v1'],
  [PaymentFailedEvent, 'payment.failed.v1'],
  [PaymentRefundedEvent, 'refund.processed.v1'],
]);

@Injectable()
export class PaymentEventPublisher {
  private readonly logger = new Logger(PaymentEventPublisher.name);

  constructor(
    @Inject('NATS_CLIENT')
    private readonly natsClient: ClientProxy,
  ) { }

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

  private mapSubject(event: DomainEvent): string | undefined {
    for (const [eventConstructor, subject] of PAYMENT_EVENT_SUBJECT_MAP.entries()) {
      if (event instanceof eventConstructor) {
        return subject;
      }
    }

    return undefined;
  }
}
