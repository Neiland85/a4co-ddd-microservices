import { PaymentDomainEvent, PaymentEventPayload } from './payment-event.base';
import { MoneyPrimitives } from '../value-objects/money.vo';
import { PaymentStatusValue } from '../value-objects/payment-status.vo';

export interface PaymentProcessingEventPayload extends PaymentEventPayload {
  status: PaymentStatusValue.PROCESSING;
}

export class PaymentProcessingEvent extends PaymentDomainEvent<PaymentProcessingEventPayload> {
  constructor(params: {
    paymentId: string;
    orderId: string;
    customerId: string;
    amount: MoneyPrimitives;
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
        metadata: params.metadata ?? {},
        stripePaymentIntentId: params.stripePaymentIntentId ?? null,
        status: PaymentStatusValue.PROCESSING,
        timestamp: params.timestamp ?? new Date(),
      },
      1,
      params.sagaId,
    );
  }
}
