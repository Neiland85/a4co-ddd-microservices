import { PaymentDomainEvent, PaymentEventPayload } from './payment-event.base';
import { MoneyPrimitives } from '../value-objects/money.vo';
import { PaymentStatusValue } from '../value-objects/payment-status.vo';

export interface PaymentFailedEventPayload extends PaymentEventPayload {
  status: PaymentStatusValue.FAILED;
  reason: string;
}

export class PaymentFailedEvent extends PaymentDomainEvent<PaymentFailedEventPayload> {
  constructor(params: {
    paymentId: string;
    orderId: string;
    customerId: string;
    amount: MoneyPrimitives;
    metadata?: Record<string, any>;
    reason: string;
    stripePaymentIntentId?: string | null;
    timestamp?: Date;
    sagaId?: string;
  }) {
    if (!params.reason) {
      throw new Error('PaymentFailedEvent requires a failure reason');
    }

    super(
      params.paymentId,
      {
        paymentId: params.paymentId,
        orderId: params.orderId,
        customerId: params.customerId,
        amount: params.amount,
        currency: params.amount.currency,
        metadata: params.metadata ?? {},
        stripePaymentIntentId: params.stripePaymentIntentId ?? null,
        status: PaymentStatusValue.FAILED,
        timestamp: params.timestamp ?? new Date(),
        reason: params.reason,
      },
      1,
      params.sagaId,
    );
  }
}
