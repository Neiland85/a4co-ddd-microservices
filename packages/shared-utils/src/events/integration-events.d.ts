import { DomainEvent } from '../domain/domain-event';
export declare class ProductInformationRequestedIntegrationEvent extends DomainEvent {
    constructor(requestId: string, data: {
        orderId: string;
        productIds: string[];
        requestedAt: Date;
    });
}
export declare class ProductInformationProvidedEvent extends DomainEvent {
    constructor(responseId: string, data: {
        orderId: string;
        requestId: string;
        products: Array<{
            productId: string;
            productName: string;
            currentPrice: number;
            currency: string;
            artisanId: string;
            isAvailable: boolean;
            stockQuantity: number;
        }>;
        providedAt: Date;
    });
}
export declare class StockValidationRequestedIntegrationEvent extends DomainEvent {
    constructor(requestId: string, data: {
        orderId: string;
        items: Array<{
            productId: string;
            quantity: number;
        }>;
        requestedAt: Date;
    });
}
export declare class StockValidationResponseEvent extends DomainEvent {
    constructor(responseId: string, data: {
        orderId: string;
        requestId: string;
        validationResults: Array<{
            productId: string;
            isAvailable: boolean;
            availableQuantity: number;
            requestedQuantity: number;
        }>;
        allItemsAvailable: boolean;
        respondedAt: Date;
    });
}
export declare class UserInformationRequestedIntegrationEvent extends DomainEvent {
    constructor(requestId: string, data: {
        userId: string;
        requestedFields: string[];
        requestedAt: Date;
    });
}
export declare class UserInformationProvidedEvent extends DomainEvent {
    constructor(responseId: string, data: {
        userId: string;
        requestId: string;
        userData: {
            email: string;
            firstName?: string;
            lastName?: string;
            address?: {
                street: string;
                city: string;
                state: string;
                postalCode: string;
                country: string;
            };
            preferences?: {
                language: string;
                currency: string;
                notifications: {
                    email: boolean;
                    sms: boolean;
                };
            };
        };
        providedAt: Date;
    });
}
//# sourceMappingURL=integration-events.d.ts.map