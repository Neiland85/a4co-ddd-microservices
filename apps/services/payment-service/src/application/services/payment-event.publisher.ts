import { Injectable, Logger } from '@nestjs/common';
import type { DomainEvent } from '@a4co/shared-utils';
import type { Payment } from '@a4co/domain-payment';

@Injectable()
export class PaymentEventPublisher {
  private readonly logger = new Logger(PaymentEventPublisher.name);

  async publishPaymentEvents(payment: Payment): Promise<void> {
    const events = payment.pullDomainEvents();
  /**
   * Estabilización: publica (o deja listo para publicar) eventos del agregado.
   * No asumimos API específica del AggregateRoot: usamos any + fallback.
   */
  async publishPaymentEvents(payment: Payment): Promise<void> {
    const anyPayment = payment as any;

    const events: DomainEvent[] =
      (anyPayment.getUncommittedEvents?.() as DomainEvent[]) ??
      (anyPayment._domainEvents as DomainEvent[]) ??
      [];

    if (!events.length) return;

    for (const event of events) {
      this.logger.log(`📤 Domain event ready: ${event.eventName} (${event.aggregateId})`);
      // aquí irá NATS / Kafka / EventBridge
      // Aquí irá el bus real (NATS/Kafka). Por ahora, stabilización.
    }

    // limpieza
    if (typeof anyPayment.clearEvents === 'function') {
      anyPayment.clearEvents();
    } else {
      anyPayment._domainEvents = [];
    }
  }
}
