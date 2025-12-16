import { DomainEvent } from '@a4co/shared-utils';
import { OrderItemPrimitives } from '../value-objects/order-item.vo.js';
import { MoneyPrimitives } from '../../common/value-objects/money.vo.js';

/**
 * Event topic constant
 */
export const ORDER_CREATED_V1 = 'order.created.v1';

/**
 * Payload for OrderCreatedV1 event
 */
export interface OrderCreatedV1Payload {
  orderId: string;
  customerId: string;
  items: OrderItemPrimitives[];
  totalAmount: MoneyPrimitives;
  timestamp: string;
}

/**
 * Event emitted when a new order is created
 * 
 * @version v1
 * @topic order.created.v1
 * @pattern Event Sourcing, Saga Orchestration
 */
export class OrderCreatedV1Event extends DomainEvent {
  public readonly eventType = ORDER_CREATED_V1;

  constructor(
    orderId: string,
    payload: OrderCreatedV1Payload,
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
    items: OrderItemPrimitives[],
    totalAmount: MoneyPrimitives,
    sagaId?: string,
  ): OrderCreatedV1Event {
    const payload: OrderCreatedV1Payload = {
      orderId,
      customerId,
      items,
      totalAmount,
      timestamp: new Date().toISOString(),
    };

    return new OrderCreatedV1Event(orderId, payload, 1, sagaId);
  }
}
