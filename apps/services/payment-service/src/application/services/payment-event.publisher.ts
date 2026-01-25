import { Injectable, Logger } from '@nestjs/common';
import type { DomainEvent } from '@a4co/shared-utils';
import type { Payment } from '@a4co/domain-payment';

@Injectable()
export class PaymentEventPublisher {
  private readonly logger = new Logger(PaymentEventPublisher.name);

  async publishPaymentEvents(payment: Payment): Promise<void> {
    const events: DomainEvent[] = payment.pullDomainEvents();

    if (!events.length) return;

    for (const event of events) {
      this.logger.log(
        `📤 Publishing domain event ${event.eventName} for aggregate ${event.aggregateId}`,
      );

      // Aquí irá NATS / Kafka / EventBridge
      // await this.eventBus.publish(event);
    }
  }
}
