"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInformationProvidedEvent = exports.UserInformationRequestedIntegrationEvent = exports.StockValidationResponseEvent = exports.StockValidationRequestedIntegrationEvent = exports.ProductInformationProvidedEvent = exports.ProductInformationRequestedIntegrationEvent = void 0;
const domain_event_1 = require("../domain/domain-event");
class ProductInformationRequestedIntegrationEvent extends domain_event_1.DomainEvent {
    constructor(requestId, data) {
        super(requestId, data);
    }
}
exports.ProductInformationRequestedIntegrationEvent = ProductInformationRequestedIntegrationEvent;
class ProductInformationProvidedEvent extends domain_event_1.DomainEvent {
    constructor(responseId, data) {
        super(responseId, data);
    }
}
exports.ProductInformationProvidedEvent = ProductInformationProvidedEvent;
class StockValidationRequestedIntegrationEvent extends domain_event_1.DomainEvent {
    constructor(requestId, data) {
        super(requestId, data);
    }
}
exports.StockValidationRequestedIntegrationEvent = StockValidationRequestedIntegrationEvent;
class StockValidationResponseEvent extends domain_event_1.DomainEvent {
    constructor(responseId, data) {
        super(responseId, data);
    }
}
exports.StockValidationResponseEvent = StockValidationResponseEvent;
class UserInformationRequestedIntegrationEvent extends domain_event_1.DomainEvent {
    constructor(requestId, data) {
        super(requestId, data);
    }
}
exports.UserInformationRequestedIntegrationEvent = UserInformationRequestedIntegrationEvent;
class UserInformationProvidedEvent extends domain_event_1.DomainEvent {
    constructor(responseId, data) {
        super(responseId, data);
    }
}
exports.UserInformationProvidedEvent = UserInformationProvidedEvent;
//# sourceMappingURL=integration-events.js.map