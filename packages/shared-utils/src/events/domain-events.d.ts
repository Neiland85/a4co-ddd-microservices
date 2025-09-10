import { DomainEvent } from '../domain/domain-event';
export interface Address {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}
export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    artisanId: string;
}
export interface ContactInfo {
    email: string;
    phone?: string;
    businessName?: string;
}
export interface OrderItemReference {
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}
export interface ProductSummary {
    productId: string;
    productName: string;
    artisanId: string;
    category: string;
    price: number;
    currency: string;
}
export declare class OrderCreatedEvent extends DomainEvent {
    constructor(orderId: string, data: {
        customerId: string;
        customerEmail: string;
        items: OrderItemReference[];
        totalAmount: number;
        currency: string;
        deliveryAddress: Address;
        billingAddress?: Address;
        specialInstructions?: string;
        estimatedDelivery: Date;
        createdAt: Date;
    });
}
export declare class OrderConfirmedEvent extends DomainEvent {
    constructor(orderId: string, data: {
        confirmedAt: Date;
        estimatedDelivery: Date;
        paymentReference: string;
        artisanNotified: boolean;
        trackingNumber?: string;
    });
}
export declare class OrderCancelledEvent extends DomainEvent {
    constructor(orderId: string, data: {
        reason: string;
        cancelledAt: Date;
        cancelledBy: 'customer' | 'artisan' | 'system' | 'admin';
        refundRequired: boolean;
        refundAmount?: number;
        notificationSent: boolean;
    });
}
export declare class OrderDeliveredEvent extends DomainEvent {
    constructor(orderId: string, data: {
        deliveredAt: Date;
        deliveryConfirmation: string;
        recipientName: string;
        recipientSignature?: string;
        deliveryNotes?: string;
        photoConfirmation?: string;
    });
}
export declare class StockReservedEvent extends DomainEvent {
    constructor(productId: string, data: {
        orderId: string;
        quantityReserved: number;
        remainingStock: number;
        reservationExpiry: Date;
        reservedAt: Date;
        artisanId: string;
    });
}
export declare class StockReleasedEvent extends DomainEvent {
    constructor(productId: string, data: {
        orderId: string;
        quantityReleased: number;
        reason: 'order-cancelled' | 'reservation-expired' | 'payment-failed' | 'manual-release';
        newStock: number;
        releasedAt: Date;
        artisanId: string;
    });
}
export declare class LowStockWarningEvent extends DomainEvent {
    constructor(productId: string, data: {
        currentStock: number;
        threshold: number;
        artisanId: string;
        productName: string;
        category: string;
        urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
        lastRestocked?: Date;
    });
}
export declare class StockUpdatedEvent extends DomainEvent {
    constructor(productId: string, data: {
        previousStock: number;
        newStock: number;
        changeAmount: number;
        updateReason: string;
        updatedBy: string;
        updatedAt: Date;
        artisanId: string;
    });
}
export declare class PaymentInitiatedEvent extends DomainEvent {
    constructor(paymentId: string, data: {
        orderId: string;
        customerId: string;
        amount: number;
        currency: string;
        paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';
        paymentGateway: string;
        initiatedAt: Date;
    });
}
export declare class PaymentSucceededEvent extends DomainEvent {
    constructor(paymentId: string, data: {
        orderId: string;
        transactionId: string;
        amount: number;
        currency: string;
        fees: number;
        netAmount: number;
        processedAt: Date;
        paymentGateway: string;
        authorizationCode?: string;
    });
}
export declare class PaymentFailedEvent extends DomainEvent {
    constructor(paymentId: string, data: {
        orderId: string;
        errorCode: string;
        errorMessage: string;
        retryable: boolean;
        failedAt: Date;
        paymentGateway: string;
        failureReason: string;
        customerNotified: boolean;
    });
}
export declare class RefundProcessedEvent extends DomainEvent {
    constructor(refundId: string, data: {
        originalPaymentId: string;
        orderId: string;
        amount: number;
        currency: string;
        reason: string;
        processedAt: Date;
        refundMethod: string;
        expectedInAccount: Date;
        customerNotified: boolean;
    });
}
export declare class UserRegisteredEvent extends DomainEvent {
    constructor(userId: string, data: {
        email: string;
        firstName: string;
        lastName: string;
        phone?: string;
        registrationDate: Date;
        preferredLanguage: string;
        location?: Address;
        accountType: 'customer' | 'artisan' | 'admin';
        verificationRequired: boolean;
    });
}
export declare class UserProfileUpdatedEvent extends DomainEvent {
    constructor(userId: string, data: {
        changedFields: string[];
        previousValues: Record<string, any>;
        newValues: Record<string, any>;
        updatedAt: Date;
        updatedBy: string;
    });
}
export declare class UserPreferencesChangedEvent extends DomainEvent {
    constructor(userId: string, data: {
        preferences: {
            notifications: {
                email: boolean;
                sms: boolean;
                push: boolean;
            };
            newsletter: boolean;
            productCategories: string[];
            deliveryRadius: number;
            language: string;
            currency: string;
        };
        updatedAt: Date;
    });
}
export declare class ArtisanVerifiedEvent extends DomainEvent {
    constructor(artisanId: string, data: {
        businessName: string;
        contactEmail: string;
        contactPhone: string;
        location: Address;
        specialties: string[];
        verifiedAt: Date;
        verifiedBy: string;
        documentType: string;
        certificationsProvided: string[];
    });
}
export declare class NewProductListedEvent extends DomainEvent {
    constructor(productId: string, data: {
        artisanId: string;
        productName: string;
        description: string;
        category: string;
        subcategory?: string;
        price: number;
        currency: string;
        initialStock: number;
        images: string[];
        tags: string[];
        isOrganic: boolean;
        isSeasonal: boolean;
        availableFrom?: Date;
        availableUntil?: Date;
        listedAt: Date;
    });
}
export declare class ArtisanStatusChangedEvent extends DomainEvent {
    constructor(artisanId: string, data: {
        previousStatus: 'pending' | 'verified' | 'suspended' | 'inactive';
        newStatus: 'pending' | 'verified' | 'suspended' | 'inactive';
        reason: string;
        changedBy: string;
        changedAt: globalThis.Date;
        effectiveDate?: globalThis.Date;
        notificationSent: boolean;
    });
}
export declare class EmailSentEvent extends DomainEvent {
    constructor(notificationId: string, data: {
        recipientEmail: string;
        recipientName?: string;
        subject: string;
        template: string;
        variables: Record<string, any>;
        sentAt: Date;
        provider: string;
        messageId: string;
    });
}
export declare class SMSSentEvent extends DomainEvent {
    constructor(notificationId: string, data: {
        recipientPhone: string;
        message: string;
        sentAt: Date;
        provider: string;
        messageId: string;
        cost?: number;
    });
}
export declare class SalesRecordedEvent extends DomainEvent {
    constructor(recordId: string, data: {
        orderId: string;
        customerId: string;
        artisanId: string;
        totalAmount: number;
        currency: string;
        items: Array<{
            productId: string;
            category: string;
            quantity: number;
            revenue: number;
        }>;
        paymentMethod: string;
        customerLocation?: {
            city: string;
            state: string;
        };
        recordedAt: Date;
    });
}
export declare class UserActionTrackedEvent extends DomainEvent {
    constructor(trackingId: string, data: {
        userId?: string;
        sessionId: string;
        action: string;
        page: string;
        category: string;
        properties: Record<string, any>;
        timestamp: Date;
        userAgent?: string;
        ipAddress?: string;
    });
}
export declare class PointsEarnedEvent extends DomainEvent {
    constructor(transactionId: string, data: {
        customerId: string;
        orderId?: string;
        pointsEarned: number;
        reason: string;
        multiplier?: number;
        campaignId?: string;
        earnedAt: Date;
        expiryDate?: Date;
    });
}
export declare class PointsRedeemedEvent extends DomainEvent {
    constructor(redemptionId: string, data: {
        customerId: string;
        orderId?: string;
        pointsRedeemed: number;
        discountAmount: number;
        currency: string;
        redeemedAt: Date;
        remainingPoints: number;
    });
}
export declare class LocationUpdatedEvent extends DomainEvent {
    constructor(locationId: string, data: {
        entityType: 'user' | 'artisan' | 'delivery';
        entityId: string;
        previousLocation?: Address;
        newLocation: Address;
        accuracy?: number;
        updatedAt: Date;
        source: 'gps' | 'manual' | 'geocoding';
    });
}
export declare class ServiceStartedEvent extends DomainEvent {
    constructor(serviceId: string, data: {
        serviceName: string;
        version: string;
        environment: string;
        startedAt: Date;
        hostname: string;
        port?: number;
        healthCheckUrl?: string;
    });
}
export declare class ServiceErrorEvent extends DomainEvent {
    constructor(errorId: string, data: {
        serviceName: string;
        errorType: string;
        errorMessage: string;
        stackTrace?: string;
        context: Record<string, any>;
        severity: 'low' | 'medium' | 'high' | 'critical';
        occurredAt: Date;
        userId?: string;
        requestId?: string;
    });
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
    static createStockReservedEvent(productId: string, data: any): StockReservedEvent;
    static createPaymentSucceededEvent(paymentId: string, data: any): PaymentSucceededEvent;
}
export declare function isOrderEvent(event: DomainEvent): boolean;
export declare function isPaymentEvent(event: DomainEvent): boolean;
export declare function isInventoryEvent(event: DomainEvent): boolean;
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