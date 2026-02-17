import { Injectable, Logger } from '@nestjs/common';
import type { DomainEvent } from '@a4co/shared-utils';
import type { Payment } from '@a4co/domain-payment';

type NamedDomainEvent = DomainEvent & {
  aggregateId?: string;
  eventName?: string;
};

@Injectable()
export class PaymentEventPublisher {
  private readonly logger = new Logger(PaymentEventPublisher.name);

  async publishPaymentEvents(payment: Payment): Promise<void> {
    const events = payment.pullDomainEvents();
    if (events.length === 0) return;

    for (const event of events) {
      const named = event as NamedDomainEvent;
      const name = named.eventName ?? event.constructor.name;
      const aggregateId = named.aggregateId ?? 'unknown-aggregate';

      this.logger.log(`📤 Domain event ready: ${name} (${aggregateId})`);
      // TODO: publicar en bus real (NATS/Kafka/EventBridge)
    }
  }
}
