import { Injectable, Logger } from '@nestjs/common';
import { NatsEventBus, EventMessage } from '@a4co/shared-utils/events/nats-event-bus';
import { EventSubjects } from '@a4co/shared-utils/events/subjects';
import { DomainEvent } from '@a4co/shared-utils/domain/domain-event';
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
  [PaymentCreatedEvent, EventSubjects.PAYMENT_INITIATED],
  [PaymentProcessingEvent, 'payment.processing.v1'],
  [PaymentSucceededEvent, EventSubjects.PAYMENT_SUCCEEDED],
  [PaymentFailedEvent, EventSubjects.PAYMENT_FAILED],
  [PaymentRefundedEvent, EventSubjects.REFUND_PROCESSED],
]);

@Injectable()
export class PaymentEventPublisher {
  private readonly logger = new Logger(PaymentEventPublisher.name);

  constructor(private readonly eventBus: NatsEventBus) { }

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

    if (!this.eventBus.getConnectionStatus()) {
      await this.eventBus.connect();
    }

    const domainEvent = event as PaymentDomainEvent<PaymentEventPayload>;
    const payload = domainEvent.payload ?? (event.eventData as PaymentEventPayload);

    const message: EventMessage = {
      eventId: event.eventId,
      eventType: event.eventType,
      timestamp: payload.timestamp,
      data: {
        ...payload,
        timestamp: payload.timestamp.toISOString(),
      },
      metadata: {
        aggregateId: event.aggregateId,
        eventVersion: event.eventVersion,
        occurredOn: event.occurredOn,
        sagaId: event.sagaId,
      },
    };

    await this.eventBus.publish(subject, message);
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

