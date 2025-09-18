import express from 'express';
import { connect } from 'nats';
import Redis from 'ioredis';
import {
  initializeObservability,
  expressObservabilityMiddleware,
  expressErrorHandler,
  instrumentNatsClient,
  instrumentRedisClient,
  getLogger,
  getTracer,
  CommandHandler,
  EventHandler,
  Trace,
  withSpan,
  createDDDSpan,
  recordCommandExecution,
  recordEvent,
  generateCorrelationId,
  generateCausationId,
} from '@a4co/observability';

// 1. Inicializar observabilidad al inicio de la aplicación
async function bootstrap() {
  await initializeObservability({
    serviceName: 'order-service',
    serviceVersion: process.env.SERVICE_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    logging: {
      level: (process.env.LOG_LEVEL as any) || 'info',
      prettyPrint: process.env.NODE_ENV === 'development',
      redact: ['password', 'creditCard', 'ssn', 'apiKey'],
    },
    tracing: {
      enabled: true,
      jaegerEndpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
      samplingRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    },
    metrics: {
      enabled: true,
      port: parseInt(process.env.METRICS_PORT || '9090'),
    },
  });

  const logger = getLogger();
  logger.info('Order service starting...');

  // 2. Conectar servicios externos con instrumentación
  const nats = await connectNats();
  const redis = await connectRedis();

  // 3. Iniciar servidor Express
  const app = createExpressApp();

  // 4. Configurar handlers DDD
  setupDomainHandlers(nats);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logger.info({ port }, 'Order service started successfully');
  });
}

// Conectar NATS con instrumentación
async function connectNats() {
  const logger = getLogger();

  try {
    const nc = await connect({
      servers: process.env.NATS_URL || 'nats://localhost:4222',
      name: 'order-service',
    });

    logger.info('Connected to NATS');
    return instrumentNatsClient(nc);
  } catch (error) {
    logger.error({ error }, 'Failed to connect to NATS');
    throw error;
  }
}

// Conectar Redis con instrumentación
async function connectRedis() {
  const logger = getLogger();

  const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
  });

  redis.on('connect', () => {
    logger.info('Connected to Redis');
  });

  redis.on('error', error => {
    logger.error({ error }, 'Redis error');
  });

  return instrumentRedisClient(redis);
}

// Crear aplicación Express con middleware de observabilidad
function createExpressApp() {
  const app = express();
  const logger = getLogger();

  // Middleware de observabilidad
  app.use(
    expressObservabilityMiddleware({
      ignorePaths: ['/health', '/metrics', '/favicon.ico'],
      includeRequestBody: true,
      customAttributes: req => ({
        tenantId: req.headers['x-tenant-id'],
        clientVersion: req.headers['x-client-version'],
      }),
    })
  );

  app.use(express.json());

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'healthy', service: 'order-service' });
  });

  // Endpoint de creación de orden con observabilidad completa
  app.post('/api/orders', async (req: any, res) => {
    const correlationId = req.correlationId || generateCorrelationId();
    const causationId = generateCausationId(correlationId);

    // Logger con contexto de la petición
    const logger = req.log.withContext({
      correlationId,
      causationId,
      customerId: req.body.customerId,
    });

    logger.info('Creating new order');

    try {
      const order = await withSpan('createOrder', async () => {
        // Validar orden
        const validation = await validateOrder(req.body);
        if (!validation.isValid) {
          throw new ValidationError(validation.errors);
        }

        // Crear orden usando DDD
        const command = new CreateOrderCommand({
          ...req.body,
          correlationId,
          causationId,
        });

        const handler = new CreateOrderCommandHandler();
        return await handler.handle(command);
      });

      logger.info({ orderId: order.id }, 'Order created successfully');
      res.status(201).json(order);
    } catch (error) {
      logger.error({ error }, 'Failed to create order');
      res.status(error.statusCode || 500).json({
        error: error.message,
        correlationId,
      });
    }
  });

  // Error handler
  app.use(expressErrorHandler());

  return app;
}

// Clases DDD con observabilidad integrada
class CreateOrderCommand {
  constructor(
    public readonly data: {
      customerId: string;
      items: Array<{ productId: string; quantity: number }>;
      shippingAddress: string;
      correlationId: string;
      causationId: string;
    }
  ) {}
}

class CreateOrderCommandHandler {
  private logger = getLogger().withContext({ handler: 'CreateOrderCommandHandler' });

  @CommandHandler('CreateOrder', 'Order')
  async handle(command: CreateOrderCommand) {
    const startTime = Date.now();

    this.logger.info({ command: command.data }, 'Handling CreateOrder command');

    try {
      // Crear span DDD
      const span = createDDDSpan('CreateOrder', {
        aggregateName: 'Order',
        commandName: 'CreateOrder',
        correlationId: command.data.correlationId,
        causationId: command.data.causationId,
        userId: command.data.customerId,
      });

      try {
        // Lógica de negocio
        const order = await this.createOrder(command);

        // Publicar evento
        await this.publishOrderCreatedEvent(order);

        span.setStatus({ code: 0 });
        return order;
      } finally {
        span.end();
      }
    } catch (error) {
      this.logger.error({ error, command: command.data }, 'Failed to handle CreateOrder command');
      throw error;
    }
  }

  @Trace({ recordResult: true })
  private async createOrder(command: CreateOrderCommand) {
    // Simular creación de orden
    const order = {
      id: `order_${Date.now()}`,
      customerId: command.data.customerId,
      items: command.data.items,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Guardar en Redis
    const redis = await connectRedis();
    await redis.set(`order:${order.id}`, JSON.stringify(order), 'EX', 3600);

    return order;
  }

  private async publishOrderCreatedEvent(order: any) {
    const logger = this.logger.withContext({ orderId: order.id });

    try {
      const nats = await connectNats();
      const event = {
        eventType: 'OrderCreated',
        aggregateId: order.id,
        data: order,
        timestamp: new Date().toISOString(),
      };

      await nats.publish('orders.created', JSON.stringify(event));

      // Registrar evento en métricas
      recordEvent('OrderCreated', 'Order', 'published');

      logger.info('OrderCreated event published');
    } catch (error) {
      logger.error({ error }, 'Failed to publish OrderCreated event');
      throw error;
    }
  }
}

// Configurar handlers de eventos
function setupDomainHandlers(nats: any) {
  const logger = getLogger();

  // Handler para eventos de inventario
  nats.subscribe('inventory.updated', async (msg: any) => {
    const handler = new InventoryUpdatedEventHandler();
    await handler.handle(msg);
  });

  logger.info('Domain event handlers configured');
}

class InventoryUpdatedEventHandler {
  private logger = getLogger().withContext({ handler: 'InventoryUpdatedEventHandler' });

  @EventHandler('InventoryUpdated', 'Inventory')
  async handle(msg: any) {
    try {
      const event = JSON.parse(msg.data);
      this.logger.info({ event }, 'Processing InventoryUpdated event');

      // Lógica de procesamiento
      await this.updateOrderStatus(event);

      // Registrar procesamiento exitoso
      recordEvent('InventoryUpdated', 'Inventory', 'processed');
    } catch (error) {
      this.logger.error({ error }, 'Failed to process InventoryUpdated event');
      throw error;
    }
  }

  @Trace()
  private async updateOrderStatus(event: any) {
    // Lógica para actualizar estado de orden basado en inventario
    this.logger.debug({ event }, 'Updating order status based on inventory');
  }
}

// Funciones auxiliares
async function validateOrder(orderData: any) {
  return withSpan('validateOrder', async () => {
    const errors = [];

    if (!orderData.customerId) {
      errors.push('Customer ID is required');
    }

    if (!orderData.items || orderData.items.length === 0) {
      errors.push('Order must contain at least one item');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  });
}

class ValidationError extends Error {
  statusCode = 400;

  constructor(public errors: string[]) {
    super('Validation failed');
  }
}

// Iniciar aplicación
bootstrap().catch(error => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
