import { DomainEvent } from '@a4co/shared-utils';
import { ProductId } from '../value-objects/product-id.vo';

export class ProductPriceChangedEvent extends DomainEvent {
  constructor(
    public readonly productId: ProductId,
    public readonly oldPrice: number,
    public readonly newPrice: number
  ) {
    super();
  }
}
