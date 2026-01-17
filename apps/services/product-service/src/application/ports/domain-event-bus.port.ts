import { DomainEvent } from '@a4co/shared-utils';

export interface DomainEventBus {
  publish(events: DomainEvent[]): Promise<void>;
}
