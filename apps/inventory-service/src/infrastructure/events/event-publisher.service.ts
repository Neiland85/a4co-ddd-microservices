import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { DomainEvent } from '@a4co/shared-utils';

@Injectable()
export class EventPublisherService implements OnModuleInit {
  private readonly logger = new Logger(EventPublisherService.name);

  constructor(@Inject('NATS_CLIENT') private readonly natsClient: ClientNats) {}

  async onModuleInit() {
    try {
      await this.natsClient.connect();
      this.logger.log('NATS client connected for event publishing');
    } catch (error) {
      this.logger.error('Failed to connect to NATS', error);
    }
  }

  async publish(event: DomainEvent): Promise<void> {
    try {
      const eventType = this.getEventType(event);
      const subject = this.getSubject(eventType);

      const eventPayload = {
        eventId: event.eventId,
        eventType: event.eventType,
        aggregateId: event.aggregateId,
        eventVersion: event.eventVersion,
        occurredOn: event.occurredOn,
        eventData: event.eventData,
        sagaId: event.sagaId,
      };

      this.logger.debug(`Publishing event: ${eventType} to subject: ${subject}`, {
        eventId: event.eventId,
        aggregateId: event.aggregateId,
        sagaId: event.sagaId,
      });

      await this.natsClient.emit(subject, eventPayload).toPromise();

      this.logger.log(`Event published successfully: ${eventType}`, {
        eventId: event.eventId,
        subject,
      });
    } catch (error) {
      this.logger.error(`Failed to publish event: ${event.eventType}`, error);
      throw error;
    }
  }

  async publishBatch(events: DomainEvent[]): Promise<void> {
    const promises = events.map(event => this.publish(event));
    await Promise.allSettled(promises);
  }

  private getEventType(event: DomainEvent): string {
    return event.eventType;
  }

  private getSubject(eventType: string): string {
    // Map domain events to NATS subjects
    const eventSubjectMap: Record<string, string> = {
      InventoryReservedEvent: 'inventory.reserved',
      InventoryOutOfStockEvent: 'inventory.out_of_stock',
      InventoryReleasedEvent: 'inventory.released',
      StockDeductedEvent: 'inventory.deducted',
      StockReplenishedEvent: 'inventory.replenished',
      LowStockEvent: 'inventory.low_stock',
    };

    return eventSubjectMap[eventType] || `inventory.${eventType.toLowerCase()}`;
  }
}
