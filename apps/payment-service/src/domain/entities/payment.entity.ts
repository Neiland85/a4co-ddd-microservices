import { AggregateRoot } from '@a4co/shared-utils';
import { PaymentId } from '../value-objects/payment-id.vo';
import { Money } from '../value-objects/money.vo';
import { StripePaymentIntent } from '../value-objects/stripe-payment-intent.vo';
import { PaymentStatus, PaymentStatusVO } from '../value-objects/payment-status.vo';
import {
  PaymentCreatedEvent,
  PaymentProcessingEvent,
  PaymentSucceededEvent,
  PaymentFailedEvent,
  PaymentRefundedEvent,
} from '../events/payment.events';

export interface PaymentProps {
  paymentId: PaymentId;
  orderId: string;
  amount: Money;
  status: PaymentStatusVO;
  stripePaymentIntentId: StripePaymentIntent | null;
  customerId: string;
  metadata?: Record<string, any>;
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Payment extends AggregateRoot {
  private _paymentId: PaymentId;
  private _orderId: string;
  private _amount: Money;
  private _status: PaymentStatusVO;
  private _stripePaymentIntentId: StripePaymentIntent | null;
  private _customerId: string;
  private _metadata: Record<string, any>;
  private _failureReason?: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: PaymentProps) {
    super(props.paymentId.toString());
    this._paymentId = props.paymentId;
    this._orderId = props.orderId;
    this._amount = props.amount;
    this._status = props.status;
    this._stripePaymentIntentId = props.stripePaymentIntentId;
    this._customerId = props.customerId;
    this._metadata = props.metadata || {};
    this._failureReason = props.failureReason;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(
    orderId: string,
    amount: Money,
    customerId: string,
    metadata?: Record<string, any>,
    sagaId?: string
  ): Payment {
    const paymentId = PaymentId.create();
    const payment = new Payment({
      paymentId,
      orderId,
      amount,
      status: PaymentStatusVO.create(PaymentStatus.PENDING),
      stripePaymentIntentId: null,
      customerId,
      metadata,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    payment.addDomainEvent(
      new PaymentCreatedEvent(paymentId.toString(), {
        orderId,
        amount: amount.toJSON(),
        customerId,
        createdAt: payment._createdAt,
      }, sagaId)
    );

    return payment;
  }

  static reconstitute(props: PaymentProps): Payment {
    return new Payment(props);
  }

  // Getters
  get paymentId(): PaymentId {
    return this._paymentId;
  }

  get orderId(): string {
    return this._orderId;
  }

  get amount(): Money {
    return this._amount;
  }

  get status(): PaymentStatusVO {
    return this._status;
  }

  get stripePaymentIntentId(): StripePaymentIntent | null {
    return this._stripePaymentIntentId;
  }

  get customerId(): string {
    return this._customerId;
  }

  get metadata(): Record<string, any> {
    return { ...this._metadata };
  }

  get failureReason(): string | undefined {
    return this._failureReason;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Domain methods
  process(sagaId?: string): void {
    if (!this._status.isPending()) {
      throw new Error(`Cannot process payment with status: ${this._status.toString()}`);
    }

    if (!this._status.canTransitionTo(PaymentStatus.PROCESSING)) {
      throw new Error(`Invalid status transition from ${this._status.toString()} to PROCESSING`);
    }

    this._status = PaymentStatusVO.create(PaymentStatus.PROCESSING);
    this._updatedAt = new Date();

    this.addDomainEvent(
      new PaymentProcessingEvent(this._paymentId.toString(), {
        orderId: this._orderId,
        amount: this._amount.toJSON(),
        startedAt: this._updatedAt,
      }, sagaId)
    );
  }

  markAsSucceeded(stripeIntentId: string, sagaId?: string): void {
    if (!this._status.isProcessing()) {
      throw new Error(`Cannot mark as succeeded payment with status: ${this._status.toString()}`);
    }

    if (!this._status.canTransitionTo(PaymentStatus.SUCCEEDED)) {
      throw new Error(`Invalid status transition from ${this._status.toString()} to SUCCEEDED`);
    }

    const stripePaymentIntent = StripePaymentIntent.create(stripeIntentId);
    this._stripePaymentIntentId = stripePaymentIntent;
    this._status = PaymentStatusVO.create(PaymentStatus.SUCCEEDED);
    this._updatedAt = new Date();

    this.addDomainEvent(
      new PaymentSucceededEvent(this._paymentId.toString(), {
        orderId: this._orderId,
        amount: this._amount.toJSON(),
        stripePaymentIntentId: stripeIntentId,
        succeededAt: this._updatedAt,
      }, sagaId)
    );
  }

  markAsFailed(reason: string, sagaId?: string): void {
    if (!this._status.isProcessing() && !this._status.isPending()) {
      throw new Error(`Cannot mark as failed payment with status: ${this._status.toString()}`);
    }

    if (!this._status.canTransitionTo(PaymentStatus.FAILED)) {
      throw new Error(`Invalid status transition from ${this._status.toString()} to FAILED`);
    }

    this._failureReason = reason;
    this._status = PaymentStatusVO.create(PaymentStatus.FAILED);
    this._updatedAt = new Date();

    this.addDomainEvent(
      new PaymentFailedEvent(this._paymentId.toString(), {
        orderId: this._orderId,
        amount: this._amount.toJSON(),
        reason,
        failedAt: this._updatedAt,
      }, sagaId)
    );
  }

  refund(stripeRefundId?: string, sagaId?: string): void {
    if (!this._status.isSucceeded()) {
      throw new Error(`Cannot refund payment with status: ${this._status.toString()}`);
    }

    if (!this._status.canTransitionTo(PaymentStatus.REFUNDED)) {
      throw new Error(`Invalid status transition from ${this._status.toString()} to REFUNDED`);
    }

    this._status = PaymentStatusVO.create(PaymentStatus.REFUNDED);
    this._updatedAt = new Date();

    if (stripeRefundId) {
      this._metadata = {
        ...this._metadata,
        stripeRefundId,
        refundedAt: this._updatedAt.toISOString(),
      };
    }

    this.addDomainEvent(
      new PaymentRefundedEvent(this._paymentId.toString(), {
        orderId: this._orderId,
        refundAmount: this._amount.toJSON(),
        originalAmount: this._amount.toJSON(),
        stripeRefundId,
        refundedAt: this._updatedAt,
      }, sagaId)
    );
  }

  cancel(sagaId?: string): void {
    if (!this._status.isPending()) {
      throw new Error(`Cannot cancel payment with status: ${this._status.toString()}`);
    }

    if (!this._status.canTransitionTo(PaymentStatus.CANCELLED)) {
      throw new Error(`Invalid status transition from ${this._status.toString()} to CANCELLED`);
    }

    this._status = PaymentStatusVO.create(PaymentStatus.CANCELLED);
    this._updatedAt = new Date();
  }

  updateMetadata(metadata: Record<string, any>): void {
    this._metadata = {
      ...this._metadata,
      ...metadata,
    };
    this._updatedAt = new Date();
  }

  canBeRefunded(): boolean {
    return this._status.isSucceeded();
  }

  isFinal(): boolean {
    return this._status.isFinal();
  }
}
