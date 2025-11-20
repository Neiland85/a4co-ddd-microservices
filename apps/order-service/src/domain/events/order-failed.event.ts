export interface OrderFailedEventPayload {
  orderId: string;
  customerId: string;
  reason: string;
  failureStage: 'inventory_check' | 'stock_reservation' | 'payment_processing';
  compensationRequired: boolean;
  timestamp: Date;
}

export class OrderFailedEvent {
  public readonly eventType = 'orders.failed';
  
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly reason: string,
    public readonly failureStage: 'inventory_check' | 'stock_reservation' | 'payment_processing',
    public readonly compensationRequired: boolean = false,
    public readonly timestamp: Date = new Date(),
  ) {}

  toJSON(): OrderFailedEventPayload {
    return {
      orderId: this.orderId,
      customerId: this.customerId,
      reason: this.reason,
      failureStage: this.failureStage,
      compensationRequired: this.compensationRequired,
      timestamp: this.timestamp,
    };
  }
}
