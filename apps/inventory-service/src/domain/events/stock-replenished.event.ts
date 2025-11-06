import { DomainEvent } from '@a4co/shared-utils';
import { ProductId } from '../value-objects/product-id.vo';
import { StockQuantity } from '../value-objects/stock-quantity.vo';

export class StockReplenishedEvent extends DomainEvent {
  constructor(
    productId: ProductId,
    data: {
      quantity: StockQuantity;
      currentStock: StockQuantity;
      previousStock: StockQuantity;
      reason: string;
      timestamp: Date;
    },
    sagaId?: string
  ) {
    super(
      productId.value,
      {
        quantity: data.quantity.value,
        currentStock: data.currentStock.value,
        previousStock: data.previousStock.value,
        reason: data.reason,
        timestamp: data.timestamp,
      },
      1,
      sagaId
    );
  }
}
