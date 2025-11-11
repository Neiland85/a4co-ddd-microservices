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
