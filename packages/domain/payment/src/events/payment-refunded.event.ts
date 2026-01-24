import { PaymentDomainEvent, PaymentEventPayload } from './payment-event.base';
import type { MoneyPrimitives } from '../value-objects/money.vo';
import type { PaymentStatusValue } from '../value-objects/payment-status.vo';

export interface PaymentRefundedPayload extends PaymentEventPayload {
  orderId: string;
  customerId: string;
  amount: MoneyPrimitives;
  currency?: string;
  refundAmount: MoneyPrimitives;
  metadata: Record<string, any>;
  stripePaymentIntentId: string | null;
  status?: PaymentStatusValue;
  timestamp: Date;
}

export class PaymentRefundedEvent extends PaymentDomainEvent<PaymentRefundedPayload> {
  constructor(params: Omit<PaymentRefundedPayload, 'timestamp'> & { timestamp?: Date }) {
    const payload: PaymentRefundedPayload = {
      ...params,
      timestamp: params.timestamp ?? new Date(),
    };

    super(payload.paymentId, 'payment.refunded.v1', payload, 1);
  }
}
