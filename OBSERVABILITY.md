# 🔍 Observability Guide - A4CO DDD Microservices

## Table of Contents
- [Introduction](#introduction)
- [Architecture Overview](#architecture-overview)
- [Core Components](#core-components)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [Distributed Tracing](#distributed-tracing)
- [Structured Logging](#structured-logging)
- [Best Practices](#best-practices)
- [Environment Variables](#environment-variables)
- [Future Roadmap](#future-roadmap)

## Introduction

Observability is the ability to understand the internal state of a system by examining its outputs. In a microservices architecture like A4CO, observability is critical for:

- **Debugging distributed systems**: Trace requests across multiple services
- **Performance monitoring**: Identify bottlenecks and slow operations
- **Error tracking**: Quickly identify and diagnose failures
- **Business intelligence**: Extract insights from operational logs

This guide covers the observability infrastructure implemented in the `@a4co/observability` package.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Request                          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              TraceContextMiddleware                         │
│  • Extract/Generate trace ID                                │
│  • Create span ID                                           │
│  • Inject into AsyncLocalStorage                           │
│  • Add headers to response                                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   AsyncLocalStorage                         │
│  Context: { traceId, spanId, parentSpanId }                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Code                         │
│  • Controllers                                              │
│  • Use Cases                                                │
│  • Domain Services                                          │
│  • Event Handlers                                           │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    SimpleLogger                             │
│  • Auto-inject trace context                                │
│  • Structured JSON output                                   │
│  • Pino-based with pretty printing                         │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Log Aggregation System                         │
│  (Future: Loki, Elasticsearch, CloudWatch)                  │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. TraceContextMiddleware

A NestJS middleware that:
- Extracts or generates `traceId` from request headers
- Generates a unique `spanId` for each request
- Injects trace context into AsyncLocalStorage
- Adds trace IDs to response headers
- Logs REQUEST_START and REQUEST_END events

**Supported Header Formats:**
- `x-trace-id` (A4CO standard)
- `traceparent` (W3C Trace Context)
- `x-b3-traceid` (Zipkin B3)

### 2. AsyncLocalStorage Context

Uses Node.js AsyncLocalStorage to propagate trace context through asynchronous operations without explicit parameter passing.

**Benefits:**
- Automatic context propagation
- No manual context threading
- Works across async/await boundaries
- Minimal code changes required

### 3. SimpleLogger

A Pino-based logger that automatically injects trace context into every log entry.

**Features:**
- Methods: `info()`, `warn()`, `error()`, `debug()`, `fatal()`
- Automatic trace context injection
- Error object handling with stack traces
- Child loggers for scoped context
- Pretty printing in development
- JSON output in production

### 4. Trace ID Generation

UUID v4-based trace ID generation with support for multiple header formats.

## Quick Start

### Installation

The `@a4co/observability` package is already installed in this monorepo.

### Basic Setup in a NestJS Service

```typescript
// apps/your-service/src/main.ts
import { TraceContextMiddleware } from '@a4co/observability';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Apply trace context middleware
  app.use((req, res, next) => {
    const middleware = new TraceContextMiddleware();
    middleware.use(req, res, next);
  });
  
  await app.listen(3000);
}
```

### Using the Logger

```typescript
import { createSimpleLogger } from '@a4co/observability';

// Initialize logger
const logger = createSimpleLogger({
  serviceName: 'order-service',
  environment: process.env.NODE_ENV || 'development',
  level: 'info',
});

// Use in your code
logger.info({ orderId: '123', action: 'OrderCreated' }, 'Order created successfully');
logger.warn({ userId: 'user-1' }, 'Slow database query detected');
logger.error(new Error('Payment failed'), { orderId: '123' });
```

## Configuration

### Logger Configuration

```typescript
interface LoggerConfig {
  serviceName: string;      // Service name for identification
  environment: string;       // 'development', 'production', etc.
  level?: string;           // Log level: 'debug', 'info', 'warn', 'error', 'fatal'
  prettyPrint?: boolean;    // Pretty printing (default: true in dev, false in prod)
}
```

### Middleware Configuration

```typescript
import { createTraceContextMiddleware } from '@a4co/observability';

// With custom options
app.use(createTraceContextMiddleware({
  excludePaths: ['/health', '/metrics'], // Paths to exclude from tracing
  generateIfMissing: true,               // Generate trace ID if not present
}));
```

## Usage Examples

### Example 1: Controller with Trace Context

```typescript
import { Controller, Get, Req } from '@nestjs/common';
import { createSimpleLogger } from '@a4co/observability';

@Controller('orders')
export class OrderController {
  private logger = createSimpleLogger({
    serviceName: 'order-service',
    environment: process.env.NODE_ENV || 'development',
  });

  @Get()
  async getOrders(@Req() req: any) {
    // Trace context is automatically available
    this.logger.info(
      {
        action: 'GetOrders',
        userId: req.user?.id,
        // traceId and spanId are automatically injected
      },
      'Fetching orders'
    );

    // Your business logic here
    const orders = await this.orderService.findAll();

    this.logger.info(
      { action: 'GetOrders', count: orders.length },
      'Orders fetched successfully'
    );

    return orders;
  }
}
```

### Example 2: Use Case with Logging

```typescript
import { Injectable } from '@nestjs/common';
import { createSimpleLogger } from '@a4co/observability';

@Injectable()
export class CreateOrderUseCase {
  private logger = createSimpleLogger({
    serviceName: 'order-service',
    environment: process.env.NODE_ENV || 'development',
  });

  async execute(command: CreateOrderCommand): Promise<Order> {
    this.logger.info(
      {
        action: 'CreateOrder',
        aggregateName: 'Order',
        commandName: 'CreateOrder',
        customerId: command.customerId,
      },
      'Creating new order'
    );

    try {
      // Business logic
      const order = await this.orderRepository.create(command);

      this.logger.info(
        {
          action: 'OrderCreated',
          aggregateName: 'Order',
          aggregateId: order.id,
          eventName: 'OrderCreated',
          eventVersion: 'v1',
        },
        'Order created successfully'
      );

      return order;
    } catch (error) {
      this.logger.error(error, {
        action: 'CreateOrderFailed',
        aggregateName: 'Order',
        commandName: 'CreateOrder',
      });
      throw error;
    }
  }
}
```

### Example 3: Event Handler with Correlation ID

```typescript
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { createSimpleLogger } from '@a4co/observability';

@Controller()
export class PaymentEventsHandler {
  private logger = createSimpleLogger({
    serviceName: 'order-service',
    environment: process.env.NODE_ENV || 'development',
  });

  @EventPattern('payment.succeeded.v1')
  async handlePaymentSucceeded(@Payload() event: any) {
    this.logger.info(
      {
        eventName: 'PaymentSucceeded',
        eventVersion: 'v1',
        aggregateName: 'Payment',
        aggregateId: event.paymentId,
        correlationId: event.correlationId, // Propagate correlation ID
        orderId: event.orderId,
      },
      'Payment succeeded event received'
    );

    // Handle event logic
    await this.orderService.markAsPaid(event.orderId);

    this.logger.info(
      {
        eventName: 'OrderPaid',
        aggregateId: event.orderId,
        correlationId: event.correlationId,
      },
      'Order marked as paid'
    );
  }
}
```

## Distributed Tracing

### Trace Propagation

Trace context is automatically propagated:

1. **HTTP Requests**: Via headers (`x-trace-id`, `x-span-id`)
2. **AsyncLocalStorage**: Throughout the call stack
3. **Event Messages**: Include `correlationId` in event payloads

### Trace Flow Example

```
Request → Service A (traceId: abc123)
  ↓
  HTTP Call → Service B (x-trace-id: abc123, new spanId)
    ↓
    Event Publish → Service C (correlationId: abc123)
      ↓
      All logs contain traceId: abc123
```

### Correlation ID for Events

When emitting domain events, include the correlation ID:

```typescript
const event = {
  eventName: 'OrderCreated',
  eventVersion: 'v1',
  aggregateId: order.id,
  correlationId: getTraceContext().traceId, // Propagate trace ID
  payload: {
    orderId: order.id,
    customerId: order.customerId,
  },
};

await this.eventBus.emit('order.created.v1', event);
```

## Structured Logging

### Log Payload Structure

All logs follow a structured format:

```json
{
  "level": "info",
  "time": "2025-01-15T10:30:45.123Z",
  "service": "order-service",
  "traceId": "550e8400-e29b-41d4-a716-446655440000",
  "spanId": "b7ad6b7169203331",
  "action": "OrderCreated",
  "aggregateName": "Order",
  "aggregateId": "order-123",
  "userId": "user-456",
  "msg": "Order created successfully"
}
```

### Standard Fields

- `level`: Log level (info, warn, error, debug, fatal)
- `time`: ISO 8601 timestamp
- `service`: Service name
- `traceId`: Distributed trace ID
- `spanId`: Current span ID
- `msg`: Human-readable message

### Custom Fields

Add domain-specific fields:

```typescript
logger.info({
  // Trace context (automatic)
  // DDD fields
  aggregateName: 'Order',
  aggregateId: 'order-123',
  commandName: 'CreateOrder',
  eventName: 'OrderCreated',
  eventVersion: 'v1',
  // Business fields
  customerId: 'customer-456',
  amount: 99.99,
  currency: 'EUR',
}, 'Order processing completed');
```

## Best Practices

### 1. Always Include Action Names

```typescript
// ✅ Good
logger.info({ action: 'CreateOrder' }, 'Creating order');

// ❌ Bad
logger.info({}, 'Creating order');
```

### 2. Use DDD Terminology

```typescript
logger.info({
  aggregateName: 'Order',
  aggregateId: 'order-123',
  commandName: 'CreateOrder',
  eventName: 'OrderCreated',
  eventVersion: 'v1',
}, 'Domain event emitted');
```

### 3. Log at Appropriate Levels

- **DEBUG**: Detailed diagnostic information
- **INFO**: General informational messages
- **WARN**: Warning conditions (e.g., slow queries, deprecated APIs)
- **ERROR**: Error conditions requiring attention
- **FATAL**: Severe errors causing service shutdown

### 4. Never Log Sensitive Data

```typescript
// ❌ Never log passwords, tokens, credit cards
logger.info({ password: user.password }, 'User login');

// ✅ Sanitize sensitive data
logger.info({ userId: user.id, email: user.email }, 'User login');
```

### 5. Use Child Loggers for Context

```typescript
const requestLogger = logger.child({
  requestId: req.id,
  userId: req.user.id,
});

requestLogger.info({ action: 'Step1' }, 'Processing step 1');
requestLogger.info({ action: 'Step2' }, 'Processing step 2');
```

### 6. Include Correlation IDs in Events

Always propagate correlation IDs through events:

```typescript
const event = {
  ...payload,
  correlationId: getTraceContext().traceId,
};
```

## Environment Variables

### LOG_LEVEL

Controls the minimum log level to output.

```bash
# Development
LOG_LEVEL=debug

# Production
LOG_LEVEL=info
```

**Values**: `fatal`, `error`, `warn`, `info`, `debug`, `trace`

### NODE_ENV

Determines pretty printing and default log level.

```bash
# Development (pretty printing enabled, debug level)
NODE_ENV=development

# Production (JSON output, info level)
NODE_ENV=production
```

### SERVICE_NAME

Override the service name in logs (optional, usually set in code).

```bash
SERVICE_NAME=order-service
```

## Future Roadmap

### Phase 1: Current Implementation ✅
- [x] Pino-based structured logging
- [x] AsyncLocalStorage trace context
- [x] NestJS middleware for trace propagation
- [x] UUID v4 trace ID generation
- [x] Multiple header format support

### Phase 2: OpenTelemetry Integration (Q2 2025)
- [ ] Full OpenTelemetry instrumentation
- [ ] Automatic span creation
- [ ] Trace exporters (Jaeger, Zipkin)
- [ ] Metrics collection (Prometheus)

### Phase 3: Advanced Observability (Q3 2025)
- [ ] Distributed tracing UI (Jaeger/Tempo)
- [ ] Log aggregation (Grafana Loki)
- [ ] Metrics dashboards (Grafana)
- [ ] Alert rules and notifications

### Phase 4: Business Intelligence (Q4 2025)
- [ ] Business metrics extraction
- [ ] Real-time analytics
- [ ] Performance insights
- [ ] Cost optimization recommendations

## Troubleshooting

### Trace ID Not Appearing in Logs

**Problem**: Logs don't include traceId or show "unknown"

**Solution**: 
1. Ensure TraceContextMiddleware is registered in main.ts
2. Verify AsyncLocalStorage is working (Node.js 12.17+)
3. Check that logger is called within request context

### Logs Not Pretty Printed in Development

**Problem**: JSON output instead of pretty logs

**Solution**:
```typescript
const logger = createSimpleLogger({
  serviceName: 'my-service',
  environment: 'development',
  prettyPrint: true, // Explicitly enable
});
```

### Trace Context Lost Across Async Operations

**Problem**: traceId changes mid-request

**Solution**: Use AsyncLocalStorage utilities:
```typescript
import { runInTraceContextAsync } from '@a4co/observability';

await runInTraceContextAsync(getTraceContext(), async () => {
  // Your async code here
});
```

## Support

For questions or issues:
- Create an issue in the GitHub repository
- Consult the `@a4co/observability` package README
- Review existing implementation in `payment-service`

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Maintained By**: A4CO Platform Team
