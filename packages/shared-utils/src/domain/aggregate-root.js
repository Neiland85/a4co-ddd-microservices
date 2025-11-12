"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AggregateRoot = void 0;
const base_entity_1 = require("./base-entity");
class AggregateRoot extends base_entity_1.BaseEntity {
    constructor(id) {
        super(id);
        this._domainEvents = [];
    }
    get domainEvents() {
        return this._domainEvents.slice();
    }
    addDomainEvent(event) {
        this._domainEvents.push(event);
    }
    getUncommittedEvents() {
        return this._domainEvents.slice();
    }
    clearEvents() {
        this._domainEvents = [];
    }
    clearDomainEvents() {
        this._domainEvents = [];
    }
    markEventsForDispatch() {
    }
}
exports.AggregateRoot = AggregateRoot;
//# sourceMappingURL=aggregate-root.js.map