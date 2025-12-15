import { DomainEventBase, EventTypes } from '../../base/event.base.js';

/**
 * Payload for PaymentProcessingV1 event
 */
export interface PaymentProcessingV1Data {
  paymentId: string;
  orderId: string;
  customerId: string;
  amount: number;
  currency: string;
  startedAt: string; // ISO timestamp
  metadata?: Record<string, any>;
}

/**
 * Event emitted when payment processing has started.
 * This is an intermediate event for monitoring and tracking.
 * 
 * @version v1
 * @pattern Saga Orchestration - Payment Progress
 */
export class PaymentProcessingV1Event extends DomainEventBase<PaymentProcessingV1Data> {
  constructor(
    data: PaymentProcessingV1Data,
    correlationId?: string,
    metadata?: Record<string, any>,
  ) {
    super(EventTypes.PAYMENT_PROCESSING_V1, data, correlationId, metadata);
  }


}
