import { DomainEvent } from '@a4co/shared-utils/src/domain/domain-event';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  artisanId: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * Evento emitido cuando se crea una nueva orden
 * Suscriptores: Inventory, Payment, Notification, Analytics
 */
export class OrderCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly orderData: {
      orderId: string;
      userId: string;
      customerEmail: string;
      items: OrderItem[];
      subtotal: number;
      tax: number;
      shipping: number;
      totalAmount: number;
      currency: string;
      shippingAddress: Address;
      billingAddress?: Address;
      paymentMethod: string;
      notes?: string;
      createdAt: Date;
    },
    eventVersion?: number
  ) {
    super(aggregateId, orderData, eventVersion);
  }
}

/**
 * Evento emitido cuando se confirma una orden tras el pago exitoso
 * Suscriptores: Notification, Loyalty, Inventory, Shipping
 */
export class OrderConfirmedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly confirmationData: {
      orderId: string;
      confirmedAt: Date;
      paymentId: string;
      paymentMethod: string;
      transactionReference: string;
      estimatedDeliveryDate: Date;
      trackingNumber?: string;
    },
    eventVersion?: number
  ) {
    super(aggregateId, confirmationData, eventVersion);
  }
}

/**
 * Evento emitido cuando se cancela una orden
 * Suscriptores: Payment, Inventory, Notification
 */
export class OrderCancelledEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly cancellationData: {
      orderId: string;
      cancelledAt: Date;
      reason: string;
      cancelledBy: string; // userId or 'system'
      refundRequired: boolean;
      refundAmount?: number;
      restockRequired: boolean;
    },
    eventVersion?: number
  ) {
    super(aggregateId, cancellationData, eventVersion);
  }
}

/**
 * Evento emitido cuando se actualiza el estado de envío
 * Suscriptores: Notification, Analytics
 */
export class OrderShippingUpdatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly shippingData: {
      orderId: string;
      status: 'preparing' | 'shipped' | 'in_transit' | 'delivered' | 'returned';
      carrier?: string;
      trackingNumber?: string;
      estimatedDelivery?: Date;
      actualDelivery?: Date;
      updatedAt: Date;
      location?: {
        city: string;
        state: string;
        country: string;
      };
    },
    eventVersion?: number
  ) {
    super(aggregateId, shippingData, eventVersion);
  }
}

/**
 * Evento emitido cuando se completa una orden
 * Suscriptores: Loyalty, Analytics, Review Service
 */
export class OrderCompletedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly completionData: {
      orderId: string;
      completedAt: Date;
      deliveredAt: Date;
      customerSatisfied: boolean;
      eligibleForReview: boolean;
      loyaltyPointsEarned?: number;
    },
    eventVersion?: number
  ) {
    super(aggregateId, completionData, eventVersion);
  }
}

/**
 * Evento emitido cuando se solicita un reembolso
 * Suscriptores: Payment, Notification, Finance
 */
export class OrderRefundRequestedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly refundData: {
      orderId: string;
      refundId: string;
      requestedAt: Date;
      requestedBy: string;
      reason: string;
      items?: Array<{
        productId: string;
        quantity: number;
        amount: number;
      }>;
      totalRefundAmount: number;
      returnRequired: boolean;
    },
    eventVersion?: number
  ) {
    super(aggregateId, refundData, eventVersion);
  }
}