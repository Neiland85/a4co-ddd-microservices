import { PaymentDomainEvent, PaymentEventPayload } from './payment-event.base';
import type { MoneyPrimitives } from '../value-objects/money.vo';
import type { PaymentStatusValue } from '../value-objects/payment-status.vo';

export interface PaymentProcessingPayload extends PaymentEventPayload {
  orderId: string;
  customerId: string;
  amount: MoneyPrimitives;
  currency?: string;
  metadata: Record<string, any>;
  stripePaymentIntentId: string | null;
  status?: PaymentStatusValue;
  timestamp: Date;
}

export class PaymentProcessingEvent extends PaymentDomainEvent<PaymentProcessingPayload> {
  constructor(params: Omit<PaymentProcessingPayload, 'timestamp'> & { timestamp?: Date }) {
    const payload: PaymentProcessingPayload = {
      ...params,
      timestamp: params.timestamp ?? new Date(),
    };

    super(payload.paymentId, 'payment.processing.v1', payload, 1);
  }
}
