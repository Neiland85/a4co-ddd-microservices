import { connect, NatsConnection, StringCodec, Subscription, ConnectionOptions } from 'nats';
import { EventEmitter } from 'events';

export interface EventMessage {
  eventId: string;
  eventType: string;
  timestamp: Date;
  data: any;
  metadata?: Record<string, any>;
}

export interface INatsEventHandler<T = any> {
  (event: EventMessage): Promise<void> | void;
}

export interface NatsEventBusConfig {
  servers: string | string[];
  name?: string;
  timeout?: number;
  reconnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectTimeWait?: number;
}

export class NatsEventBus extends EventEmitter {
  private connection: NatsConnection | null = null;
  private subscriptions: Map<string, Subscription> = new Map();
  private codec = StringCodec();
  private config: NatsEventBusConfig;
  private isConnected = false;

  constructor(config: NatsEventBusConfig) {
    super();
    this.config = {
      timeout: 10000,
      reconnect: true,
      maxReconnectAttempts: 10,
      reconnectTimeWait: 2000,
      ...config,
    };
  }

  async connect(): Promise<void> {
    try {
      const connectionOptions: ConnectionOptions = {
        servers: this.config.servers,
        name: this.config.name || `a4co-event-bus-${Date.now()}`,
        timeout: this.config.timeout,
        reconnect: this.config.reconnect,
        maxReconnectAttempts: this.config.maxReconnectAttempts,
        reconnectTimeWait: this.config.reconnectTimeWait,
      };

      this.connection = await connect(connectionOptions);
      this.isConnected = true;
      this.setupConnectionListeners();

      this.emit('connected');
      console.log(
        `✅ Conectado a NATS en: ${Array.isArray(this.config.servers) ? this.config.servers.join(', ') : this.config.servers}`
      );
    } catch (error) {
      this.emit('error', error);
      throw new Error(
        `❌ Error conectando a NATS: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.drain();
        this.connection.close();
        this.connection = null;
        this.isConnected = false;
        this.emit('disconnected');
        console.log('🔌 Desconectado de NATS');
      } catch (error) {
        this.emit('error', error);
        console.error('❌ Error desconectando de NATS:', error);
      }
    }
  }

  private setupConnectionListeners(): void {
    if (!this.connection) return;

    this.connection.closed().then(() => {
      this.isConnected = false;
      this.emit('disconnected');
      console.log('🔌 Conexión NATS cerrada');
    });

    // NATS status es un AsyncIterable, no un Observable
    (async () => {
      try {
        for await (const status of this.connection!.status()) {
          this.emit('status', status);

          switch (status.type) {
            case 'disconnect':
              this.isConnected = false;
              this.emit('disconnected');
              console.log('🔌 Desconectado de NATS');
              break;
            case 'reconnect':
              this.isConnected = true;
              this.emit('reconnected');
              console.log('🔄 Reconectado a NATS');
              break;
          }
        }
      } catch (error) {
        console.error('Error en status NATS:', error);
      }
    })();
  }

  async publish<T = any>(subject: string, event: EventMessage): Promise<void> {
    if (!this.connection || !this.isConnected) {
      throw new Error('❌ No hay conexión activa con NATS');
    }

    try {
      const message = JSON.stringify({
        ...event,
        timestamp: event.timestamp.toISOString(),
      });

      const encodedMessage = this.codec.encode(message);
      await this.connection.publish(subject, encodedMessage);

      this.emit('published', { subject, event });
      console.log(`📤 Evento publicado en ${subject}:`, event.eventType);
    } catch (error) {
      this.emit('error', error);
      throw new Error(
        `❌ Error publicando evento en ${subject}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async subscribe(subject: string, handler: INatsEventHandler, queueGroup?: string): Promise<void> {
    if (!this.connection || !this.isConnected) {
      throw new Error('❌ No hay conexión activa con NATS');
    }

    try {
      const subscription = queueGroup
        ? this.connection.subscribe(subject, { queue: queueGroup })
        : this.connection.subscribe(subject);

      const subscriptionKey = `${subject}-${queueGroup || 'default'}`;
      this.setupMessageHandler(subscription, handler, subject);
      this.subscriptions.set(subscriptionKey, subscription);

      this.emit('subscribed', { subject, queueGroup });
      console.log(`📥 Suscrito a ${subject}${queueGroup ? ` (queue: ${queueGroup})` : ''}`);
    } catch (error) {
      this.emit('error', error);
      throw new Error(
        `❌ Error suscribiéndose a ${subject}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  private setupMessageHandler(
    subscription: Subscription,
    handler: INatsEventHandler,
    subject: string
  ): void {
    (async () => {
      for await (const message of subscription) {
        try {
          const decodedMessage = this.codec.decode(message.data);
          const eventMessage: EventMessage = JSON.parse(decodedMessage);

          if (typeof eventMessage.timestamp === 'string') {
            eventMessage.timestamp = new Date(eventMessage.timestamp);
          }

          this.emit('message', { subject, message: eventMessage });
          await handler(eventMessage);
          if ('ack' in message) {
            (message as any).ack();
          }
        } catch (error) {
          this.emit('error', error);
          console.error(`❌ Error procesando mensaje de ${subject}:`, error);
        }
      }
    })();
  }

  async unsubscribe(subject: string, queueGroup?: string): Promise<void> {
    const subscriptionKey = `${subject}-${queueGroup || 'default'}`;
    const subscription = this.subscriptions.get(subscriptionKey);

    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionKey);
      this.emit('unsubscribed', { subject, queueGroup });
      console.log(`📤 Desuscrito de ${subject}${queueGroup ? ` (queue: ${queueGroup})` : ''}`);
    }
  }

  async unsubscribeAll(): Promise<void> {
    for (const [key, subscription] of this.subscriptions) {
      subscription.unsubscribe();
    }
    this.subscriptions.clear();
    this.emit('unsubscribed-all');
    console.log('📤 Desuscrito de todos los eventos');
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getActiveSubscriptions(): string[] {
    return Array.from(this.subscriptions.keys());
  }

  // Métodos de conveniencia para eventos específicos
  async publishOrderCreated(orderId: string, orderData: any): Promise<void> {
    const event: EventMessage = {
      eventId: this.generateEventId(),
      eventType: 'OrderCreated',
      timestamp: new Date(),
      data: { orderId, ...orderData },
    };
    await this.publish('order.created', event);
  }

  async publishStockReserved(orderId: string, stockData: any): Promise<void> {
    const event: EventMessage = {
      eventId: this.generateEventId(),
      eventType: 'StockReserved',
      timestamp: new Date(),
      data: { orderId, ...stockData },
    };
    await this.publish('inventory.stock.reserved', event);
  }

  async subscribeToOrderCreated(handler: INatsEventHandler): Promise<void> {
    await this.subscribe('order.created', handler, 'order-service');
  }

  async subscribeToStockReserved(handler: INatsEventHandler): Promise<void> {
    await this.subscribe('inventory.stock.reserved', handler, 'inventory-service');
  }
}
