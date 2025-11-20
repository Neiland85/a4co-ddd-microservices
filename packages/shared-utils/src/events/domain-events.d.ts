export declare abstract class DomainEvent {
    readonly eventId: string;
    readonly eventData: any;
    readonly version: number;
    readonly aggregateId?: string | undefined;
    constructor(eventId: string, eventData: any, version?: number, aggregateId?: string | undefined);
    get eventType(): string;
    toJSON(): Record<string, any>;
}
export declare class OrderCreatedEvent extends DomainEvent {
    constructor(orderId: string, data: any);
}
export declare class OrderUpdatedEvent extends DomainEvent {
    constructor(orderId: string, data: any);
}
export declare class OrderCancelledEvent extends DomainEvent {
    constructor(orderId: string, data: any);
}
export declare class PaymentInitiatedEvent extends DomainEvent {
    constructor(paymentId: string, data: any);
}
export declare class PaymentSucceededEvent extends DomainEvent {
    constructor(paymentId: string, data: any);
}
export declare class PaymentFailedEvent extends DomainEvent {
    constructor(paymentId: string, data: any);
}
export declare class StockReservedEvent extends DomainEvent {
    constructor(productId: string, data: any);
}
export declare class StockReleasedEvent extends DomainEvent {
    constructor(productId: string, data: any);
}
export declare class StockDepletedEvent extends DomainEvent {
    constructor(productId: string, data: any);
}
export declare class UserRegisteredEvent extends DomainEvent {
    constructor(userId: string, data: any);
}
export declare class UserUpdatedEvent extends DomainEvent {
    constructor(userId: string, data: any);
}
export declare class UserDeletedEvent extends DomainEvent {
    constructor(userId: string, data: any);
}
export declare class ErrorOccurredEvent extends DomainEvent {
    constructor(errorId: string, data: any);
}
export declare class SagaCompletedEvent extends DomainEvent {
    constructor(sagaId: string, data: {
        result: any;
        completedAt: Date;
    });
}
export declare class SagaFailedEvent extends DomainEvent {
    constructor(sagaId: string, data: {
        error: string;
        compensations: string[];
        failedAt: Date;
    });
}
export declare class ProductInformationRequestedEvent extends DomainEvent {
    constructor(sagaId: string, data: {
        orderId: string;
        productIds: string[];
        requestedAt: Date;
    });
}
export declare class StockValidationRequestedEvent extends DomainEvent {
    constructor(sagaId: string, data: {
        orderId: string;
        items: Array<{
            productId: string;
            quantity: number;
        }>;
        requestedAt: Date;
    });
}
export declare class UserInformationRequestedEvent extends DomainEvent {
    constructor(sagaId: string, data: {
        userId: string;
        requestedFields: string[];
        requestedAt: Date;
    });
}
export declare class DomainEventFactory {
    static createOrderCreatedEvent(orderId: string, data: any): OrderCreatedEvent;
    static createPaymentSucceededEvent(paymentId: string, data: any): PaymentSucceededEvent;
    static createUserRegisteredEvent(userId: string, data: any): UserRegisteredEvent;
}
export declare function isOrderEvent(event: DomainEvent): boolean;
export declare function isPaymentEvent(event: DomainEvent): boolean;
export declare function isUserEvent(event: DomainEvent): boolean;
export declare function isNotificationEvent(event: DomainEvent): boolean;
export interface EventValidationResult {
    isValid: boolean;
    errors: string[];
}
export declare class DomainEventValidator {
    static validateOrderCreatedEvent(event: OrderCreatedEvent): EventValidationResult;
}
//# sourceMappingURL=domain-events.d.ts.map