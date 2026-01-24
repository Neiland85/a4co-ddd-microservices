import { DomainEvent } from '@a4co/shared-utils';

export class ProductArchivedEvent implements DomainEvent {
  readonly eventName = 'product.archived';
  readonly occurredOn = new Date();

  constructor(public readonly aggregateId: string) {}
}
