import { DomainEvent } from '@a4co/shared-utils';
import { ProductId } from '../value-objects/product-id.vo';
import { StockQuantity } from '../value-objects/stock-quantity.vo';

export class LowStockEvent extends DomainEvent {
  constructor(
    productId: ProductId,
    data: {
      currentStock: StockQuantity;
      reservedStock: StockQuantity;
      availableStock: StockQuantity;
      reorderPoint: number;
      timestamp: Date;
    },
    sagaId?: string
  ) {
    super(
      productId.value,
      {
        currentStock: data.currentStock.value,
        reservedStock: data.reservedStock.value,
        availableStock: data.availableStock.value,
        reorderPoint: data.reorderPoint,
        timestamp: data.timestamp,
      },
      1,
      sagaId
    );
  }
}
