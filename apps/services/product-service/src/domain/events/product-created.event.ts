import { DomainEvent } from '@a4co/shared-utils';

export type ProductCreatedPayloadV1 = Record<string, never>;

export class ProductCreatedEvent extends DomainEvent {
  readonly eventName = 'product.created.v1';

  constructor(
    public readonly aggregateId: string,
    public readonly payload: ProductCreatedPayloadV1 = {},
    occurredOn?: Date,
  ) {
    super(undefined, occurredOn);
  }
}
