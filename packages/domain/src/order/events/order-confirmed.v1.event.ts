import { DomainEvent } from '@a4co/shared-utils';
import { MoneyPrimitives } from '../../common/value-objects/money.vo.js';

/**
 * Event topic constant
 */
export const ORDER_CONFIRMED_V1 = 'order.confirmed.v1';

/**
 * Payload for OrderConfirmedV1 event
 */
export interface OrderConfirmedV1Payload {
  orderId: string;
  customerId: string;
  totalAmount: MoneyPrimitives;
  paymentId: string;
  timestamp: string;
}

/**
 * Event emitted when an order is confirmed after payment
 * 
 * @version v1
 * @topic order.confirmed.v1
 * @pattern Saga Orchestration
 */
export class OrderConfirmedV1Event extends DomainEvent {
  public readonly eventType = ORDER_CONFIRMED_V1;

  constructor(
    orderId: string,
    payload: OrderConfirmedV1Payload,
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
    totalAmount: MoneyPrimitives,
    paymentId: string,
    sagaId?: string,
  ): OrderConfirmedV1Event {
    const payload: OrderConfirmedV1Payload = {
      orderId,
      customerId,
      totalAmount,
      paymentId,
      timestamp: new Date().toISOString(),
    };

    return new OrderConfirmedV1Event(orderId, payload, 1, sagaId);
  }
}
