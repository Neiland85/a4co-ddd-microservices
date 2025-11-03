// packages/shared-utils/src/events/domain-events.ts

// BASE DOMAIN EVENT
export abstract class DomainEvent {
  constructor(
    public readonly eventId: string,
    public readonly eventData: any,
    public readonly version: number = 1,
    public readonly aggregateId?: string
  ) {}

  get eventType(): string {
    return this.constructor.name;
  }

  toJSON(): Record<string, any> {
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

// ORDER DOMAIN EVENTS

export class OrderCreatedEvent extends DomainEvent {
  constructor(orderId: string, data: any) {
    super(orderId, data);
  }
}

export class OrderUpdatedEvent extends DomainEvent {
  constructor(orderId: string, data: any) {
    super(orderId, data);
  }
}

export class OrderCancelledEvent extends DomainEvent {
  constructor(orderId: string, data: any) {
    super(orderId, data);
  }
}

// PAYMENT DOMAIN EVENTS

export class PaymentInitiatedEvent extends DomainEvent {
  constructor(paymentId: string, data: any) {
    super(paymentId, data);
  }
}

export class PaymentSucceededEvent extends DomainEvent {
  constructor(paymentId: string, data: any) {
    super(paymentId, data);
  }
}

export class PaymentFailedEvent extends DomainEvent {
  constructor(paymentId: string, data: any) {
    super(paymentId, data);
  }
}

// INVENTORY DOMAIN EVENTS

export class StockReservedEvent extends DomainEvent {
  constructor(productId: string, data: any) {
    super(productId, data);
  }
}

export class StockReleasedEvent extends DomainEvent {
  constructor(productId: string, data: any) {
    super(productId, data);
  }
}

export class StockDepletedEvent extends DomainEvent {
  constructor(productId: string, data: any) {
    super(productId, data);
  }
}

// USER DOMAIN EVENTS

export class UserRegisteredEvent extends DomainEvent {
  constructor(userId: string, data: any) {
    super(userId, data);
  }
}

export class UserUpdatedEvent extends DomainEvent {
  constructor(userId: string, data: any) {
    super(userId, data);
  }
}

export class UserDeletedEvent extends DomainEvent {
  constructor(userId: string, data: any) {
    super(userId, data);
  }
}

// ERROR DOMAIN EVENT

export class ErrorOccurredEvent extends DomainEvent {
  constructor(errorId: string, data: any) {
    super(errorId, data);
  }
}

// SAGA DOMAIN EVENTS

export class SagaCompletedEvent extends DomainEvent {
  constructor(
    sagaId: string,
    data: {
      result: any;
      completedAt: Date;
    }
  ) {
    super(sagaId, data, 1, sagaId);
  }
}

export class SagaFailedEvent extends DomainEvent {
  constructor(
    sagaId: string,
    data: {
      error: string;
      compensations: string[];
      failedAt: Date;
    }
  ) {
    super(sagaId, data, 1, sagaId);
  }
}

export class ProductInformationRequestedEvent extends DomainEvent {
  constructor(
    sagaId: string,
    data: {
      orderId: string;
      productIds: string[];
      requestedAt: Date;
    }
  ) {
    super(sagaId, data, 1, sagaId);
  }
}

export class StockValidationRequestedEvent extends DomainEvent {
  constructor(
    sagaId: string,
    data: {
      orderId: string;
      items: Array<{ productId: string; quantity: number }>;
      requestedAt: Date;
    }
  ) {
    super(sagaId, data, 1, sagaId);
  }
}

export class UserInformationRequestedEvent extends DomainEvent {
  constructor(
    sagaId: string,
    data: {
      userId: string;
      requestedFields: string[];
      requestedAt: Date;
    }
  ) {
    super(sagaId, data, 1, sagaId);
  }
}

// EVENT FACTORY FOR TYPE SAFETY

export class DomainEventFactory {
  static createOrderCreatedEvent(orderId: string, data: any): OrderCreatedEvent {
    return new OrderCreatedEvent(orderId, data);
  }

  static createPaymentSucceededEvent(paymentId: string, data: any): PaymentSucceededEvent {
    return new PaymentSucceededEvent(paymentId, data);
  }

  static createUserRegisteredEvent(userId: string, data: any): UserRegisteredEvent {
    return new UserRegisteredEvent(userId, data);
  }
}

// EVENT TYPE GUARDS

export function isOrderEvent(event: DomainEvent): boolean {
  return event.eventType.startsWith('Order');
}

export function isPaymentEvent(event: DomainEvent): boolean {
  return event.eventType.startsWith('Payment');
}

export function isUserEvent(event: DomainEvent): boolean {
  return event.eventType.startsWith('User');
}

export function isNotificationEvent(event: DomainEvent): boolean {
  return event.eventType.startsWith('Email') || event.eventType.startsWith('SMS');
}

// EVENT VALIDATION

export interface EventValidationResult {
  isValid: boolean;
  errors: string[];
}

export class DomainEventValidator {
  static validateOrderCreatedEvent(event: OrderCreatedEvent): EventValidationResult {
    const errors: string[] = [];

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

  // Additional validations can be added here
}
