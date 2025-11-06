import { Injectable, Logger } from '@nestjs/common';
import { EventPublisherService } from '../infrastructure/events/event-publisher.service';
import { ProductRepository } from '../infrastructure/repositories/product.repository';
import { DomainEvent } from '@a4co/shared-utils';

@Injectable()
export class AggregateEventPublisher {
  private readonly logger = new Logger(AggregateEventPublisher.name);

  constructor(private readonly eventPublisher: EventPublisherService) {}

  async publishAggregateEvents(product: any): Promise<void> {
    const events = product.getUncommittedEvents();
    if (events.length === 0) {
      return;
    }

    this.logger.log(`Publishing ${events.length} events for aggregate ${product.id}`);

    try {
      await this.eventPublisher.publishEvents(events);
      product.clearEvents();
      this.logger.log(`Successfully published ${events.length} events`);
    } catch (error) {
      this.logger.error('Failed to publish aggregate events', error);
      throw error;
    }
  }
}
