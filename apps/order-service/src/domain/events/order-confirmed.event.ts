export interface OrderConfirmedEventPayload {
  orderId: string;
  customerId: string;
  totalAmount: number;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  paymentId: string;
  timestamp: Date;
}

export class OrderConfirmedEvent {
  public readonly eventType = 'orders.confirmed';
  
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly totalAmount: number,
    public readonly items: Array<{ productId: string; quantity: number; price: number }>,
    public readonly paymentId: string,
    public readonly timestamp: Date = new Date(),
  ) {}

  toJSON(): OrderConfirmedEventPayload {
    return {
      orderId: this.orderId,
      customerId: this.customerId,
      totalAmount: this.totalAmount,
      items: this.items,
      paymentId: this.paymentId,
      timestamp: this.timestamp,
    };
  }
}
