import { PaymentDomainEvent, PaymentEventPayload } from './payment-event.base';
import type { MoneyPrimitives } from '../value-objects/money.vo';
import type { PaymentStatusValue } from '../value-objects/payment-status.vo';

export interface PaymentSucceededPayload extends PaymentEventPayload {
  orderId: string;
  customerId: string;
  amount: MoneyPrimitives;
  currency?: string;
  status?: PaymentStatusValue;
  metadata: Record<string, any>;
  stripePaymentIntentId: string;
}

export class PaymentSucceededEvent extends PaymentDomainEvent<PaymentSucceededPayload> {
  constructor(payload: PaymentSucceededPayload) {
    super(payload.paymentId, 'payment.succeeded', payload);
  }
}
