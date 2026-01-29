import { DomainEvent } from '@a4co/shared-utils';
import { type MoneyPrimitives } from '../../shared/value-objects/money.vo.js';

export const PAYMENT_CREATED_V1 = 'payment.created.v1';

export interface PaymentCreatedV1Data {
  paymentId: string;
  orderId: string;
  customerId: string;
  amount: MoneyPrimitives;
  createdAt: string;
}

export class PaymentCreatedV1Event extends DomainEvent {
  public readonly eventType = PAYMENT_CREATED_V1;

  constructor(public readonly data: PaymentCreatedV1Data) {
    super();
  }
}
