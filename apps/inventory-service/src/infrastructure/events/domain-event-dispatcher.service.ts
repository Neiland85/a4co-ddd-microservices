import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DomainEvent } from '@a4co/shared-utils';
import { EventPublisherService } from '../infrastructure/events/event-publisher.service';
import { Product } from '../../domain/entities/product.entity';

@Injectable()
export class DomainEventDispatcher implements OnModuleInit {
  private readonly logger = new Logger(DomainEventDispatcher.name);

  constructor(private readonly eventPublisher: EventPublisherService) {}

  async onModuleInit() {
    this.logger.log('Domain Event Dispatcher initialized');
  }

  async dispatchEvents(aggregate: { domainEvents: DomainEvent[] }): Promise<void> {
    const events = aggregate.domainEvents;
    if (events.length === 0) {
      return;
    }

    this.logger.debug(`Dispatching ${events.length} domain events`);

    try {
      await this.eventPublisher.publishBatch(events);
      this.logger.log(`Successfully dispatched ${events.length} domain events`);
    } catch (error) {
      this.logger.error('Failed to dispatch domain events', error);
      throw error;
    }
  }

  async dispatchProductEvents(product: Product): Promise<void> {
    await this.dispatchEvents(product);
    // Clear events after successful dispatch
    product.clearDomainEvents();
  }
}
