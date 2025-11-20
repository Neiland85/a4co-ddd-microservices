"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainEvent = void 0;
const uuid_1 = require("uuid");
class DomainEvent {
    constructor(aggregateId, eventData, eventVersion = 1, sagaId) {
        this.eventId = (0, uuid_1.v4)();
        this.eventType = this.constructor.name;
        this.aggregateId = aggregateId;
        this.eventVersion = eventVersion;
        this.occurredOn = new Date();
        this.eventData = eventData;
        if (sagaId !== undefined) {
            this.sagaId = sagaId;
        }
    }
}
exports.DomainEvent = DomainEvent;
//# sourceMappingURL=domain-event.js.map