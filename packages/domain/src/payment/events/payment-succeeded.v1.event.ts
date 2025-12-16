import { DomainEvent } from '@a4co/shared-utils';
import { MoneyPrimitives } from '../../common/value-objects/money.vo.js';

/**
 * Event topic constant
 */
export const PAYMENT_SUCCEEDED_V1 = 'payment.succeeded.v1';

/**
 * Payload for PaymentSucceededV1 event
 */
export interface PaymentSucceededV1Payload {
  paymentId: string;
  orderId: string;
  customerId: string;
  amount: MoneyPrimitives;
  paymentMethodId?: string;
  transactionId?: string;
  timestamp: string;
}

/**
 * Event emitted when a payment succeeds
 * 
 * @version v1
 * @topic payment.succeeded.v1
 * @pattern Saga Orchestration
 */
export class PaymentSucceededV1Event extends DomainEvent {
  public readonly eventType = PAYMENT_SUCCEEDED_V1;

  constructor(
    paymentId: string,
    payload: PaymentSucceededV1Payload,
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
    paymentMethodId?: string,
    transactionId?: string,
    sagaId?: string,
  ): PaymentSucceededV1Event {
    const payload: PaymentSucceededV1Payload = {
      paymentId,
      orderId,
      customerId,
      amount,
      ...(paymentMethodId !== undefined && { paymentMethodId }),
      ...(transactionId !== undefined && { transactionId }),
      timestamp: new Date().toISOString(),
    };

    return new PaymentSucceededV1Event(paymentId, payload, 1, sagaId);
  }
}
