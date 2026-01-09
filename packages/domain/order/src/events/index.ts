export interface OrderCreatedEventPayload {
  orderId: string;
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  timestamp: Date;
}

export class OrderCreatedEvent {
  public readonly eventType = 'orders.created';

  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly items: Array<{ productId: string; quantity: number; price: number }>,
    public readonly totalAmount: number,
    public readonly timestamp: Date = new Date(),
  ) {}

  toJSON(): OrderCreatedEventPayload {
    return {
      orderId: this.orderId,
      customerId: this.customerId,
      items: this.items,
      totalAmount: this.totalAmount,
      timestamp: this.timestamp,
    };
  }
}

export interface OrderCancelledEventPayload {
  orderId: string;
  reason: string;
  timestamp: Date;
}

export class OrderCancelledEvent {
  public readonly eventType = 'orders.cancelled';

  constructor(
    public readonly orderId: string,
    public readonly reason: string,
    public readonly timestamp: Date = new Date(),
  ) {}

  toJSON(): OrderCancelledEventPayload {
    return {
      orderId: this.orderId,
      reason: this.reason,
      timestamp: this.timestamp,
    };
  }
}

export * from './order-confirmed.event.js';
export * from './order-failed.event.js';
export * from './order-status-changed.event.js';
