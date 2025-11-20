"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Payment = void 0;
const shared_utils_1 = require("@a4co/shared-utils");
const payment_id_vo_1 = require("../value-objects/payment-id.vo");
const money_vo_1 = require("../value-objects/money.vo");
const payment_status_vo_1 = require("../value-objects/payment-status.vo");
const stripe_payment_intent_vo_1 = require("../value-objects/stripe-payment-intent.vo");
const events_1 = require("../events");
class Payment extends shared_utils_1.AggregateRoot {
    constructor(props, timestamps = {}) {
        super(props.paymentId.value);
        this._paymentId = props.paymentId;
        this._orderId = props.orderId;
        this._amount = props.amount;
        this._customerId = props.customerId;
        this._status = props.status;
        this._stripePaymentIntentId = props.stripePaymentIntentId;
        this._metadata = { ...props.metadata };
        if (timestamps.createdAt) {
            this.createdAt = timestamps.createdAt;
        }
        if (timestamps.updatedAt) {
            this.updatedAt = timestamps.updatedAt;
        }
    }
    static create(props) {
        const paymentId = props.paymentId ?? payment_id_vo_1.PaymentId.create();
        const stripePaymentIntent = this.normalizeStripePaymentIntent(props.stripePaymentIntentId);
        const payment = new Payment({
            paymentId,
            orderId: Payment.ensureOrderId(props.orderId),
            amount: props.amount,
            customerId: Payment.ensureCustomerId(props.customerId),
            metadata: props.metadata ?? {},
            status: payment_status_vo_1.PaymentStatus.create(payment_status_vo_1.PaymentStatusValue.PENDING),
            stripePaymentIntentId: stripePaymentIntent,
        }, {});
        payment.recordDomainEvent(new events_1.PaymentCreatedEvent({
            paymentId: payment.paymentId.value,
            orderId: payment.orderId,
            customerId: payment.customerId,
            amount: payment.amount.toPrimitives(),
            metadata: payment.metadata,
            stripePaymentIntentId: payment.stripePaymentIntentId,
        }));
        return payment;
    }
    static rehydrate(primitives) {
        const payment = new Payment({
            paymentId: payment_id_vo_1.PaymentId.create(primitives.id),
            orderId: Payment.ensureOrderId(primitives.orderId),
            amount: money_vo_1.Money.fromPrimitives(primitives.amount),
            customerId: Payment.ensureCustomerId(primitives.customerId),
            metadata: primitives.metadata ?? {},
            status: payment_status_vo_1.PaymentStatus.create(primitives.status),
            stripePaymentIntentId: Payment.normalizeStripePaymentIntent(primitives.stripePaymentIntentId),
        }, {
            createdAt: primitives.createdAt,
            updatedAt: primitives.updatedAt,
        });
        return payment;
    }
    process() {
        if (this._status.value === payment_status_vo_1.PaymentStatusValue.PROCESSING) {
            return;
        }
        if (!this._status.canTransitionTo(payment_status_vo_1.PaymentStatusValue.PROCESSING)) {
            throw new Error(`Payment ${this._paymentId.value} cannot transition to PROCESSING from ${this._status.value}`);
        }
        this._status = this._status.transitionTo(payment_status_vo_1.PaymentStatusValue.PROCESSING);
        this.touch();
        this.recordDomainEvent(new events_1.PaymentProcessingEvent({
            paymentId: this.paymentId.value,
            orderId: this.orderId,
            customerId: this.customerId,
            amount: this.amount.toPrimitives(),
            metadata: this.metadata,
            stripePaymentIntentId: this.stripePaymentIntentId,
        }));
    }
    markAsSucceeded(stripePaymentIntentId) {
        if (this._status.value === payment_status_vo_1.PaymentStatusValue.SUCCEEDED) {
            if (this._stripePaymentIntentId?.value === stripePaymentIntentId) {
                return;
            }
            throw new Error('Payment already succeeded with a different Stripe payment intent id');
        }
        if (!this._status.canTransitionTo(payment_status_vo_1.PaymentStatusValue.SUCCEEDED)) {
            throw new Error(`Payment ${this._paymentId.value} cannot transition to SUCCEEDED from ${this._status.value}`);
        }
        this._stripePaymentIntentId = stripe_payment_intent_vo_1.StripePaymentIntent.create(stripePaymentIntentId);
        this._status = this._status.transitionTo(payment_status_vo_1.PaymentStatusValue.SUCCEEDED);
        this.touch();
        this.recordDomainEvent(new events_1.PaymentSucceededEvent({
            paymentId: this.paymentId.value,
            orderId: this.orderId,
            customerId: this.customerId,
            amount: this.amount.toPrimitives(),
            metadata: this.metadata,
            stripePaymentIntentId: this._stripePaymentIntentId.value,
        }));
    }
    markAsFailed(reason) {
        if (this._status.value === payment_status_vo_1.PaymentStatusValue.FAILED) {
            return;
        }
        if (this._status.value === payment_status_vo_1.PaymentStatusValue.SUCCEEDED) {
            throw new Error('Cannot mark a succeeded payment as failed');
        }
        this._status = this._status.transitionTo(payment_status_vo_1.PaymentStatusValue.FAILED);
        this.touch();
        this.recordDomainEvent(new events_1.PaymentFailedEvent({
            paymentId: this.paymentId.value,
            orderId: this.orderId,
            customerId: this.customerId,
            amount: this.amount.toPrimitives(),
            metadata: this.metadata,
            stripePaymentIntentId: this.stripePaymentIntentId,
            reason,
        }));
    }
    refund(refundAmount, reason) {
        if (this._status.value === payment_status_vo_1.PaymentStatusValue.REFUNDED) {
            return;
        }
        if (!this._status.canTransitionTo(payment_status_vo_1.PaymentStatusValue.REFUNDED)) {
            throw new Error(`Payment ${this._paymentId.value} cannot transition to REFUNDED from ${this._status.value}`);
        }
        const amountToRefund = refundAmount ?? this._amount;
        if (amountToRefund.currency !== this._amount.currency) {
            throw new Error('Refund currency must match original payment currency');
        }
        this._status = this._status.transitionTo(payment_status_vo_1.PaymentStatusValue.REFUNDED);
        this.touch();
        this.recordDomainEvent(new events_1.PaymentRefundedEvent({
            paymentId: this.paymentId.value,
            orderId: this.orderId,
            customerId: this.customerId,
            amount: this.amount.toPrimitives(),
            refundAmount: amountToRefund.toPrimitives(),
            metadata: { ...this.metadata, refundReason: reason },
            stripePaymentIntentId: this.stripePaymentIntentId,
        }));
    }
    updateMetadata(metadata) {
        this._metadata = { ...metadata };
        this.touch();
    }
    recordDomainEvent(event) {
        super.addDomainEvent(event);
    }
    get paymentId() {
        return this._paymentId;
    }
    get orderId() {
        return this._orderId;
    }
    get amount() {
        return this._amount;
    }
    get status() {
        return this._status;
    }
    get stripePaymentIntentId() {
        return this._stripePaymentIntentId?.value ?? null;
    }
    get customerId() {
        return this._customerId;
    }
    get metadata() {
        return { ...this._metadata };
    }
    toPrimitives() {
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
    static normalizeStripePaymentIntent(intent) {
        if (!intent) {
            return null;
        }
        if (intent instanceof stripe_payment_intent_vo_1.StripePaymentIntent) {
            return intent;
        }
        return stripe_payment_intent_vo_1.StripePaymentIntent.create(intent);
    }
    static ensureOrderId(orderId) {
        if (!orderId || typeof orderId !== 'string') {
            throw new Error('Order id must be a non-empty string');
        }
        return orderId.trim();
    }
    static ensureCustomerId(customerId) {
        if (!customerId || typeof customerId !== 'string') {
            throw new Error('Customer id must be a non-empty string');
        }
        return customerId.trim();
    }
}
exports.Payment = Payment;
//# sourceMappingURL=payment.entity.js.map