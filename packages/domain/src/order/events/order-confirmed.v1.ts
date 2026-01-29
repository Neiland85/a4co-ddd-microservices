import { DomainEvent } from '@a4co/shared-utils';

/**
 * Event name constant for OrderConfirmedV1
 */
export const ORDER_CONFIRMED_V1 = 'order.confirmed.v1';

/**
 * Payload for OrderConfirmedV1 event
 */
export interface OrderConfirmedV1Data {
  orderId: string;
  customerId: string;
  totalAmount: number;
  currency: string;
  confirmedAt: string; // ISO timestamp
}

/**
 * Domain Event: Order Confirmed v1
 * Emitted when an order is confirmed after successful payment.
 * 
 * @version v1
 * @pattern Saga Orchestration
 */
export class OrderConfirmedV1Event extends DomainEvent {
  public readonly eventType = ORDER_CONFIRMED_V1;

  constructor(public readonly data: OrderConfirmedV1Data) {
    super();
  }

  public toJSON() {
    return {
      eventType: this.eventType,
      data: this.data,
      occurredOn: this.occurredOn,
    };
  }
}
