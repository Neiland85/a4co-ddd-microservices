"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductDeactivatedEvent = exports.ProductVariantAddedEvent = exports.ProductUpdatedEvent = exports.ProductCreatedEvent = void 0;
const shared_utils_1 = require("@a4co/shared-utils");
class ProductCreatedEvent extends shared_utils_1.DomainEvent {
    constructor(aggregateId, data) {
        super(aggregateId, data);
    }
}
exports.ProductCreatedEvent = ProductCreatedEvent;
class ProductUpdatedEvent extends shared_utils_1.DomainEvent {
    constructor(aggregateId, data) {
        super(aggregateId, data);
    }
}
exports.ProductUpdatedEvent = ProductUpdatedEvent;
class ProductVariantAddedEvent extends shared_utils_1.DomainEvent {
    constructor(aggregateId, data) {
        super(aggregateId, data);
    }
}
exports.ProductVariantAddedEvent = ProductVariantAddedEvent;
class ProductDeactivatedEvent extends shared_utils_1.DomainEvent {
    constructor(aggregateId, data) {
        super(aggregateId, data);
    }
}
exports.ProductDeactivatedEvent = ProductDeactivatedEvent;
//# sourceMappingURL=product-events.js.map