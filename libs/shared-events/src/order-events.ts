import { DomainEvent } from './base-event';

/**
 * Event Types (Versioned)
 */
export const ORDER_CREATED_V1 = 'order.created.v1';
export const ORDER_CONFIRMED_V1 = 'order.confirmed.v1';
export const ORDER_CANCELLED_V1 = 'order.cancelled.v1';
export const ORDER_FAILED_V1 = 'order.failed.v1';

/**
 * OrderCreatedV1Event
 * Emitted when a new order is created and needs processing
 */
export interface OrderCreatedV1Payload {
  orderId: string;
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
  totalAmount: number;
  currency: string;
}

export class OrderCreatedV1Event extends DomainEvent {
  constructor(
    public readonly payload: OrderCreatedV1Payload,
    correlationId?: string,
  ) {
    super(ORDER_CREATED_V1, 'v1', correlationId);
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
 * OrderConfirmedV1Event
 * Emitted when an order has been successfully confirmed (payment + inventory)
 */
export interface OrderConfirmedV1Payload {
  orderId: string;
  customerId: string;
  paymentId: string;
  reservationId: string;
  confirmedAt: string;
}

export class OrderConfirmedV1Event extends DomainEvent {
  constructor(
    public readonly payload: OrderConfirmedV1Payload,
    correlationId?: string,
  ) {
    super(ORDER_CONFIRMED_V1, 'v1', correlationId);
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
 * OrderCancelledV1Event
 * Emitted when an order is cancelled (due to failure or compensation)
 */
export interface OrderCancelledV1Payload {
  orderId: string;
  reason: string;
  cancelledAt: string;
}

export class OrderCancelledV1Event extends DomainEvent {
  constructor(
    public readonly payload: OrderCancelledV1Payload,
    correlationId?: string,
  ) {
    super(ORDER_CANCELLED_V1, 'v1', correlationId);
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
 * OrderFailedV1Event
 * Emitted when order processing fails
 */
export interface OrderFailedV1Payload {
  orderId: string;
  reason: string;
  failedAt: string;
}

export class OrderFailedV1Event extends DomainEvent {
  constructor(
    public readonly payload: OrderFailedV1Payload,
    correlationId?: string,
  ) {
    super(ORDER_FAILED_V1, 'v1', correlationId);
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
