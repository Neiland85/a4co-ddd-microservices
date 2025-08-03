import express, { Request, Response, NextFunction } from 'express';
import { setupObservability, TracingUtils, Trace, TracedHttpClient } from '@a4co/observability';

// Configurar observabilidad
const observability = setupObservability({
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