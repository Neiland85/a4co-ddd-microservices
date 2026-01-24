import { PaymentDomainEvent, PaymentEventPayload } from './payment-event.base';
import type { MoneyPrimitives } from '../value-objects/money.vo';
import type { PaymentStatusValue } from '../value-objects/payment-status.vo';

export interface PaymentSucceededPayload extends PaymentEventPayload {
  orderId: string;
  customerId: string;
  amount: MoneyPrimitives;
  currency?: string;
  metadata: Record<string, any>;
  stripePaymentIntentId: string;
  status?: PaymentStatusValue;
  timestamp: Date;
}

export class PaymentSucceededEvent extends PaymentDomainEvent<PaymentSucceededPayload> {
  constructor(params: Omit<PaymentSucceededPayload, 'timestamp'> & { timestamp?: Date }) {
    const payload: PaymentSucceededPayload = {
      ...params,
      timestamp: params.timestamp ?? new Date(),
    };

    super(payload.paymentId, 'payment.succeeded.v1', payload, 1);
  }
}
