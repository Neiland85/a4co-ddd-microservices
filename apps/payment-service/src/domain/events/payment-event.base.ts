import { DomainEvent } from '@a4co/shared-utils';
import { MoneyPrimitives } from '../value-objects/money.vo';
import { PaymentStatusValue } from '../value-objects/payment-status.vo';

export interface PaymentEventPayload {
  paymentId: string;
  orderId: string;
  customerId: string;
  amount: MoneyPrimitives;
  status: PaymentStatusValue;
  metadata: Record<string, any>;
  stripePaymentIntentId?: string | null;
  timestamp: Date;
  reason?: string;
}

export abstract class PaymentDomainEvent<TPayload extends PaymentEventPayload> extends DomainEvent {
  public readonly payload: TPayload;

  protected constructor(paymentId: string, payload: TPayload, eventVersion?: number, sagaId?: string) {
    super(paymentId, { ...payload, timestamp: payload.timestamp.toISOString() }, eventVersion, sagaId);
    this.payload = payload;
  }
}

