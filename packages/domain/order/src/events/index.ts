// Public exports for order bounded context
import { DomainEvent } from '@a4co/shared-utils';

export * from '../entities/order.aggregate';
export * from '../value-objects/money.vo';
export * from '../ports/order.repository';
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

export class OrderCreatedEvent extends DomainEvent {
  public readonly eventType = 'orders.created';

  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly items: Array<{ productId: string; quantity: number; price: number }>,
    public readonly totalAmount: number,
    public readonly timestamp: Date = new Date(),
  ) {
    super();
  }

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

export class OrderCancelledEvent extends DomainEvent {
  public readonly eventType = 'orders.cancelled';

  constructor(
    public readonly orderId: string,
    public readonly reason: string,
    public readonly timestamp: Date = new Date(),
  ) {
    super();
  }

  toJSON(): OrderCancelledEventPayload {
    return {
      orderId: this.orderId,
      reason: this.reason,
      timestamp: this.timestamp,
    };
  }
}

export * from './order-confirmed.event';
export * from './order-failed.event';
export * from './order-status-changed.event';
