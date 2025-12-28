/**
 * NATS event helper for E2E tests
 * Monitors and validates NATS events during order flow
 * 
 * Note: This is a simplified version that uses HTTP monitoring endpoint
 * For full NATS integration, consider using @nats-io/nats client
 */

// Configuration constants
const DEFAULT_EVENT_POLL_INTERVAL_MS = 100;
const DEFAULT_EVENT_TIMEOUT_MS = 10000;

export interface NATSEvent {
  subject: string;
  data: any;
  timestamp: string;
  correlationId?: string;
}

export class NATSEventMonitor {
  private events: NATSEvent[] = [];
  private monitoringUrl: string;
  private pollIntervalMs: number;

  constructor(
    monitoringUrl: string = 'http://localhost:8223',
    pollIntervalMs: number = DEFAULT_EVENT_POLL_INTERVAL_MS
  ) {
    this.monitoringUrl = monitoringUrl;
    this.pollIntervalMs = pollIntervalMs;
  }

  /**
   * Start monitoring NATS events
   * In a real implementation, this would connect to NATS and subscribe to events
   */
  async startMonitoring(): Promise<void> {
    // Check if NATS monitoring endpoint is available
    try {
      const response = await fetch(`${this.monitoringUrl}/healthz`);
      if (!response.ok) {
        console.warn('NATS monitoring endpoint not available');
      }
    } catch (error) {
      console.warn('Could not connect to NATS monitoring:', error);
    }
  }

  /**
   * Stop monitoring NATS events
   */
  async stopMonitoring(): Promise<void> {
    this.events = [];
  }

  /**
   * Record an event (simulated for testing)
   */
  recordEvent(event: NATSEvent): void {
    this.events.push(event);
  }

  /**
   * Get all recorded events
   */
  getEvents(): NATSEvent[] {
    return this.events;
  }

  /**
   * Find events by subject pattern
   */
  findEventsBySubject(subjectPattern: string): NATSEvent[] {
    const regex = new RegExp(subjectPattern);
    return this.events.filter((event) => regex.test(event.subject));
  }

  /**
   * Find events by correlation ID
   */
  findEventsByCorrelationId(correlationId: string): NATSEvent[] {
    return this.events.filter((event) => event.correlationId === correlationId);
  }

  /**
   * Wait for specific event
   */
  async waitForEvent(
    subjectPattern: string,
    timeoutMs: number = DEFAULT_EVENT_TIMEOUT_MS
  ): Promise<NATSEvent> {
    const startTime = Date.now();
    const regex = new RegExp(subjectPattern);

    while (Date.now() - startTime < timeoutMs) {
      const event = this.events.find((e) => regex.test(e.subject));
      if (event) {
        return event;
      }
      await new Promise((resolve) => setTimeout(resolve, this.pollIntervalMs));
    }

    throw new Error(
      `Event matching ${subjectPattern} not found within ${timeoutMs}ms`
    );
  }

  /**
   * Verify event sequence
   */
  verifyEventSequence(expectedSubjects: string[]): boolean {
    if (this.events.length < expectedSubjects.length) {
      return false;
    }

    for (let i = 0; i < expectedSubjects.length; i++) {
      if (!this.events[i].subject.includes(expectedSubjects[i])) {
        return false;
      }
    }

    return true;
  }

  /**
   * Get event statistics
   */
  getStatistics(): {
    totalEvents: number;
    eventsBySubject: Record<string, number>;
    eventsWithCorrelation: number;
  } {
    const eventsBySubject: Record<string, number> = {};
    let eventsWithCorrelation = 0;

    this.events.forEach((event) => {
      eventsBySubject[event.subject] = (eventsBySubject[event.subject] || 0) + 1;
      if (event.correlationId) {
        eventsWithCorrelation++;
      }
    });

    return {
      totalEvents: this.events.length,
      eventsBySubject,
      eventsWithCorrelation,
    };
  }

  /**
   * Clear all events
   */
  clear(): void {
    this.events = [];
  }
}

/**
 * Common NATS subjects used in the order flow
 */
export const NATS_SUBJECTS = {
  ORDER_CREATED: 'order.created.v1',
  ORDER_CONFIRMED: 'order.confirmed.v1',
  ORDER_FAILED: 'order.failed.v1',
  ORDER_CANCELLED: 'order.cancelled.v1',
  PAYMENT_INITIATED: 'payment.initiated.v1',
  PAYMENT_SUCCEEDED: 'payment.succeeded.v1',
  PAYMENT_FAILED: 'payment.failed.v1',
  INVENTORY_RESERVED: 'inventory.reserved.v1',
  INVENTORY_RELEASED: 'inventory.released.v1',
  SAGA_STARTED: 'saga.started.v1',
  SAGA_COMPLETED: 'saga.completed.v1',
  SAGA_COMPENSATING: 'saga.compensating.v1',
  SAGA_FAILED: 'saga.failed.v1',
};
