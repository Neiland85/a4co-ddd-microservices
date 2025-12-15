# Notification Service

Event-driven multi-channel notification service for A4CO platform.

## Features

- ✉️ **Email Notifications** via SendGrid
- 📱 **SMS Notifications** via Twilio
- 🔄 **Event-Driven** - Reacts to NATS events
- 🔒 **Idempotent** - Prevents duplicate notifications
- 🔁 **Retry Logic** - Exponential backoff on failures
- 📊 **History Tracking** - Full notification audit trail

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your API keys

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Start development server
npm run start:dev
```

## Event Listeners

### OrderConfirmedV1
- **Event:** `order.confirmed.v1`
- **Action:** Send order confirmation email
- **Template:** Professional HTML with order details

### ShipmentDeliveredV1
- **Event:** `shipment.delivered.v1`
- **Action:** Send delivery notification SMS
- **Template:** Concise message with tracking number

## Environment Variables

```env
# Required
SENDGRID_API_KEY=sg_xxx
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
TWILIO_PHONE_NUMBER=+1234567890
DATABASE_URL=postgresql://...
NATS_SERVERS=nats://localhost:4222

# Optional
NOTIFICATION_EMAIL=noreply@a4co.com
PORT=3007
NODE_ENV=development
```

## API Endpoints

- `GET /api/notifications/health` - Health check
- `GET /api/notifications/notifications/:orderId` - Get notification history
- `GET /api/notifications/stats` - Get statistics
- `POST /api/notifications/send` - Send notification (legacy)

## Testing

```bash
# Run tests
npm test

# With coverage (>80% required)
npm run test:coverage

# Watch mode
npm run test:watch
```

## Documentation

Full documentation available at: [docs/notification-service.md](../../docs/notification-service.md)

## Architecture

```
Event → Listener → NotificationService → SendGrid/Twilio
                         ↓
                    PostgreSQL (History)
```

## Idempotency

Notifications are deduplicated by `correlationId`. Each event can only trigger one notification, even if the event is replayed.

## Retry Logic

- **Max retries:** 3
- **Strategy:** Exponential backoff (1s, 2s, 4s)
- **Failure:** Marked as failed in database after max retries

## Mock Mode

Without API keys configured, the service runs in mock mode:
- Logs notifications to console
- Saves to database
- Useful for development and testing

## License

MIT
