import { AggregateRoot, DomainEvent } from '@a4co/shared-utils';
import { PaymentId } from '../value-objects/payment-id.vo';
import { Money, MoneyPrimitives } from '../value-objects/money.vo';
import { PaymentStatus, PaymentStatusValue } from '../value-objects/payment-status.vo';
import { StripePaymentIntent } from '../value-objects/stripe-payment-intent.vo';
import {
  PaymentCreatedEvent,
  PaymentFailedEvent,
  PaymentProcessingEvent,
  PaymentRefundedEvent,
  PaymentSucceededEvent,
} from '../events';

export interface PaymentCreateProps {
  paymentId?: PaymentId;
  orderId: string;
  amount: Money;
  customerId: string;
  metadata?: Record<string, any>;
  stripePaymentIntentId?: StripePaymentIntent | string | null;
}

export interface PaymentPrimitives {
  id: string;
  orderId: string;
  amount: MoneyPrimitives;
  status: PaymentStatusValue;
  stripePaymentIntentId: string | null;
  customerId: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

interface PaymentProps {
  paymentId: PaymentId;
  orderId: string;
  amount: Money;
  customerId: string;
  metadata: Record<string, any>;
  status: PaymentStatus;
  stripePaymentIntentId: StripePaymentIntent | null;
}

interface PaymentTimestamps {
  createdAt?: Date;
  updatedAt?: Date;
}

export class Payment extends AggregateRoot {
  private _paymentId: PaymentId;
  private _orderId: string;
  private _amount: Money;
  private _status: PaymentStatus;
  private _stripePaymentIntentId: StripePaymentIntent | null;
  private _customerId: string;
  private _metadata: Record<string, any>;

  private constructor(props: PaymentProps, timestamps: PaymentTimestamps = {}) {
    super(props.paymentId.value);

    this._paymentId = props.paymentId;
    this._orderId = props.orderId;
    this._amount = props.amount;
    this._customerId = props.customerId;
    this._status = props.status;
    this._stripePaymentIntentId = props.stripePaymentIntentId;
    this._metadata = { ...props.metadata };

    if (timestamps.createdAt) {
      (this as any).createdAt = timestamps.createdAt;
    }

    if (timestamps.updatedAt) {
      this.updatedAt = timestamps.updatedAt;
    }
  }

  public static create(props: PaymentCreateProps): Payment {
    const paymentId = props.paymentId ?? PaymentId.create();
    const stripePaymentIntent = this.normalizeStripePaymentIntent(props.stripePaymentIntentId);
    const payment = new Payment(
      {
        paymentId,
        orderId: Payment.ensureOrderId(props.orderId),
        amount: props.amount,
        customerId: Payment.ensureCustomerId(props.customerId),
        metadata: props.metadata ?? {},
        status: PaymentStatus.create(PaymentStatusValue.PENDING),
        stripePaymentIntentId: stripePaymentIntent,
      },
      {},
    );

    payment.recordDomainEvent(
      new PaymentCreatedEvent({
        paymentId: payment.paymentId.value,
        orderId: payment.orderId,
        customerId: payment.customerId,
        amount: payment.amount.toPrimitives(),
        metadata: payment.metadata,
        stripePaymentIntentId: payment.stripePaymentIntentId,
      }),
    );

    return payment;
  }

  public static rehydrate(primitives: PaymentPrimitives): Payment {
    const payment = new Payment(
      {
        paymentId: PaymentId.create(primitives.id),
        orderId: Payment.ensureOrderId(primitives.orderId),
        amount: Money.fromPrimitives(primitives.amount),
        customerId: Payment.ensureCustomerId(primitives.customerId),
        metadata: primitives.metadata ?? {},
        status: PaymentStatus.create(primitives.status),
        stripePaymentIntentId: Payment.normalizeStripePaymentIntent(primitives.stripePaymentIntentId),
      },
      {
        createdAt: primitives.createdAt,
        updatedAt: primitives.updatedAt,
      },
    );

    return payment;
  }

  public process(): void {
    if (this._status.value === PaymentStatusValue.PROCESSING) {
      return; // Idempotent
    }

    if (!this._status.canTransitionTo(PaymentStatusValue.PROCESSING)) {
      throw new Error(`Payment ${this._paymentId.value} cannot transition to PROCESSING from ${this._status.value}`);
    }

    this._status = this._status.transitionTo(PaymentStatusValue.PROCESSING);
    this.touch();

    this.recordDomainEvent(
      new PaymentProcessingEvent({
        paymentId: this.paymentId.value,
        orderId: this.orderId,
        customerId: this.customerId,
        amount: this.amount.toPrimitives(),
        metadata: this.metadata,
        stripePaymentIntentId: this.stripePaymentIntentId,
      }),
    );
  }

  public markAsSucceeded(stripePaymentIntentId: string): void {
    if (this._status.value === PaymentStatusValue.SUCCEEDED) {
      if (this._stripePaymentIntentId?.value === stripePaymentIntentId) {
        return; // Idempotent success
      }

      throw new Error('Payment already succeeded with a different Stripe payment intent id');
    }

    if (!this._status.canTransitionTo(PaymentStatusValue.SUCCEEDED)) {
      throw new Error(`Payment ${this._paymentId.value} cannot transition to SUCCEEDED from ${this._status.value}`);
    }

    this._stripePaymentIntentId = StripePaymentIntent.create(stripePaymentIntentId);
    this._status = this._status.transitionTo(PaymentStatusValue.SUCCEEDED);
    this.touch();

    this.recordDomainEvent(
      new PaymentSucceededEvent({
        paymentId: this.paymentId.value,
        orderId: this.orderId,
        customerId: this.customerId,
        amount: this.amount.toPrimitives(),
        metadata: this.metadata,
        stripePaymentIntentId: this._stripePaymentIntentId.value,
      }),
    );
  }

  public markAsFailed(reason: string): void {
    if (this._status.value === PaymentStatusValue.FAILED) {
      return; // Idempotent failure
    }

    if (this._status.value === PaymentStatusValue.SUCCEEDED) {
      throw new Error('Cannot mark a succeeded payment as failed');
    }

    this._status = this._status.transitionTo(PaymentStatusValue.FAILED);
    this.touch();

    this.recordDomainEvent(
      new PaymentFailedEvent({
        paymentId: this.paymentId.value,
        orderId: this.orderId,
        customerId: this.customerId,
        amount: this.amount.toPrimitives(),
        metadata: this.metadata,
        stripePaymentIntentId: this.stripePaymentIntentId,
        reason,
      }),
    );
  }

  public refund(refundAmount?: Money): void {
    if (this._status.value === PaymentStatusValue.REFUNDED) {
      return; // Idempotent refund
    }

    if (!this._status.canTransitionTo(PaymentStatusValue.REFUNDED)) {
      throw new Error(`Payment ${this._paymentId.value} cannot transition to REFUNDED from ${this._status.value}`);
    }

    const amountToRefund = refundAmount ?? this._amount;

    if (amountToRefund.currency !== this._amount.currency) {
      throw new Error('Refund currency must match original payment currency');
    }

    this._status = this._status.transitionTo(PaymentStatusValue.REFUNDED);
    this.touch();

    this.recordDomainEvent(
      new PaymentRefundedEvent({
        paymentId: this.paymentId.value,
        orderId: this.orderId,
        customerId: this.customerId,
        amount: this.amount.toPrimitives(),
        refundAmount: amountToRefund.toPrimitives(),
        metadata: this.metadata,
        stripePaymentIntentId: this.stripePaymentIntentId,
      }),
    );
  }

  public updateMetadata(metadata: Record<string, any>): void {
    this._metadata = { ...metadata };
    this.touch();
  }

  private recordDomainEvent(event: DomainEvent): void {
    super.addDomainEvent(event);
  }

  public get paymentId(): PaymentId {
    return this._paymentId;
  }

  public get orderId(): string {
    return this._orderId;
  }

  public get amount(): Money {
    return this._amount;
  }

  public get status(): PaymentStatus {
    return this._status;
  }

  public get stripePaymentIntentId(): string | null {
    return this._stripePaymentIntentId?.value ?? null;
  }

  public get customerId(): string {
    return this._customerId;
  }

  public get metadata(): Record<string, any> {
    return { ...this._metadata };
  }

  public toPrimitives(): PaymentPrimitives {
    return {
      id: this._paymentId.value,
      orderId: this._orderId,
      amount: this._amount.toPrimitives(),
      status: this._status.value,
      stripePaymentIntentId: this._stripePaymentIntentId?.value ?? null,
      customerId: this._customerId,
      metadata: { ...this._metadata },
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  private static normalizeStripePaymentIntent(
    intent: StripePaymentIntent | string | null | undefined,
  ): StripePaymentIntent | null {
    if (!intent) {
      return null;
    }

    if (intent instanceof StripePaymentIntent) {
      return intent;
    }

    return StripePaymentIntent.create(intent);
  }

  private static ensureOrderId(orderId: string): string {
    if (!orderId || typeof orderId !== 'string') {
      throw new Error('Order id must be a non-empty string');
    }

    return orderId.trim();
  }

  private static ensureCustomerId(customerId: string): string {
    if (!customerId || typeof customerId !== 'string') {
      throw new Error('Customer id must be a non-empty string');
    }

    return customerId.trim();
  }
}

