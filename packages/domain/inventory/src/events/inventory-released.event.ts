export interface InventoryReleasedEventPayload {
  orderId: string;
  reservationId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  reason: 'order_cancelled' | 'order_expired' | 'payment_failed';
  timestamp: Date;
}

export class InventoryReleasedEvent {
  public readonly eventType = 'inventory.released';

  constructor(
    public readonly orderId: string,
    public readonly reservationId: string,
    public readonly items: Array<{ productId: string; quantity: number }>,
    public readonly reason: 'order_cancelled' | 'order_expired' | 'payment_failed',
    public readonly timestamp: Date = new Date(),
  ) {}

  toJSON(): InventoryReleasedEventPayload {
    return {
      orderId: this.orderId,
      reservationId: this.reservationId,
      items: this.items,
      reason: this.reason,
      timestamp: this.timestamp,
    };
  }
}
