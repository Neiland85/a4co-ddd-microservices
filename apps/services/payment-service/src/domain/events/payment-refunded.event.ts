import { PaymentDomainEvent, PaymentEventPayload } from './payment-event.base';
import type { MoneyPrimitives } from '../value-objects/money.vo';
import type { PaymentStatusValue } from '../value-objects/payment-status.vo';

export interface PaymentRefundedPayload extends PaymentEventPayload {
  orderId: string;
  customerId: string;
  amount: MoneyPrimitives;
  refundAmount: MoneyPrimitives;
  currency?: string;
  status?: PaymentStatusValue;
  metadata: Record<string, any>;
  stripePaymentIntentId: string | null;
}

export class PaymentRefundedEvent extends PaymentDomainEvent<PaymentRefundedPayload> {
  constructor(payload: PaymentRefundedPayload) {
    super(payload.paymentId, 'payment.refunded', payload);
  }
}
