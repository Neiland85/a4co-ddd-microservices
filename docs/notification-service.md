# Notification Service Documentation

## Overview

The Notification Service is an event-driven microservice that handles multi-channel notifications (Email and SMS) for the A4CO platform. It reacts to order and shipment events, sending timely notifications to customers.

## Architecture

### Event-Driven Design

```
┌──────────────┐        ┌──────────────┐        ┌───────────────────┐
│Order Service │─NATS──▶│ Notification │───────▶│SendGrid / Twilio │
└──────────────┘        │   Service    │        └───────────────────┘
                        └──────────────┘
┌──────────────┐               │
│Transportista │─NATS──────────┘
│  Service     │               
└──────────────┘               ▼
                        ┌──────────────┐
                        │  PostgreSQL  │
                        │  (History)   │
                        └──────────────┘
```

### Components

1. **Event Listeners**
   - `OrderConfirmedListener` - Handles order confirmation events
   - `ShipmentDeliveredListener` - Handles delivery events

2. **Services**
   - `SendGridService` - Email notifications with retry logic
   - `TwilioService` - SMS notifications with retry logic
   - `NotificationService` - Orchestration and persistence

3. **Database**
   - Notification history tracking
   - Idempotency control via correlationId

## Event Processing

### Order Confirmed Event

**Event:** `order.confirmed.v1`  
**Subject:** `orders.events.confirmed`  
**Action:** Send confirmation email to customer

**Payload:**
```typescript
{
  orderId: string;
  customerId: string;
  paymentId: string;
  totalAmount: number;
  currency?: string;
  confirmedAt: string; // ISO timestamp
}
```

**Email Template:**
- Professional HTML design
- Order number and total amount
- List of items (when available)
- Next steps information

### Shipment Delivered Event

**Event:** `shipment.delivered.v1`  
**Subject:** `shipments.events.delivered`  
**Action:** Send delivery SMS to customer

**Payload:**
```typescript
{
  shipmentId: string;
  orderId: string;
  customerId: string;
  trackingNumber?: string;
  deliveredAt: string;
}
```

**SMS Template:**
```
✅ ¡Tu pedido {orderId} ha sido entregado! 
Número de seguimiento: {trackingNumber}
Gracias por tu compra - A4CO
```

## Configuration

### Environment Variables

```env
# SendGrid Configuration
SENDGRID_API_KEY=sg_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTIFICATION_EMAIL=noreply@a4co.com

# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890

# NATS Configuration
NATS_SERVERS=nats://localhost:4222

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/notifications

# Testing (Development only)
TEST_EMAIL=test@example.com
TEST_PHONE=+34600000000

# Service Configuration
PORT=3007
NODE_ENV=development
```

### Database Setup

1. **Run migrations:**
   ```bash
   cd apps/notification-service
   npm run db:migrate
   ```

2. **Generate Prisma client:**
   ```bash
   npm run db:generate
   ```

## API Endpoints

### GET `/api/notifications/health`

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "notification-service",
  "timestamp": "2025-01-15T10:30:00.000Z",
  "providers": {
    "email": "configured",
    "sms": "configured",
    "push": "configured"
  }
}
```

### GET `/api/notifications/notifications/:orderId`

Get notification history for a specific order.

**Parameters:**
- `orderId` (path) - Order ID

**Query Parameters:**
- `channel` (optional) - Filter by channel: `email` | `sms`
- `status` (optional) - Filter by status: `pending` | `sent` | `failed`
- `limit` (optional, default: 10) - Number of results per page
- `offset` (optional, default: 0) - Pagination offset

**Example:**
```bash
GET /api/notifications/notifications/order-123?channel=email&status=sent&limit=20
```

**Response:**
```json
{
  "data": [
    {
      "id": "notif-uuid",
      "orderId": "order-123",
      "customerId": "customer-456",
      "correlationId": "corr-789",
      "eventType": "order.confirmed.v1",
      "channel": "email",
      "recipient": "customer@example.com",
      "subject": "✅ Pedido Confirmado - order-123",
      "status": "sent",
      "attempts": 1,
      "sentAt": "2025-01-15T10:30:00.000Z",
      "createdAt": "2025-01-15T10:29:55.000Z",
      "updatedAt": "2025-01-15T10:30:00.000Z"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

### GET `/api/notifications/stats`

Get notification statistics.

**Response:**
```json
{
  "total": 1000,
  "sent": 950,
  "failed": 30,
  "pending": 20,
  "successRate": "95.00%"
}
```

## Features

### Idempotency

- Notifications are deduplicated using `correlationId`
- Prevents duplicate emails/SMS for the same event
- Implemented at the database level with unique constraint

### Retry Logic

Both SendGrid and Twilio services implement exponential backoff retry:

- **Max retries:** 3
- **Initial delay:** 1 second
- **Backoff multiplier:** 2x (1s, 2s, 4s)

```typescript
// Example retry sequence
Attempt 1: immediate
Attempt 2: after 1s delay
Attempt 3: after 2s delay
Attempt 4: after 4s delay (then fail)
```

### Error Handling

- Failed notifications are marked in the database
- Error messages are stored for debugging
- Errors don't block event processing (logged but not thrown)

### Mock Mode

For development without API keys:
- SendGrid: Logs email to console
- Twilio: Logs SMS to console
- Useful for testing event flow

## Logging

All operations are logged with structured information:

```typescript
// Success
Logger.log('✅ Email sent successfully', {
  orderId: 'order-123',
  recipient: 'customer@example.com',
  correlationId: 'corr-789'
});

// Warning
Logger.warn('⚠️ Duplicate notification detected', {
  correlationId: 'corr-789'
});

// Error
Logger.error('❌ Failed to send notification', {
  orderId: 'order-123',
  error: error.message,
  attempts: 3
});
```

## Testing

### Run Tests

```bash
# All tests
npm test

# With coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

### Coverage Threshold

- **Lines:** 80%
- **Functions:** 80%
- **Branches:** 80%
- **Statements:** 80%

### Test Structure

```
src/
├── services/__tests__/
│   ├── sendgrid.service.spec.ts
│   ├── twilio.service.spec.ts
│   └── notification.service.spec.ts
└── listeners/__tests__/
    ├── order-confirmed.listener.spec.ts
    └── shipment-delivered.listener.spec.ts
```

## Deployment

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY dist ./dist
EXPOSE 3007
CMD ["node", "dist/main.js"]
```

### Build

```bash
# Build TypeScript
npm run build

# Build Docker image
docker build -t notification-service:latest .
```

### Docker Compose

```yaml
notification-service:
  image: notification-service:latest
  ports:
    - "3007:3007"
  environment:
    - DATABASE_URL=postgresql://user:pass@db:5432/notifications
    - NATS_SERVERS=nats://nats:4222
    - SENDGRID_API_KEY=${SENDGRID_API_KEY}
    - TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
    - TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
    - TWILIO_PHONE_NUMBER=${TWILIO_PHONE_NUMBER}
  depends_on:
    - db
    - nats
```

## Troubleshooting

### Notifications Not Sending

1. **Check environment variables:**
   ```bash
   echo $SENDGRID_API_KEY
   echo $TWILIO_ACCOUNT_SID
   ```

2. **Check NATS connection:**
   ```bash
   curl http://localhost:3007/api/notifications/health
   ```

3. **Check logs:**
   ```bash
   docker logs notification-service -f
   ```

### Duplicate Notifications

- Verify `correlationId` is being passed correctly
- Check database for existing notification with same correlationId:
  ```sql
  SELECT * FROM "Notification" WHERE "correlationId" = 'corr-123';
  ```

### Failed Notifications

1. **Query failed notifications:**
   ```bash
   curl "http://localhost:3007/api/notifications/notifications/order-123?status=failed"
   ```

2. **Check error messages in response**

3. **Verify API credentials are valid**

### NATS Connection Issues

1. **Verify NATS is running:**
   ```bash
   docker ps | grep nats
   ```

2. **Test NATS connection:**
   ```bash
   docker exec -it nats nats-server --version
   ```

3. **Check NATS logs:**
   ```bash
   docker logs nats -f
   ```

## Monitoring

### Key Metrics

- **Success Rate:** Percentage of successfully sent notifications
- **Average Latency:** Time from event receipt to notification sent
- **Failed Notifications:** Count of notifications that failed after max retries
- **Retry Rate:** Percentage of notifications requiring retries

### Health Checks

Kubernetes/Docker health check:
```yaml
livenessProbe:
  httpGet:
    path: /api/notifications/health
    port: 3007
  initialDelaySeconds: 30
  periodSeconds: 10
```

## Future Enhancements

- [ ] Dead Letter Queue for failed events
- [ ] Notification templates management UI
- [ ] Customer notification preferences
- [ ] Push notifications via Firebase
- [ ] Webhook notifications for integrations
- [ ] Rate limiting per customer
- [ ] Batch notification sending
- [ ] Email open/click tracking

## References

- [SendGrid Documentation](https://docs.sendgrid.com/)
- [Twilio Documentation](https://www.twilio.com/docs/sms)
- [NATS Documentation](https://docs.nats.io/)
- [NestJS Microservices](https://docs.nestjs.com/microservices/basics)
