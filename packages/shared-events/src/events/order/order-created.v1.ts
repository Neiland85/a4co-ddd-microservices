import { DomainEventBase, EventTypes } from '../../base/event.base.js';

/**
 * Order item structure
 */
export interface OrderItemV1 {
  productId: string;
  quantity: number;
  unitPrice: number;
}

/**
 * Payload for OrderCreatedV1 event
 */
export interface OrderCreatedV1Data {
  orderId: string;
  customerId: string;
  items: OrderItemV1[];
  totalAmount: number;
  currency?: string;
}

/**
 * Event emitted when a new order is created.
 * This event triggers the saga orchestration process.
 * 
 * @version v1
 * @pattern Saga Orchestration
 */
export class OrderCreatedV1Event extends DomainEventBase<OrderCreatedV1Data> {
  constructor(
    data: OrderCreatedV1Data,
    correlationId?: string,
    metadata?: Record<string, any>,
  ) {
    super(EventTypes.ORDER_CREATED_V1, data, correlationId, metadata);
  }
}
