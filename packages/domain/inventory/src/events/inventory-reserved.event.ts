export interface InventoryReservedEventPayload {
  orderId: string;
  reservationId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  expiresAt: Date;
  timestamp: Date;
}

export class InventoryReservedEvent {
  public readonly eventType = 'inventory.reserved';

  constructor(
    public readonly orderId: string,
    public readonly reservationId: string,
    public readonly items: Array<{ productId: string; quantity: number }>,
    public readonly expiresAt: Date = new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
    public readonly timestamp: Date = new Date(),
  ) {}

  toJSON(): InventoryReservedEventPayload {
    return {
      orderId: this.orderId,
      reservationId: this.reservationId,
      items: this.items,
      expiresAt: this.expiresAt,
      timestamp: this.timestamp,
    };
  }
}
