import { DomainEvent } from '../base-classes';
import { Money } from '../value-objects';

export class PaymentCreatedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly orderId: string,
    public readonly amount: Money,
    public readonly customerId: string,
    public readonly metadata?: Record<string, any>
  ) {
    super(aggregateId, 'payment.created', {
      orderId,
      amount: amount.toJSON(),
      customerId,
      metadata,
      timestamp: new Date().toISOString(),
    });
  }

  eventType(): string {
    return 'payment.created';
  }
}

export class PaymentProcessingEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly orderId: string,
    public readonly stripePaymentIntentId: string
  ) {
    super(aggregateId, 'payment.processing', {
      orderId,
      stripePaymentIntentId,
      timestamp: new Date().toISOString(),
    });
  }

  eventType(): string {
    return 'payment.processing';
  }
}

export class PaymentSucceededEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly orderId: string,
    public readonly amount: Money,
    public readonly stripePaymentIntentId: string,
    public readonly customerId: string,
    public readonly metadata?: Record<string, any>
  ) {
    super(aggregateId, 'payment.succeeded', {
      orderId,
      amount: amount.toJSON(),
      stripePaymentIntentId,
      customerId,
      metadata,
      timestamp: new Date().toISOString(),
    });
  }

  eventType(): string {
    return 'payment.succeeded';
  }
}

export class PaymentFailedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly orderId: string,
    public readonly amount: Money,
    public readonly reason: string,
    public readonly customerId: string,
    public readonly metadata?: Record<string, any>
  ) {
    super(aggregateId, 'payment.failed', {
      orderId,
      amount: amount.toJSON(),
      reason,
      customerId,
      metadata,
      timestamp: new Date().toISOString(),
    });
  }

  eventType(): string {
    return 'payment.failed';
  }
}

export class PaymentRefundedEvent extends DomainEvent {
  constructor(
    aggregateId: string,
    public readonly orderId: string,
    public readonly amount: Money,
    public readonly refundAmount: Money,
    public readonly stripeRefundId: string,
    public readonly reason?: string
  ) {
    super(aggregateId, 'payment.refunded', {
      orderId,
      amount: amount.toJSON(),
      refundAmount: refundAmount.toJSON(),
      stripeRefundId,
      reason,
      timestamp: new Date().toISOString(),
    });
  }

  eventType(): string {
    return 'payment.refunded';
  }
}
