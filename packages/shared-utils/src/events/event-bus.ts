import { connect, NatsConnection, Codec, StringCodec, Subscription, Msg } from 'nats';
import { DomainEvent } from '../domain/domain-event';

export interface IEventBus {
  connect(servers?: string[]): Promise<void>;
  disconnect(): Promise<void>;
  publish(subject: string, event: DomainEvent): Promise<void>;
  subscribe(subject: string, handler: (event: DomainEvent) => Promise<void>): Promise<Subscription>;
  subscribeQueue(subject: string, queue: string, handler: (event: DomainEvent) => Promise<void>): Promise<Subscription>;
  isConnected(): boolean;
}

export interface EventMetadata {
  eventId: string;
  correlationId: string;
  causationId?: string;
  publishedAt: string;
  version: string;
  retryCount?: number;
  source: string;
}

export interface EnhancedDomainEvent extends DomainEvent {
  metadata: EventMetadata;
}

export class NatsEventBus implements IEventBus {
  private nc?: NatsConnection;
  private codec: Codec<string> = StringCodec();
  private subscriptions: Map<string, Subscription> = new Map();
  private serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  async connect(servers = ['nats://localhost:4222']): Promise<void> {
    try {
      this.nc = await connect({ 
        servers,
        name: this.serviceName,
        reconnect: true,
        maxReconnectAttempts: 10,
        reconnectTimeWait: 1000,
        timeout: 5000
      });

      console.log(`✅ ${this.serviceName} connected to NATS at ${servers.join(', ')}`);

      // Listen for connection events
      (async () => {
        for await (const status of this.nc!.status()) {
          console.log(`🔄 NATS ${status.type}: ${status.data}`);
        }
      })();

    } catch (error) {
      console.error(`❌ Failed to connect to NATS:`, error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.nc) {
      // Close all subscriptions
      this.subscriptions.forEach(sub => sub.unsubscribe());
      this.subscriptions.clear();

      await this.nc.close();
      this.nc = undefined;
      console.log(`🔌 ${this.serviceName} disconnected from NATS`);
    }
  }

  isConnected(): boolean {
    return this.nc !== undefined && !this.nc.isClosed();
  }

  async publish(subject: string, event: DomainEvent): Promise<void> {
    if (!this.nc) {
      throw new Error('NATS connection not established. Call connect() first.');
    }

    const enhancedEvent: EnhancedDomainEvent = {
      ...event,
      metadata: {
        eventId: event.eventId,
        correlationId: this.generateCorrelationId(),
        publishedAt: new Date().toISOString(),
        version: '1.0',
        source: this.serviceName
      }
    };

    const eventData = JSON.stringify(enhancedEvent, null, 0);
    
    try {
      this.nc.publish(subject, this.codec.encode(eventData));
      console.log(`📤 Published event ${event.eventType} to ${subject}`);
    } catch (error) {
      console.error(`❌ Failed to publish event ${event.eventType} to ${subject}:`, error);
      throw error;
    }
  }

  async subscribe(subject: string, handler: (event: DomainEvent) => Promise<void>): Promise<Subscription> {
    if (!this.nc) {
      throw new Error('NATS connection not established. Call connect() first.');
    }

    const sub = this.nc.subscribe(subject);
    this.subscriptions.set(`${subject}`, sub);

    console.log(`📥 Subscribed to ${subject}`);

    // Process messages asynchronously
    this.processMessages(sub, handler, subject);

    return sub;
  }

  async subscribeQueue(
    subject: string, 
    queue: string, 
    handler: (event: DomainEvent) => Promise<void>
  ): Promise<Subscription> {
    if (!this.nc) {
      throw new Error('NATS connection not established. Call connect() first.');
    }

    const sub = this.nc.subscribe(subject, { queue });
    this.subscriptions.set(`${subject}:${queue}`, sub);

    console.log(`📥 Subscribed to ${subject} with queue ${queue}`);

    // Process messages asynchronously
    this.processMessages(sub, handler, subject, queue);

    return sub;
  }

  private async processMessages(
    sub: Subscription, 
    handler: (event: DomainEvent) => Promise<void>,
    subject: string,
    queue?: string
  ): Promise<void> {
    for await (const msg of sub) {
      try {
        const eventData = JSON.parse(this.codec.decode(msg.data)) as EnhancedDomainEvent;
        
        console.log(`📨 Received event ${eventData.eventType} on ${subject}${queue ? ` (queue: ${queue})` : ''}`);
        
        // Add processing timestamp
        const startTime = Date.now();
        
        await handler(eventData);
        
        const duration = Date.now() - startTime;
        console.log(`✅ Processed event ${eventData.eventType} in ${duration}ms`);
        
      } catch (error) {
        console.error(`❌ Error processing event on ${subject}:`, error);
        
        // Implement retry logic or dead letter queue here
        await this.handleEventError(msg, error as Error, subject);
      }
    }
  }

  private async handleEventError(msg: Msg, error: Error, subject: string): Promise<void> {
    try {
      const eventData = JSON.parse(this.codec.decode(msg.data)) as EnhancedDomainEvent;
      const retryCount = (eventData.metadata.retryCount || 0) + 1;
      
      if (retryCount <= 3) { // Max 3 retries
        console.log(`🔄 Retrying event ${eventData.eventType} (attempt ${retryCount})`);
        
        // Update retry count
        eventData.metadata.retryCount = retryCount;
        
        // Republish with delay
        setTimeout(() => {
          if (this.nc) {
            this.nc.publish(subject, this.codec.encode(JSON.stringify(eventData)));
          }
        }, Math.pow(2, retryCount) * 1000); // Exponential backoff
        
      } else {
        // Send to dead letter queue
        console.error(`💀 Sending event ${eventData.eventType} to dead letter queue after ${retryCount} retries`);
        
        if (this.nc) {
          this.nc.publish(`${subject}.dlq`, this.codec.encode(JSON.stringify({
            originalSubject: subject,
            event: eventData,
            error: {
              message: error.message,
              stack: error.stack
            },
            failedAt: new Date().toISOString()
          })));
        }
      }
    } catch (parseError) {
      console.error(`❌ Failed to parse event data for error handling:`, parseError);
    }
  }

  private generateCorrelationId(): string {
    return `${this.serviceName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Decorator for event handlers
export function EventHandler(subject: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    target._eventHandlers = target._eventHandlers || [];
    target._eventHandlers.push({
      subject,
      method: propertyName,
      handler: descriptor.value
    });
  };
}

// Base class for services with event handling
export abstract class EventDrivenService {
  protected eventBus: IEventBus;
  private handlerRegistrations: Subscription[] = [];

  constructor(serviceName: string) {
    this.eventBus = new NatsEventBus(serviceName);
  }

  async startEventHandling(): Promise<void> {
    await this.eventBus.connect();
    await this.registerEventHandlers();
  }

  async stopEventHandling(): Promise<void> {
    this.handlerRegistrations.forEach(sub => sub.unsubscribe());
    this.handlerRegistrations = [];
    await this.eventBus.disconnect();
  }

  private async registerEventHandlers(): Promise<void> {
    const eventHandlers = (this.constructor.prototype as any)._eventHandlers || [];
    
    for (const { subject, handler } of eventHandlers) {
      const subscription = await this.eventBus.subscribe(
        subject, 
        handler.bind(this)
      );
      this.handlerRegistrations.push(subscription);
    }
  }

  protected async publishEvent(subject: string, event: DomainEvent): Promise<void> {
    await this.eventBus.publish(subject, event);
  }
}