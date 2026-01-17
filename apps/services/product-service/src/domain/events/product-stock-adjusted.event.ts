import { DomainEvent } from '@a4co/shared-utils';
import { ProductId } from '../value-objects/product-id.vo';

export class ProductStockAdjustedEvent extends DomainEvent {
  constructor(
    public readonly productId: ProductId,
    public readonly oldStock: number,
    public readonly newStock: number
  ) {
    super();
  }
}
