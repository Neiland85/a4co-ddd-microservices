import { PaymentDomainEvent, PaymentEventPayload } from './payment-event.base';
import { MoneyPrimitives } from '../value-objects/money.vo';
import { PaymentStatusValue } from '../value-objects/payment-status.vo';

export interface PaymentCreatedEventPayload extends PaymentEventPayload {
  status: PaymentStatusValue.PENDING;
}

export class PaymentCreatedEvent extends PaymentDomainEvent<PaymentCreatedEventPayload> {
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
        metadata: params.metadata ?? {},
        stripePaymentIntentId: params.stripePaymentIntentId,
        status: PaymentStatusValue.PENDING,
        timestamp: params.timestamp ?? new Date(),
      },
      1,
      params.sagaId,
    );
  }
}

