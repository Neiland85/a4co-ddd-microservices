import { DomainEvent } from '@a4co/shared-utils';

export class PaymentCreatedEvent extends DomainEvent {
  constructor(
    paymentId: string,
    eventData: {
      orderId: string;
      amount: { amount: number; currency: string };
      customerId: string;
      createdAt: Date;
    },
    sagaId?: string
  ) {
    super(paymentId, eventData, 1, sagaId);
  }
}

export class PaymentProcessingEvent extends DomainEvent {
  constructor(
    paymentId: string,
    eventData: {
      orderId: string;
      amount: { amount: number; currency: string };
      stripePaymentIntentId?: string;
      startedAt: Date;
    },
    sagaId?: string
  ) {
    super(paymentId, eventData, 1, sagaId);
  }
}

export class PaymentSucceededEvent extends DomainEvent {
  constructor(
    paymentId: string,
    eventData: {
      orderId: string;
      amount: { amount: number; currency: string };
      stripePaymentIntentId: string;
      succeededAt: Date;
    },
    sagaId?: string
  ) {
    super(paymentId, eventData, 1, sagaId);
  }
}

export class PaymentFailedEvent extends DomainEvent {
  constructor(
    paymentId: string,
    eventData: {
      orderId: string;
      amount: { amount: number; currency: string };
      reason: string;
      failedAt: Date;
    },
    sagaId?: string
  ) {
    super(paymentId, eventData, 1, sagaId);
  }
}

export class PaymentRefundedEvent extends DomainEvent {
  constructor(
    paymentId: string,
    eventData: {
      orderId: string;
      refundAmount: { amount: number; currency: string };
      originalAmount: { amount: number; currency: string };
      stripeRefundId?: string;
      refundedAt: Date;
    },
    sagaId?: string
  ) {
    super(paymentId, eventData, 1, sagaId);
  }
}
