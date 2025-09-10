import { DomainEvent } from '../domain/domain-event';
/**
 * Evento de integración: Cuando se crea una orden, se solicita información de productos
 * Este evento NO contiene datos de productos, solo solicita la información
 */
export declare class ProductInformationRequestedEvent extends DomainEvent {
    constructor(requestId: string, data: {
        orderId: string;
        productIds: string[];
        requestedAt: Date;
    });
}
/**
 * Evento de integración: Respuesta con información de productos solicitada
 * Este evento contiene solo los datos necesarios para la orden
 */
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
/**
 * Evento de integración: Solicitud de validación de stock
 */
export declare class StockValidationRequestedEvent extends DomainEvent {
    constructor(requestId: string, data: {
        orderId: string;
        items: Array<{
            productId: string;
            quantity: number;
        }>;
        requestedAt: Date;
    });
}
/**
 * Evento de integración: Respuesta de validación de stock
 */
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
/**
 * Evento de integración: Solicitud de información de usuario
 */
export declare class UserInformationRequestedEvent extends DomainEvent {
    constructor(requestId: string, data: {
        userId: string;
        requestedFields: string[];
        requestedAt: Date;
    });
}
/**
 * Evento de integración: Respuesta con información de usuario
 */
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