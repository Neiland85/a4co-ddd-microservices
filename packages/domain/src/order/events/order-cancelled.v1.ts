import { DomainEvent } from '@a4co/shared-utils';

/**
 * Event name constant for OrderCancelledV1
 */
export const ORDER_CANCELLED_V1 = 'order.cancelled.v1';

/**
 * Payload for OrderCancelledV1 event
 */
export interface OrderCancelledV1Data {
  orderId: string;
  customerId: string;
  reason?: string;
  cancelledAt: string; // ISO timestamp
}

/**
 * Domain Event: Order Cancelled v1
 * Emitted when an order is cancelled.
 * Triggers compensating transactions in the saga.
 * 
 * @version v1
 * @pattern Saga Compensation
 */
export class OrderCancelledV1Event extends DomainEvent {
  public readonly eventType = ORDER_CANCELLED_V1;

  constructor(public readonly data: OrderCancelledV1Data) {
    super(data.orderId, data);
  }

  public toJSON() {
    return {
      eventType: this.eventType,
      data: this.data,
      occurredOn: this.occurredOn,
    };
  }
}
