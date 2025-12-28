import { DomainEventBase, EventTypes } from '../../base/event.base.js';

/**
 * Payload for PaymentConfirmedV1 event
 */
export interface PaymentConfirmedV1Data {
  paymentId: string;
  orderId: string;
  customerId: string;
  amount: number;
  currency: string;
  paymentIntentId?: string; // Stripe payment intent ID
  confirmedAt: string; // ISO timestamp
  metadata?: Record<string, any>;
}

/**
 * Event emitted when a payment is successfully confirmed.
 * This allows the order saga to proceed to completion.
 * 
 * @version v1
 * @pattern Saga Orchestration - Payment Success
 */
export class PaymentConfirmedV1Event extends DomainEventBase<PaymentConfirmedV1Data> {
  constructor(
    data: PaymentConfirmedV1Data,
    correlationId?: string,
    metadata?: Record<string, any>,
  ) {
    super(EventTypes.PAYMENT_CONFIRMED_V1, data, correlationId, metadata);
  }
}
