import { DomainEvent } from '@a4co/shared-utils';

export interface OrderStatusChangedEventPayload {
  orderId: string;
  previousStatus: string;
  newStatus: string;
}

export class OrderStatusChangedEvent extends DomainEvent {
  public readonly eventType = 'orders.status_changed';

  constructor(orderId: string, previousStatus: string, newStatus: string) {
    const payload: OrderStatusChangedEventPayload = {
      orderId,
      previousStatus,
      newStatus,
    };

    super();
    this.payload = payload;
  }

  public readonly payload: OrderStatusChangedEventPayload;
}
