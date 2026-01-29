import { DomainEvent } from '@a4co/shared-utils';

/**
 * Event name constant for OrderFailedV1
 */
export const ORDER_FAILED_V1 = 'order.failed.v1';

/**
 * Payload for OrderFailedV1 event
 */
export interface OrderFailedV1Data {
  orderId: string;
  customerId: string;
  reason: string;
  failedAt: string; // ISO timestamp
}

/**
 * Domain Event: Order Failed v1
 * Emitted when an order fails (payment failed, inventory unavailable, etc.).
 * Triggers saga rollback.
 * 
 * @version v1
 * @pattern Saga Failure Handling
 */
export class OrderFailedV1Event extends DomainEvent {
  public readonly eventType = ORDER_FAILED_V1;

  constructor(public readonly data: OrderFailedV1Data) {
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
