import amqp from 'amqplib';
import { DomainEvent } from '../../domain/shared/DomainEvent';
import { EventPublisher } from '../../domain/shared/EventPublisher';

export class RabbitMQEventPublisher implements EventPublisher {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private readonly exchangeName = 'product.events';

  constructor(
    private readonly connectionUrl: string,
    private readonly options: {
      reconnectDelay?: number;
      maxRetries?: number;
    } = {}
  ) {}

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(this.connectionUrl);
      this.channel = await this.connection.createChannel();

      // Configurar exchange
      await this.channel.assertExchange(this.exchangeName, 'topic', {
        durable: true
      });

      // Manejar desconexiones
      this.connection.on('error', (err) => {
        console.error('RabbitMQ connection error:', err);
        this.reconnect();
      });

      this.connection.on('close', () => {
        console.log('RabbitMQ connection closed');
        this.reconnect();
      });

      console.log('Connected to RabbitMQ');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  async publish(event: DomainEvent): Promise<void> {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    const routingKey = this.getRoutingKey(event);
    const message = this.serializeEvent(event);

    try {
      const published = this.channel.publish(
        this.exchangeName,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        {
          persistent: true,
          contentType: 'application/json',
          timestamp: Date.now(),
          messageId: event.eventId,
          headers: {
            eventType: event.constructor.name,
            aggregateId: event.aggregateId,
            version: event.version
          }
        }
      );

      if (!published) {
        throw new Error('Failed to publish event to RabbitMQ');
      }

      console.log(`Published event ${event.constructor.name} with routing key ${routingKey}`);
    } catch (error) {
      console.error('Error publishing event:', error);
      throw error;
    }
  }

  async publishBatch(events: DomainEvent[]): Promise<void> {
    // Publicar eventos en batch para mejor performance
    const promises = events.map(event => this.publish(event));
    await Promise.all(promises);
  }

  async disconnect(): Promise<void> {
    if (this.channel) {
      await this.channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
  }

  private async reconnect(): Promise<void> {
    const delay = this.options.reconnectDelay || 5000;
    const maxRetries = this.options.maxRetries || 10;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        console.log(`Attempting to reconnect... (${retries + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        await this.connect();
        return;
      } catch (error) {
        retries++;
        console.error(`Reconnection attempt ${retries} failed:`, error);
      }
    }

    console.error('Max reconnection attempts reached');
  }

  private getRoutingKey(event: DomainEvent): string {
    // Mapear eventos a routing keys
    const eventTypeMap: Record<string, string> = {
      'ProductCreatedEvent': 'product.created',
      'ProductUpdatedEvent': 'product.updated',
      'ProductDeletedEvent': 'product.deleted',
      'ProductPriceUpdatedEvent': 'product.price.updated',
      'ProductActivatedEvent': 'product.activated',
      'ProductDeactivatedEvent': 'product.deactivated',
      'ProductVariantAddedEvent': 'product.variant.added',
      'ProductVariantRemovedEvent': 'product.variant.removed',
      'ProductCategoryChangedEvent': 'product.category.changed'
    };

    return eventTypeMap[event.constructor.name] || 'product.unknown';
  }

  private serializeEvent(event: DomainEvent): any {
    return {
      eventId: event.eventId,
      eventType: event.constructor.name,
      aggregateId: event.aggregateId,
      occurredAt: event.occurredAt,
      version: event.version,
      data: this.extractEventData(event)
    };
  }

  private extractEventData(event: any): any {
    // Extraer solo los datos relevantes del evento
    const { eventId, occurredAt, aggregateId, version, ...data } = event;
    
    // Serializar objetos complejos
    const serialized: any = {};
    
    for (const [key, value] of Object.entries(data)) {
      if (value && typeof value === 'object' && 'toJSON' in value) {
        serialized[key] = value.toJSON();
      } else if (value && typeof value === 'object' && 'getValue' in value) {
        // Para value objects
        serialized[key] = value.getValue();
      } else {
        serialized[key] = value;
      }
    }

    return serialized;
  }
}

// Factory para crear el publisher
export class RabbitMQEventPublisherFactory {
  static create(config: {
    host: string;
    port: number;
    username: string;
    password: string;
    vhost?: string;
  }): RabbitMQEventPublisher {
    const connectionUrl = `amqp://${config.username}:${config.password}@${config.host}:${config.port}/${config.vhost || ''}`;
    return new RabbitMQEventPublisher(connectionUrl);
  }
}