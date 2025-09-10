"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInformationProvidedEvent = exports.UserInformationRequestedEvent = exports.StockValidationResponseEvent = exports.StockValidationRequestedEvent = exports.ProductInformationProvidedEvent = exports.ProductInformationRequestedEvent = void 0;
const domain_event_1 = require("../domain/domain-event");
// ========================================
// INTEGRATION EVENTS - Para comunicación entre bounded contexts
// ========================================
/**
 * Evento de integración: Cuando se crea una orden, se solicita información de productos
 * Este evento NO contiene datos de productos, solo solicita la información
 */
class ProductInformationRequestedEvent extends domain_event_1.DomainEvent {
    constructor(requestId, data) {
        super(requestId, data);
    }
}
exports.ProductInformationRequestedEvent = ProductInformationRequestedEvent;
/**
 * Evento de integración: Respuesta con información de productos solicitada
 * Este evento contiene solo los datos necesarios para la orden
 */
class ProductInformationProvidedEvent extends domain_event_1.DomainEvent {
    constructor(responseId, data) {
        super(responseId, data);
    }
}
exports.ProductInformationProvidedEvent = ProductInformationProvidedEvent;
/**
 * Evento de integración: Solicitud de validación de stock
 */
class StockValidationRequestedEvent extends domain_event_1.DomainEvent {
    constructor(requestId, data) {
        super(requestId, data);
    }
}
exports.StockValidationRequestedEvent = StockValidationRequestedEvent;
/**
 * Evento de integración: Respuesta de validación de stock
 */
class StockValidationResponseEvent extends domain_event_1.DomainEvent {
    constructor(responseId, data) {
        super(responseId, data);
    }
}
exports.StockValidationResponseEvent = StockValidationResponseEvent;
/**
 * Evento de integración: Solicitud de información de usuario
 */
class UserInformationRequestedEvent extends domain_event_1.DomainEvent {
    constructor(requestId, data) {
        super(requestId, data);
    }
}
exports.UserInformationRequestedEvent = UserInformationRequestedEvent;
/**
 * Evento de integración: Respuesta con información de usuario
 */
class UserInformationProvidedEvent extends domain_event_1.DomainEvent {
    constructor(responseId, data) {
        super(responseId, data);
    }
}
exports.UserInformationProvidedEvent = UserInformationProvidedEvent;
//# sourceMappingURL=integration-events.js.map