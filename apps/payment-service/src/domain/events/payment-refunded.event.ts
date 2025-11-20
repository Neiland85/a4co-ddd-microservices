import { PaymentDomainEvent, PaymentEventPayload } from './payment-event.base';
import { MoneyPrimitives } from '../value-objects/money.vo';
import { PaymentStatusValue } from '../value-objects/payment-status.vo';

export interface PaymentRefundedEventPayload extends PaymentEventPayload {
  status: PaymentStatusValue.REFUNDED;
  refundAmount: MoneyPrimitives;
}

export class PaymentRefundedEvent extends PaymentDomainEvent<PaymentRefundedEventPayload> {
  constructor(params: {
    paymentId: string;
    orderId: string;
    customerId: string;
    amount: MoneyPrimitives;
    refundAmount: MoneyPrimitives;
    metadata?: Record<string, any>;
    stripePaymentIntentId?: string | null;
    timestamp?: Date;
    sagaId?: string;
  }) {
    super(
      params.paymentId,
      {
        paymentId: params.paymentId,
        orderId: params.orderId,
        customerId: params.customerId,
        amount: params.amount,
        currency: params.amount.currency,
        refundAmount: params.refundAmount,
        metadata: params.metadata ?? {},
        stripePaymentIntentId: params.stripePaymentIntentId ?? null,
        status: PaymentStatusValue.REFUNDED,
        timestamp: params.timestamp ?? new Date(),
      },
      1,
      params.sagaId,
    );
  }
}
