import { DomainEventBase, EventTypes } from '../../base/event.base.js';

/**
 * Payload for OrderCancelledV1 event
 */
export interface OrderCancelledV1Data {
  orderId: string;
  customerId: string;
  reason: string;
  cancelledAt: string; // ISO timestamp
}

/**
 * Event emitted when an order is cancelled.
 * This can happen due to payment failure, inventory shortage, or user cancellation.
 * 
 * @version v1
 * @pattern Saga Orchestration - Compensation
 */
export class OrderCancelledV1Event extends DomainEventBase<OrderCancelledV1Data> {
  constructor(
    data: OrderCancelledV1Data,
    correlationId?: string,
    metadata?: Record<string, any>,
  ) {
    super(EventTypes.ORDER_CANCELLED_V1, data, correlationId, metadata);
  }


}
