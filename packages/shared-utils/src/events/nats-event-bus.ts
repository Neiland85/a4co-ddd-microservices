import { EventEmitter } from 'events';
import { connect, ConnectionOptions, NatsConnection, StringCodec, Subscription } from 'nats';

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
  private connected = false;

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
      const options: ConnectionOptions = {
        servers: this.config.servers,
        name: this.config.name || `a4co-event-bus-${Date.now()}`,
        ...(this.config.timeout !== undefined && { timeout: this.config.timeout }),
        ...(this.config.reconnect !== undefined && { reconnect: this.config.reconnect }),
        ...(this.config.maxReconnectAttempts !== undefined && { maxReconnectAttempts: this.config.maxReconnectAttempts }),
        ...(this.config.reconnectTimeWait !== undefined && { reconnectTimeWait: this.config.reconnectTimeWait }),
      };

      this.connection = await connect(options);
      this.connected = true;
      this.setupConnectionListeners();

      console.log(
        `✅ Conectado a NATS en ${Array.isArray(this.config.servers) ? this.config.servers.join(', ') : this.config.servers
        }`
      );
    } catch (error) {
      this.emit('error', error);
      throw new Error(
        `❌ Error conectando a NATS: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.drain();
        await this.connection.close();
        this.connection = null;
        this.connected = false;
        console.log('🔌 Desconectado de NATS');
      } catch (error) {
        this.emit('error', error);
        console.error('❌ Error desconectando de NATS:', error);
      }
    }
  }

  private setupConnectionListeners(): void {
    if (!this.connection) return;

    (async () => {
      for await (const status of this.connection!.status()) {
        switch (status.type) {
          case 'disconnect':
            this.connected = false;
            console.log('🔌 Desconectado de NATS');
            break;
          case 'reconnect':
            this.connected = true;
            console.log('🔄 Reconectado a NATS');
            break;
        }
      }
    })();
  }

  async publish<T = any>(subject: string, event: EventMessage): Promise<void> {
    if (!this.connection || !this.connected) {
      throw new Error('❌ No hay conexión activa con NATS');
    }

    try {
      const message = JSON.stringify({
        ...event,
        timestamp: event.timestamp.toISOString(),
      });

      const encoded = this.codec.encode(message);
      this.connection.publish(subject, encoded);
      console.log(`📤 Evento publicado en ${subject}: ${event.eventType}`);
    } catch (error) {
      console.error(`❌ Error publicando evento en ${subject}:`, error);
      throw error;
    }
  }

  async subscribe(subject: string, handler: INatsEventHandler, queueGroup?: string): Promise<void> {
    if (!this.connection || !this.connected) {
      throw new Error('❌ No hay conexión activa con NATS');
    }

    const sub = queueGroup
      ? this.connection.subscribe(subject, { queue: queueGroup })
      : this.connection.subscribe(subject);

    this.subscriptions.set(`${subject}-${queueGroup || 'default'}`, sub);
    console.log(`📥 Suscrito a ${subject}${queueGroup ? ` (queue: ${queueGroup})` : ''}`);

    (async () => {
      for await (const msg of sub) {
        try {
          const decoded = this.codec.decode(msg.data);
          const event: EventMessage = JSON.parse(decoded);
          if (typeof event.timestamp === 'string') event.timestamp = new Date(event.timestamp);
          await handler(event);
        } catch (error) {
          console.error(`❌ Error procesando mensaje de ${subject}:`, error);
        }
      }
    })();
  }

  async unsubscribe(subject: string, queueGroup?: string): Promise<void> {
    const key = `${subject}-${queueGroup || 'default'}`;
    const sub = this.subscriptions.get(key);
    if (sub) {
      sub.unsubscribe();
      this.subscriptions.delete(key);
      console.log(`📤 Desuscrito de ${subject}${queueGroup ? ` (queue: ${queueGroup})` : ''}`);
    }
  }

  async unsubscribeAll(): Promise<void> {
    for (const [key, sub] of this.subscriptions) {
      sub.unsubscribe();
    }
    this.subscriptions.clear();
    console.log('📤 Desuscrito de todos los eventos');
  }

  getConnectionStatus(): boolean {
    return this.connected;
  }

  getActiveSubscriptions(): string[] {
    return Array.from(this.subscriptions.keys());
  }

  private generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}
