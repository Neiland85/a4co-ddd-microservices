import { DomainEvent, EventMetadata } from './domain-event';

/**
 * Base data for order items
 */
export interface OrderItemData {
  productId: string;
  artisanId: string;
  quantity: number;
  unitPrice: number;
  productName: string;
  sku?: string;
}

/**
 * Address information
 */
export interface AddressData {
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

/**
 * Order Created Event
 * Published when a new order is placed
 */
export class OrderCreatedEvent extends DomainEvent<{
  customerId: string;
  items: OrderItemData[];
  totalAmount: number;
  subtotal: number;
  tax: number;
  shippingCost: number;
  deliveryAddress: AddressData;
  billingAddress?: AddressData;
  paymentMethodId: string;
  specialInstructions?: string;
  estimatedDeliveryDate?: Date;
  createdAt: Date;
}> {
  constructor(
    orderId: string,
    data: OrderCreatedEvent['data'],
    metadata?: Partial<EventMetadata>
  ) {
    super(orderId, 'OrderCreated', data, metadata);
  }

  getSubject(): string {
    return 'order.created';
  }

  validate(): boolean {
    return (
      this.data.customerId.length > 0 &&
      this.data.items.length > 0 &&
      this.data.totalAmount > 0 &&
      this.data.deliveryAddress.street.length > 0
    );
  }
}

/**
 * Order Status Changed Event
 * Published when order status is updated
 */
export class OrderStatusChangedEvent extends DomainEvent<{
  orderId: string;
  previousStatus: OrderStatus;
  newStatus: OrderStatus;
  reason?: string;
  changedBy: string;
  changedAt: Date;
  estimatedDeliveryDate?: Date;
  trackingNumber?: string;
}> {
  constructor(
    orderId: string,
    data: OrderStatusChangedEvent['data'],
    metadata?: Partial<EventMetadata>
  ) {
    super(orderId, 'OrderStatusChanged', data, metadata);
  }

  getSubject(): string {
    return 'order.status.changed';
  }

  validate(): boolean {
    return (
      this.data.orderId === this.aggregateId &&
      this.data.previousStatus !== this.data.newStatus
    );
  }
}

/**
 * Order Cancelled Event
 * Published when an order is cancelled
 */
export class OrderCancelledEvent extends DomainEvent<{
  orderId: string;
  reason: string;
  cancelledBy: string;
  cancelledAt: Date;
  refundRequired: boolean;
  refundAmount?: number;
  itemsToReturn?: Array<{
    productId: string;
    quantity: number;
  }>;
}> {
  constructor(
    orderId: string,
    data: OrderCancelledEvent['data'],
    metadata?: Partial<EventMetadata>
  ) {
    super(orderId, 'OrderCancelled', data, metadata);
  }

  getSubject(): string {
    return 'order.cancelled';
  }

  validate(): boolean {
    return (
      this.data.orderId === this.aggregateId &&
      this.data.reason.length > 0
    );
  }
}

/**
 * Order Delivered Event
 * Published when an order is successfully delivered
 */
export class OrderDeliveredEvent extends DomainEvent<{
  orderId: string;
  deliveredAt: Date;
  deliveredTo: string;
  deliveryLocation: AddressData;
  signatureUrl?: string;
  deliveryNotes?: string;
  deliveryPhotos?: string[];
}> {
  constructor(
    orderId: string,
    data: OrderDeliveredEvent['data'],
    metadata?: Partial<EventMetadata>
  ) {
    super(orderId, 'OrderDelivered', data, metadata);
  }

  getSubject(): string {
    return 'order.delivered';
  }

  validate(): boolean {
    return (
      this.data.orderId === this.aggregateId &&
      this.data.deliveredTo.length > 0
    );
  }
}

/**
 * Order Refunded Event
 * Published when an order refund is processed
 */
export class OrderRefundedEvent extends DomainEvent<{
  orderId: string;
  refundId: string;
  amount: number;
  reason: string;
  refundedItems?: Array<{
    productId: string;
    quantity: number;
    amount: number;
  }>;
  processedAt: Date;
}> {
  constructor(
    orderId: string,
    data: OrderRefundedEvent['data'],
    metadata?: Partial<EventMetadata>
  ) {
    super(orderId, 'OrderRefunded', data, metadata);
  }

  getSubject(): string {
    return 'order.refunded';
  }

  validate(): boolean {
    return (
      this.data.orderId === this.aggregateId &&
      this.data.amount > 0 &&
      this.data.refundId.length > 0
    );
  }
}

/**
 * Order status enumeration
 */
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  FAILED = 'failed'
}

/**
 * Factory for creating order events
 */
export class OrderEventFactory {
  static createOrderCreated(
    orderId: string,
    customerId: string,
    items: OrderItemData[],
    deliveryAddress: AddressData,
    paymentMethodId: string,
    metadata?: Partial<EventMetadata>
  ): OrderCreatedEvent {
    const subtotal = items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    const tax = subtotal * 0.21; // 21% IVA for Spain
    const shippingCost = 5.00; // Fixed shipping cost for demo
    const totalAmount = subtotal + tax + shippingCost;

    return new OrderCreatedEvent(
      orderId,
      {
        customerId,
        items,
        totalAmount,
        subtotal,
        tax,
        shippingCost,
        deliveryAddress,
        paymentMethodId,
        createdAt: new Date()
      },
      metadata
    );
  }

  static createStatusChanged(
    orderId: string,
    previousStatus: OrderStatus,
    newStatus: OrderStatus,
    changedBy: string,
    reason?: string,
    metadata?: Partial<EventMetadata>
  ): OrderStatusChangedEvent {
    return new OrderStatusChangedEvent(
      orderId,
      {
        orderId,
        previousStatus,
        newStatus,
        reason,
        changedBy,
        changedAt: new Date()
      },
      metadata
    );
  }
}