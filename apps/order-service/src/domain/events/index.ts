import { DomainEvent } from '../base-classes';
import { OrderStatusEnum } from '../aggregates/order.aggregate';

export interface OrderCreatedEventProps {
  orderId: string;
  customerId: string;
  items: Array<{ productId: string; quantity: number; unitPrice: number; currency: string }>;
  totalAmount: number;
  timestamp?: Date;
}

export class OrderCreatedEvent extends DomainEvent {
  public readonly eventType = 'orders.created';

  constructor(private readonly props: OrderCreatedEventProps) {
    super(props.orderId, 'orders.created');
  }

  toJSON() {
    return {
      orderId: this.props.orderId,
      customerId: this.props.customerId,
      items: this.props.items,
      totalAmount: this.props.totalAmount,
      timestamp: (this.props.timestamp ?? this.occurredOn).toISOString(),
    };
  }
}

export interface OrderStatusChangedEventProps {
  orderId: string;
  oldStatus: OrderStatusEnum;
  newStatus: OrderStatusEnum;
  timestamp?: Date;
}

export class OrderStatusChangedEvent extends DomainEvent {
  public readonly eventType = 'orders.status_changed';

  constructor(private readonly props: OrderStatusChangedEventProps) {
    super(props.orderId, 'orders.status_changed');
  }

  toJSON() {
    return {
      orderId: this.props.orderId,
      oldStatus: this.props.oldStatus,
      newStatus: this.props.newStatus,
      timestamp: (this.props.timestamp ?? this.occurredOn).toISOString(),
    };
  }
}

export interface OrderCancelledEventProps {
  orderId: string;
  reason: string;
  timestamp?: Date;
}

export class OrderCancelledEvent extends DomainEvent {
  public readonly eventType = 'orders.cancelled';

  constructor(private readonly props: OrderCancelledEventProps) {
    super(props.orderId, 'orders.cancelled');
  }

  toJSON() {
    return {
      orderId: this.props.orderId,
      reason: this.props.reason,
      timestamp: (this.props.timestamp ?? this.occurredOn).toISOString(),
    };
  }
}

export interface OrderCompletedEventProps {
  orderId: string;
  customerId: string;
  totalAmount: number;
  paymentId?: string;
  items: Array<{ productId: string; quantity: number; unitPrice: number; currency: string }>;
  timestamp?: Date;
}

export class OrderCompletedEvent extends DomainEvent {
  public readonly eventType = 'orders.completed';

  constructor(private readonly props: OrderCompletedEventProps) {
    super(props.orderId, 'orders.completed');
  }

  toJSON() {
    return {
      orderId: this.props.orderId,
      customerId: this.props.customerId,
      totalAmount: this.props.totalAmount,
      paymentId: this.props.paymentId,
      items: this.props.items,
      timestamp: (this.props.timestamp ?? this.occurredOn).toISOString(),
    };
  }
}

export interface OrderFailedEventProps {
  orderId: string;
  reason: string;
  timestamp?: Date;
}

export class OrderFailedEvent extends DomainEvent {
  public readonly eventType = 'orders.failed';

  constructor(private readonly props: OrderFailedEventProps) {
    super(props.orderId, 'orders.failed');
  }

  toJSON() {
    return {
      orderId: this.props.orderId,
      reason: this.props.reason,
      timestamp: (this.props.timestamp ?? this.occurredOn).toISOString(),
    };
  }
}
