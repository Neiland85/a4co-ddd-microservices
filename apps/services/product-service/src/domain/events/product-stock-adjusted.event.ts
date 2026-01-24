import { DomainEvent } from '@a4co/shared-utils';

export class ProductStockAdjustedEvent implements DomainEvent {
  readonly eventName = 'product.stock.adjusted';
  readonly occurredOn = new Date();

  constructor(
    public readonly aggregateId: string,
    public readonly quantity: number
  ) {}
}
