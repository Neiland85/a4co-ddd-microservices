# Observability Usage Examples

This document provides practical examples of using the `@a4co/observability` package in your services.

## Table of Contents

- [Basic Setup](#basic-setup)
- [Using Decorators](#using-decorators)
- [Manual Instrumentation](#manual-instrumentation)
- [Context Propagation](#context-propagation)
- [Real-World Examples](#real-world-examples)

---

## Basic Setup

### 1. Initialize OpenTelemetry in main.ts

```typescript
import { initializeTracing, TraceContextMiddleware } from '@a4co/observability';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Initialize tracing BEFORE creating the app
  initializeTracing({
    serviceName: process.env.OTEL_SERVICE_NAME || 'order-service',
    serviceVersion: process.env.OTEL_SERVICE_VERSION || '1.0.0',
    environment: process.env.ENVIRONMENT || 'development',
    otlpEndpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    enableAutoInstrumentation: true,
    enableConsoleExporter: process.env.NODE_ENV === 'development',
  });

  const app = await NestFactory.create(AppModule);

  // Apply trace context middleware
  app.use((req, res, next) => {
    const middleware = new TraceContextMiddleware();
    middleware.use(req, res, next);
  });

  await app.listen(3000);
}

bootstrap();
```

### 2. Environment Variables

Create `.env` in your service:

```env
# OpenTelemetry Configuration
OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318
OTEL_SERVICE_NAME=order-service
OTEL_SERVICE_VERSION=1.0.0
OTEL_TRACES_SAMPLER=parentbased_traceidratio
OTEL_TRACES_SAMPLER_ARG=1.0
OTEL_RESOURCE_ATTRIBUTES=environment=development,cluster=a4co-local
```

---

## Using Decorators

### @Tracing() Decorator

#### Basic Usage

```typescript
import { Tracing } from '@a4co/observability';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {
  @Tracing()
  async createOrder(dto: CreateOrderDto): Promise<Order> {
    // Automatically creates span: OrderService.createOrder
    const order = await this.orderRepository.save(dto);
    return order;
  }

  @Tracing({ name: 'order.validate' })
  async validateOrder(order: Order): Promise<boolean> {
    // Custom span name: order.validate
    return this.validator.validate(order);
  }

  @Tracing({ 
    name: 'order.calculate-total',
    attributes: { version: '2.0' }
  })
  calculateTotal(items: OrderItem[]): number {
    // Span with custom attributes
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }
}
```

### @TraceDDD() Decorator

```typescript
import { TraceDDD } from '@a4co/observability';

export class OrderAggregate {
  @TraceDDD({
    aggregateName: 'Order',
    commandName: 'CreateOrder'
  })
  async create(command: CreateOrderCommand): Promise<Order> {
    // Span: Order.CreateOrder
    // Attributes: ddd.aggregate.name=Order, ddd.command.name=CreateOrder
    
    const order = new Order(command.userId, command.items);
    await this.repository.save(order);
    return order;
  }

  @TraceDDD({
    aggregateName: 'Order',
    aggregateId: this.id,
    eventName: 'OrderCancelled'
  })
  cancel(reason: string): void {
    // Span with aggregate ID and event name
    this.status = OrderStatus.CANCELLED;
    this.addDomainEvent(new OrderCancelledEvent(this.id, reason));
  }
}
```

### @Log() Decorator

```typescript
import { Log } from '@a4co/observability';

@Injectable()
export class PaymentService {
  @Log()
  async processPayment(orderId: string, amount: number): Promise<Payment> {
    // Logs:
    // INFO: PaymentService.processPayment started { method: "PaymentService.processPayment" }
    // INFO: PaymentService.processPayment completed { method: "PaymentService.processPayment", durationMs: 123 }
    
    return await this.paymentGateway.charge(orderId, amount);
  }

  @Log({ level: 'debug', logArgs: true })
  validatePaymentMethod(method: PaymentMethod): boolean {
    // Logs at debug level with arguments
    return this.supportedMethods.includes(method);
  }

  @Log({ 
    prefix: '💳',
    logResult: true,
    logExecutionTime: true
  })
  async calculateFees(amount: number): Promise<number> {
    // Custom prefix and logs result
    // INFO: 💳 PaymentService.calculateFees completed { result: 2.5, durationMs: 5 }
    return amount * 0.025;
  }
}
```

### @LogDDD() Decorator

```typescript
import { LogDDD } from '@a4co/observability';

export class OrderAggregate {
  @LogDDD({
    aggregateName: 'Order',
    commandName: 'CreateOrder',
    level: 'info'
  })
  async create(command: CreateOrderCommand): Promise<void> {
    // Logs:
    // INFO: DDD operation started { aggregateName: "Order", commandName: "CreateOrder" }
    // INFO: DDD operation completed { aggregateName: "Order", commandName: "CreateOrder", durationMs: 50 }
    
    this.items = command.items;
    this.userId = command.userId;
  }
}
```

---

## Manual Instrumentation

### Using withSpan Helper

```typescript
import { withSpan } from '@a4co/observability';

export class OrderService {
  async createOrder(dto: CreateOrderDto): Promise<Order> {
    return withSpan('order.create', async () => {
      // Span is automatically created and ended
      // Errors are automatically recorded
      
      const order = await this.orderRepository.save(dto);
      await this.eventBus.publish(new OrderCreatedEvent(order.id));
      
      return order;
    });
  }
}
```

### Using getTracer Directly

```typescript
import { getTracer, SpanStatusCode } from '@a4co/observability';
import { trace } from '@opentelemetry/api';

export class OrderService {
  private readonly tracer = getTracer();

  async processOrder(orderId: string): Promise<void> {
    const span = this.tracer.startSpan('order.process', {
      attributes: {
        'order.id': orderId,
        'order.version': '2.0',
      },
    });

    try {
      // Your business logic
      await this.validate(orderId);
      await this.charge(orderId);
      await this.ship(orderId);
      
      span.setStatus({ code: SpanStatusCode.OK });
    } catch (error) {
      span.recordException(error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      throw error;
    } finally {
      span.end();
    }
  }
}
```

### Nested Spans

```typescript
export class OrderService {
  async createOrder(dto: CreateOrderDto): Promise<Order> {
    return withSpan('order.create', async () => {
      // Parent span
      
      const order = await withSpan('order.validate', async () => {
        // Child span 1
        return this.validate(dto);
      });
      
      const payment = await withSpan('payment.process', async () => {
        // Child span 2
        return this.paymentService.charge(order.total);
      });
      
      const inventory = await withSpan('inventory.reserve', async () => {
        // Child span 3
        return this.inventoryService.reserve(order.items);
      });
      
      return order;
    });
  }
}
```

---

## Context Propagation

### Propagating Context Between Services

```typescript
import { injectContext } from '@a4co/observability';
import axios from 'axios';

export class OrderService {
  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const order = await this.orderRepository.save(dto);
    
    // Propagate trace context to payment service
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Inject current trace context into headers
    injectContext(headers);
    
    // Make HTTP call with trace context
    const response = await axios.post(
      'http://payment-service/process',
      { orderId: order.id, amount: order.total },
      { headers }
    );
    
    return order;
  }
}
```

### Extracting Context in Receiver

```typescript
// The TraceContextMiddleware automatically extracts context
// from incoming requests, so you don't need to do anything manually

export class PaymentController {
  @Post('process')
  async processPayment(@Body() dto: ProcessPaymentDto) {
    // Logger automatically includes traceId from context
    this.logger.info('Processing payment', { orderId: dto.orderId });
    
    // Spans automatically inherit parent context
    return this.paymentService.process(dto);
  }
}
```

---

## Real-World Examples

### Example 1: Order Creation Flow

```typescript
import { Tracing, Log, getLogger } from '@a4co/observability';

@Injectable()
export class OrderService {
  private readonly logger = getLogger();

  @Tracing({ name: 'order.create' })
  @Log({ level: 'info', logExecutionTime: true })
  async createOrder(dto: CreateOrderDto): Promise<Order> {
    this.logger.info('Creating order', { 
      userId: dto.userId, 
      itemsCount: dto.items.length 
    });

    // Validate order
    await this.validateOrder(dto);

    // Create order entity
    const order = new Order(dto);
    await this.orderRepository.save(order);

    // Process payment
    await this.processPayment(order);

    // Reserve inventory
    await this.reserveInventory(order);

    // Publish event
    await this.eventBus.publish(new OrderCreatedEvent(order.id));

    this.logger.info('Order created successfully', { orderId: order.id });

    return order;
  }

  @Tracing({ name: 'order.validate' })
  private async validateOrder(dto: CreateOrderDto): Promise<void> {
    if (dto.items.length === 0) {
      throw new Error('Order must have at least one item');
    }
    
    // Validate stock availability
    for (const item of dto.items) {
      const available = await this.inventoryService.checkStock(item.productId);
      if (!available) {
        throw new Error(`Product ${item.productId} is out of stock`);
      }
    }
  }

  @Tracing({ name: 'payment.process' })
  private async processPayment(order: Order): Promise<void> {
    const headers: Record<string, string> = {};
    injectContext(headers);

    await axios.post(
      'http://payment-service/process',
      { orderId: order.id, amount: order.total },
      { headers }
    );
  }

  @Tracing({ name: 'inventory.reserve' })
  private async reserveInventory(order: Order): Promise<void> {
    const headers: Record<string, string> = {};
    injectContext(headers);

    await axios.post(
      'http://inventory-service/reserve',
      { orderId: order.id, items: order.items },
      { headers }
    );
  }
}
```

### Example 2: Event Handler with Tracing

```typescript
import { TraceDDD, LogDDD } from '@a4co/observability';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';

@EventsHandler(OrderCreatedEvent)
export class OrderCreatedHandler implements IEventHandler<OrderCreatedEvent> {
  @TraceDDD({
    aggregateName: 'Order',
    eventName: 'OrderCreated'
  })
  @LogDDD({
    aggregateName: 'Order',
    eventName: 'OrderCreated',
    level: 'info'
  })
  async handle(event: OrderCreatedEvent): Promise<void> {
    // Send confirmation email
    await this.emailService.sendOrderConfirmation(event.orderId);
    
    // Update analytics
    await this.analyticsService.trackOrderCreated(event);
    
    // Trigger fulfillment
    await this.fulfillmentService.createShipment(event.orderId);
  }
}
```

### Example 3: Saga with Distributed Tracing

```typescript
import { Tracing, getLogger } from '@a4co/observability';
import { Saga } from '@nestjs/cqrs';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class OrderSaga {
  private readonly logger = getLogger();

  @Saga()
  orderCreated = (events$: Observable<any>): Observable<any> => {
    return events$.pipe(
      ofType(OrderCreatedEvent),
      map(event => this.handleOrderCreated(event))
    );
  };

  @Tracing({ name: 'saga.order-created' })
  private async handleOrderCreated(event: OrderCreatedEvent): Promise<any> {
    this.logger.info('Processing order saga', { orderId: event.orderId });

    try {
      // Step 1: Process payment
      await this.processPayment(event);
      
      // Step 2: Reserve inventory
      await this.reserveInventory(event);
      
      // Step 3: Create shipment
      await this.createShipment(event);
      
      return new OrderCompletedCommand(event.orderId);
    } catch (error) {
      this.logger.error('Saga failed, starting compensation', {
        orderId: event.orderId,
        error: error.message
      });
      
      // Compensation logic
      return new OrderFailedCommand(event.orderId, error.message);
    }
  }

  @Tracing({ name: 'saga.process-payment' })
  private async processPayment(event: OrderCreatedEvent): Promise<void> {
    // Payment processing with trace propagation
  }

  @Tracing({ name: 'saga.reserve-inventory' })
  private async reserveInventory(event: OrderCreatedEvent): Promise<void> {
    // Inventory reservation with trace propagation
  }

  @Tracing({ name: 'saga.create-shipment' })
  private async createShipment(event: OrderCreatedEvent): Promise<void> {
    // Shipment creation with trace propagation
  }
}
```

---

## Best Practices

### 1. Always Use Decorators for Public Methods

```typescript
// ✅ GOOD
@Tracing()
@Log()
async createOrder(dto: CreateOrderDto): Promise<Order> {
  return this.orderRepository.save(dto);
}

// ❌ BAD - Missing instrumentation
async createOrder(dto: CreateOrderDto): Promise<Order> {
  return this.orderRepository.save(dto);
}
```

### 2. Use Meaningful Span Names

```typescript
// ✅ GOOD
@Tracing({ name: 'order.validate.inventory' })

// ❌ BAD
@Tracing({ name: 'function1' })
```

### 3. Add Context to Logs

```typescript
// ✅ GOOD
this.logger.info('Order created', { 
  orderId: order.id, 
  userId: order.userId,
  total: order.total 
});

// ❌ BAD
this.logger.info('Order created');
```

### 4. Don't Log Sensitive Data

```typescript
// ❌ BAD
this.logger.info('User logged in', { 
  password: user.password  // ❌ Never log passwords!
});

// ✅ GOOD
this.logger.info('User logged in', { 
  userId: user.id,
  email: user.email
});
```

---

## Troubleshooting

### Traces Not Appearing

1. Verify OTLP endpoint is reachable:
   ```bash
   curl http://localhost:4318/v1/traces
   ```

2. Check service logs for initialization errors:
   ```bash
   docker logs order-service | grep -i "tracing\|otel"
   ```

3. Verify TraceContextMiddleware is applied

### Logs Missing traceId

1. Ensure TraceContextMiddleware is applied before routes
2. Use `getLogger()` from `@a4co/observability`
3. Check AsyncLocalStorage is working (Node.js 14+)

---

**Version**: 1.0.0  
**Last Updated**: 2025-12-15  
**Maintained by**: @a4co/observability
