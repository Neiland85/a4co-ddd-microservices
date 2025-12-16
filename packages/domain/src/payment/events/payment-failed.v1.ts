import { DomainEvent } from '@a4co/shared-utils';
import { type MoneyPrimitives } from '../../common/value-objects/money.vo.js';

export const PAYMENT_FAILED_V1 = 'payment.failed.v1';

export interface PaymentFailedV1Data {
  paymentId: string;
  orderId: string;
  customerId: string;
  amount: MoneyPrimitives;
  reason: string;
  failedAt: string;
}

export class PaymentFailedV1Event extends DomainEvent {
  public readonly eventType = PAYMENT_FAILED_V1;

  constructor(public readonly data: PaymentFailedV1Data) {
    super(data.paymentId, data);
  }
}
