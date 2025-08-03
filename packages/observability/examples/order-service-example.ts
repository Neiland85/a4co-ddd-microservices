import express from 'express';
import { 
  initializeObservability, 
  withTracing, 
  tracePropagationMiddleware,
  createDDDSpan,
  injectTraceContext,
  logger 
} from '@a4co/observability';

// Inicializar observabilidad
const observability = initializeObservability({
  serviceName: 'order-service',
  serviceVersion: '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  logging: {
    level: 'info',
    prettyPrint: process.env.NODE_ENV !== 'production',
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

const app = express();

// Middleware de propagación de trace
app.use(tracePropagationMiddleware());

// Middleware de logging HTTP
app.use(observability.httpLogger);

// Controlador de órdenes con decorador de tracing
class OrderController {
  @withTracing({
    operationName: 'createOrder',
    aggregate: 'Order',
    command: 'CreateOrder',
    domain: 'OrderManagement',
    boundedContext: 'Order',
    captureRequestBody: true,
    captureResponseBody: true,
  })
  async createOrder(req: express.Request, res: express.Response) {
    const { orderData } = req.body;
    
    // Crear span para operación DDD
    return await createDDDSpan(
      'Order.CreateOrder',
      {
        aggregate: 'Order',
        command: 'CreateOrder',
        domain: 'OrderManagement',
        boundedContext: 'Order',
      },
      async (span) => {
        try {
          // Validar datos de entrada
          span.setAttribute('order.customer_id', orderData.customerId);
          span.setAttribute('order.total_amount', orderData.totalAmount);
          
          // Simular validación de negocio
          if (orderData.totalAmount <= 0) {
            throw new Error('Order amount must be greater than 0');
          }
          
          // Simular creación de orden
          const order = {
            id: `order-${Date.now()}`,
            customerId: orderData.customerId,
            totalAmount: orderData.totalAmount,
            status: 'pending',
            createdAt: new Date().toISOString(),
          };
          
          // Simular llamada a servicio externo (inventario)
          await this.checkInventory(orderData.items);
          
          // Simular persistencia
          await this.saveOrder(order);
          
          // Emitir evento de dominio
          await this.emitOrderCreatedEvent(order);
          
          span.setAttribute('order.id', order.id);
          span.setAttribute('order.status', order.status);
          
          res.status(201).json({
            success: true,
            order,
            traceId: span.spanContext().traceId,
          });
          
          return order;
        } catch (error) {
          span.setAttribute('order.error', error instanceof Error ? error.message : 'Unknown error');
          throw error;
        }
      }
    );
  }
  
  @withTracing({
    operationName: 'getOrder',
    aggregate: 'Order',
    command: 'GetOrder',
    domain: 'OrderManagement',
    boundedContext: 'Order',
  })
  async getOrder(req: express.Request, res: express.Response) {
    const { orderId } = req.params;
    
    return await createDDDSpan(
      'Order.GetOrder',
      {
        aggregate: 'Order',
        command: 'GetOrder',
        domain: 'OrderManagement',
        boundedContext: 'Order',
      },
      async (span) => {
        span.setAttribute('order.id', orderId);
        
        // Simular búsqueda de orden
        const order = await this.findOrder(orderId);
        
        if (!order) {
          res.status(404).json({ error: 'Order not found' });
          return null;
        }
        
        res.json({
          success: true,
          order,
          traceId: span.spanContext().traceId,
        });
        
        return order;
      }
    );
  }
  
  // Métodos privados con spans
  private async checkInventory(items: any[]) {
    const span = observability.getTracer('inventory').startSpan('inventory.check');
    
    try {
      span.setAttribute('inventory.items_count', items.length);
      
      // Simular llamada HTTP a servicio de inventario
      const response = await fetch('http://inventory-service:3001/api/inventory/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...injectTraceContext(),
        },
        body: JSON.stringify({ items }),
      });
      
      if (!response.ok) {
        throw new Error(`Inventory check failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      span.setAttribute('inventory.available', result.available);
      
      return result;
    } catch (error) {
      span.setStatus({ code: 2, message: error instanceof Error ? error.message : 'Unknown error' });
      span.recordException(error as Error);
      throw error;
    } finally {
      span.end();
    }
  }
  
  private async saveOrder(order: any) {
    const span = observability.getTracer('database').startSpan('database.save_order');
    
    try {
      span.setAttribute('database.operation', 'insert');
      span.setAttribute('database.table', 'orders');
      span.setAttribute('database.order_id', order.id);
      
      // Simular operación de base de datos
      await new Promise(resolve => setTimeout(resolve, 50));
      
      logger.info('Order saved successfully', { orderId: order.id });
      
      return order;
    } catch (error) {
      span.setStatus({ code: 2, message: error instanceof Error ? error.message : 'Unknown error' });
      span.recordException(error as Error);
      throw error;
    } finally {
      span.end();
    }
  }
  
  private async findOrder(orderId: string) {
    const span = observability.getTracer('database').startSpan('database.find_order');
    
    try {
      span.setAttribute('database.operation', 'select');
      span.setAttribute('database.table', 'orders');
      span.setAttribute('database.order_id', orderId);
      
      // Simular búsqueda en base de datos
      await new Promise(resolve => setTimeout(resolve, 30));
      
      // Simular orden encontrada
      return {
        id: orderId,
        customerId: 'customer-123',
        totalAmount: 99.99,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      };
    } catch (error) {
      span.setStatus({ code: 2, message: error instanceof Error ? error.message : 'Unknown error' });
      span.recordException(error as Error);
      throw error;
    } finally {
      span.end();
    }
  }
  
  private async emitOrderCreatedEvent(order: any) {
    const span = observability.getTracer('events').startSpan('events.emit_order_created');
    
    try {
      span.setAttribute('event.type', 'OrderCreated');
      span.setAttribute('event.aggregate_id', order.id);
      span.setAttribute('event.aggregate_type', 'Order');
      
      // Simular envío de evento a NATS
      const event = {
        type: 'OrderCreated',
        aggregateId: order.id,
        aggregateType: 'Order',
        data: order,
        timestamp: new Date().toISOString(),
        metadata: {
          traceId: span.spanContext().traceId,
          spanId: span.spanContext().spanId,
        },
      };
      
      // Simular publicación
      await new Promise(resolve => setTimeout(resolve, 20));
      
      logger.info('Order created event emitted', { 
        eventType: event.type, 
        orderId: order.id,
        traceId: span.spanContext().traceId,
      });
      
      return event;
    } catch (error) {
      span.setStatus({ code: 2, message: error instanceof Error ? error.message : 'Unknown error' });
      span.recordException(error as Error);
      throw error;
    } finally {
      span.end();
    }
  }
}

// Instanciar controlador
const orderController = new OrderController();

// Rutas
app.post('/api/orders', (req, res) => orderController.createOrder(req, res));
app.get('/api/orders/:orderId', (req, res) => orderController.getOrder(req, res));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'order-service',
    timestamp: new Date().toISOString(),
  });
});

// Métricas endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.end('# Metrics endpoint - handled by Prometheus exporter');
});

// Error handling middleware
app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error', { 
    error: error.message, 
    stack: error.stack,
    url: req.url,
    method: req.method,
  });
  
  res.status(500).json({ 
    error: 'Internal server error',
    traceId: req.headers['x-trace-id'],
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await observability.shutdown();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await observability.shutdown();
  process.exit(0);
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Order service started on port ${PORT}`, {
    service: 'order-service',
    port: PORT,
    environment: process.env.NODE_ENV,
  });
});

export default app;