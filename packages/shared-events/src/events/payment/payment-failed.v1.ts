import { DomainEventBase, EventTypes } from '../../base/event.base.js';

/**
 * Payload for PaymentFailedV1 event
 */
export interface PaymentFailedV1Data {
  paymentId?: string;
  orderId: string;
  customerId: string;
  amount: number;
  currency: string;
  reason: string;
  failedAt: string; // ISO timestamp
  errorCode?: string;
  metadata?: Record<string, any>;
}

/**
 * Event emitted when a payment fails.
 * This triggers saga compensation to rollback the order.
 * 
 * @version v1
 * @pattern Saga Orchestration - Payment Failure & Compensation
 */
export class PaymentFailedV1Event extends DomainEventBase<PaymentFailedV1Data> {
  constructor(
    data: PaymentFailedV1Data,
    correlationId?: string,
    metadata?: Record<string, any>,
  ) {
    super(EventTypes.PAYMENT_FAILED_V1, data, correlationId, metadata);
  }
}
