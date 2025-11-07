import { PaymentDomainEvent, PaymentEventPayload } from './payment-event.base';
import { MoneyPrimitives } from '../value-objects/money.vo';
import { PaymentStatusValue } from '../value-objects/payment-status.vo';

export interface PaymentSucceededEventPayload extends PaymentEventPayload {
  status: PaymentStatusValue.SUCCEEDED;
  stripePaymentIntentId: string;
}

export class PaymentSucceededEvent extends PaymentDomainEvent<PaymentSucceededEventPayload> {
  constructor(params: {
    paymentId: string;
    orderId: string;
    customerId: string;
    amount: MoneyPrimitives;
    metadata?: Record<string, any>;
    stripePaymentIntentId: string;
    timestamp?: Date;
    sagaId?: string;
  }) {
    if (!params.stripePaymentIntentId) {
      throw new Error('PaymentSucceededEvent requires a Stripe payment intent id');
    }

    super(
      params.paymentId,
      {
        paymentId: params.paymentId,
        orderId: params.orderId,
        customerId: params.customerId,
        amount: params.amount,
        metadata: params.metadata ?? {},
        stripePaymentIntentId: params.stripePaymentIntentId,
        status: PaymentStatusValue.SUCCEEDED,
        timestamp: params.timestamp ?? new Date(),
      },
      1,
      params.sagaId,
    );
  }
}

