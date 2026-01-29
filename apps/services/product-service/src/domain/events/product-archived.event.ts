import { DomainEvent } from '@a4co/shared-utils';

export type ProductArchivedPayloadV1 = Record<string, never>;

export class ProductArchivedEvent extends DomainEvent {
  readonly eventName = 'product.archived.v1';

  constructor(
    public readonly aggregateId: string,
    public readonly payload: ProductArchivedPayloadV1 = {},
    occurredOn?: Date,
  ) {
    super(undefined, occurredOn);
  }
}
