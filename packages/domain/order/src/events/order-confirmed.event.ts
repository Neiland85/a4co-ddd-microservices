import { DomainEvent } from '@a4co/shared-utils';

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
}

export class OrderConfirmedEvent extends DomainEvent {
  public readonly eventType = 'orders.confirmed';

  constructor(
    public readonly payload: OrderConfirmedEventPayload,
  ) {
    super();
  }
}
