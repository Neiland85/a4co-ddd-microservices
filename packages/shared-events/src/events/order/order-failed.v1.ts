import { DomainEventBase, EventTypes } from '../../base/event.base.js';

/**
 * Payload for OrderFailedV1 event
 */
export interface OrderFailedV1Data {
  orderId: string;
  customerId: string;
  reason: string;
  failedAt: string; // ISO timestamp
  stage?: 'validation' | 'inventory' | 'payment' | 'unknown';
}

/**
 * Event emitted when an order processing fails.
 * This indicates a permanent failure that cannot be recovered.
 * 
 * @version v1
 * @pattern Saga Orchestration - Failure
 */
export class OrderFailedV1Event extends DomainEventBase<OrderFailedV1Data> {
  constructor(
    data: OrderFailedV1Data,
    correlationId?: string,
    metadata?: Record<string, any>,
  ) {
    super(EventTypes.ORDER_FAILED_V1, data, correlationId, metadata);
  }
}
