import { PaymentDomainEvent, PaymentEventPayload } from './payment-event.base';
import type { MoneyPrimitives } from '../value-objects/money.vo';
import type { PaymentStatusValue } from '../value-objects/payment-status.vo';

export interface PaymentCreatedPayload extends PaymentEventPayload {
  orderId: string;
  customerId: string;
  amount: MoneyPrimitives;
  currency?: string;
  metadata: Record<string, any>;
  stripePaymentIntentId: string | null;
  status?: PaymentStatusValue;
  timestamp: Date;
}

export class PaymentCreatedEvent extends PaymentDomainEvent<PaymentCreatedPayload> {
  constructor(params: Omit<PaymentCreatedPayload, 'timestamp'> & { timestamp?: Date }) {
    const payload: PaymentCreatedPayload = {
      ...params,
      timestamp: params.timestamp ?? new Date(),
    };

    super(payload.paymentId, 'payment.created.v1', payload, 1);
  }
}
