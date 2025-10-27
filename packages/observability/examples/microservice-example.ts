    cursor/design-microservice-communication-strategy-a023
import express, { Request, Response, NextFunction } from 'express';
import { initializeObservability, TracingUtils, Trace, TracedHttpClient } from '@a4co/observability';

// Configurar observabilidad
const observability = initializeObservability({
  serviceName: 'user-service',
  serviceVersion: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    prettyPrint: process.env.NODE_ENV !== 'production',
  },
  tracing: {
    enabled: true,
    exporterType: process.env.TRACE_EXPORTER as any || 'console',
    jaegerEndpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
    otlpEndpoint: process.env.OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
    sampleRate: parseFloat(process.env.TRACE_SAMPLE_RATE || '1.0'),
  },
});

// Obtener herramientas de observabilidad
const logger = observability.getStructuredLogger();
const httpClient = observability.getHttpClient();
const middleware = observability.getMiddleware();

// Crear aplicación Express
const app = express();

// Configurar middleware de observabilidad (ORDEN IMPORTANTE)
app.use(middleware.observability);      // 1. Contexto de tracing
app.use(middleware.logCorrelation);     // 2. Correlación de logs
app.use(middleware.httpLogging);        // 3. Logging HTTP
app.use(express.json());                // 4. Body parser

// Ejemplo de servicio con instrumentación
class UserService {
  private db: any; // Simulación de base de datos
  
  constructor() {
    this.db = new Map();
  }
  
  // Decorador @Trace para instrumentación automática
  @Trace('UserService.createUser')
  async createUser(userData: any): Promise<any> {
    // Log estructurado con contexto
    logger.info('Creating new user', {
      operation: 'createUser',
      email: userData.email,
    });
    
    // Agregar evento al span actual
    TracingUtils.addEvent('user.validation.start');
    
    // Validación
    if (!userData.email || !userData.name) {
      const error = new Error('Invalid user data');
      logger.error('User validation failed', error, {
        userData,
      });
      throw error;
    }
    
    TracingUtils.addEvent('user.validation.complete');
    
    // Simular operación de base de datos con span manual
    const user = await TracingUtils.withSpan('db.user.insert', async (span) => {
      span.setAttributes({
        'db.operation': 'insert',
        'db.collection': 'users',
        'user.email': userData.email,
      });
      
      // Simular latencia
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date(),
      };
      
      this.db.set(newUser.id, newUser);
      
      return newUser;
    });
    
    // Log de auditoría
    logger.audit('USER_CREATED', user.id, 'user', {
      email: user.email,
      ip: '127.0.0.1', // En producción, obtener del request
    });
    
    // Métricas de negocio
    logger.metric('users.created', 1, {
      plan: userData.plan || 'free',
    });
    
    return user;
  }
  
  @Trace('UserService.getUserById')
  async getUserById(id: string): Promise<any> {
    logger.debug('Fetching user by ID', { userId: id });
    
    const user = await TracingUtils.withSpan('db.user.findById', async (span) => {
      span.setAttributes({
        'db.operation': 'findOne',
        'db.collection': 'users',
        'user.id': id,
      });
      
      await new Promise(resolve => setTimeout(resolve, 20));
      return this.db.get(id);
    });
    
    if (!user) {
      logger.warn('User not found', { userId: id });
      throw new Error('User not found');
    }
    
    return user;
  }
  
  @Trace('UserService.notifyUserCreated')
  async notifyUserCreated(user: any): Promise<void> {
    logger.info('Notifying user creation', { userId: user.id });
    
    try {
      // Llamada a otro servicio con propagación de contexto
      const response = await httpClient.post(
        'http://notification-service:3000/notifications',
        {
          type: 'USER_WELCOME',
          userId: user.id,
          email: user.email,
          data: {
            name: user.name,
          },
        }
      );
      
      logger.info('Notification sent successfully', {
        userId: user.id,
        notificationId: response.data.id,
      });
    } catch (error: any) {
      logger.error('Failed to send notification', error, {
        userId: user.id,
      });
      // No lanzar error para no bloquear creación de usuario
    }
  }
}

// Instanciar servicio
const userService = new UserService();

// Rutas con instrumentación
app.post('/users', async (req: any, res: Response, next: NextFunction) => {
  try {
    // El contexto de tracing ya está establecido por el middleware
    const user = await userService.createUser(req.body);
    
    // Notificar de forma asíncrona
    userService.notifyUserCreated(user).catch(err => {
      req.log.error('Background notification failed', err);
    });
    
    res.status(201).json({
      data: user,
      traceId: req.traceId, // Incluir trace ID en respuesta
    });
  } catch (error) {
    next(error);
  }
});

app.get('/users/:id', async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.params.id);
    
    res.json({
      data: user,
      traceId: req.traceId,
    });
  } catch (error) {
    next(error);
  }
});

// Endpoint de health check (ignorado por logging middleware)
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy' });
});

// Endpoint de métricas
app.get('/metrics', async (req: Request, res: Response) => {
  // En producción, usar Prometheus registry
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  });
});

// Ejemplo de llamada entre servicios
app.get('/users/:id/orders', async (req: any, res: Response, next: NextFunction) => {
  try {
    // Verificar que el usuario existe
    const user = await userService.getUserById(req.params.id);
    
    // Llamar al servicio de órdenes con propagación de contexto
    const orders = await TracingUtils.withSpan('http.order-service.getOrders', async (span) => {
      span.setAttributes({
        'http.url': `http://order-service:3000/orders`,
        'http.method': 'GET',
        'user.id': user.id,
      });
      
      const response = await httpClient.get(`http://order-service:3000/orders`, {
        params: { userId: user.id },
      });
      
      return response.data;
    });
    
    res.json({
      data: {
        user,
        orders: orders.data,
      },
      traceId: req.traceId,
    });
  } catch (error) {
    next(error);
  }
});

// Middleware de manejo de errores (debe ir al final)
app.use(middleware.errorHandling);

// Iniciar servidor
const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  logger.info('User service started', {
    port: PORT,
    environment: process.env.NODE_ENV,
    pid: process.pid,
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  
  server.close(() => {
    logger.info('HTTP server closed');
  });
  
  // Esperar a que se completen las trazas pendientes
  await observability.shutdown();
  
  process.exit(0);
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled rejection', new Error('Unhandled rejection'), {
    reason,
    promise,
  });
});

export default app;
import express from 'express';
import { initializeObservability } from '../src';
import { 
  TraceCommand, 
  TraceEventHandler, 
  TraceAggregateMethod,
  DDDContext,
  dddContextMiddleware,
  traceDomainTransaction,
  createDomainSpan
} from '../src/ddd-tracing';
import { logger } from '../src';

// Configuración de observabilidad
const observability = initializeObservability({
  serviceName: 'product-service',
  serviceVersion: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  logging: {
    level: 'info',
    prettyPrint: process.env.NODE_ENV === 'development',
  },
  tracing: {
    enabled: true,
    jaegerEndpoint: process.env.JAEGER_ENDPOINT || 'http://localhost:14268/api/traces',
    enableConsoleExporter: process.env.NODE_ENV === 'development',
    enableAutoInstrumentation: true,
  },
  metrics: {
    enabled: true,
    port: 9464,
    endpoint: '/metrics',
  },
});

// Agregado de Producto (DDD)
class Product {
  constructor(
    public id: string,
    public name: string,
    public price: number,
    public stock: number
  ) {}

  @TraceAggregateMethod('Product')
  async updateStock(quantity: number): Promise<void> {
    logger.info('Updating product stock', {
      productId: this.id,
      currentStock: this.stock,
      newQuantity: quantity,
    });

    if (this.stock + quantity < 0) {
      throw new Error('Insufficient stock');
    }

    this.stock += quantity;
    
    logger.info('Product stock updated', {
      productId: this.id,
      newStock: this.stock,
    });
  }

  @TraceAggregateMethod('Product')
  async updatePrice(newPrice: number): Promise<void> {
    logger.info('Updating product price', {
      productId: this.id,
      currentPrice: this.price,
      newPrice,
    });

    if (newPrice < 0) {
      throw new Error('Price cannot be negative');
    }

    this.price = newPrice;
    
    logger.info('Product price updated', {
      productId: this.id,
      newPrice: this.price,
    });
  }
}

// Comando para crear producto
interface CreateProductCommand {
  commandId: string;
  name: string;
  price: number;
  initialStock: number;
  userId: string;
  correlationId: string;
}

// Comando para actualizar stock
interface UpdateStockCommand {
  commandId: string;
  productId: string;
  quantity: number;
  userId: string;
  correlationId: string;
}

// Evento de producto creado
interface ProductCreatedEvent {
  eventId: string;
  productId: string;
  name: string;
  price: number;
  initialStock: number;
  correlationId: string;
  causationId: string;
}

// Evento de stock actualizado
interface StockUpdatedEvent {
  eventId: string;
  productId: string;
  oldStock: number;
  newStock: number;
  quantity: number;
  correlationId: string;
  causationId: string;
}

// Command Handler
class ProductCommandHandler {
  private products = new Map<string, Product>();

  @TraceCommand('CreateProduct')
  async handleCreateProduct(command: CreateProductCommand): Promise<ProductCreatedEvent> {
    logger.info('Handling CreateProduct command', {
      commandId: command.commandId,
      correlationId: command.correlationId,
      userId: command.userId,
    });

    const product = new Product(
      command.commandId, // Usar commandId como productId para simplicidad
      command.name,
      command.price,
      command.initialStock
    );

    this.products.set(product.id, product);

    const event: ProductCreatedEvent = {
      eventId: `evt_${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      initialStock: product.stock,
      correlationId: command.correlationId,
      causationId: command.commandId,
    };

    logger.info('Product created', {
      productId: product.id,
      eventId: event.eventId,
    });

    return event;
  }

  @TraceCommand('UpdateStock')
  async handleUpdateStock(command: UpdateStockCommand): Promise<StockUpdatedEvent> {
    logger.info('Handling UpdateStock command', {
      commandId: command.commandId,
      productId: command.productId,
      correlationId: command.correlationId,
    });

    const product = this.products.get(command.productId);
    if (!product) {
      throw new Error(`Product not found: ${command.productId}`);
    }

    const oldStock = product.stock;
    await product.updateStock(command.quantity);

    const event: StockUpdatedEvent = {
      eventId: `evt_${Date.now()}`,
      productId: product.id,
      oldStock,
      newStock: product.stock,
      quantity: command.quantity,
      correlationId: command.correlationId,
      causationId: command.commandId,
    };

    logger.info('Stock updated', {
      productId: product.id,
      eventId: event.eventId,
      oldStock,
      newStock: product.stock,
    });

    return event;
  }
}

// Event Handler
class ProductEventHandler {
  @TraceEventHandler('ProductCreated')
  async handleProductCreated(event: ProductCreatedEvent): Promise<void> {
    logger.info('Handling ProductCreated event', {
      eventId: event.eventId,
      productId: event.productId,
      correlationId: event.correlationId,
    });

    // Simular procesamiento del evento
    await new Promise(resolve => setTimeout(resolve, 100));
    
    logger.info('ProductCreated event processed', {
      eventId: event.eventId,
      productId: event.productId,
    });
  }

  @TraceEventHandler('StockUpdated')
  async handleStockUpdated(event: StockUpdatedEvent): Promise<void> {
    logger.info('Handling StockUpdated event', {
      eventId: event.eventId,
      productId: event.productId,
      correlationId: event.correlationId,
    });

    // Simular procesamiento del evento
    await new Promise(resolve => setTimeout(resolve, 50));
    
    logger.info('StockUpdated event processed', {
      eventId: event.eventId,
      productId: event.productId,
    });
  }
}

// Controlador REST
class ProductController {
  private commandHandler = new ProductCommandHandler();
  private eventHandler = new ProductEventHandler();

  async createProduct(req: express.Request, res: express.Response): Promise<void> {
    const correlationId = req.headers['x-correlation-id'] as string || `req_${Date.now()}`;
    const userId = req.headers['x-user-id'] as string || 'anonymous';

    const command: CreateProductCommand = {
      commandId: `cmd_${Date.now()}`,
      name: req.body.name,
      price: req.body.price,
      initialStock: req.body.initialStock || 0,
      userId,
      correlationId,
    };

    try {
      const event = await traceDomainTransaction(
        'createProduct',
        command,
        () => this.commandHandler.handleCreateProduct(command)
      );

      // Procesar el evento
      await this.eventHandler.handleProductCreated(event);

      res.status(201).json({
        productId: event.productId,
        message: 'Product created successfully',
        correlationId,
      });
    } catch (error) {
      logger.error('Error creating product', error as Error, {
        commandId: command.commandId,
        correlationId,
      });

      res.status(500).json({
        error: 'Failed to create product',
        correlationId,
      });
    }
  }

  async updateStock(req: express.Request, res: express.Response): Promise<void> {
    const correlationId = req.headers['x-correlation-id'] as string || `req_${Date.now()}`;
    const userId = req.headers['x-user-id'] as string || 'anonymous';
    const productId = req.params.id;

    const command: UpdateStockCommand = {
      commandId: `cmd_${Date.now()}`,
      productId,
      quantity: req.body.quantity,
      userId,
      correlationId,
    };

    try {
      const event = await traceDomainTransaction(
        'updateStock',
        command,
        () => this.commandHandler.handleUpdateStock(command)
      );

      // Procesar el evento
      await this.eventHandler.handleStockUpdated(event);

      res.json({
        productId: event.productId,
        newStock: event.newStock,
        message: 'Stock updated successfully',
        correlationId,
      });
    } catch (error) {
      logger.error('Error updating stock', error as Error, {
        commandId: command.commandId,
        productId,
        correlationId,
      });

      res.status(500).json({
        error: 'Failed to update stock',
        correlationId,
      });
    }
  }

  async getProduct(req: express.Request, res: express.Response): Promise<void> {
    const correlationId = req.headers['x-correlation-id'] as string || `req_${Date.now()}`;
    const productId = req.params.id;

    const span = createDomainSpan('getProduct', {
      aggregateName: 'Product',
      aggregateId: productId,
    });

    try {
      // Simular búsqueda de producto
      await new Promise(resolve => setTimeout(resolve, 50));

      const product = {
        id: productId,
        name: 'Sample Product',
        price: 99.99,
        stock: 100,
      };

      span.setStatus({ code: 1 }); // OK
      res.json({
        product,
        correlationId,
      });
    } catch (error) {
      span.setStatus({
        code: 2, // ERROR
        message: error instanceof Error ? error.message : String(error),
      });
      span.recordException(error as Error);

      res.status(500).json({
        error: 'Failed to get product',
        correlationId,
      });
    } finally {
      span.end();
    }
  }
}

// Configurar Express
const app = express();
app.use(express.json());

// Middleware de observabilidad
app.use(dddContextMiddleware());
app.use(observability.httpLogger);

// Rutas
const productController = new ProductController();

app.post('/products', (req, res) => productController.createProduct(req, res));
app.patch('/products/:id/stock', (req, res) => productController.updateStock(req, res));
app.get('/products/:id', (req, res) => productController.getProduct(req, res));

// Endpoint de health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Endpoint de métricas
app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.end('metrics endpoint');
});

// Manejo de errores global
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', error, {
    url: req.url,
    method: req.method,
    correlationId: req.headers['x-correlation-id'],
  });

  res.status(500).json({
    error: 'Internal server error',
    correlationId: req.headers['x-correlation-id'],
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Product service started on port ${PORT}`, {
    serviceName: 'product-service',
    port: PORT,
    environment: process.env.NODE_ENV,
  });
});

// Manejo de shutdown graceful
process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM, shutting down gracefully');
  await observability.shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully');
  await observability.shutdown();
  process.exit(0);
});

     develop
