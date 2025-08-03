import { 
  connect, 
  NatsConnection, 
  StringCodec, 
  Codec,
  JetStreamManager,
  JetStreamClient,
  ConsumerConfig,
  StreamConfig
} from 'nats';
import { DomainEvent } from './domain-event';
import { Logger } from '@nestjs/common';
import { CircuitBreaker } from '../resilience/circuit-breaker';
import { RetryPolicy } from '../resilience/retry-policy';

export interface IEventBus {
  publish(subject: string, event: DomainEvent): Promise<void>;
  subscribe(subject: string, handler: EventHandler): Promise<void>;
  subscribeQueue(subject: string, queue: string, handler: EventHandler): Promise<void>;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

export type EventHandler = (event: DomainEvent) => Promise<void>;

export interface NatsEventBusConfig {
  servers?: string[];
  maxReconnectAttempts?: number;
  reconnectTimeWait?: number;
  enableJetStream?: boolean;
  streamName?: string;
  logger?: Logger;
}

/**
 * NATS-based Event Bus implementation with JetStream support
 * Provides reliable message delivery, persistence, and replay capabilities
 */
export class NatsEventBus implements IEventBus {
  private nc!: NatsConnection;
  private js!: JetStreamClient;
  private jsm!: JetStreamManager;
  private codec: Codec<string> = StringCodec();
  private readonly logger: Logger;
  private readonly circuitBreaker: CircuitBreaker;
  private readonly retryPolicy: RetryPolicy;
  private readonly config: Required<NatsEventBusConfig>;

  constructor(config?: NatsEventBusConfig) {
    this.config = {
      servers: config?.servers || ['nats://localhost:4222'],
      maxReconnectAttempts: config?.maxReconnectAttempts || 10,
      reconnectTimeWait: config?.reconnectTimeWait || 2000,
      enableJetStream: config?.enableJetStream ?? true,
      streamName: config?.streamName || 'EVENTS',
      logger: config?.logger || new Logger('NatsEventBus')
    };
    
    this.logger = this.config.logger;
    this.circuitBreaker = new CircuitBreaker();
    this.retryPolicy = new RetryPolicy();
  }

  /**
   * Connect to NATS server and initialize JetStream if enabled
   */
  async connect(): Promise<void> {
    try {
      this.nc = await connect({
        servers: this.config.servers,
        maxReconnectAttempts: this.config.maxReconnectAttempts,
        reconnectTimeWait: this.config.reconnectTimeWait,
        reconnect: true,
        verbose: true,
        pedantic: true,
        name: `${process.env.SERVICE_NAME || 'unknown'}-${process.pid}`
      });

      this.logger.log(`Connected to NATS at ${this.config.servers.join(', ')}`);

      // Setup connection event handlers
      this.setupConnectionHandlers();

      // Initialize JetStream if enabled
      if (this.config.enableJetStream) {
        await this.initializeJetStream();
      }
    } catch (error) {
      this.logger.error('Failed to connect to NATS', error);
      throw error;
    }
  }

  /**
   * Initialize JetStream for event persistence
   */
  private async initializeJetStream(): Promise<void> {
    this.jsm = await this.nc.jetstreamManager();
    this.js = this.nc.jetstream();

    // Create or update the stream configuration
    const streamConfig: Partial<StreamConfig> = {
      name: this.config.streamName,
      subjects: ['events.>'],
      retention: 'limits',
      max_msgs_per_subject: 100000,
      max_msg_size: 1024 * 1024, // 1MB
      max_age: 7 * 24 * 60 * 60 * 1000000000, // 7 days in nanoseconds
      storage: 'file',
      replicas: 1,
      duplicate_window: 2 * 60 * 1000000000, // 2 minutes for deduplication
    };

    try {
      await this.jsm.streams.add(streamConfig as StreamConfig);
      this.logger.log(`JetStream stream '${this.config.streamName}' created`);
    } catch (error: any) {
      if (error.message?.includes('already exists')) {
        await this.jsm.streams.update(this.config.streamName, streamConfig as StreamConfig);
        this.logger.log(`JetStream stream '${this.config.streamName}' updated`);
      } else {
        throw error;
      }
    }
  }

  /**
   * Setup connection event handlers for monitoring
   */
  private setupConnectionHandlers(): void {
    (async () => {
      for await (const status of this.nc.status()) {
        this.logger.log(`NATS connection status: ${status.type}`);
        
        if (status.type === 'disconnect' || status.type === 'error') {
          this.logger.error(`NATS connection issue: ${status.type}`, status.data);
        }
      }
    })();
  }

  /**
   * Publish an event to the specified subject
   */
  async publish(subject: string, event: DomainEvent): Promise<void> {
    if (!this.nc || this.nc.isClosed()) {
      throw new Error('NATS connection is not established');
    }

    // Validate event before publishing
    if (!event.validate()) {
      throw new Error(`Invalid event: ${event.eventType}`);
    }

    // Use circuit breaker for resilience
    await this.circuitBreaker.execute(async () => {
      const fullSubject = `events.${subject}`;
      const data = this.codec.encode(event.toJSON());

      if (this.config.enableJetStream) {
        // Publish with JetStream for persistence
        const ack = await this.js.publish(fullSubject, data, {
          msgID: event.eventId, // Deduplication
          expect: { streamName: this.config.streamName }
        });
        
        this.logger.debug(`Event published to JetStream: ${fullSubject} (seq: ${ack.seq})`);
      } else {
        // Regular NATS publish
        this.nc.publish(fullSubject, data);
        this.logger.debug(`Event published: ${fullSubject}`);
      }

      // Emit metrics
      this.emitPublishMetrics(subject, event.eventType);
    });
  }

  /**
   * Subscribe to events on a specific subject
   */
  async subscribe(subject: string, handler: EventHandler): Promise<void> {
    if (!this.nc || this.nc.isClosed()) {
      throw new Error('NATS connection is not established');
    }

    const fullSubject = `events.${subject}`;
    
    if (this.config.enableJetStream) {
      // JetStream durable consumer
      await this.subscribeJetStream(fullSubject, handler);
    } else {
      // Regular NATS subscription
      const sub = this.nc.subscribe(fullSubject);
      this.processSubscription(sub, handler, fullSubject);
    }

    this.logger.log(`Subscribed to: ${fullSubject}`);
  }

  /**
   * Subscribe to events with queue group for load balancing
   */
  async subscribeQueue(
    subject: string, 
    queue: string, 
    handler: EventHandler
  ): Promise<void> {
    if (!this.nc || this.nc.isClosed()) {
      throw new Error('NATS connection is not established');
    }

    const fullSubject = `events.${subject}`;
    
    if (this.config.enableJetStream) {
      // JetStream durable consumer with queue group
      await this.subscribeJetStream(fullSubject, handler, queue);
    } else {
      // Regular NATS queue subscription
      const sub = this.nc.subscribe(fullSubject, { queue });
      this.processSubscription(sub, handler, fullSubject);
    }

    this.logger.log(`Subscribed to queue '${queue}' on: ${fullSubject}`);
  }

  /**
   * Create JetStream subscription with durable consumer
   */
  private async subscribeJetStream(
    subject: string, 
    handler: EventHandler,
    queue?: string
  ): Promise<void> {
    const consumerName = queue || `${process.env.SERVICE_NAME}-${subject.replace(/\./g, '-')}`;
    
    const consumerConfig: Partial<ConsumerConfig> = {
      durable_name: consumerName,
      deliver_subject: `deliver.${consumerName}`,
      ack_policy: 'explicit',
      ack_wait: 30 * 1000000000, // 30 seconds
      max_deliver: 3,
      filter_subject: subject,
      replay_policy: 'instant',
      deliver_policy: 'all'
    };

    try {
      await this.jsm.consumers.add(this.config.streamName, consumerConfig);
    } catch (error: any) {
      if (!error.message?.includes('already exists')) {
        throw error;
      }
    }

    const consumer = await this.js.consumers.get(this.config.streamName, consumerName);
    const messages = await consumer.consume();

    this.processJetStreamMessages(messages, handler, subject);
  }

  /**
   * Process messages from JetStream consumer
   */
  private async processJetStreamMessages(
    messages: any,
    handler: EventHandler,
    subject: string
  ): Promise<void> {
    for await (const msg of messages) {
      const startTime = Date.now();
      
      try {
        const eventData = this.codec.decode(msg.data);
        const event = JSON.parse(eventData);
        
        // Process with retry policy
        await this.retryPolicy.execute(async () => {
          await handler(event);
        });

        // Acknowledge successful processing
        msg.ack();
        
        // Emit success metrics
        this.emitProcessMetrics(subject, 'success', Date.now() - startTime);
        
      } catch (error) {
        this.logger.error(`Error processing message from ${subject}`, error);
        
        // Negative acknowledgment for retry
        msg.nak();
        
        // Emit error metrics
        this.emitProcessMetrics(subject, 'error', Date.now() - startTime);
      }
    }
  }

  /**
   * Process regular NATS subscription
   */
  private async processSubscription(
    sub: any,
    handler: EventHandler,
    subject: string
  ): Promise<void> {
    for await (const msg of sub) {
      const startTime = Date.now();
      
      try {
        const eventData = this.codec.decode(msg.data);
        const event = JSON.parse(eventData);
        
        await this.retryPolicy.execute(async () => {
          await handler(event);
        });
        
        this.emitProcessMetrics(subject, 'success', Date.now() - startTime);
        
      } catch (error) {
        this.logger.error(`Error processing message from ${subject}`, error);
        this.emitProcessMetrics(subject, 'error', Date.now() - startTime);
        
        // Could implement dead letter queue here
        await this.handleFailedMessage(subject, msg.data, error as Error);
      }
    }
  }

  /**
   * Handle failed messages (send to DLQ)
   */
  private async handleFailedMessage(
    subject: string,
    data: Uint8Array,
    error: Error
  ): Promise<void> {
    const dlqSubject = `dlq.${subject}`;
    const dlqData = {
      originalSubject: subject,
      data: this.codec.decode(data),
      error: {
        message: error.message,
        stack: error.stack
      },
      failedAt: new Date().toISOString()
    };

    try {
      this.nc.publish(dlqSubject, this.codec.encode(JSON.stringify(dlqData)));
      this.logger.warn(`Message sent to DLQ: ${dlqSubject}`);
    } catch (dlqError) {
      this.logger.error('Failed to send message to DLQ', dlqError);
    }
  }

  /**
   * Emit publish metrics (to be implemented with actual metrics library)
   */
  private emitPublishMetrics(subject: string, eventType: string): void {
    // Implement with Prometheus/StatsD/etc
    this.logger.debug(`Metrics: Published ${eventType} to ${subject}`);
  }

  /**
   * Emit processing metrics
   */
  private emitProcessMetrics(subject: string, status: string, duration: number): void {
    // Implement with Prometheus/StatsD/etc
    this.logger.debug(`Metrics: Processed ${subject} - ${status} in ${duration}ms`);
  }

  /**
   * Gracefully disconnect from NATS
   */
  async disconnect(): Promise<void> {
    if (this.nc && !this.nc.isClosed()) {
      await this.nc.drain();
      await this.nc.close();
      this.logger.log('Disconnected from NATS');
    }
  }
}