import { DomainEvent } from '../domain/domain-event';

// ========================================
// SHARED INTERFACES AND TYPES
// ========================================

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

// ========================================
// ORDER DOMAIN EVENTS
// ========================================

export class OrderCreatedEvent extends DomainEvent {
  constructor(
    orderId: string,
    data: {
      customerId: string;
      customerEmail: string;
      items: OrderItem[];
      totalAmount: number;
      currency: string;
      deliveryAddress: Address;
      billingAddress?: Address;
      specialInstructions?: string;
      estimatedDelivery: Date;
      createdAt: Date;
    }
  ) {
    super(orderId, data);
  }
}

export class OrderConfirmedEvent extends DomainEvent {
  constructor(
    orderId: string,
    data: {
      confirmedAt: Date;
      estimatedDelivery: Date;
      paymentReference: string;
      artisanNotified: boolean;
      trackingNumber?: string;
    }
  ) {
    super(orderId, data);
  }
}

export class OrderCancelledEvent extends DomainEvent {
  constructor(
    orderId: string,
    data: {
      reason: string;
      cancelledAt: Date;
      cancelledBy: 'customer' | 'artisan' | 'system' | 'admin';
      refundRequired: boolean;
      refundAmount?: number;
      notificationSent: boolean;
    }
  ) {
    super(orderId, data);
  }
}

export class OrderDeliveredEvent extends DomainEvent {
  constructor(
    orderId: string,
    data: {
      deliveredAt: Date;
      deliveryConfirmation: string;
      recipientName: string;
      recipientSignature?: string;
      deliveryNotes?: string;
      photoConfirmation?: string;
    }
  ) {
    super(orderId, data);
  }
}

// ========================================
// INVENTORY DOMAIN EVENTS
// ========================================

export class StockReservedEvent extends DomainEvent {
  constructor(
    productId: string,
    data: {
      orderId: string;
      quantityReserved: number;
      remainingStock: number;
      reservationExpiry: Date;
      reservedAt: Date;
      artisanId: string;
    }
  ) {
    super(productId, data);
  }
}

export class StockReleasedEvent extends DomainEvent {
  constructor(
    productId: string,
    data: {
      orderId: string;
      quantityReleased: number;
      reason: 'order-cancelled' | 'reservation-expired' | 'payment-failed' | 'manual-release';
      newStock: number;
      releasedAt: Date;
      artisanId: string;
    }
  ) {
    super(productId, data);
  }
}

export class LowStockWarningEvent extends DomainEvent {
  constructor(
    productId: string,
    data: {
      currentStock: number;
      threshold: number;
      artisanId: string;
      productName: string;
      category: string;
      urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
      lastRestocked?: Date;
    }
  ) {
    super(productId, data);
  }
}

export class StockUpdatedEvent extends DomainEvent {
  constructor(
    productId: string,
    data: {
      previousStock: number;
      newStock: number;
      changeAmount: number;
      updateReason: string;
      updatedBy: string;
      updatedAt: Date;
      artisanId: string;
    }
  ) {
    super(productId, data);
  }
}

// ========================================
// PAYMENT DOMAIN EVENTS
// ========================================

export class PaymentInitiatedEvent extends DomainEvent {
  constructor(
    paymentId: string,
    data: {
      orderId: string;
      customerId: string;
      amount: number;
      currency: string;
      paymentMethod: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'cash_on_delivery';
      paymentGateway: string;
      initiatedAt: Date;
    }
  ) {
    super(paymentId, data);
  }
}

export class PaymentSucceededEvent extends DomainEvent {
  constructor(
    paymentId: string,
    data: {
      orderId: string;
      transactionId: string;
      amount: number;
      currency: string;
      fees: number;
      netAmount: number;
      processedAt: Date;
      paymentGateway: string;
      authorizationCode?: string;
    }
  ) {
    super(paymentId, data);
  }
}

export class PaymentFailedEvent extends DomainEvent {
  constructor(
    paymentId: string,
    data: {
      orderId: string;
      errorCode: string;
      errorMessage: string;
      retryable: boolean;
      failedAt: Date;
      paymentGateway: string;
      failureReason: string;
      customerNotified: boolean;
    }
  ) {
    super(paymentId, data);
  }
}

export class RefundProcessedEvent extends DomainEvent {
  constructor(
    refundId: string,
    data: {
      originalPaymentId: string;
      orderId: string;
      amount: number;
      currency: string;
      reason: string;
      processedAt: Date;
      refundMethod: string;
      expectedInAccount: Date;
      customerNotified: boolean;
    }
  ) {
    super(refundId, data);
  }
}

// ========================================
// USER DOMAIN EVENTS
// ========================================

export class UserRegisteredEvent extends DomainEvent {
  constructor(
    userId: string,
    data: {
      email: string;
      firstName: string;
      lastName: string;
      phone?: string;
      registrationDate: Date;
      preferredLanguage: string;
      location?: Address;
      accountType: 'customer' | 'artisan' | 'admin';
      verificationRequired: boolean;
    }
  ) {
    super(userId, data);
  }
}

export class UserProfileUpdatedEvent extends DomainEvent {
  constructor(
    userId: string,
    data: {
      changedFields: string[];
      previousValues: Record<string, any>;
      newValues: Record<string, any>;
      updatedAt: Date;
      updatedBy: string; // userId or 'system'
    }
  ) {
    super(userId, data);
  }
}

export class UserPreferencesChangedEvent extends DomainEvent {
  constructor(
    userId: string,
    data: {
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
    }
  ) {
    super(userId, data);
  }
}

// ========================================
// ARTISAN DOMAIN EVENTS
// ========================================

export class ArtisanVerifiedEvent extends DomainEvent {
  constructor(
    artisanId: string,
    data: {
      businessName: string;
      contactEmail: string;
      contactPhone: string;
      location: Address;
      specialties: string[];
      verifiedAt: Date;
      verifiedBy: string;
      documentType: string;
      certificationsProvided: string[];
    }
  ) {
    super(artisanId, data);
  }
}

export class NewProductListedEvent extends DomainEvent {
  constructor(
    productId: string,
    data: {
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
    }
  ) {
    super(productId, data);
  }
}

export class ArtisanStatusChangedEvent extends DomainEvent {
  constructor(
    artisanId: string,
    data: {
      previousStatus: 'pending' | 'verified' | 'suspended' | 'inactive';
      newStatus: 'pending' | 'verified' | 'suspended' | 'inactive';
      reason: string;
      changedBy: string;
      changedAt: Date;
      effectiveDate?: Date;
      notificationSent: boolean;
    }
  ) {
    super(artisanId, data);
  }
}

// ========================================
// NOTIFICATION DOMAIN EVENTS
// ========================================

export class EmailSentEvent extends DomainEvent {
  constructor(
    notificationId: string,
    data: {
      recipientEmail: string;
      recipientName?: string;
      subject: string;
      template: string;
      variables: Record<string, any>;
      sentAt: Date;
      provider: string;
      messageId: string;
    }
  ) {
    super(notificationId, data);
  }
}

export class SMSSentEvent extends DomainEvent {
  constructor(
    notificationId: string,
    data: {
      recipientPhone: string;
      message: string;
      sentAt: Date;
      provider: string;
      messageId: string;
      cost?: number;
    }
  ) {
    super(notificationId, data);
  }
}

// ========================================
// ANALYTICS DOMAIN EVENTS
// ========================================

export class SalesRecordedEvent extends DomainEvent {
  constructor(
    recordId: string,
    data: {
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
    }
  ) {
    super(recordId, data);
  }
}

export class UserActionTrackedEvent extends DomainEvent {
  constructor(
    trackingId: string,
    data: {
      userId?: string;
      sessionId: string;
      action: string;
      page: string;
      category: string;
      properties: Record<string, any>;
      timestamp: Date;
      userAgent?: string;
      ipAddress?: string;
    }
  ) {
    super(trackingId, data);
  }
}

// ========================================
// LOYALTY DOMAIN EVENTS
// ========================================

export class PointsEarnedEvent extends DomainEvent {
  constructor(
    transactionId: string,
    data: {
      customerId: string;
      orderId?: string;
      pointsEarned: number;
      reason: string;
      multiplier?: number;
      campaignId?: string;
      earnedAt: Date;
      expiryDate?: Date;
    }
  ) {
    super(transactionId, data);
  }
}

export class PointsRedeemedEvent extends DomainEvent {
  constructor(
    redemptionId: string,
    data: {
      customerId: string;
      orderId?: string;
      pointsRedeemed: number;
      discountAmount: number;
      currency: string;
      redeemedAt: Date;
      remainingPoints: number;
    }
  ) {
    super(redemptionId, data);
  }
}

// ========================================
// GEO DOMAIN EVENTS
// ========================================

export class LocationUpdatedEvent extends DomainEvent {
  constructor(
    locationId: string,
    data: {
      entityType: 'user' | 'artisan' | 'delivery';
      entityId: string;
      previousLocation?: Address;
      newLocation: Address;
      accuracy?: number;
      updatedAt: Date;
      source: 'gps' | 'manual' | 'geocoding';
    }
  ) {
    super(locationId, data);
  }
}

// ========================================
// SYSTEM DOMAIN EVENTS
// ========================================

export class ServiceStartedEvent extends DomainEvent {
  constructor(
    serviceId: string,
    data: {
      serviceName: string;
      version: string;
      environment: string;
      startedAt: Date;
      hostname: string;
      port?: number;
      healthCheckUrl?: string;
    }
  ) {
    super(serviceId, data);
  }
}

export class ServiceErrorEvent extends DomainEvent {
  constructor(
    errorId: string,
    data: {
      serviceName: string;
      errorType: string;
      errorMessage: string;
      stackTrace?: string;
      context: Record<string, any>;
      severity: 'low' | 'medium' | 'high' | 'critical';
      occurredAt: Date;
      userId?: string;
      requestId?: string;
    }
  ) {
    super(errorId, data);
  }
}

// ========================================
// EVENT FACTORY FOR TYPE SAFETY
// ========================================

export class DomainEventFactory {
  static createOrderCreatedEvent(orderId: string, data: any): OrderCreatedEvent {
    return new OrderCreatedEvent(orderId, data);
  }

  static createStockReservedEvent(productId: string, data: any): StockReservedEvent {
    return new StockReservedEvent(productId, data);
  }

  static createPaymentSucceededEvent(paymentId: string, data: any): PaymentSucceededEvent {
    return new PaymentSucceededEvent(paymentId, data);
  }

  // Add more factory methods as needed...
}

// ========================================
// EVENT TYPE GUARDS
// ========================================

export function isOrderEvent(event: DomainEvent): boolean {
  return event.eventType.startsWith('Order');
}

export function isPaymentEvent(event: DomainEvent): boolean {
  return event.eventType.startsWith('Payment') || event.eventType.startsWith('Refund');
}

export function isInventoryEvent(event: DomainEvent): boolean {
  return event.eventType.startsWith('Stock') || event.eventType.includes('Stock');
}

export function isUserEvent(event: DomainEvent): boolean {
  return event.eventType.startsWith('User');
}

export function isNotificationEvent(event: DomainEvent): boolean {
  return event.eventType.startsWith('Email') || event.eventType.startsWith('SMS');
}

// ========================================
// EVENT VALIDATION
// ========================================

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
      errors
    };
  }

  // Add more validation methods...
}