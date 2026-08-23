# Event-Driven Microservices Flow with NATS and Saga Pattern

## 🎯 Overview

This implementation demonstrates a complete event-driven architecture for order processing using NATS message broker and the Saga pattern for distributed transaction management.

## 🏗️ Architecture

### Services

1. **Order Service** (Port 3004) - Order management
2. **Payment Service** (Port 3006) - Payment processing with 90% success simulation
3. **Inventory Service** (Port 3006) - Stock reservation and management
4. **NATS Server** (Port 4222) - Message broker with JetStream

### Event Flow Diagram

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ POST /orders
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Order Service                             │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ 1. Create Order (status: PENDING)                      │     │
│  │ 2. Save to database                                     │     │
│  │ 3. Emit: OrderCreatedV1Event                           │     │
│  │    Returns: { orderId, status: 'PENDING' }            │     │
│  └────────────────────────────────────────────────────────┘     │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         │ NATS: order.created.v1
                         │
        ┌────────────────┴────────────────┐
        │                                  │
        ▼                                  ▼
┌──────────────────────┐          ┌──────────────────────┐
│  Payment Service     │          │  Inventory Service   │
│                      │          │                      │
│  Listen:             │          │  Listen:             │
│  order.created.v1    │          │  order.created.v1    │
│                      │          │                      │
│  ┌────────────────┐ │          │  ┌────────────────┐ │
│  │ 1. Simulate    │ │          │  │ 1. Check stock │ │
│  │    payment     │ │          │  │ 2. Reserve qty │ │
│  │    (90% pass)  │ │          │  │ 3. Create      │ │
│  │ 2. Save txn    │ │          │  │    reservation │ │
│  │    to DB       │ │          │  └────────────────┘ │
│  └────────────────┘ │          │         │           │
│         │            │          │         │           │
│         ├─ Success   │          │         ├─ Success  │
│         │            │          │         │           │
│         │ Emit:      │          │         │ Emit:     │
│  payment.confirmed   │          │  inventory.reserved │
│         .v1          │          │         .v1         │
│         │            │          │         │           │
│         ├─ Failure   │          │         ├─ Failure  │
│         │            │          │         │           │
│         │ Emit:      │          │         │ Emit:     │
│    payment.failed    │          │   inventory.failed  │
│         .v1          │          │         .v1         │
└─────────┬────────────┘          └─────────┬───────────┘
          │                                  │
          │ NATS                             │ NATS
          │                                  │
          └──────────────┬───────────────────┘
                         │
                         ▼
         ┌───────────────────────────┐
         │      Order Service        │
         │                           │
         │  Listen:                  │
         │  - payment.confirmed.v1   │
         │  - payment.failed.v1      │
         │                           │
         │  ┌─────────────────────┐ │
         │  │ Update Order Status │ │
         │  │                     │ │
         │  │ ✅ CONFIRMED        │ │
         │  │ ❌ CANCELLED        │ │
         │  └─────────────────────┘ │
         └───────────────────────────┘
```

## 🔄 Saga Pattern Implementation

### Successful Flow

```
1. Order Created (PENDING)
   ↓
2. Inventory Reserved
   ↓
3. Payment Confirmed
   ↓
4. Order Confirmed (CONFIRMED)
```

### Compensation Flow (Payment Failure)

```
1. Order Created (PENDING)
   ↓
2. Inventory Reserved
   ↓
3. Payment Failed ❌
   ↓
4. Release Inventory (Compensation)
   ↓
5. Order Cancelled (CANCELLED)
```

### Compensation Flow (Inventory Failure)

```
1. Order Created (PENDING)
   ↓
2. Inventory Failed ❌
   ↓
3. Order Cancelled (CANCELLED)
```

## 📦 Event Definitions

All events are defined in `libs/shared-events` with TypeScript types and versioning.

### Order Events

- `order.created.v1` - New order created
- `order.confirmed.v1` - Order successfully completed
- `order.cancelled.v1` - Order cancelled (compensation)
- `order.failed.v1` - Order processing failed

### Payment Events

- `payment.confirmed.v1` - Payment successfully processed
- `payment.failed.v1` - Payment processing failed
- `payment.refunded.v1` - Payment refunded (compensation)

### Inventory Events

- `inventory.reserved.v1` - Stock reserved for order
- `inventory.failed.v1` - Stock reservation failed
- `inventory.released.v1` - Stock released (compensation)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- pnpm (or npm)

### 1. Start Infrastructure

```bash
# Start PostgreSQL and NATS
docker-compose up -d postgres nats

# Verify NATS is running
curl http://localhost:8222/varz
```

### 2. Environment Configuration

Create `.env` files for each service or use environment variables:

```bash
# Order Service
DATABASE_URL=postgresql://postgres:CHANGE_ME@localhost:5432/order_db
NATS_URL=nats://localhost:4222

# Payment Service (with simulation enabled)
DATABASE_URL=postgresql://postgres:CHANGE_ME@localhost:5432/payment_db
NATS_URL=nats://localhost:4222
USE_SIMULATED_PAYMENT=true
PAYMENT_SUCCESS_RATE=0.9  # 90% success rate

# Inventory Service
DATABASE_URL=postgresql://postgres:CHANGE_ME@localhost:5432/inventory_db
NATS_URL=nats://localhost:4222
```

### 3. Install Dependencies and Build

```bash
# Install dependencies
pnpm install

# Build shared-events library
cd libs/shared-events
pnpm run build
cd ../..

# Generate Prisma clients
pnpm run db:generate
```

### 4. Start Services

```bash
# Terminal 1 - Order Service
pnpm run --filter=@a4co/order-service start:dev

# Terminal 2 - Payment Service
pnpm run --filter=@a4co/payment-service start:dev

# Terminal 3 - Inventory Service
pnpm run --filter=@a4co/inventory-service start:dev
```

## 🧪 Testing the Flow

### Test 1: Successful Order Flow

```bash
# Create a new order
curl -X POST http://localhost:3004/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerId": "customer-123",
    "items": [
      {
        "productId": "product-abc",
        "quantity": 2,
        "unitPrice": 19.99
      }
    ]
  }'

# Response:
# {
#   "orderId": "order-...",
#   "status": "PENDING",
#   "customerId": "customer-123",
#   "items": [...],
#   "totalAmount": 39.98
# }

# Wait 2-3 seconds for async processing

# Check order status (should be CONFIRMED or CANCELLED)
curl http://localhost:3004/orders/{orderId}
```

### Test 2: Multiple Orders (to see failures)

Run this script to create 10 orders and observe ~90% success rate:

```bash
#!/bin/bash
for i in {1..10}; do
  echo "Creating order $i..."
  curl -X POST http://localhost:3004/orders \
    -H "Content-Type: application/json" \
    -d "{
      \"customerId\": \"customer-$i\",
      \"items\": [
        {
          \"productId\": \"product-test\",
          \"quantity\": 1,
          \"unitPrice\": 10.00
        }
      ]
    }"
  echo ""
  sleep 1
done
```

### Test 3: Monitor NATS Events

```bash
# Subscribe to all events (requires nats CLI)
nats sub ">"

# Or subscribe to specific patterns
nats sub "order.*"
nats sub "payment.*"
nats sub "inventory.*"
```

### Test 4: Check Service Logs

Watch the logs to see the event flow:

```bash
# Order service logs show:
# - OrderCreatedV1 emission
# - PaymentConfirmed/Failed reception
# - Order status updates

# Payment service logs show:
# - OrderCreated reception
# - Payment simulation (success/failure)
# - PaymentConfirmed/Failed emission

# Inventory service logs show:
# - OrderCreated reception
# - Stock reservation
# - InventoryReserved/Failed emission
```

## 📊 Success Rate Configuration

Adjust payment success rate for testing:

```bash
# 100% success (all payments succeed)
PAYMENT_SUCCESS_RATE=1.0

# 90% success (default - realistic testing)
PAYMENT_SUCCESS_RATE=0.9

# 50% success (stress test compensations)
PAYMENT_SUCCESS_RATE=0.5

# 0% success (all payments fail - test rollback)
PAYMENT_SUCCESS_RATE=0.0
```

## 🔍 Debugging

### View NATS Monitoring

```bash
# NATS monitoring dashboard
open http://localhost:8222

# Check connections
curl http://localhost:8222/connz

# Check subscriptions
curl http://localhost:8222/subsz
```

### Database Inspection

```bash
# Order database
psql postgresql://postgres:CHANGE_ME@localhost:5432/order_db

# Payment database
psql postgresql://postgres:CHANGE_ME@localhost:5432/payment_db

# Inventory database
psql postgresql://postgres:CHANGE_ME@localhost:5432/inventory_db
```

## 🐛 Troubleshooting

### Issue: Services can't connect to NATS

**Solution**: Verify NATS is running and accessible:
```bash
docker ps | grep nats
nc -zv localhost 4222
```

### Issue: Events not being received

**Solution**: Check service logs for NATS connection errors:
```bash
# Look for "NATS microservice connected" message
# Verify queue names are unique per service
```

### Issue: Orders stuck in PENDING

**Solution**: Check payment service is running and processing events:
```bash
# Verify payment service logs show "Received order.created.v1"
# Check database for payment records
```

### Issue: Payment always succeeds/fails

**Solution**: Verify environment variable:
```bash
echo $USE_SIMULATED_PAYMENT  # Should be "true"
echo $PAYMENT_SUCCESS_RATE    # Should be "0.9" or desired value
```

## 📈 Metrics and Observability

### Prometheus Metrics

```bash
# Order service metrics
curl http://localhost:3004/orders/metrics

# Payment service metrics
curl http://localhost:3006/payments/metrics

# Inventory service metrics
curl http://localhost:3006/inventory/metrics
```

### Key Metrics

- `orders_created_total` - Total orders created
- `orders_confirmed_total` - Total orders confirmed
- `orders_cancelled_total` - Total orders cancelled
- `payments_processed_total` - Total payments processed
- `payments_success_total` - Successful payments
- `payments_failed_total` - Failed payments
- `inventory_reservations_total` - Total reservations
- `inventory_failures_total` - Total reservation failures

## 📚 Additional Resources

- [NATS Documentation](https://docs.nats.io/)
- [Saga Pattern](https://microservices.io/patterns/data/saga.html)
- [Event-Driven Architecture](https://martinfowler.com/articles/201701-event-driven.html)
- [DDD with NestJS](https://docs.nestjs.com/recipes/cqrs)

## 🤝 Contributing

When adding new events:

1. Define in `libs/shared-events/src`
2. Version with V1, V2, etc. suffix
3. Export from `libs/shared-events/src/index.ts`
4. Update this documentation
5. Add tests for event handlers

## 📝 License

MIT
