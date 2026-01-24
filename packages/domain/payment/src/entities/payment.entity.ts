private constructor(props: PaymentProps, timestamps: PaymentTimestamps = {}) {
  super(props.paymentId.value, timestamps.createdAt, timestamps.updatedAt);

  this._paymentId = props.paymentId;
  this._orderId = props.orderId;
  this._amount = props.amount;
  this._customerId = props.customerId;
  this._status = props.status;
  this._stripePaymentIntentId = props.stripePaymentIntentId;
  this._metadata = { ...props.metadata };
}
