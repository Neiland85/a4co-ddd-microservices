import { PaymentDomainEvent, PaymentEventPayload } from './payment-event.base';
import type { MoneyPrimitives } from '../value-objects/money.vo';
import type { PaymentStatusValue } from '../value-objects/payment-status.vo';

export interface PaymentProcessingPayload extends PaymentEventPayload {
  orderId: string;
  customerId: string;
  amount: MoneyPrimitives;
  currency?: string;
  status?: PaymentStatusValue;
  metadata: Record<string, any>;
  stripePaymentIntentId: string | null;
}

export class PaymentProcessingEvent extends PaymentDomainEvent<PaymentProcessingPayload> {
  constructor(payload: PaymentProcessingPayload) {
    super(payload.paymentId, 'payment.processing', payload);
  }
}
