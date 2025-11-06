import { DomainEvent } from '@a4co/shared-utils';
import { Money } from '../value-objects';

export class PaymentCreatedEvent extends DomainEvent {
  constructor(
    paymentId: string,
    data: {
      orderId: string;
      amount: Money;
      customerId: string;
      createdAt: Date;
    },
    sagaId?: string
  ) {
    super(paymentId, data, 1, sagaId);
  }
}

export class PaymentProcessingEvent extends DomainEvent {
  constructor(
    paymentId: string,
    data: {
      orderId: string;
      amount: Money;
      processedAt: Date;
    },
    sagaId?: string
  ) {
    super(paymentId, data, 1, sagaId);
  }
}

export class PaymentSucceededEvent extends DomainEvent {
  constructor(
    paymentId: string,
    data: {
      orderId: string;
      amount: Money;
      stripePaymentIntentId: string;
      succeededAt: Date;
    },
    sagaId?: string
  ) {
    super(paymentId, data, 1, sagaId);
  }
}

export class PaymentFailedEvent extends DomainEvent {
  constructor(
    paymentId: string,
    data: {
      orderId: string;
      amount: Money;
      reason: string;
      failedAt: Date;
    },
    sagaId?: string
  ) {
    super(paymentId, data, 1, sagaId);
  }
}

export class PaymentRefundedEvent extends DomainEvent {
  constructor(
    paymentId: string,
    data: {
      orderId: string;
      amount: Money;
      refundAmount: Money;
      refundedAt: Date;
    },
    sagaId?: string
  ) {
    super(paymentId, data, 1, sagaId);
  }
}
