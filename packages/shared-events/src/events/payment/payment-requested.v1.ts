import { DomainEventBase, EventTypes } from '../../base/event.base.js';

/**
 * Payload for PaymentRequestedV1 event
 */
export interface PaymentRequestedV1Data {
  orderId: string;
  customerId: string;
  amount: number;
  currency: string;
  paymentMethod?: string;
  metadata?: Record<string, any>;
}

/**
 * Event emitted when a payment is requested by the order service.
 * This triggers the payment processing saga step.
 * 
 * @version v1
 * @pattern Saga Orchestration - Payment Step
 */
export class PaymentRequestedV1Event extends DomainEventBase<PaymentRequestedV1Data> {
  constructor(
    data: PaymentRequestedV1Data,
    correlationId?: string,
    metadata?: Record<string, any>,
  ) {
    super(EventTypes.PAYMENT_REQUESTED_V1, data, correlationId, metadata);
  }
}
