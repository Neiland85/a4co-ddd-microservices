import { AggregateRoot } from '@a4co/shared-utils';
import { v4 as uuidv4 } from 'uuid';
import { PaymentId, Money, StripePaymentIntent, PaymentStatus, PaymentStatusVO } from '../value-objects';
import {
  PaymentCreatedEvent,
  PaymentProcessingEvent,
  PaymentSucceededEvent,
  PaymentFailedEvent,
  PaymentRefundedEvent,
} from '../events';

export class Payment extends AggregateRoot {
  private _paymentId: PaymentId;
  private _orderId: string;
  private _amount: Money;
  private _status: PaymentStatusVO;
  private _stripePaymentIntentId: StripePaymentIntent | null;
  private _customerId: string;
  private _metadata: Record<string, any>;
  private _failureReason: string | null;

  private constructor(
    id: string,
    paymentId: PaymentId,
    orderId: string,
    amount: Money,
    customerId: string,
    status: PaymentStatusVO,
    stripePaymentIntentId: StripePaymentIntent | null = null,
    metadata: Record<string, any> = {},
    failureReason: string | null = null,
    createdAt?: Date,
    updatedAt?: Date
  ) {
    super(id);
    this._paymentId = paymentId;
    this._orderId = orderId;
    this._amount = amount;
    this._customerId = customerId;
    this._status = status;
    this._stripePaymentIntentId = stripePaymentIntentId;
    this._metadata = metadata;
    this._failureReason = failureReason;
    if (createdAt) {
      (this as any).createdAt = createdAt;
    }
    if (updatedAt) {
      (this as any).updatedAt = updatedAt;
    }
  }

  // Factory method para crear nuevo payment
  public static create(
    orderId: string,
    amount: Money,
    customerId: string,
    metadata: Record<string, any> = {},
    paymentId?: PaymentId,
    sagaId?: string
  ): Payment {
    if (!orderId || orderId.trim().length === 0) {
      throw new Error('OrderId cannot be empty');
    }
    if (!customerId || customerId.trim().length === 0) {
      throw new Error('CustomerId cannot be empty');
    }

    const id = paymentId?.value || uuidv4();
    const pId = paymentId || new PaymentId();
    const status = new PaymentStatusVO(PaymentStatus.PENDING);

    const payment = new Payment(
      id,
      pId,
      orderId,
      amount,
      customerId,
      status,
      null,
      metadata
    );

    // Emitir evento de dominio
    payment.addDomainEvent(
      new PaymentCreatedEvent(payment._paymentId.value, {
        orderId: payment._orderId,
        amount: payment._amount,
        customerId: payment._customerId,
        createdAt: payment.createdAt,
      }, sagaId)
    );

    return payment;
  }

  // Factory method para reconstruir desde persistencia
  public static reconstruct(
    id: string,
    paymentId: string,
    orderId: string,
    amount: number,
    currency: string,
    customerId: string,
    status: string,
    stripePaymentIntentId: string | null,
    metadata: Record<string, any>,
    failureReason: string | null,
    createdAt: Date,
    updatedAt: Date
  ): Payment {
    return new Payment(
      id,
      PaymentId.fromString(paymentId),
      orderId,
      new Money(amount, currency),
      customerId,
      PaymentStatusVO.fromString(status),
      stripePaymentIntentId ? StripePaymentIntent.fromString(stripePaymentIntentId) : null,
      metadata,
      failureReason,
      createdAt,
      updatedAt
    );
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

  get status(): PaymentStatus {
    return this._status.value;
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

  get failureReason(): string | null {
    return this._failureReason;
  }

  // Métodos de dominio
  public process(sagaId?: string): void {
    if (!this._status.canTransitionTo(PaymentStatus.PROCESSING)) {
      throw new Error(`Cannot transition from ${this._status.value} to PROCESSING`);
    }

    this._status = new PaymentStatusVO(PaymentStatus.PROCESSING);
    this.touch();

    this.addDomainEvent(
      new PaymentProcessingEvent(this._paymentId.value, {
        orderId: this._orderId,
        amount: this._amount,
        processedAt: new Date(),
      }, sagaId)
    );
  }

  public markAsSucceeded(stripeIntentId: string, sagaId?: string): void {
    if (!this._status.canTransitionTo(PaymentStatus.SUCCEEDED)) {
      throw new Error(`Cannot transition from ${this._status.value} to SUCCEEDED`);
    }

    const stripeIntent = StripePaymentIntent.fromString(stripeIntentId);
    this._stripePaymentIntentId = stripeIntent;
    this._status = new PaymentStatusVO(PaymentStatus.SUCCEEDED);
    this._failureReason = null;
    this.touch();

    this.addDomainEvent(
      new PaymentSucceededEvent(this._paymentId.value, {
        orderId: this._orderId,
        amount: this._amount,
        stripePaymentIntentId: stripeIntent.value,
        succeededAt: new Date(),
      }, sagaId)
    );
  }

  public markAsFailed(reason: string, sagaId?: string): void {
    if (!this._status.canTransitionTo(PaymentStatus.FAILED)) {
      throw new Error(`Cannot transition from ${this._status.value} to FAILED`);
    }

    if (!reason || reason.trim().length === 0) {
      throw new Error('Failure reason cannot be empty');
    }

    this._status = new PaymentStatusVO(PaymentStatus.FAILED);
    this._failureReason = reason;
    this.touch();

    this.addDomainEvent(
      new PaymentFailedEvent(this._paymentId.value, {
        orderId: this._orderId,
        amount: this._amount,
        reason,
        failedAt: new Date(),
      }, sagaId)
    );
  }

  public refund(refundAmount?: Money, sagaId?: string): void {
    if (!this._status.canTransitionTo(PaymentStatus.REFUNDED)) {
      throw new Error(`Cannot transition from ${this._status.value} to REFUNDED`);
    }

    if (this._status.value !== PaymentStatus.SUCCEEDED) {
      throw new Error('Can only refund succeeded payments');
    }

    if (!this._stripePaymentIntentId) {
      throw new Error('Cannot refund payment without Stripe Payment Intent ID');
    }

    const refund = refundAmount || this._amount;
    if (refund.isGreaterThan(this._amount)) {
      throw new Error('Refund amount cannot exceed payment amount');
    }

    this._status = new PaymentStatusVO(PaymentStatus.REFUNDED);
    this.touch();

    this.addDomainEvent(
      new PaymentRefundedEvent(this._paymentId.value, {
        orderId: this._orderId,
        amount: this._amount,
        refundAmount: refund,
        refundedAt: new Date(),
      }, sagaId)
    );
  }

  public updateMetadata(metadata: Record<string, any>): void {
    this._metadata = { ...this._metadata, ...metadata };
    this.touch();
  }

  public canBeRefunded(): boolean {
    return this._status.value === PaymentStatus.SUCCEEDED && 
           this._stripePaymentIntentId !== null;
  }

  public isFinal(): boolean {
    return this._status.isFinal();
  }

  // Método para obtener datos para persistencia
  public toPersistence(): {
    id: string;
    paymentId: string;
    orderId: string;
    amount: number;
    currency: string;
    customerId: string;
    status: string;
    stripePaymentIntentId: string | null;
    metadata: Record<string, any>;
    failureReason: string | null;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.id,
      paymentId: this._paymentId.value,
      orderId: this._orderId,
      amount: this._amount.amount,
      currency: this._amount.currency,
      customerId: this._customerId,
      status: this._status.value,
      stripePaymentIntentId: this._stripePaymentIntentId?.value || null,
      metadata: this._metadata,
      failureReason: this._failureReason,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
