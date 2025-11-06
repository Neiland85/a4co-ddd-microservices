import { DomainEvent } from '@a4co/shared-utils';
import { Money } from '../value-objects/money.vo';
import { PaymentId } from '../value-objects/payment-id.vo';

export class PaymentCreatedEvent extends DomainEvent {
  constructor(
    paymentId: PaymentId,
    data: {
      orderId: string;
      amount: { amount: number; currency: string };
      customerId: string;
      createdAt: Date;
    }
  ) {
    super(paymentId.toString(), data);
  }
}

export class PaymentProcessingEvent extends DomainEvent {
  constructor(
    paymentId: PaymentId,
    data: {
      orderId: string;
      amount: { amount: number; currency: string };
      stripePaymentIntentId?: string;
      processedAt: Date;
    }
  ) {
    super(paymentId.toString(), data);
  }
}

export class PaymentSucceededEvent extends DomainEvent {
  constructor(
    paymentId: PaymentId,
    data: {
      orderId: string;
      amount: { amount: number; currency: string };
      stripePaymentIntentId: string;
      customerId: string;
      succeededAt: Date;
    }
  ) {
    super(paymentId.toString(), data);
  }
}

export class PaymentFailedEvent extends DomainEvent {
  constructor(
    paymentId: PaymentId,
    data: {
      orderId: string;
      amount: { amount: number; currency: string };
      reason: string;
      stripePaymentIntentId?: string;
      failedAt: Date;
    }
  ) {
    super(paymentId.toString(), data);
  }
}

export class PaymentRefundedEvent extends DomainEvent {
  constructor(
    paymentId: PaymentId,
    data: {
      orderId: string;
      amount: { amount: number; currency: string };
      refundAmount: { amount: number; currency: string };
      stripeRefundId: string;
      reason?: string;
      refundedAt: Date;
    }
  ) {
    super(paymentId.toString(), data);
  }
}
