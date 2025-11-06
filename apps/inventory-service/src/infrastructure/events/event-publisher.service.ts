import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { DomainEvent } from '@a4co/shared-utils';

@Injectable()
export class EventPublisherService implements OnModuleInit {
  private readonly logger = new Logger(EventPublisherService.name);
  private natsClient: ClientProxy;

  constructor() {
    this.natsClient = ClientProxyFactory.create({
      transport: Transport.NATS,
      options: {
        servers: process.env.NATS_URL || 'nats://localhost:4222',
        name: 'inventory-service',
      },
    });
  }

  async onModuleInit() {
    try {
      await this.natsClient.connect();
      this.logger.log('Connected to NATS');
    } catch (error) {
      this.logger.error('Failed to connect to NATS', error);
    }
  }

  async publishEvent(event: DomainEvent): Promise<void> {
    try {
      const eventType = this.getEventType(event.eventType);
      const payload = {
        eventId: event.eventId,
        eventType: event.eventType,
        aggregateId: event.aggregateId,
        eventVersion: event.eventVersion,
        occurredOn: event.occurredOn,
        eventData: event.eventData,
        sagaId: event.sagaId,
      };

      this.logger.log(`Publishing event: ${eventType}`, {
        aggregateId: event.aggregateId,
        sagaId: event.sagaId,
      });

      await this.natsClient.emit(eventType, payload).toPromise();

      this.logger.log(`Successfully published event: ${eventType}`, {
        aggregateId: event.aggregateId,
      });
    } catch (error) {
      this.logger.error(`Failed to publish event: ${event.eventType}`, error);
      throw error;
    }
  }

  async publishEvents(events: DomainEvent[]): Promise<void> {
    const publishPromises = events.map(event => this.publishEvent(event));
    await Promise.all(publishPromises);
  }

  private getEventType(eventType: string): string {
    // Map domain event types to NATS event patterns
    const eventTypeMap: Record<string, string> = {
      InventoryReservedEvent: 'inventory.reserved',
      InventoryOutOfStockEvent: 'inventory.out_of_stock',
      InventoryReleasedEvent: 'inventory.released',
      StockDeductedEvent: 'inventory.stock_deducted',
      StockReplenishedEvent: 'inventory.stock_replenished',
      LowStockEvent: 'inventory.low_stock',
    };

    return eventTypeMap[eventType] || eventType.toLowerCase().replace(/event$/, '');
  }

  async onModuleDestroy() {
    await this.natsClient.close();
  }
}
