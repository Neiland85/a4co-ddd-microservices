import { AggregateRoot } from '@a4co/shared-utils';
import { PaymentId } from './value-objects/payment-id.vo';
import { Money } from './value-objects/money.vo';
import { StripePaymentIntent } from './value-objects/stripe-payment-intent.vo';
import { PaymentStatus, PaymentStatusVO } from './value-objects/payment-status.vo';
import {
  PaymentCreatedEvent,
  PaymentProcessingEvent,
  PaymentSucceededEvent,
  PaymentFailedEvent,
  PaymentRefundedEvent,
} from './events/payment.events';

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
  private _stripeRefundId: string | null;

  private constructor(props: PaymentProps) {
    super(props.paymentId?.toString() || PaymentId.generate().toString());
    
    this._paymentId = props.paymentId || PaymentId.generate();
    this._orderId = props.orderId;
    this._amount = props.amount;
    this._customerId = props.customerId;
    this._status = props.status 
      ? PaymentStatusVO.fromString(props.status)
      : new PaymentStatusVO(PaymentStatus.PENDING);
    this._stripePaymentIntentId = props.stripePaymentIntentId || null;
    this._metadata = props.metadata || {};
    this._stripeRefundId = null;

    // Emitir evento de creación solo si es nuevo
    if (!props.paymentId) {
      this.addDomainEvent(
        new PaymentCreatedEvent(this._paymentId, {
          orderId: this._orderId,
          amount: {
            amount: this._amount.amount,
            currency: this._amount.currency,
          },
          customerId: this._customerId,
          createdAt: props.createdAt || new Date(),
        })
      );
    }
  }

  // Factory method
  static create(props: PaymentProps): Payment {
    // Validaciones de dominio
    if (!props.orderId || !props.orderId.trim()) {
      throw new Error('OrderId is required');
    }
    if (!props.customerId || !props.customerId.trim()) {
      throw new Error('CustomerId is required');
    }

    return new Payment(props);
  }

  // Factory method para reconstruir desde persistencia
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
    return this._status.getValue();
  }

  get stripePaymentIntentId(): string | null {
    return this._stripePaymentIntentId;
  }

  get metadata(): Record<string, any> {
    return { ...this._metadata };
  }

  get stripeRefundId(): string | null {
    return this._stripeRefundId;
  }

  // Métodos de dominio
  process(): void {
    if (!this._status.isPending()) {
      throw new Error(`Cannot process payment in status: ${this._status.getValue()}`);
    }

    this._status = this._status.transitionTo(PaymentStatus.PROCESSING);
    this.touch();

    this.addDomainEvent(
      new PaymentProcessingEvent(this._paymentId, {
        orderId: this._orderId,
        amount: {
          amount: this._amount.amount,
          currency: this._amount.currency,
        },
        stripePaymentIntentId: this._stripePaymentIntentId || undefined,
        processedAt: new Date(),
      })
    );
  }

  markAsSucceeded(stripeIntentId: string): void {
    if (!this._status.isProcessing()) {
      throw new Error(`Cannot mark as succeeded from status: ${this._status.getValue()}`);
    }

    const stripeIntent = StripePaymentIntent.fromString(stripeIntentId);
    this._stripePaymentIntentId = stripeIntent.toString();
    this._status = this._status.transitionTo(PaymentStatus.SUCCEEDED);
    this.touch();

    this.addDomainEvent(
      new PaymentSucceededEvent(this._paymentId, {
        orderId: this._orderId,
        amount: {
          amount: this._amount.amount,
          currency: this._amount.currency,
        },
        stripePaymentIntentId: this._stripePaymentIntentId,
        customerId: this._customerId,
        succeededAt: new Date(),
      })
    );
  }

  markAsFailed(reason: string): void {
    if (!this._status.canTransitionTo(PaymentStatus.FAILED)) {
      throw new Error(`Cannot mark as failed from status: ${this._status.getValue()}`);
    }

    if (!reason || !reason.trim()) {
      throw new Error('Failure reason is required');
    }

    this._status = this._status.transitionTo(PaymentStatus.FAILED);
    this.touch();

    this.addDomainEvent(
      new PaymentFailedEvent(this._paymentId, {
        orderId: this._orderId,
        amount: {
          amount: this._amount.amount,
          currency: this._amount.currency,
        },
        reason,
        stripePaymentIntentId: this._stripePaymentIntentId || undefined,
        failedAt: new Date(),
      })
    );
  }

  refund(stripeRefundId: string, refundAmount?: Money, reason?: string): void {
    if (!this._status.isSucceeded()) {
      throw new Error(`Cannot refund payment in status: ${this._status.getValue()}`);
    }

    if (!stripeRefundId || !stripeRefundId.trim()) {
      throw new Error('Stripe refund ID is required');
    }

    const actualRefundAmount = refundAmount || this._amount;
    
    if (actualRefundAmount.isGreaterThan(this._amount)) {
      throw new Error('Refund amount cannot exceed payment amount');
    }

    this._stripeRefundId = stripeRefundId;
    this._status = this._status.transitionTo(PaymentStatus.REFUNDED);
    this.touch();

    this.addDomainEvent(
      new PaymentRefundedEvent(this._paymentId, {
        orderId: this._orderId,
        amount: {
          amount: this._amount.amount,
          currency: this._amount.currency,
        },
        refundAmount: {
          amount: actualRefundAmount.amount,
          currency: actualRefundAmount.currency,
        },
        stripeRefundId,
        reason,
        refundedAt: new Date(),
      })
    );
  }

  cancel(): void {
    if (this._status.isFinal()) {
      throw new Error(`Cannot cancel payment in final status: ${this._status.getValue()}`);
    }

    this._status = this._status.transitionTo(PaymentStatus.CANCELLED);
    this.touch();
  }

  updateMetadata(metadata: Record<string, any>): void {
    if (this._status.isFinal()) {
      throw new Error('Cannot update metadata of payment in final status');
    }
    this._metadata = { ...this._metadata, ...metadata };
    this.touch();
  }

  canBeRefunded(): boolean {
    return this._status.isSucceeded() && !this._status.isRefunded();
  }

  isFinal(): boolean {
    return this._status.isFinal();
  }
}
