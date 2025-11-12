export * from './inventory-reserved.event';
export * from './inventory-out-of-stock.event';
export * from './inventory-released.event';
export class InventoryReservedEvent {
  constructor(
    public readonly orderId: string,
    public readonly reservations: Array<{
      reservationId: string;
      productId: string;
      quantity: number;
    }>,
    public readonly totalAmount: number,
  ) {}
}

export class InventoryOutOfStockEvent {
  constructor(
    public readonly orderId: string,
    public readonly reason: string,
  ) {}
}

export class InventoryReleasedEvent {
  constructor(
    public readonly orderId: string,
    public readonly reservationId: string,
    public readonly productId: string,
    public readonly quantity: number,
  ) {}
}

export class LowStockAlertEvent {
  constructor(
    public readonly productId: string,
    public readonly currentStock: number,
    public readonly minimumStock: number,
  ) {}
}
