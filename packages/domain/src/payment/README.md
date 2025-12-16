# Payment Bounded Context

## Purpose
The Payment bounded context manages payment transactions for orders, handling the complete lifecycle from creation through processing, success, failure, or refund. It integrates with Stripe for payment processing.

## Ubiquitous Language

- **Payment**: A financial transaction for an order
- **Payment Status**: Current state of the payment (Pending, Processing, Succeeded, Failed, Refunded)
- **Payment Intent**: Stripe's representation of a payment transaction
- **Refund**: Reversal of a successful payment
- **Payment Amount**: Money value with currency

## Key Aggregates

### Payment (Aggregate Root)
The main aggregate managing payment transactions and state transitions.

**Invariants:**
- Payment amount must be positive
- Payment status transitions must follow valid paths
- Succeeded payments can only transition to Refunded
- Final states (Failed, Refunded) cannot transition further
- Stripe payment intent ID required for successful payments

**Properties:**
- `paymentId`: Unique identifier
- `orderId`: Reference to the order
- `customerId`: Reference to the customer
- `amount`: Money value object
- `status`: Current payment status
- `stripePaymentIntentId`: Stripe transaction reference
- `metadata`: Additional payment information

## Value Objects

### PaymentId
Unique identifier for a payment (UUID).

### PaymentStatus
Enum representing payment lifecycle states:
- `PENDING`: Initial state, awaiting processing
- `PROCESSING`: Payment is being processed by Stripe
- `SUCCEEDED`: Payment completed successfully
- `FAILED`: Payment failed (insufficient funds, declined card, etc.)
- `REFUNDED`: Payment was reversed

**Valid Transitions:**
- PENDING → PROCESSING, FAILED
- PROCESSING → SUCCEEDED, FAILED
- SUCCEEDED → REFUNDED
- FAILED, REFUNDED → (terminal states)

### Money
Shared value object representing monetary amounts with currency.

## Domain Events

All events are versioned following the pattern `{context}.{event}.v{version}`:

### PaymentCreatedV1 (`payment.created.v1`)
Emitted when a new payment is created.

**Payload:**
- `paymentId`: Payment identifier
- `orderId`: Order identifier
- `customerId`: Customer identifier
- `amount`: Payment amount and currency
- `createdAt`: Timestamp

### PaymentSucceededV1 (`payment.succeeded.v1`)
Emitted when payment processing succeeds.

**Payload:**
- `paymentId`: Payment identifier
- `orderId`: Order identifier
- `customerId`: Customer identifier
- `amount`: Payment amount and currency
- `stripePaymentIntentId`: Stripe transaction reference
- `succeededAt`: Timestamp

### PaymentFailedV1 (`payment.failed.v1`)
Emitted when payment processing fails.

**Payload:**
- `paymentId`: Payment identifier
- `orderId`: Order identifier
- `customerId`: Customer identifier
- `amount`: Payment amount and currency
- `reason`: Failure reason
- `failedAt`: Timestamp

## Business Rules

1. **Payment Creation**
   - Must have valid order ID and customer ID
   - Amount must be positive with valid currency
   - Starts in PENDING status

2. **Payment Processing**
   - Can only process PENDING payments
   - Processing is idempotent
   - Requires integration with Stripe

3. **Status Transitions**
   - Must follow valid transition paths
   - Final states cannot transition
   - Succeeded payments require Stripe payment intent ID

4. **Payment Success**
   - Transitions from PROCESSING to SUCCEEDED
   - Stores Stripe payment intent ID
   - Idempotent with same intent ID

5. **Payment Failure**
   - Can fail from PENDING or PROCESSING
   - Records failure reason in metadata
   - Triggers order saga compensation

6. **Payment Refund**
   - Only SUCCEEDED payments can be refunded
   - Records refund reason in metadata
   - Cannot be reversed once refunded

## Repository Interface

`IPaymentRepository` defines the persistence contract:
- `save(payment)`: Persist payment changes
- `findById(paymentId)`: Retrieve payment by ID
- `findByOrderId(orderId)`: Get payment for an order
- `findByCustomerId(customerId)`: Get customer's payments
- `findByStatus(status)`: Query payments by status
- `exists(paymentId)`: Check payment existence

## Domain Services

Currently, no domain services are defined. Payment processing logic is handled in the application layer with Stripe integration.

## Integration Points

- **Order Context**: Payment status affects order lifecycle
- **Stripe**: External payment gateway integration
- **Notification Context**: Sends payment status updates
- **Saga Orchestration**: Payment success/failure triggers order state transitions

## Testing Strategy

Unit tests cover:
- Payment entity creation and validation
- Status transition logic
- Payment processing flow
- Business rule enforcement
- Idempotency handling
- Error scenarios
