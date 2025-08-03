import { v4 as uuidv4 } from 'uuid';

/**
 * Base class for all domain events in the system
 * Implements event sourcing patterns and ensures consistency
 */
export abstract class DomainEvent<T = any> {
  public readonly eventId: string;
  public readonly aggregateId: string;
  public readonly eventType: string;
  public readonly eventVersion: string;
  public readonly occurredAt: Date;
  public readonly data: T;
  public readonly metadata: EventMetadata;

  constructor(
    aggregateId: string,
    eventType: string,
    data: T,
    metadata?: Partial<EventMetadata>
  ) {
    this.eventId = uuidv4();
    this.aggregateId = aggregateId;
    this.eventType = eventType;
    this.eventVersion = '1.0';
    this.occurredAt = new Date();
    this.data = data;
    this.metadata = {
      correlationId: metadata?.correlationId || uuidv4(),
      causationId: metadata?.causationId,
      userId: metadata?.userId || 'system',
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
      retryCount: metadata?.retryCount || 0,
    };
  }

  /**
   * Get the subject/topic name for NATS publishing
   */
  abstract getSubject(): string;

  /**
   * Validate event data before publishing
   */
  abstract validate(): boolean;

  /**
   * Convert event to JSON for storage/transmission
   */
  toJSON(): string {
    return JSON.stringify({
      eventId: this.eventId,
      aggregateId: this.aggregateId,
      eventType: this.eventType,
      eventVersion: this.eventVersion,
      occurredAt: this.occurredAt.toISOString(),
      data: this.data,
      metadata: this.metadata,
    });
  }

  /**
   * Create event from JSON string
   */
  static fromJSON<T>(json: string): DomainEvent<T> {
    const parsed = JSON.parse(json);
    // This would need to be implemented by each concrete event class
    throw new Error('fromJSON must be implemented by concrete event classes');
  }
}

/**
 * Metadata attached to every domain event
 */
export interface EventMetadata {
  correlationId: string;      // Track related events across services
  causationId?: string;       // ID of the event that caused this event
  userId: string;             // User who triggered the event
  ipAddress?: string;         // Client IP for audit
  userAgent?: string;         // Client user agent
  retryCount?: number;        // Number of processing attempts
}

/**
 * Base interface for event handlers
 */
export interface IEventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;
  getEventType(): string;
}

/**
 * Decorator for marking event handler methods
 */
export function EventHandler(eventType: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata('event:type', eventType, target, propertyKey);
    return descriptor;
  };
}

/**
 * Interface for aggregate roots that produce events
 */
export interface IEventSourcedAggregate {
  id: string;
  version: number;
  getUncommittedEvents(): DomainEvent[];
  markEventsAsCommitted(): void;
  loadFromHistory(events: DomainEvent[]): void;
}