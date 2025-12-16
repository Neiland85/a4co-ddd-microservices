# Payment Bounded Context

## Purpose and Scope

The Payment bounded context handles payment processing, refunds, and payment validation. It integrates with external payment providers (e.g., Stripe) and ensures payment transactions are properly tracked and managed.

## Key Aggregates/Entities

### Payment (Aggregate Root)
- **Identifier**: PaymentId
- **Main Properties**:
  - orderId: string
  - customerId: string
  - amount: Money
  - status: PaymentStatus
  - paymentMethodId: string (optional)
  - transactionId: string (optional)
  - createdAt: Date
  - updatedAt: Date

### Value Objects
- **PaymentId**: Unique identifier for a payment
- **PaymentStatus**: Current status (PENDING, PROCESSING, SUCCEEDED, FAILED, REFUNDED)

## Core Invariants/Business Rules

1. **Payment Creation**
   - Amount must be positive
   - Must be linked to a valid order
   - Initial status must be PENDING

2. **Status Transitions**
   - PENDING → PROCESSING (payment initiation)
   - PENDING → FAILED (immediate failure)
   - PROCESSING → SUCCEEDED (successful payment)
   - PROCESSING → FAILED (payment failure)
   - SUCCEEDED → REFUNDED (refund processed)
   - FAILED and REFUNDED are final states

3. **Refund Rules**
   - Can only refund SUCCEEDED payments
   - Refund amount cannot exceed original payment amount

## Main Domain Events and Flow

1. **PaymentSucceededV1** (`payment.succeeded.v1`)
   - Emitted when payment completes successfully
   - Triggers order confirmation
   - Contains: paymentId, orderId, amount, transactionId

2. **PaymentFailedV1** (`payment.failed.v1`)
   - Emitted when payment fails
   - Triggers order cancellation
   - Contains: paymentId, orderId, amount, reason, errorCode

## Related Contexts

- **Order**: Initiates payment requests and receives payment results
- **User**: Provides customer and payment method information
