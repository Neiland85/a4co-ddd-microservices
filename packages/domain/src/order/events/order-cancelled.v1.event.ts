import { DomainEvent } from '@a4co/shared-utils';

/**
 * Event topic constant
 */
export const ORDER_CANCELLED_V1 = 'order.cancelled.v1';

/**
 * Payload for OrderCancelledV1 event
 */
export interface OrderCancelledV1Payload {
  orderId: string;
  customerId: string;
  reason: string;
  timestamp: string;
}

/**
 * Event emitted when an order is cancelled
 * 
 * @version v1
 * @topic order.cancelled.v1
 * @pattern Saga Compensation
 */
export class OrderCancelledV1Event extends DomainEvent {
  public readonly eventType = ORDER_CANCELLED_V1;

  constructor(
    orderId: string,
    payload: OrderCancelledV1Payload,
    eventVersion: number = 1,
    sagaId?: string,
  ) {
    super(orderId, payload, eventVersion, sagaId);
  }

  /**
   * Create event from aggregate data
   */
  static create(
    orderId: string,
    customerId: string,
    reason: string,
    sagaId?: string,
  ): OrderCancelledV1Event {
    const payload: OrderCancelledV1Payload = {
      orderId,
      customerId,
      reason,
      timestamp: new Date().toISOString(),
    };

    return new OrderCancelledV1Event(orderId, payload, 1, sagaId);
  }
}
