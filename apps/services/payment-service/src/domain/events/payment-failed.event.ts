import { PaymentDomainEvent, PaymentEventPayload } from './payment-event.base';
import type { MoneyPrimitives } from '../value-objects/money.vo';
import type { PaymentStatusValue } from '../value-objects/payment-status.vo';

export interface PaymentFailedPayload extends PaymentEventPayload {
  orderId: string;
  customerId: string;
  amount: MoneyPrimitives;
  currency?: string;
  status?: PaymentStatusValue;
  metadata: Record<string, any>;
  stripePaymentIntentId: string | null;
  reason: string;
}

export class PaymentFailedEvent extends PaymentDomainEvent<PaymentFailedPayload> {
  constructor(payload: PaymentFailedPayload) {
    super(payload.paymentId, 'payment.failed', payload);
  }
}
