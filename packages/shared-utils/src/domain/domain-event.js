"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainEvent = void 0;
const uuid_1 = require("uuid");
class DomainEvent {
    eventId;
    eventType;
    aggregateId;
    eventVersion;
    occurredOn;
    eventData;
    constructor(aggregateId, eventData, eventVersion = 1) {
        this.eventId = (0, uuid_1.v4)();
        this.eventType = this.constructor.name;
        this.aggregateId = aggregateId;
        this.eventVersion = eventVersion;
        this.occurredOn = new Date();
        this.eventData = eventData;
    }
}
exports.DomainEvent = DomainEvent;
//# sourceMappingURL=domain-event.js.map