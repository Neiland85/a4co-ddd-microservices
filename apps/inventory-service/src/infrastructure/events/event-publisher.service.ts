import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';
import { DomainEvent } from '@a4co/shared-utils';
import {
  InventoryReservedEvent,
  InventoryOutOfStockEvent,
  InventoryReleasedEvent,
  StockDeductedEvent,
  StockReplenishedEvent,
  LowStockEvent,
} from '../../domain/events';

@Injectable()
export class EventPublisherService {
  private readonly logger = new Logger(EventPublisherService.name);

  constructor(@Inject('NATS_CLIENT') private readonly natsClient: ClientNats) {}

  async publishEvents(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publishEvent(event);
    }
  }

  async publishEvent(event: DomainEvent): Promise<void> {
    try {
      const subject = this.getSubjectForEvent(event);
      const payload = {
        eventId: event.eventId,
        eventType: event.eventType,
        aggregateId: event.aggregateId,
        eventVersion: event.eventVersion,
        occurredOn: event.occurredOn,
        eventData: event.eventData,
        sagaId: event.sagaId,
      };

      this.logger.log(`Publishing event: ${event.eventType} to ${subject}`);
      this.natsClient.emit(subject, payload);
    } catch (error) {
      this.logger.error(`Failed to publish event ${event.eventType}:`, error);
      throw error;
    }
  }

  private getSubjectForEvent(event: DomainEvent): string {
    // Mapear eventos de dominio a subjects NATS
    if (event instanceof InventoryReservedEvent) {
      return 'inventory.reserved';
    }
    if (event instanceof InventoryOutOfStockEvent) {
      return 'inventory.out_of_stock';
    }
    if (event instanceof InventoryReleasedEvent) {
      return 'inventory.released';
    }
    if (event instanceof StockDeductedEvent) {
      return 'inventory.stock_deducted';
    }
    if (event instanceof StockReplenishedEvent) {
      return 'inventory.stock_replenished';
    }
    if (event instanceof LowStockEvent) {
      return 'inventory.low_stock';
    }

    // Fallback: usar el nombre del evento en minúsculas con puntos
    return `inventory.${event.eventType.toLowerCase().replace(/event$/, '')}`;
  }
}
