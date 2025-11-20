"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBus = void 0;
const events_1 = require("events");
class EventBus extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.handlers = new Map();
    }
    async publish(event) {
        const handlers = this.handlers.get(event.eventType) || new Set();
        for (const handler of handlers) {
            try {
                await handler(event);
            }
            catch (err) {
                console.error(`[EventBus] Error handling ${event.eventType}:`, err);
            }
        }
    }
    subscribe(eventType, handler) {
        if (!this.handlers.has(eventType))
            this.handlers.set(eventType, new Set());
        this.handlers.get(eventType).add(handler);
    }
    unsubscribe(eventType, handler) {
        this.handlers.get(eventType)?.delete(handler);
    }
}
exports.EventBus = EventBus;
//# sourceMappingURL=event-bus.js.map