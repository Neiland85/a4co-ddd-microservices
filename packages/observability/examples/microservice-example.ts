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

export { app, Product, ProductCommandHandler, ProductEventHandler };