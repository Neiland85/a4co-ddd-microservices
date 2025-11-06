import { AggregateRoot } from '../base-classes';
import {
  PaymentId,
  Money,
  StripePaymentIntent,
  PaymentStatus,
  PaymentStatusVO,
} from '../value-objects';
import {
  PaymentCreatedEvent,
  PaymentProcessingEvent,
  PaymentSucceededEvent,
  PaymentFailedEvent,
  PaymentRefundedEvent,
} from '../events';

export interface PaymentProps {
  paymentId?: PaymentId;
  orderId: string;
  amount: Money;
  customerId: string;
  status?: PaymentStatus;
  stripePaymentIntentId?: string | null;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Payment extends AggregateRoot {
  private _paymentId: PaymentId;
  private _orderId: string;
  private _amount: Money;
  private _customerId: string;
  private _status: PaymentStatusVO;
  private _stripePaymentIntentId: string | null;
  private _metadata: Record<string, any>;
  private _failureReason: string | null = null;
  private _stripeRefundId: string | null = null;

  private constructor(props: PaymentProps) {
    super(
      props.paymentId?.value || PaymentId.generate().value,
      props.createdAt,
      props.updatedAt
    );
    this._paymentId = props.paymentId || PaymentId.generate();
    this._orderId = props.orderId;
    this._amount = props.amount;
    this._customerId = props.customerId;
    this._status = new PaymentStatusVO(props.status || PaymentStatus.PENDING);
    this._stripePaymentIntentId = props.stripePaymentIntentId || null;
    this._metadata = props.metadata || {};
  }

  static create(props: PaymentProps): Payment {
    // Validaciones de creación
    if (!props.orderId || props.orderId.trim().length === 0) {
      throw new Error('OrderId is required');
    }
    if (!props.customerId || props.customerId.trim().length === 0) {
      throw new Error('CustomerId is required');
    }

    const payment = new Payment(props);

    // Emitir evento de dominio
    payment.addDomainEvent(
      new PaymentCreatedEvent(
        payment._paymentId.value,
        payment._orderId,
        payment._amount,
        payment._customerId,
        payment._metadata
      )
    );

    return payment;
  }

  static reconstitute(props: PaymentProps & { paymentId: PaymentId }): Payment {
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

  get customerId(): string {
    return this._customerId;
  }

  get status(): PaymentStatus {
    return this._status.value;
  }

  get stripePaymentIntentId(): string | null {
    return this._stripePaymentIntentId;
  }

  get metadata(): Record<string, any> {
    return { ...this._metadata };
  }

  get failureReason(): string | null {
    return this._failureReason;
  }

  get stripeRefundId(): string | null {
    return this._stripeRefundId;
  }

  // Métodos de dominio
  process(): void {
    if (!this._status.isPending()) {
      throw new Error(`Cannot process payment. Current status: ${this._status.value}`);
    }

    this._status = this._status.transitionTo(PaymentStatus.PROCESSING);
    this.touch();

    this.addDomainEvent(
      new PaymentProcessingEvent(this._paymentId.value, this._orderId, '')
    );
  }

  markAsSucceeded(stripeIntentId: string): void {
    if (!this._status.isProcessing()) {
      throw new Error(`Cannot mark as succeeded. Current status: ${this._status.value}`);
    }

    const stripeIntent = StripePaymentIntent.fromString(stripeIntentId);
    this._stripePaymentIntentId = stripeIntent.value;
    this._status = this._status.transitionTo(PaymentStatus.SUCCEEDED);
    this.touch();

    this.addDomainEvent(
      new PaymentSucceededEvent(
        this._paymentId.value,
        this._orderId,
        this._amount,
        stripeIntent.value,
        this._customerId,
        this._metadata
      )
    );
  }

  markAsFailed(reason: string): void {
    if (!this._status.isProcessing() && !this._status.isPending()) {
      throw new Error(`Cannot mark as failed. Current status: ${this._status.value}`);
    }

    this._failureReason = reason;
    this._status = this._status.transitionTo(PaymentStatus.FAILED);
    this.touch();

    this.addDomainEvent(
      new PaymentFailedEvent(
        this._paymentId.value,
        this._orderId,
        this._amount,
        reason,
        this._customerId,
        this._metadata
      )
    );
  }

  refund(stripeRefundId: string, reason?: string): void {
    if (!this._status.isSucceeded()) {
      throw new Error(`Cannot refund payment. Current status: ${this._status.value}`);
    }

    this._stripeRefundId = stripeRefundId;
    this._status = this._status.transitionTo(PaymentStatus.REFUNDED);
    this.touch();

    // Calcular monto de reembolso (por ahora, reembolso completo)
    const refundAmount = this._amount;

    this.addDomainEvent(
      new PaymentRefundedEvent(
        this._paymentId.value,
        this._orderId,
        this._amount,
        refundAmount,
        stripeRefundId,
        reason
      )
    );
  }

  cancel(): void {
    if (!this._status.isPending()) {
      throw new Error(`Cannot cancel payment. Current status: ${this._status.value}`);
    }

    this._status = this._status.transitionTo(PaymentStatus.CANCELLED);
    this.touch();
  }

  updateMetadata(metadata: Record<string, any>): void {
    this._metadata = { ...this._metadata, ...metadata };
    this.touch();
  }

  canBeProcessed(): boolean {
    return this._status.isPending();
  }

  canBeRefunded(): boolean {
    return this._status.isSucceeded();
  }

  isFinal(): boolean {
    return this._status.isFinal();
  }
}
