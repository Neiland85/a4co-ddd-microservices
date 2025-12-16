import { AggregateRoot } from '@a4co/shared-utils';
import { Money } from '../../common/value-objects/money.vo.js';
import { PaymentId } from '../value-objects/payment-id.vo.js';
import { PaymentStatus, PaymentStatusValue } from '../value-objects/payment-status.vo.js';

/**
 * Payment Entity (Aggregate Root)
 * Represents a payment transaction for an order.
 * Manages payment lifecycle from creation through success/failure/refund.
 */
export class Payment extends AggregateRoot {
  private _paymentId: PaymentId;
  private _orderId: string;
  private _customerId: string;
  private _amount: Money;
  private _status: PaymentStatus;
  private _stripePaymentIntentId: string | null;
  private _metadata: Record<string, any>;

  private constructor(
    paymentId: PaymentId,
    orderId: string,
    customerId: string,
    amount: Money,
    status: PaymentStatus,
    stripePaymentIntentId: string | null = null,
    metadata: Record<string, any> = {},
  ) {
    super(paymentId.value);
    this._paymentId = paymentId;
    this._orderId = orderId;
    this._customerId = customerId;
    this._amount = amount;
    this._status = status;
    this._stripePaymentIntentId = stripePaymentIntentId;
    this._metadata = metadata;
  }

  /**
   * Create a new Payment
   */
  public static create(
    orderId: string,
    customerId: string,
    amount: Money,
    paymentId?: PaymentId,
    metadata?: Record<string, any>,
  ): Payment {
    if (!orderId || orderId.trim().length === 0) {
      throw new Error('Order ID cannot be empty');
    }

    if (!customerId || customerId.trim().length === 0) {
      throw new Error('Customer ID cannot be empty');
    }

    const id = paymentId || PaymentId.create();
    const status = PaymentStatus.create(PaymentStatusValue.PENDING);

    return new Payment(
      id,
      orderId,
      customerId,
      amount,
      status,
      null,
      metadata || {},
    );
  }

  /**
   * Rehydrate Payment from persistence
   */
  public static rehydrate(
    paymentId: string,
    orderId: string,
    customerId: string,
    amount: Money,
    status: PaymentStatusValue,
    stripePaymentIntentId: string | null,
    metadata: Record<string, any>,
  ): Payment {
    return new Payment(
      PaymentId.create(paymentId),
      orderId,
      customerId,
      amount,
      PaymentStatus.create(status),
      stripePaymentIntentId,
      metadata,
    );
  }

  // Getters
  public get paymentId(): PaymentId {
    return this._paymentId;
  }

  public get orderId(): string {
    return this._orderId;
  }

  public get customerId(): string {
    return this._customerId;
  }

  public get amount(): Money {
    return this._amount;
  }

  public get status(): PaymentStatus {
    return this._status;
  }

  public get stripePaymentIntentId(): string | null {
    return this._stripePaymentIntentId;
  }

  public get metadata(): Record<string, any> {
    return { ...this._metadata };
  }

  // Business logic methods

  /**
   * Mark payment as processing
   */
  public process(): void {
    if (this._status.isProcessing()) {
      return; // Idempotent
    }

    this._status = this._status.transitionTo(PaymentStatusValue.PROCESSING);
    this.touch();
  }

  /**
   * Mark payment as succeeded
   */
  public markAsSucceeded(stripePaymentIntentId: string): void {
    if (this._status.isSucceeded() && this._stripePaymentIntentId === stripePaymentIntentId) {
      return; // Idempotent
    }

    this._status = this._status.transitionTo(PaymentStatusValue.SUCCEEDED);
    this._stripePaymentIntentId = stripePaymentIntentId;
    this.touch();
  }

  /**
   * Mark payment as failed
   */
  public markAsFailed(reason: string): void {
    if (this._status.isFinal()) {
      return; // Idempotent for final states
    }

    this._status = this._status.transitionTo(PaymentStatusValue.FAILED);
    this._metadata = { ...this._metadata, failureReason: reason };
    this.touch();
  }

  /**
   * Refund the payment
   */
  public refund(reason?: string): void {
    if (this._status.value === PaymentStatusValue.REFUNDED) {
      return; // Idempotent
    }

    this._status = this._status.transitionTo(PaymentStatusValue.REFUNDED);
    if (reason) {
      this._metadata = { ...this._metadata, refundReason: reason };
    }
    this.touch();
  }

  /**
   * Update payment metadata
   */
  public updateMetadata(metadata: Record<string, any>): void {
    this._metadata = { ...this._metadata, ...metadata };
    this.touch();
  }

  /**
   * Serialize to primitives
   */
  public toPrimitives() {
    return {
      id: this._paymentId.value,
      orderId: this._orderId,
      customerId: this._customerId,
      amount: this._amount.toPrimitives(),
      status: this._status.value,
      stripePaymentIntentId: this._stripePaymentIntentId,
      metadata: { ...this._metadata },
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
