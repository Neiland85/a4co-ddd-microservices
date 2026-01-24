import { DomainEvent } from '@a4co/shared-utils';

export class ProductCreatedEvent implements DomainEvent {
  readonly eventName = 'product.created';
  readonly occurredOn = new Date();

  constructor(
    public readonly aggregateId: string
  ) {}
}

