import { DomainEventBus } from '../../application/ports/domain-event-bus.port';
import { DomainEvent } from '@a4co/shared-utils';

export class NatsDomainEventBus implements DomainEventBus {
  async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      console.log('[EVENT]', event.eventName, event.payload);
    }
  }
}
