import { AggregateRoot } from '@a4co/shared-utils';
import { PaymentId } from '../value-objects/payment-id.vo';
import { Money, MoneyPrimitives } from '../value-objects/money.vo';
import { PaymentStatus, PaymentStatusValue } from '../value-objects/payment-status.vo';
import { StripePaymentIntent } from '../value-objects/stripe-payment-intent.vo';

import {
  PaymentCreatedEvent,
  PaymentProcessingEvent,
  PaymentSucceededEvent,
  PaymentFailedEvent,
  PaymentRefundedEvent,
} from '../events';

export interface PaymentCreateProps {
  orderId: string;
  amount: Money;
  customerId: string;
  metadata?: Record<string, unknown>;
  stripePaymentIntentId?: string | null;
}

export interface PaymentPrimitives {
  id: string;
  orderId: string;
  amount: MoneyPrimitives;
  status: PaymentStatusValue;
  stripePaymentIntentId: string | null;
  customerId: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export class Payment extends AggregateRoot {
  private _status: PaymentStatus;
  private _stripePaymentIntentId: StripePaymentIntent | null;

  private constructor(
    private readonly _paymentId: PaymentId,
    private readonly _orderId: string,
    private readonly _amount: Money,
    private readonly _customerId: string,
    private readonly _metadata: Record<string, unknown>,
    status: PaymentStatus,
    stripePaymentIntentId: StripePaymentIntent | null,
  ) {
    super(_paymentId.value);
    this._status = status;
    this._stripePaymentIntentId = stripePaymentIntentId;
  }

  // -------- FACTORY --------

  static create(props: PaymentCreateProps): Payment {
    const payment = new Payment(
      PaymentId.create(),
      props.orderId,
      props.amount,
      props.customerId,
      props.metadata ?? {},
      PaymentStatus.create(PaymentStatusValue.PENDING),
      props.stripePaymentIntentId ? StripePaymentIntent.create(props.stripePaymentIntentId) : null,
    );

    payment.addDomainEvent(
      new PaymentCreatedEvent({
        paymentId: payment.id,
        orderId: payment.orderId,
        customerId: payment.customerId,
        amount: payment.amount.toPrimitives(),
        metadata: payment.metadata,
        stripePaymentIntentId: payment.stripePaymentIntentId,
      }),
    );

    return payment;
  }

  // -------- BEHAVIOUR --------

  process(): void {
    this._status = this._status.transitionTo(PaymentStatusValue.PROCESSING);
    this.touch();

    this.addDomainEvent(
      new PaymentProcessingEvent({
        paymentId: this.id,
        orderId: this.orderId,
        customerId: this.customerId,
        amount: this.amount.toPrimitives(),
        metadata: this.metadata,
        stripePaymentIntentId: this.stripePaymentIntentId,
      }),
    );
  }

  succeed(stripePaymentIntentId: string): void {
    this._status = this._status.transitionTo(PaymentStatusValue.SUCCEEDED);
    this._stripePaymentIntentId = StripePaymentIntent.create(stripePaymentIntentId);
    this.touch();

    this.addDomainEvent(
      new PaymentSucceededEvent({
        paymentId: this.id,
        orderId: this.orderId,
        customerId: this.customerId,
        amount: this.amount.toPrimitives(),
        metadata: this.metadata,
        stripePaymentIntentId,
      }),
    );
  }

  fail(reason: string): void {
    this._status = this._status.transitionTo(PaymentStatusValue.FAILED);
    this.touch();

    this.addDomainEvent(
      new PaymentFailedEvent({
        paymentId: this.id,
        orderId: this.orderId,
        customerId: this.customerId,
        amount: this.amount.toPrimitives(),
        metadata: this.metadata,
        stripePaymentIntentId: this.stripePaymentIntentId,
        reason,
      }),
    );
  }

  refund(amount?: Money, reason?: string): void {
    const refundAmount = amount ?? this._amount;

    this._status = this._status.transitionTo(PaymentStatusValue.REFUNDED);
    this.touch();

    this.addDomainEvent(
      new PaymentRefundedEvent({
        paymentId: this.id,
        orderId: this.orderId,
        customerId: this.customerId,
        amount: this.amount.toPrimitives(),
        refundAmount: refundAmount.toPrimitives(),
        stripePaymentIntentId: this.stripePaymentIntentId,
        metadata: { reason },
      }),
    );
  }

  // -------- GETTERS (única forma válida de acceso) --------

  get id(): string {
    return this._paymentId.value;
  }

  get orderId(): string {
    return this._orderId;
  }

  get customerId(): string {
    return this._customerId;
  }

  get amount(): Money {
    return this._amount;
  }

  get metadata(): Record<string, unknown> {
    return this._metadata;
  }

  get stripePaymentIntentId(): string | null {
    return this._stripePaymentIntentId?.value ?? null;
  }

  get status(): PaymentStatusValue {
    return this._status.value;
  }

  // -------- SERIALIZATION --------

  toPrimitives(): PaymentPrimitives {
    return {
      id: this.id,
      orderId: this.orderId,
      amount: this.amount.toPrimitives(),
      status: this.status,
      stripePaymentIntentId: this.stripePaymentIntentId,
      customerId: this.customerId,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
