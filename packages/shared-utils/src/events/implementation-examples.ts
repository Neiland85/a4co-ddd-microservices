// Ejemplos de implementación concreta para la estrategia de comunicación entre microservicios

import { NatsConnection, connect, JSONCodec, JetStreamManager, JetStreamClient } from 'nats';
import { EventEmitter } from 'events';

// ========== BASE DOMAIN EVENT STRUCTURE ==========

export abstract class DomainEvent {
  public readonly metadata: EventMetadata;

  constructor(
    public readonly aggregateId: string,
    public readonly eventType: string,
    public readonly eventData: any,
    public readonly eventVersion: number = 1
  ) {
    this.metadata = {
      eventId: this.generateEventId(),
      correlationId: this.generateCorrelationId(),
      timestamp: new Date(),
      version: eventVersion,
    };
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateCorrelationId(): string {
    return `cor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export interface EventMetadata {
  eventId: string;
  correlationId: string;
  causationId?: string;
  timestamp: Date;
  version: number;
  userId?: string;
  traceId?: string;
  spanId?: string;
}

// ========== EVENT BUS IMPLEMENTATION ==========

export interface IEventBus {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  publish(subject: string, event: DomainEvent): Promise<void>;
  subscribe(subject: string, handler: EventHandler): Promise<void>;
  subscribeWithQueue(subject: string, queue: string, handler: EventHandler): Promise<void>;
}

export type EventHandler = (event: DomainEvent) => Promise<void>;

export class NatsEventBus implements IEventBus {
  private nc?: NatsConnection;
  private js?: JetStreamClient;
  private jsm?: JetStreamManager;
  private codec = JSONCodec();
  private readonly servers: string[];

  constructor(servers: string[] = ['nats://localhost:4222']) {
    this.servers = servers;
  }

  async connect(): Promise<void> {
    this.nc = await connect({ 
      servers: this.servers,
      reconnect: true,
      maxReconnectAttempts: -1,
      reconnectTimeWait: 1000,
      timeout: 30000,
    });
    
    this.jsm = await this.nc.jetstreamManager();
    this.js = this.nc.jetstream();
    
    // Initialize streams
    await this.initializeStreams();
  }

  async disconnect(): Promise<void> {
    if (this.nc) {
      await this.nc.drain();
      await this.nc.close();
    }
  }

  async publish(subject: string, event: DomainEvent): Promise<void> {
    if (!this.nc || !this.js) {
      throw new Error('Not connected to NATS');
    }

    const msg = this.codec.encode(JSON.stringify(event));
    
    // Publish with acknowledgment
    const ack = await this.js.publish(subject, msg, {
      msgID: event.metadata.eventId,
      expect: { lastMsgID: event.metadata.causationId },
    });
    
    console.log(`Published event ${event.eventType} to ${subject}, seq: ${ack.seq}`);
  }

  async subscribe(subject: string, handler: EventHandler): Promise<void> {
    if (!this.nc) {
      throw new Error('Not connected to NATS');
    }

    const sub = this.nc.subscribe(subject);
    
    (async () => {
      for await (const msg of sub) {
        try {
          const event = JSON.parse(this.codec.decode(msg.data)) as DomainEvent;
          await handler(event);
        } catch (error) {
          console.error(`Error handling event on ${subject}:`, error);
          // Implement retry logic or send to DLQ
        }
      }
    })();
  }

  async subscribeWithQueue(subject: string, queue: string, handler: EventHandler): Promise<void> {
    if (!this.nc) {
      throw new Error('Not connected to NATS');
    }

    const sub = this.nc.subscribe(subject, { queue });
    
    (async () => {
      for await (const msg of sub) {
        try {
          const event = JSON.parse(this.codec.decode(msg.data)) as DomainEvent;
          await handler(event);
        } catch (error) {
          console.error(`Error handling event on ${subject} (queue: ${queue}):`, error);
        }
      }
    })();
  }

  private async initializeStreams(): Promise<void> {
    if (!this.jsm) return;

    // Define stream configurations
    const streams = [
      {
        name: 'ORDERS',
        subjects: ['order.>'],
        retention: 'limits',
        max_msgs: 1000000,
        max_age: 30 * 24 * 60 * 60 * 1000000000, // 30 days
      },
      {
        name: 'INVENTORY',
        subjects: ['inventory.>'],
        retention: 'limits',
        max_msgs: 500000,
        max_age: 7 * 24 * 60 * 60 * 1000000000, // 7 days
      },
      {
        name: 'PAYMENTS',
        subjects: ['payment.>'],
        retention: 'limits',
        max_msgs: 2000000,
        max_age: 365 * 24 * 60 * 60 * 1000000000, // 1 year
      },
      {
        name: 'USERS',
        subjects: ['user.>'],
        retention: 'limits',
        max_msgs: 1000000,
        max_age: 90 * 24 * 60 * 60 * 1000000000, // 90 days
      },
    ];

    for (const streamConfig of streams) {
      try {
        await this.jsm.streams.add(streamConfig);
        console.log(`Stream ${streamConfig.name} created/updated`);
      } catch (error: any) {
        if (error.code !== '10058') { // Stream name already in use
          throw error;
        }
        console.log(`Stream ${streamConfig.name} already exists`);
      }
    }
  }
}

// ========== CONCRETE EVENT IMPLEMENTATIONS ==========

// Order Events
export class OrderCreatedEvent extends DomainEvent {
  static readonly EVENT_TYPE = 'order.created.v1';
  
  constructor(
    orderId: string,
    public readonly data: {
      customerId: string;
      items: Array<{
        productId: string;
        productName: string;
        quantity: number;
        unitPrice: number;
        artisanId: string;
      }>;
      totalAmount: number;
      deliveryAddress: {
        street: string;
        city: string;
        postalCode: string;
        coordinates?: { lat: number; lng: number };
      };
      paymentMethodId: string;
      estimatedDeliveryDate: Date;
      createdAt: Date;
    }
  ) {
    super(orderId, OrderCreatedEvent.EVENT_TYPE, data);
  }
}

export class OrderStateChangedEvent extends DomainEvent {
  static readonly EVENT_TYPE = 'order.state.changed.v1';
  
  constructor(
    orderId: string,
    public readonly data: {
      previousState: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
      currentState: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
      reason: string;
      changedBy: string;
      changedAt: Date;
    }
  ) {
    super(orderId, OrderStateChangedEvent.EVENT_TYPE, data);
  }
}

// Inventory Events
export class StockReservedEvent extends DomainEvent {
  static readonly EVENT_TYPE = 'inventory.stock.reserved.v1';
  
  constructor(
    reservationId: string,
    public readonly data: {
      orderId: string;
      productId: string;
      quantity: number;
      remainingStock: number;
      reservationExpiresAt: Date;
      reservedAt: Date;
    }
  ) {
    super(reservationId, StockReservedEvent.EVENT_TYPE, data);
  }
}

export class LowStockWarningEvent extends DomainEvent {
  static readonly EVENT_TYPE = 'inventory.stock.low.v1';
  
  constructor(
    productId: string,
    public readonly data: {
      currentStock: number;
      threshold: number;
      thresholdType: 'critical' | 'low' | 'reorder';
      artisanId: string;
      productName: string;
      averageDailySales: number;
      estimatedStockoutDate: Date;
    }
  ) {
    super(productId, LowStockWarningEvent.EVENT_TYPE, data);
  }
}

// Payment Events
export class PaymentSucceededEvent extends DomainEvent {
  static readonly EVENT_TYPE = 'payment.succeeded.v1';
  
  constructor(
    paymentId: string,
    public readonly data: {
      orderId: string;
      amount: number;
      currency: string;
      paymentMethod: 'card' | 'bizum' | 'paypal' | 'transfer';
      transactionId: string;
      processedAt: Date;
      processingFee: number;
      netAmount: number;
    }
  ) {
    super(paymentId, PaymentSucceededEvent.EVENT_TYPE, data);
  }
}

export class PaymentFailedEvent extends DomainEvent {
  static readonly EVENT_TYPE = 'payment.failed.v1';
  
  constructor(
    paymentId: string,
    public readonly data: {
      orderId: string;
      amount: number;
      errorCode: string;
      errorMessage: string;
      retryable: boolean;
      failedAt: Date;
    }
  ) {
    super(paymentId, PaymentFailedEvent.EVENT_TYPE, data);
  }
}

// ========== SAGA IMPLEMENTATION EXAMPLE ==========

export class OrderFulfillmentSaga {
  private eventBus: IEventBus;
  private steps: Map<string, boolean> = new Map();
  
  constructor(eventBus: IEventBus) {
    this.eventBus = eventBus;
    this.initializeHandlers();
  }

  private initializeHandlers(): void {
    // Subscribe to relevant events
    this.eventBus.subscribe('order.created.v1', this.handleOrderCreated.bind(this));
    this.eventBus.subscribe('inventory.stock.reserved.v1', this.handleStockReserved.bind(this));
    this.eventBus.subscribe('payment.succeeded.v1', this.handlePaymentSucceeded.bind(this));
    this.eventBus.subscribe('payment.failed.v1', this.handlePaymentFailed.bind(this));
  }

  private async handleOrderCreated(event: OrderCreatedEvent): Promise<void> {
    console.log(`Starting saga for order ${event.aggregateId}`);
    
    // Step 1: Reserve stock for all items
    for (const item of event.data.items) {
      await this.eventBus.publish('inventory.reserve.stock', {
        orderId: event.aggregateId,
        productId: item.productId,
        quantity: item.quantity,
        customerId: event.data.customerId,
      } as any);
    }
    
    this.steps.set(`${event.aggregateId}:stock-reservation`, true);
  }

  private async handleStockReserved(event: StockReservedEvent): Promise<void> {
    console.log(`Stock reserved for order ${event.data.orderId}`);
    
    // Check if all items are reserved (simplified)
    if (this.steps.get(`${event.data.orderId}:stock-reservation`)) {
      // Proceed to payment
      await this.eventBus.publish('payment.initiate', {
        orderId: event.data.orderId,
        // ... payment details
      } as any);
      
      this.steps.set(`${event.data.orderId}:payment-initiated`, true);
    }
  }

  private async handlePaymentSucceeded(event: PaymentSucceededEvent): Promise<void> {
    console.log(`Payment succeeded for order ${event.data.orderId}`);
    
    // Confirm the order
    await this.eventBus.publish('order.state.changed', new OrderStateChangedEvent(
      event.data.orderId,
      {
        previousState: 'pending',
        currentState: 'confirmed',
        reason: 'Payment successful',
        changedBy: 'system',
        changedAt: new Date(),
      }
    ));
    
    // Notify relevant parties
    await this.eventBus.publish('notification.send', {
      type: 'order-confirmed',
      orderId: event.data.orderId,
      // ... notification details
    } as any);
    
    // Cleanup saga state
    this.cleanupSagaState(event.data.orderId);
  }

  private async handlePaymentFailed(event: PaymentFailedEvent): Promise<void> {
    console.log(`Payment failed for order ${event.data.orderId}`);
    
    // Compensate: Release stock
    await this.eventBus.publish('inventory.release.stock', {
      orderId: event.data.orderId,
      reason: 'payment-failed',
    } as any);
    
    // Cancel the order
    await this.eventBus.publish('order.state.changed', new OrderStateChangedEvent(
      event.data.orderId,
      {
        previousState: 'pending',
        currentState: 'cancelled',
        reason: `Payment failed: ${event.data.errorMessage}`,
        changedBy: 'system',
        changedAt: new Date(),
      }
    ));
    
    // Cleanup saga state
    this.cleanupSagaState(event.data.orderId);
  }

  private cleanupSagaState(orderId: string): void {
    // Remove all saga state for this order
    const keysToDelete = Array.from(this.steps.keys()).filter(key => key.startsWith(orderId));
    keysToDelete.forEach(key => this.steps.delete(key));
  }
}

// ========== SERVICE HANDLER EXAMPLE ==========

export class OrderServiceEventHandlers {
  private eventBus: IEventBus;
  
  constructor(eventBus: IEventBus) {
    this.eventBus = eventBus;
  }

  async initialize(): Promise<void> {
    // Subscribe to events this service cares about
    await this.eventBus.subscribeWithQueue(
      'inventory.stock.reserved.v1',
      'order-service',
      this.handleStockReserved.bind(this)
    );
    
    await this.eventBus.subscribeWithQueue(
      'payment.succeeded.v1',
      'order-service',
      this.handlePaymentSucceeded.bind(this)
    );
    
    await this.eventBus.subscribeWithQueue(
      'payment.failed.v1',
      'order-service',
      this.handlePaymentFailed.bind(this)
    );
  }

  private async handleStockReserved(event: StockReservedEvent): Promise<void> {
    // Update order aggregate with stock reservation info
    console.log(`Order ${event.data.orderId}: Stock reserved for product ${event.data.productId}`);
    
    // Update database
    // await this.orderRepository.updateOrderItemStatus(
    //   event.data.orderId,
    //   event.data.productId,
    //   'stock-reserved'
    // );
  }

  private async handlePaymentSucceeded(event: PaymentSucceededEvent): Promise<void> {
    // Update order status to confirmed
    console.log(`Order ${event.data.orderId}: Payment succeeded`);
    
    // Emit order confirmed event
    await this.eventBus.publish(
      'order.state.changed.v1',
      new OrderStateChangedEvent(event.data.orderId, {
        previousState: 'pending',
        currentState: 'confirmed',
        reason: 'Payment completed successfully',
        changedBy: 'payment-service',
        changedAt: new Date(),
      })
    );
  }

  private async handlePaymentFailed(event: PaymentFailedEvent): Promise<void> {
    // Handle payment failure
    console.log(`Order ${event.data.orderId}: Payment failed - ${event.data.errorMessage}`);
    
    if (event.data.retryable) {
      // Schedule retry
      console.log(`Scheduling payment retry for order ${event.data.orderId}`);
    } else {
      // Cancel order
      await this.eventBus.publish(
        'order.state.changed.v1',
        new OrderStateChangedEvent(event.data.orderId, {
          previousState: 'pending',
          currentState: 'cancelled',
          reason: `Payment failed: ${event.data.errorMessage}`,
          changedBy: 'payment-service',
          changedAt: new Date(),
        })
      );
    }
  }
}

// ========== USAGE EXAMPLE ==========

async function startApplication() {
  // Initialize event bus
  const eventBus = new NatsEventBus(['nats://localhost:4222']);
  await eventBus.connect();
  
  // Initialize saga
  const orderSaga = new OrderFulfillmentSaga(eventBus);
  
  // Initialize service handlers
  const orderHandlers = new OrderServiceEventHandlers(eventBus);
  await orderHandlers.initialize();
  
  // Example: Create an order
  const orderCreatedEvent = new OrderCreatedEvent('order_123', {
    customerId: 'customer_456',
    items: [
      {
        productId: 'product_789',
        productName: 'Aceite de Oliva Premium',
        quantity: 2,
        unitPrice: 25.99,
        artisanId: 'artisan_101',
      },
    ],
    totalAmount: 51.98,
    deliveryAddress: {
      street: 'Calle Mayor 123',
      city: 'Jaén',
      postalCode: '23001',
      coordinates: { lat: 37.7795941, lng: -3.7849057 },
    },
    paymentMethodId: 'payment_method_999',
    estimatedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
    createdAt: new Date(),
  });
  
  await eventBus.publish('order.created.v1', orderCreatedEvent);
  
  console.log('Application started successfully');
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  // Close connections, complete ongoing operations, etc.
  process.exit(0);
});