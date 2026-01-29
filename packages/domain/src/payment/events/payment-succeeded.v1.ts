import { DomainEvent } from '@a4co/shared-utils';
import { type MoneyPrimitives } from '../../shared/value-objects/money.vo.js';

export const PAYMENT_SUCCEEDED_V1 = 'payment.succeeded.v1';

export interface PaymentSucceededV1Data {
  paymentId: string;
  orderId: string;
  customerId: string;
  amount: MoneyPrimitives;
  stripePaymentIntentId: string;
  succeededAt: string;
}

export class PaymentSucceededV1Event extends DomainEvent {
  public readonly eventType = PAYMENT_SUCCEEDED_V1;

  constructor(public readonly data: PaymentSucceededV1Data) {
    super();
  }
}
