"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainEventValidator = exports.DomainEventFactory = exports.UserInformationRequestedEvent = exports.StockValidationRequestedEvent = exports.ProductInformationRequestedEvent = exports.SagaFailedEvent = exports.SagaCompletedEvent = exports.ServiceErrorEvent = exports.ServiceStartedEvent = exports.LocationUpdatedEvent = exports.PointsRedeemedEvent = exports.PointsEarnedEvent = exports.UserActionTrackedEvent = exports.SalesRecordedEvent = exports.SMSSentEvent = exports.EmailSentEvent = exports.ArtisanStatusChangedEvent = exports.NewProductListedEvent = exports.ArtisanVerifiedEvent = exports.UserPreferencesChangedEvent = exports.UserProfileUpdatedEvent = exports.UserRegisteredEvent = exports.RefundProcessedEvent = exports.PaymentFailedEvent = exports.PaymentSucceededEvent = exports.PaymentInitiatedEvent = exports.StockUpdatedEvent = exports.LowStockWarningEvent = exports.StockReleasedEvent = exports.StockReservedEvent = exports.OrderDeliveredEvent = exports.OrderCancelledEvent = exports.OrderConfirmedEvent = exports.OrderCreatedEvent = void 0;
exports.isOrderEvent = isOrderEvent;
exports.isPaymentEvent = isPaymentEvent;
exports.isInventoryEvent = isInventoryEvent;
exports.isUserEvent = isUserEvent;
exports.isNotificationEvent = isNotificationEvent;
const domain_event_1 = require("../domain/domain-event");
// ========================================
// ORDER DOMAIN EVENTS
// ========================================
class OrderCreatedEvent extends domain_event_1.DomainEvent {
    constructor(orderId, data) {
        super(orderId, data);
    }
}
exports.OrderCreatedEvent = OrderCreatedEvent;
class OrderConfirmedEvent extends domain_event_1.DomainEvent {
    constructor(orderId, data) {
        super(orderId, data);
    }
}
exports.OrderConfirmedEvent = OrderConfirmedEvent;
class OrderCancelledEvent extends domain_event_1.DomainEvent {
    constructor(orderId, data) {
        super(orderId, data);
    }
}
exports.OrderCancelledEvent = OrderCancelledEvent;
class OrderDeliveredEvent extends domain_event_1.DomainEvent {
    constructor(orderId, data) {
        super(orderId, data);
    }
}
exports.OrderDeliveredEvent = OrderDeliveredEvent;
// ========================================
// INVENTORY DOMAIN EVENTS
// ========================================
class StockReservedEvent extends domain_event_1.DomainEvent {
    constructor(productId, data) {
        super(productId, data);
    }
}
exports.StockReservedEvent = StockReservedEvent;
class StockReleasedEvent extends domain_event_1.DomainEvent {
    constructor(productId, data) {
        super(productId, data);
    }
}
exports.StockReleasedEvent = StockReleasedEvent;
class LowStockWarningEvent extends domain_event_1.DomainEvent {
    constructor(productId, data) {
        super(productId, data);
    }
}
exports.LowStockWarningEvent = LowStockWarningEvent;
class StockUpdatedEvent extends domain_event_1.DomainEvent {
    constructor(productId, data) {
        super(productId, data);
    }
}
exports.StockUpdatedEvent = StockUpdatedEvent;
// ========================================
// PAYMENT DOMAIN EVENTS
// ========================================
class PaymentInitiatedEvent extends domain_event_1.DomainEvent {
    constructor(paymentId, data) {
        super(paymentId, data);
    }
}
exports.PaymentInitiatedEvent = PaymentInitiatedEvent;
class PaymentSucceededEvent extends domain_event_1.DomainEvent {
    constructor(paymentId, data) {
        super(paymentId, data);
    }
}
exports.PaymentSucceededEvent = PaymentSucceededEvent;
class PaymentFailedEvent extends domain_event_1.DomainEvent {
    constructor(paymentId, data) {
        super(paymentId, data);
    }
}
exports.PaymentFailedEvent = PaymentFailedEvent;
class RefundProcessedEvent extends domain_event_1.DomainEvent {
    constructor(refundId, data) {
        super(refundId, data);
    }
}
exports.RefundProcessedEvent = RefundProcessedEvent;
// ========================================
// USER DOMAIN EVENTS
// ========================================
class UserRegisteredEvent extends domain_event_1.DomainEvent {
    constructor(userId, data) {
        super(userId, data);
    }
}
exports.UserRegisteredEvent = UserRegisteredEvent;
class UserProfileUpdatedEvent extends domain_event_1.DomainEvent {
    constructor(userId, data) {
        super(userId, data);
    }
}
exports.UserProfileUpdatedEvent = UserProfileUpdatedEvent;
class UserPreferencesChangedEvent extends domain_event_1.DomainEvent {
    constructor(userId, data) {
        super(userId, data);
    }
}
exports.UserPreferencesChangedEvent = UserPreferencesChangedEvent;
// ========================================
// ARTISAN DOMAIN EVENTS
// ========================================
class ArtisanVerifiedEvent extends domain_event_1.DomainEvent {
    constructor(artisanId, data) {
        super(artisanId, data);
    }
}
exports.ArtisanVerifiedEvent = ArtisanVerifiedEvent;
class NewProductListedEvent extends domain_event_1.DomainEvent {
    constructor(productId, data) {
        super(productId, data);
    }
}
exports.NewProductListedEvent = NewProductListedEvent;
class ArtisanStatusChangedEvent extends domain_event_1.DomainEvent {
    constructor(artisanId, data) {
        super(artisanId, data);
    }
}
exports.ArtisanStatusChangedEvent = ArtisanStatusChangedEvent;
// ========================================
// NOTIFICATION DOMAIN EVENTS
// ========================================
class EmailSentEvent extends domain_event_1.DomainEvent {
    constructor(notificationId, data) {
        super(notificationId, data);
    }
}
exports.EmailSentEvent = EmailSentEvent;
class SMSSentEvent extends domain_event_1.DomainEvent {
    constructor(notificationId, data) {
        super(notificationId, data);
    }
}
exports.SMSSentEvent = SMSSentEvent;
// ========================================
// ANALYTICS DOMAIN EVENTS
// ========================================
class SalesRecordedEvent extends domain_event_1.DomainEvent {
    constructor(recordId, data) {
        super(recordId, data);
    }
}
exports.SalesRecordedEvent = SalesRecordedEvent;
class UserActionTrackedEvent extends domain_event_1.DomainEvent {
    constructor(trackingId, data) {
        super(trackingId, data);
    }
}
exports.UserActionTrackedEvent = UserActionTrackedEvent;
// ========================================
// LOYALTY DOMAIN EVENTS
// ========================================
class PointsEarnedEvent extends domain_event_1.DomainEvent {
    constructor(transactionId, data) {
        super(transactionId, data);
    }
}
exports.PointsEarnedEvent = PointsEarnedEvent;
class PointsRedeemedEvent extends domain_event_1.DomainEvent {
    constructor(redemptionId, data) {
        super(redemptionId, data);
    }
}
exports.PointsRedeemedEvent = PointsRedeemedEvent;
// ========================================
// GEO DOMAIN EVENTS
// ========================================
class LocationUpdatedEvent extends domain_event_1.DomainEvent {
    constructor(locationId, data) {
        super(locationId, data);
    }
}
exports.LocationUpdatedEvent = LocationUpdatedEvent;
// ========================================
// SYSTEM DOMAIN EVENTS
// ========================================
class ServiceStartedEvent extends domain_event_1.DomainEvent {
    constructor(serviceId, data) {
        super(serviceId, data);
    }
}
exports.ServiceStartedEvent = ServiceStartedEvent;
class ServiceErrorEvent extends domain_event_1.DomainEvent {
    constructor(errorId, data) {
        super(errorId, data);
    }
}
exports.ServiceErrorEvent = ServiceErrorEvent;
// ========================================
// SAGA DOMAIN EVENTS
// ========================================
class SagaCompletedEvent extends domain_event_1.DomainEvent {
    constructor(sagaId, data) {
        super(sagaId, data, 1, sagaId);
    }
}
exports.SagaCompletedEvent = SagaCompletedEvent;
class SagaFailedEvent extends domain_event_1.DomainEvent {
    constructor(sagaId, data) {
        super(sagaId, data, 1, sagaId);
    }
}
exports.SagaFailedEvent = SagaFailedEvent;
class ProductInformationRequestedEvent extends domain_event_1.DomainEvent {
    constructor(sagaId, data) {
        super(sagaId, data, 1, sagaId);
    }
}
exports.ProductInformationRequestedEvent = ProductInformationRequestedEvent;
class StockValidationRequestedEvent extends domain_event_1.DomainEvent {
    constructor(sagaId, data) {
        super(sagaId, data, 1, sagaId);
    }
}
exports.StockValidationRequestedEvent = StockValidationRequestedEvent;
class UserInformationRequestedEvent extends domain_event_1.DomainEvent {
    constructor(sagaId, data) {
        super(sagaId, data, 1, sagaId);
    }
}
exports.UserInformationRequestedEvent = UserInformationRequestedEvent;
// ========================================
// EVENT FACTORY FOR TYPE SAFETY
// ========================================
class DomainEventFactory {
    static createOrderCreatedEvent(orderId, data) {
        return new OrderCreatedEvent(orderId, data);
    }
    static createStockReservedEvent(productId, data) {
        return new StockReservedEvent(productId, data);
    }
    static createPaymentSucceededEvent(paymentId, data) {
        return new PaymentSucceededEvent(paymentId, data);
    }
}
exports.DomainEventFactory = DomainEventFactory;
// ========================================
// EVENT TYPE GUARDS
// ========================================
function isOrderEvent(event) {
    return event.eventType.startsWith('Order');
}
function isPaymentEvent(event) {
    return event.eventType.startsWith('Payment') || event.eventType.startsWith('Refund');
}
function isInventoryEvent(event) {
    return event.eventType.startsWith('Stock') || event.eventType.includes('Stock');
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