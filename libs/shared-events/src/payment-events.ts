import { DomainEvent } from './base-event';

/**
 * Event Types (Versioned)
 */
export const PAYMENT_CONFIRMED_V1 = 'payment.confirmed.v1';
export const PAYMENT_FAILED_V1 = 'payment.failed.v1';
export const PAYMENT_REFUNDED_V1 = 'payment.refunded.v1';

/**
 * PaymentConfirmedV1Event
 * Emitted when payment is successfully processed
 */
export interface PaymentConfirmedV1Payload {
  paymentId: string;
  orderId: string;
  customerId: string;
  amount: number;
  currency: string;
  paymentMethod?: string;
  transactionId?: string;
  confirmedAt: string;
}

export class PaymentConfirmedV1Event extends DomainEvent {
  constructor(
    public readonly payload: PaymentConfirmedV1Payload,
    correlationId?: string,
  ) {
    super(PAYMENT_CONFIRMED_V1, 'v1', correlationId);
  }

  toJSON() {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      version: this.version,
      timestamp: this.timestamp,
      correlationId: this.correlationId,
      payload: this.payload,
    };
  }
}

/**
 * PaymentFailedV1Event
 * Emitted when payment processing fails
 */
export interface PaymentFailedV1Payload {
  orderId: string;
  customerId: string;
  amount: number;
  currency: string;
  reason: string;
  errorCode?: string;
  failedAt: string;
}

export class PaymentFailedV1Event extends DomainEvent {
  constructor(
    public readonly payload: PaymentFailedV1Payload,
    correlationId?: string,
  ) {
    super(PAYMENT_FAILED_V1, 'v1', correlationId);
  }

  toJSON() {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      version: this.version,
      timestamp: this.timestamp,
      correlationId: this.correlationId,
      payload: this.payload,
    };
  }
}

/**
 * PaymentRefundedV1Event
 * Emitted when payment is refunded (compensation)
 */
export interface PaymentRefundedV1Payload {
  paymentId: string;
  orderId: string;
  customerId: string;
  amount: number;
  currency: string;
  reason: string;
  refundedAt: string;
}

export class PaymentRefundedV1Event extends DomainEvent {
  constructor(
    public readonly payload: PaymentRefundedV1Payload,
    correlationId?: string,
  ) {
    super(PAYMENT_REFUNDED_V1, 'v1', correlationId);
  }

  toJSON() {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      version: this.version,
      timestamp: this.timestamp,
      correlationId: this.correlationId,
      payload: this.payload,
    };
  }
}
