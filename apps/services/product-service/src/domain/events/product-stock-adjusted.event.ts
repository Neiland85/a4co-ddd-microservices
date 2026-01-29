import { DomainEvent } from '@a4co/shared-utils';

export interface ProductStockAdjustedPayloadV1 {
  quantity: number;
}

export class ProductStockAdjustedEvent extends DomainEvent {
  readonly eventName = 'product.stock.adjusted.v1';

  constructor(
    public readonly aggregateId: string,
    public readonly payload: ProductStockAdjustedPayloadV1,
    occurredOn?: Date,
  ) {
    super(undefined, occurredOn);
  }
}
