import { DomainEvent } from '@a4co/shared-utils';
import { ProductId } from '../value-objects/product-id.vo';
import { StockQuantity } from '../value-objects/stock-quantity.vo';

export class InventoryOutOfStockEvent extends DomainEvent {
  constructor(
    productId: ProductId,
    data: {
      requestedQuantity: StockQuantity;
      availableStock: StockQuantity;
      orderId: string;
      timestamp: Date;
    },
    sagaId?: string
  ) {
    super(
      productId.value,
      {
        requestedQuantity: data.requestedQuantity.value,
        availableStock: data.availableStock.value,
        orderId: data.orderId,
        timestamp: data.timestamp,
      },
      1,
      sagaId
    );
  }
}
