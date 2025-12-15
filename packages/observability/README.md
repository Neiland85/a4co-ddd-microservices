# @a4co/observability

Comprehensive observability package for A4CO DDD microservices.

**Quick Links:**
- **[Full Documentation](../../OBSERVABILITY.md)** - Complete guide with examples and best practices
- **API Reference** - See below
- **Examples** - order-service, payment-service, inventory-service

## Quick Start

```typescript
// 1. Add middleware
import { TraceContextMiddleware } from '@a4co/observability';
app.use((req, res, next) => {
  const middleware = new TraceContextMiddleware();
  middleware.use(req, res, next);
});

// 2. Create logger
import { createSimpleLogger } from '@a4co/observability';
const logger = createSimpleLogger({
  serviceName: 'order-service',
  environment: process.env.NODE_ENV || 'development',
});

// 3. Log with automatic trace context
logger.info('Order created', { orderId: '123' });
```

See [OBSERVABILITY.md](../../OBSERVABILITY.md) for complete documentation.

## License

Apache-2.0
