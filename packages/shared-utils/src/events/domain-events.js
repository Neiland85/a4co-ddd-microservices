"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainEventValidator = exports.DomainEventFactory = exports.UserInformationRequestedEvent = exports.StockValidationRequestedEvent = exports.ProductInformationRequestedEvent = exports.SagaFailedEvent = exports.SagaCompletedEvent = exports.ErrorOccurredEvent = exports.UserDeletedEvent = exports.UserUpdatedEvent = exports.UserRegisteredEvent = exports.StockDepletedEvent = exports.StockReleasedEvent = exports.StockReservedEvent = exports.PaymentFailedEvent = exports.PaymentSucceededEvent = exports.PaymentInitiatedEvent = exports.OrderCancelledEvent = exports.OrderUpdatedEvent = exports.OrderCreatedEvent = exports.DomainEvent = void 0;
exports.isOrderEvent = isOrderEvent;
exports.isPaymentEvent = isPaymentEvent;
exports.isUserEvent = isUserEvent;
exports.isNotificationEvent = isNotificationEvent;
class DomainEvent {
    constructor(eventId, eventData, version = 1, aggregateId) {
        this.eventId = eventId;
        this.eventData = eventData;
        this.version = version;
        this.aggregateId = aggregateId;
    }
    get eventType() {
        return this.constructor.name;
    }
    toJSON() {
        return {
            eventId: this.eventId,
            eventType: this.eventType,
            eventData: this.eventData,
            version: this.version,
            aggregateId: this.aggregateId,
            occurredAt: new Date().toISOString(),
        };
    }
}
exports.DomainEvent = DomainEvent;
class OrderCreatedEvent extends DomainEvent {
    constructor(orderId, data) {
        super(orderId, data);
    }
}
exports.OrderCreatedEvent = OrderCreatedEvent;
class OrderUpdatedEvent extends DomainEvent {
    constructor(orderId, data) {
        super(orderId, data);
    }
}
exports.OrderUpdatedEvent = OrderUpdatedEvent;
class OrderCancelledEvent extends DomainEvent {
    constructor(orderId, data) {
        super(orderId, data);
    }
}
exports.OrderCancelledEvent = OrderCancelledEvent;
class PaymentInitiatedEvent extends DomainEvent {
    constructor(paymentId, data) {
        super(paymentId, data);
    }
}
exports.PaymentInitiatedEvent = PaymentInitiatedEvent;
class PaymentSucceededEvent extends DomainEvent {
    constructor(paymentId, data) {
        super(paymentId, data);
    }
}
exports.PaymentSucceededEvent = PaymentSucceededEvent;
class PaymentFailedEvent extends DomainEvent {
    constructor(paymentId, data) {
        super(paymentId, data);
    }
}
exports.PaymentFailedEvent = PaymentFailedEvent;
class StockReservedEvent extends DomainEvent {
    constructor(productId, data) {
        super(productId, data);
    }
}
exports.StockReservedEvent = StockReservedEvent;
class StockReleasedEvent extends DomainEvent {
    constructor(productId, data) {
        super(productId, data);
    }
}
exports.StockReleasedEvent = StockReleasedEvent;
class StockDepletedEvent extends DomainEvent {
    constructor(productId, data) {
        super(productId, data);
    }
}
exports.StockDepletedEvent = StockDepletedEvent;
class UserRegisteredEvent extends DomainEvent {
    constructor(userId, data) {
        super(userId, data);
    }
}
exports.UserRegisteredEvent = UserRegisteredEvent;
class UserUpdatedEvent extends DomainEvent {
    constructor(userId, data) {
        super(userId, data);
    }
}
exports.UserUpdatedEvent = UserUpdatedEvent;
class UserDeletedEvent extends DomainEvent {
    constructor(userId, data) {
        super(userId, data);
    }
}
exports.UserDeletedEvent = UserDeletedEvent;
class ErrorOccurredEvent extends DomainEvent {
    constructor(errorId, data) {
        super(errorId, data);
    }
}
exports.ErrorOccurredEvent = ErrorOccurredEvent;
class SagaCompletedEvent extends DomainEvent {
    constructor(sagaId, data) {
        super(sagaId, data, 1, sagaId);
    }
}
exports.SagaCompletedEvent = SagaCompletedEvent;
class SagaFailedEvent extends DomainEvent {
    constructor(sagaId, data) {
        super(sagaId, data, 1, sagaId);
    }
}
exports.SagaFailedEvent = SagaFailedEvent;
class ProductInformationRequestedEvent extends DomainEvent {
    constructor(sagaId, data) {
        super(sagaId, data, 1, sagaId);
    }
}
exports.ProductInformationRequestedEvent = ProductInformationRequestedEvent;
class StockValidationRequestedEvent extends DomainEvent {
    constructor(sagaId, data) {
        super(sagaId, data, 1, sagaId);
    }
}
exports.StockValidationRequestedEvent = StockValidationRequestedEvent;
class UserInformationRequestedEvent extends DomainEvent {
    constructor(sagaId, data) {
        super(sagaId, data, 1, sagaId);
    }
}
exports.UserInformationRequestedEvent = UserInformationRequestedEvent;
class DomainEventFactory {
    static createOrderCreatedEvent(orderId, data) {
        return new OrderCreatedEvent(orderId, data);
    }
    static createPaymentSucceededEvent(paymentId, data) {
        return new PaymentSucceededEvent(paymentId, data);
    }
    static createUserRegisteredEvent(userId, data) {
        return new UserRegisteredEvent(userId, data);
    }
}
exports.DomainEventFactory = DomainEventFactory;
function isOrderEvent(event) {
    return event.eventType.startsWith('Order');
}
function isPaymentEvent(event) {
    return event.eventType.startsWith('Payment');
}
function isUserEvent(event) {
    return event.eventType.startsWith('User');
}
function isNotificationEvent(event) {
    return event.eventType.startsWith('Email') || event.eventType.startsWith('SMS');
}
class DomainEventValidator {
    static validateOrderCreatedEvent(event) {
        const errors = [];
        if (!event.eventData.customerId) {
            errors.push('customerId is required');
        }
        if (!event.eventData.items || event.eventData.items.length === 0) {
            errors.push('items are required and cannot be empty');
        }
        if (!event.eventData.totalAmount || event.eventData.totalAmount <= 0) {
            errors.push('totalAmount must be greater than 0');
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
}
exports.DomainEventValidator = DomainEventValidator;
//# sourceMappingURL=domain-events.js.map