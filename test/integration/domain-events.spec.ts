import { DomainEvents } from '@a4co/observability';
import { OrderCreatedEvent } from '../domain/events/order-created.event';
import { OrderCreatedHandler } from '../application/handlers/order-created.handler';

describe('Domain Events Integration', () => {
  let eventHandler: OrderCreatedHandler;

  beforeEach(() => {
    eventHandler = new OrderCreatedHandler();
    DomainEvents.register(eventHandler);
  });

  it('should publish and handle domain events', async () => {
    const event = new OrderCreatedEvent({
      orderId: 'order-123',
      userId: 'user-456',
      total: 100,
    });

    // Publish event
    DomainEvents.publish(event);

    // Verify event was handled
    expect(eventHandler.handledEvents).toContain(event);
  });

  it('should handle multiple event types', async () => {
    const events = [
      new OrderCreatedEvent({ orderId: '1', userId: '1', total: 50 }),
      new OrderCreatedEvent({ orderId: '2', userId: '2', total: 75 }),
    ];

    for (const event of events) {
      DomainEvents.publish(event);
    }

    expect(eventHandler.handledEvents).toHaveLength(2);
  });
});
