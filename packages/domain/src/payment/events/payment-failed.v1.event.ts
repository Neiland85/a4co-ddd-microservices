import { DomainEvent } from '@a4co/shared-utils';
import { MoneyPrimitives } from '../../common/value-objects/money.vo.js';

/**
 * Event topic constant
 */
export const PAYMENT_FAILED_V1 = 'payment.failed.v1';

/**
 * Payload for PaymentFailedV1 event
 */
export interface PaymentFailedV1Payload {
  paymentId: string;
  orderId: string;
  customerId: string;
  amount: MoneyPrimitives;
  reason: string;
  errorCode?: string;
  timestamp: string;
}

/**
 * Event emitted when a payment fails
 * 
 * @version v1
 * @topic payment.failed.v1
 * @pattern Saga Compensation
 */
export class PaymentFailedV1Event extends DomainEvent {
  public readonly eventType = PAYMENT_FAILED_V1;

  constructor(
    paymentId: string,
    payload: PaymentFailedV1Payload,
    eventVersion: number = 1,
    sagaId?: string,
  ) {
    super(paymentId, payload, eventVersion, sagaId);
  }

  /**
   * Create event from aggregate data
   */
  static create(
    paymentId: string,
    orderId: string,
    customerId: string,
    amount: MoneyPrimitives,
    reason: string,
    errorCode?: string,
    sagaId?: string,
  ): PaymentFailedV1Event {
    const payload: PaymentFailedV1Payload = {
      paymentId,
      orderId,
      customerId,
      amount,
      reason,
      ...(errorCode !== undefined && { errorCode }),
      timestamp: new Date().toISOString(),
    };

    return new PaymentFailedV1Event(paymentId, payload, 1, sagaId);
  }
}
