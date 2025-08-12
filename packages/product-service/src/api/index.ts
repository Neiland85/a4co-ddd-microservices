import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import routes from './routes';
import { generalRateLimiter } from './middleware/rate-limiter';

/**
 * Configuración principal de la API con seguridad avanzada
 */
export function createApp(): express.Application {
  const app = express();

  // Configuración de seguridad básica con Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // Configuración de CORS
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400 // 24 horas
  }));

  // Compresión de respuestas
  app.use(compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers['x-no-compression']) {
        return false;
      }
      return compression.filter(req, res);
    }
  }));

  // Rate limiting global
  app.use(generalRateLimiter);

  // Logging con Morgan
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => {
        console.log(message.trim());
      }
    }
  }));

  // Parsing de JSON con límites de seguridad
  app.use(express.json({
    limit: '10mb',
    verify: (req: any, res, buf) => {
      try {
        JSON.parse(buf);
      } catch (e) {
        res.status(400).json({
          error: 'Invalid JSON',
          message: 'El cuerpo de la petición no es un JSON válido'
        });
        throw new Error('Invalid JSON');
      }
    }
  }));

  // Parsing de URL encoded
  app.use(express.urlencoded({
    extended: true,
    limit: '10mb'
  }));

  // Headers de seguridad adicionales
  app.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'A4CO Product Service');
    res.setHeader('X-API-Version', '1.0.0');
    res.setHeader('X-Request-ID', req.headers['x-request-id'] || generateRequestId());
    next();
  });

  // Rutas de la API
  app.use('/', routes);

  // Middleware de manejo de errores global
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Global error handler:', err);

    // Si es un error de validación
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Los datos proporcionados no son válidos',
        details: err.details || err.message,
        timestamp: new Date().toISOString()
      });
    }

    // Si es un error de rate limiting
    if (err.status === 429) {
      return res.status(429).json({
        error: 'Rate Limit Exceeded',
        message: 'Has excedido el límite de peticiones',
        retryAfter: err.retryAfter,
        timestamp: new Date().toISOString()
      });
    }

    // Error interno del servidor
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Ha ocurrido un error interno',
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id'] || 'unknown'
    });
  });

  return app;
}

/**
 * Genera un ID único para cada petición
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Configuración del servidor
 */
export function configureServer(app: express.Application): void {
  const port = process.env.PORT || 3002;
  const host = process.env.HOST || 'localhost';

  app.listen(port, () => {
    console.log(`🚀 Product Service iniciado en http://${host}:${port}`);
    console.log(`📚 Documentación disponible en http://${host}:${port}/docs`);
    console.log(`💚 Health check en http://${host}:${port}/health`);
    console.log(`🔒 Rate limiting habilitado`);
    console.log(`🛡️  Seguridad avanzada activada`);
  });
} 