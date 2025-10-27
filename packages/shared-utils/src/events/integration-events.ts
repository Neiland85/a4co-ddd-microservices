import { DomainEvent } from '../domain/domain-event';

// INTEGRATION EVENTS - Para comunicación entre bounded contexts

/**
 * Evento de integración: Cuando se crea una orden, se solicita información de productos
 * Este evento NO contiene datos de productos, solo solicita la información
 */
export class ProductInformationRequestedIntegrationEvent extends DomainEvent {
  constructor(
    requestId: string,
    data: {
      orderId: string;
      productIds: string[]; // Solo IDs, no datos completos
      requestedAt: Date;
    }
  ) {
    super(requestId, data);
  }
}

/**
 * Evento de integración: Respuesta con información de productos solicitada
 * Este evento contiene solo los datos necesarios para la orden
 */
export class ProductInformationProvidedEvent extends DomainEvent {
  constructor(
    responseId: string,
    data: {
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
    }
  ) {
    super(responseId, data);
  }
}

/**
 * Evento de integración: Solicitud de validación de stock
 */
export class StockValidationRequestedIntegrationEvent extends DomainEvent {
  constructor(
    requestId: string,
    data: {
      orderId: string;
      items: Array<{
        productId: string;
        quantity: number;
      }>;
      requestedAt: Date;
    }
  ) {
    super(requestId, data);
  }
}

/**
 * Evento de integración: Respuesta de validación de stock
 */
export class StockValidationResponseEvent extends DomainEvent {
  constructor(
    responseId: string,
    data: {
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
    }
  ) {
    super(responseId, data);
  }
}

/**
 * Evento de integración: Solicitud de información de usuario
 */
export class UserInformationRequestedIntegrationEvent extends DomainEvent {
  constructor(
    requestId: string,
    data: {
      userId: string;
      requestedFields: string[]; // ['email', 'address', 'preferences']
      requestedAt: Date;
    }
  ) {
    super(requestId, data);
  }
}

/**
 * Evento de integración: Respuesta con información de usuario
 */
export class UserInformationProvidedEvent extends DomainEvent {
  constructor(
    responseId: string,
    data: {
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
    }
  ) {
    super(responseId, data);
  }
}
