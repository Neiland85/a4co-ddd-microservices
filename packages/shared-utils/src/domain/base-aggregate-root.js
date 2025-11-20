"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseAggregateRoot = void 0;
const base_entity_1 = require("./base-entity");
class BaseAggregateRoot extends base_entity_1.BaseEntity {
    constructor() {
        super(...arguments);
        this._domainEvents = [];
        this._version = 0;
    }
    get domainEvents() {
        return [...this._domainEvents];
    }
    get version() {
        return this._version;
    }
    addDomainEvent(event) {
        this._domainEvents.push(event);
    }
    clearDomainEvents() {
        this._domainEvents = [];
    }
    incrementVersion() {
        this._version++;
    }
    markEventsForDispatch() {
    }
}
exports.BaseAggregateRoot = BaseAggregateRoot;
//# sourceMappingURL=base-aggregate-root.js.map