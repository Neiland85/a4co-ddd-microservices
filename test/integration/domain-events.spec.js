"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const observability_1 = require("@a4co/observability");
const order_created_event_1 = require("../domain/events/order-created.event");
const order_created_handler_1 = require("../application/handlers/order-created.handler");
describe('Domain Events Integration', () => {
    let eventHandler;
    beforeEach(() => {
        eventHandler = new order_created_handler_1.OrderCreatedHandler();
        observability_1.DomainEvents.register(eventHandler);
    });
    it('should publish and handle domain events', async () => {
        const event = new order_created_event_1.OrderCreatedEvent({
            orderId: 'order-123',
            userId: 'user-456',
            total: 100,
        });
        observability_1.DomainEvents.publish(event);
        expect(eventHandler.handledEvents).toContain(event);
    });
    it('should handle multiple event types', async () => {
        const events = [
            new order_created_event_1.OrderCreatedEvent({ orderId: '1', userId: '1', total: 50 }),
            new order_created_event_1.OrderCreatedEvent({ orderId: '2', userId: '2', total: 75 }),
        ];
        for (const event of events) {
            observability_1.DomainEvents.publish(event);
        }
        expect(eventHandler.handledEvents).toHaveLength(2);
    });
});
//# sourceMappingURL=domain-events.spec.js.map