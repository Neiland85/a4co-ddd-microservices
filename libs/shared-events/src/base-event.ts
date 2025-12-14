/**
 * Base interface for all events in the system
 * Provides common fields and structure
 */
export interface BaseEvent {
  eventId: string;
  eventType: string;
  version: string;
  timestamp: string;
  correlationId?: string;
}

/**
 * Base class for creating typed events
 */
export abstract class DomainEvent implements BaseEvent {
  public readonly eventId: string;
  public readonly timestamp: string;
  public readonly correlationId?: string;

  constructor(
    public readonly eventType: string,
    public readonly version: string,
    correlationId?: string,
  ) {
    this.eventId = this.generateEventId();
    this.timestamp = new Date().toISOString();
    this.correlationId = correlationId;
  }

  private generateEventId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  abstract toJSON(): Record<string, any>;
}
