"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInformationProvidedEvent = exports.UserInformationRequestedEvent = exports.StockValidationResponseEvent = exports.StockValidationRequestedEvent = exports.ProductInformationProvidedEvent = exports.ProductInformationRequestedEvent = void 0;
const domain_event_1 = require("../domain/domain-event");
class ProductInformationRequestedEvent extends domain_event_1.DomainEvent {
    constructor(requestId, data) {
        super(requestId, data);
    }
}
exports.ProductInformationRequestedEvent = ProductInformationRequestedEvent;
class ProductInformationProvidedEvent extends domain_event_1.DomainEvent {
    constructor(responseId, data) {
        super(responseId, data);
    }
}
exports.ProductInformationProvidedEvent = ProductInformationProvidedEvent;
class StockValidationRequestedEvent extends domain_event_1.DomainEvent {
    constructor(requestId, data) {
        super(requestId, data);
    }
}
exports.StockValidationRequestedEvent = StockValidationRequestedEvent;
class StockValidationResponseEvent extends domain_event_1.DomainEvent {
    constructor(responseId, data) {
        super(responseId, data);
    }
}
exports.StockValidationResponseEvent = StockValidationResponseEvent;
class UserInformationRequestedEvent extends domain_event_1.DomainEvent {
    constructor(requestId, data) {
        super(requestId, data);
    }
}
exports.UserInformationRequestedEvent = UserInformationRequestedEvent;
class UserInformationProvidedEvent extends domain_event_1.DomainEvent {
    constructor(responseId, data) {
        super(responseId, data);
    }
}
exports.UserInformationProvidedEvent = UserInformationProvidedEvent;
//# sourceMappingURL=integration-events.js.map