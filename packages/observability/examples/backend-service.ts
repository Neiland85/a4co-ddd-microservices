/**
 * Example: Backend microservice with full observability
 */

import express from 'express';
import {
  createLogger,
  initializeTracer,
  expressTracingMiddleware,
  Trace,
  withSpan,
  TracedNatsClient,
  getTracingContext,
} from '@a4co/observability';

// Initialize observability
const logger = createLogger({
  service: 'order-service',
  environment: process.env.NODE_ENV || 'development',
  version: process.env.SERVICE_VERSION || '1.0.0',
  level: process.env.LOG_LEVEL || 'info',
  pretty: process.env.NODE_ENV === 'development',
});

const tracer = initializeTracer({
  serviceName: 'order-service',
  serviceVersion: process.env.SERVICE_VERSION || '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  jaegerEndpoint: process.env.JAEGER_ENDPOINT,
  prometheusPort: 9090,
  logger,
});

// Initialize NATS client with tracing
const natsClient = new TracedNatsClient({
  serviceName: 'order-service',
  logger,
});

// Domain service with observability
class OrderService {
  constructor(private logger = logger.child({ component: 'OrderService' })) {}

  @Trace({ name: 'OrderService.createOrder' })
  async createOrder(command: CreateOrderCommand): Promise<Order> {
    // Log command reception
    this.logger.info('Processing create order command', {
      ddd: {
        aggregateId: command.orderId,
        aggregateType: 'Order',
        commandName: 'CreateOrderCommand',
        userId: command.userId,
        correlationId: command.correlationId,
      },
    });

    try {
      // Validate order
      await withSpan('validate-order', async span => {
        span.setAttribute('order.items', command.items.length);
        span.setAttribute('order.total', command.total);

        if (command.total <= 0) {
          throw new Error('Invalid order total');
        }
      });

      // Create order aggregate
      const order = await withSpan('create-order-aggregate', async span => {
        const order = new Order({
          id: command.orderId,
          userId: command.userId,
          items: command.items,
          total: command.total,
          status: 'pending',
        });

        span.setAttribute('order.id', order.id);
        return order;
      });

      // Save to database
      await withSpan('save-order-to-db', async span => {
        span.setAttribute('db.operation', 'insert');
        span.setAttribute('db.table', 'orders');

        // Simulated DB operation
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      // Publish domain event
      await natsClient.publishEvent('orders.created', {
        type: 'OrderCreated',
        aggregateId: order.id,
        data: {
          orderId: order.id,
          userId: order.userId,
          items: order.items,
          total: order.total,
          createdAt: new Date().toISOString(),
        },
        metadata: {
          correlationId: command.correlationId,
          causationId: command.id,
        },
      });

      this.logger.info('Order created successfully', {
        ddd: {
          aggregateId: order.id,
          aggregateType: 'Order',
          eventName: 'OrderCreated',
          eventVersion: 1,
        },
      });

      return order;
    } catch (error) {
      this.logger.error('Failed to create order', error as Error, {
        ddd: {
          aggregateId: command.orderId,
          commandName: 'CreateOrderCommand',
        },
      });
      throw error;
    }
  }
}

// Express application
const app = express();
app.use(express.json());

// Add observability middleware
app.use(
  expressTracingMiddleware({
    serviceName: 'order-service',
    logger,
    captureRequestBody: true,
<<<<<<< HEAD
  }),
=======
  })
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'order-service',
    version: process.env.SERVICE_VERSION || '1.0.0',
  });
});

// Metrics endpoint
app.get('/metrics', async(req, res) => {
  // Prometheus metrics will be exposed here
  res.set('Content-Type', 'text/plain');
  res.send('# Prometheus metrics');
});

// Order creation endpoint
const orderService = new OrderService();

app.post('/orders', async(req, res) => {
  const tracingContext = getTracingContext();

  try {
    const command: CreateOrderCommand = {
      id: generateId(),
      orderId: generateId(),
      userId: req.body.userId,
      items: req.body.items,
      total: req.body.total,
      correlationId: tracingContext?.traceId || generateId(),
    };

    const order = await orderService.createOrder(command);

    res.status(201).json({
      success: true,
      data: order,
      traceId: tracingContext?.traceId,
    });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      success: false,
      error: err.message,
      traceId: tracingContext?.traceId,
    });
  }
});

// Event subscriptions
natsClient.subscribeToEvents('inventory.reserved', async(event, span) => {
  logger.info('Received inventory reserved event', {
    ddd: {
      eventName: 'InventoryReserved',
      aggregateId: event.aggregateId,
    },
  });

  span.setAttribute('order.id', event.data.orderId);

  // Process the event...
});

// Graceful shutdown
process.on('SIGTERM', async() => {
  logger.info('Shutting down service...');

  // Close connections
  await new Promise(resolve => setTimeout(resolve, 1000));

  logger.info('Service shut down complete');
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Order service started on port ${PORT}`, {
    custom: {
      port: PORT,
      environment: process.env.NODE_ENV,
      pid: process.pid,
    },
  });
});

// Type definitions
interface CreateOrderCommand {
  id: string;
  orderId: string;
  userId: string;
  items: OrderItem[];
  total: number;
  correlationId: string;
}

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Order implements Order {
  constructor(data: Partial<Order>) {
    Object.assign(this, data);
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
