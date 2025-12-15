import { DomainEventBase, EventTypes } from '../../base/event.base.js';

/**
 * Payload for OrderConfirmedV1 event
 */
export interface OrderConfirmedV1Data {
  orderId: string;
  customerId: string;
  paymentId: string;
  totalAmount: number;
  currency?: string;
  confirmedAt: string; // ISO timestamp
}

/**
 * Event emitted when an order is successfully confirmed.
 * This indicates the payment was successful and inventory was reserved.
 * 
 * @version v1
 * @pattern Saga Orchestration - Success Path
 */
export class OrderConfirmedV1Event extends DomainEventBase<OrderConfirmedV1Data> {
  constructor(
    data: OrderConfirmedV1Data,
    correlationId?: string,
    metadata?: Record<string, any>,
  ) {
    super(EventTypes.ORDER_CONFIRMED_V1, data, correlationId, metadata);
  }
}
