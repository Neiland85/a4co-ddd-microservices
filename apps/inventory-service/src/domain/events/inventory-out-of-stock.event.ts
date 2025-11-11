export interface InventoryOutOfStockEventPayload {
  orderId: string;
  unavailableItems: Array<{
    productId: string;
    requestedQuantity: number;
    availableQuantity: number;
  }>;
  timestamp: Date;
}

export class InventoryOutOfStockEvent {
  public readonly eventType = 'inventory.out_of_stock';
  
  constructor(
    public readonly orderId: string,
    public readonly unavailableItems: Array<{
      productId: string;
      requestedQuantity: number;
      availableQuantity: number;
    }>,
    public readonly timestamp: Date = new Date(),
  ) {}

  toJSON(): InventoryOutOfStockEventPayload {
    return {
      orderId: this.orderId,
      unavailableItems: this.unavailableItems,
      timestamp: this.timestamp,
    };
  }
}
