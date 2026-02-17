import { PaymentDomainEvent, PaymentEventPayload } from './payment-event.base';
import type { MoneyPrimitives } from '../value-objects/money.vo';
import type { PaymentStatusValue } from '../value-objects/payment-status.vo';

export interface PaymentFailedPayload extends PaymentEventPayload {
  orderId: string;
  customerId: string;
  amount: MoneyPrimitives;
  currency?: string;
  metadata: Record<string, any>;
  stripePaymentIntentId: string | null;
  status?: PaymentStatusValue;
  timestamp: Date;
  reason: string;
}

export class PaymentFailedEvent extends PaymentDomainEvent<PaymentFailedPayload> {
  constructor(params: Omit<PaymentFailedPayload, 'timestamp'> & { timestamp?: Date }) {
    const payload: PaymentFailedPayload = {
      ...params,
      timestamp: params.timestamp ?? new Date(),
    };

    super(payload.paymentId, 'payment.failed.v1', payload, 1);
  }
}
