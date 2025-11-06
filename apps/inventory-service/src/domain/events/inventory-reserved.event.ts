import { DomainEvent } from '@a4co/shared-utils';
import { ProductId } from '../value-objects/product-id.vo';
import { StockQuantity } from '../value-objects/stock-quantity.vo';

export class InventoryReservedEvent extends DomainEvent {
  constructor(
    productId: ProductId,
    data: {
      quantity: StockQuantity;
      currentStock: StockQuantity;
      reservedStock: StockQuantity;
      availableStock: StockQuantity;
      orderId: string;
      timestamp: Date;
    },
    sagaId?: string
  ) {
    super(
      productId.value,
      {
        quantity: data.quantity.value,
        currentStock: data.currentStock.value,
        reservedStock: data.reservedStock.value,
        availableStock: data.availableStock.value,
        orderId: data.orderId,
        timestamp: data.timestamp,
      },
      1,
      sagaId
    );
  }
}
