import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';
import { DomainEvent } from '@a4co/shared-utils';
import { getLogger } from '@a4co/observability';

@Injectable()
export class NatsEventPublisher implements OnModuleInit {
  private readonly logger = getLogger(NatsEventPublisher.name);

  constructor(@Inject('NATS_CLIENT') private readonly natsClient: ClientNats) {}

  async onModuleInit() {
    await this.natsClient.connect();
    this.logger.info('NATS client connected');
  }

  /**
   * Publica un evento de dominio a NATS
   */
  async publish(event: DomainEvent): Promise<void> {
    const subject = this.getSubjectForEvent(event);
    const payload = {
      eventId: event.eventId,
      eventType: event.eventType,
      aggregateId: event.aggregateId,
      eventVersion: event.eventVersion,
      occurredOn: event.occurredOn,
      eventData: event.eventData,
      sagaId: event.sagaId,
    };

    this.logger.debug('Publishing event to NATS', {
      subject,
      eventType: event.eventType,
      aggregateId: event.aggregateId,
    });

    try {
      this.natsClient.emit(subject, payload);
      this.logger.info('Event published successfully', {
        subject,
        eventType: event.eventType,
      });
    } catch (error) {
      this.logger.error('Failed to publish event to NATS', {
        subject,
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }

  /**
   * Publica múltiples eventos
   */
  async publishAll(events: DomainEvent[]): Promise<void> {
    await Promise.all(events.map(event => this.publish(event)));
  }

  /**
   * Obtiene el subject de NATS para un evento
   */
  private getSubjectForEvent(event: DomainEvent): string {
    // Mapear eventos de dominio a subjects de NATS
    const eventTypeMap: Record<string, string> = {
      PaymentCreatedEvent: 'payment.created',
      PaymentProcessingEvent: 'payment.processing',
      PaymentSucceededEvent: 'payment.succeeded',
      PaymentFailedEvent: 'payment.failed',
      PaymentRefundedEvent: 'payment.refunded',
    };

    return eventTypeMap[event.eventType] || event.eventType.toLowerCase().replace('event', '');
  }
}
