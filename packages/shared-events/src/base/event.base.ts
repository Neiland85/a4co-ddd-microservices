import { v4 as uuidv4 } from 'uuid';

/**
 * Base interface for all domain events in the system.
 * All events MUST include:
 * - eventId: Unique identifier for idempotency
 * - eventType: Versioned event type (e.g., "order.created.v1")
 * - correlationId: For tracing through saga flows
 * - timestamp: When the event occurred
 */
export interface IDomainEvent<T = any> {
  readonly eventId: string;
  readonly eventType: string;
  readonly correlationId: string;
  readonly timestamp: Date;
  readonly data: T;
  readonly metadata?: Record<string, any>;
}

/**
 * Abstract base class for domain events with automatic ID generation
 * and correlation tracking.
 */
export abstract class DomainEventBase<T = any> implements IDomainEvent<T> {
  public readonly eventId: string;
  public readonly eventType: string;
  public readonly correlationId: string;
  public readonly timestamp: Date;
  public readonly data: T;
  public readonly metadata?: Record<string, any>;

  constructor(
    eventType: string,
    data: T,
    correlationId?: string,
    metadata?: Record<string, any>,
  ) {
    this.eventId = uuidv4();
    this.eventType = eventType;
    this.correlationId = correlationId || uuidv4();
    this.timestamp = new Date();
    this.data = data;
    this.metadata = metadata || undefined;
  }

  /**
   * Serialize event to JSON for transmission over message broker
   */
  toJSON(): Record<string, any> {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      correlationId: this.correlationId,
      timestamp: this.timestamp.toISOString(),
      data: this.data,
      ...(this.metadata && { metadata: this.metadata }),
    };
  }

  /**
   * Create event instance from JSON payload
   */
  static fromJSON<T>(json: Record<string, any>): IDomainEvent<T> {
    return {
      eventId: json['eventId'],
      eventType: json['eventType'],
      correlationId: json['correlationId'],
      timestamp: new Date(json['timestamp']),
      data: json['data'] as T,
      metadata: json['metadata'],
    };
  }
}

/**
 * Event type constants for versioned events
 */
export const EventTypes = {
  // Order events (v1)
  ORDER_CREATED_V1: 'order.created.v1',
  ORDER_CONFIRMED_V1: 'order.confirmed.v1',
  ORDER_CANCELLED_V1: 'order.cancelled.v1',
  ORDER_FAILED_V1: 'order.failed.v1',

  // Payment events (v1)
  PAYMENT_REQUESTED_V1: 'payment.requested.v1',
  PAYMENT_CONFIRMED_V1: 'payment.confirmed.v1',
  PAYMENT_FAILED_V1: 'payment.failed.v1',
  PAYMENT_PROCESSING_V1: 'payment.processing.v1',

  // Inventory events (v1)
  INVENTORY_RESERVED_V1: 'inventory.reserved.v1',
  INVENTORY_RELEASED_V1: 'inventory.released.v1',
  INVENTORY_OUT_OF_STOCK_V1: 'inventory.out_of_stock.v1',
} as const;

export type EventType = (typeof EventTypes)[keyof typeof EventTypes];
