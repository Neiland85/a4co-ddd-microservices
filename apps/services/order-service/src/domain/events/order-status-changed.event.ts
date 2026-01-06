export interface OrderStatusChangedEventPayload {
  orderId: string;
  previousStatus: string;
  newStatus: string;
  timestamp: Date;
}

export class OrderStatusChangedEvent {
  public readonly eventType = 'orders.status_changed';
  
  constructor(
    public readonly orderId: string,
    public readonly previousStatus: string,
    public readonly newStatus: string,
    public readonly timestamp: Date = new Date(),
  ) {}

  toJSON(): OrderStatusChangedEventPayload {
    return {
      orderId: this.orderId,
      previousStatus: this.previousStatus,
      newStatus: this.newStatus,
      timestamp: this.timestamp,
    };
  }
}
