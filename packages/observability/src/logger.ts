import pino from 'pino';
import { trace, context } from '@opentelemetry/api';

export interface LoggerConfig {
  serviceName: string;
  environment: string;
  level?: string;
  prettyPrint?: boolean;
}

// Función para obtener el trace ID actual
function getTraceId(): string | undefined {
  const span = trace.getActiveSpan();
  if (span) {
    const spanContext = span.spanContext();
    return spanContext.traceId;
  }
  return undefined;
}

// Función para obtener el span ID actual
function getSpanId(): string | undefined {
  const span = trace.getActiveSpan();
  if (span) {
    const spanContext = span.spanContext();
    return spanContext.spanId;
  }
  return undefined;
}

// Crear logger con configuración estructurada
export function createLogger(config: LoggerConfig): pino.Logger {
  const isProduction = config.environment === 'production';
  
  const pinoConfig: pino.LoggerOptions = {
    name: config.serviceName,
    level: config.level || (isProduction ? 'info' : 'debug'),
    // Formateo estructurado en JSON
    formatters: {
      level: (label) => ({ level: label }),
      bindings: (bindings) => ({
        service: bindings.name || config.serviceName,
        pid: bindings.pid,
        hostname: bindings.hostname,
        environment: config.environment,
      }),
    },
    // Agregar información de contexto a cada log
    mixin() {
      const traceId = getTraceId();
      const spanId = getSpanId();
      const contextData: any = {};
      
      if (traceId) {
        contextData.traceId = traceId;
      }
      if (spanId) {
        contextData.spanId = spanId;
      }
      
      // Agregar contexto adicional si está disponible
      const baggage = context.active().getValue(Symbol.for('baggage'));
      if (baggage) {
        contextData.baggage = baggage;
      }
      
      return contextData;
    },
    // Timestamp en ISO format
    timestamp: pino.stdTimeFunctions.isoTime,
    // Serializers personalizados
    serializers: {
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
      err: pino.stdSerializers.err,
      // Serializer personalizado para errores con más detalles
      error: (err: any) => {
        if (!err || !err.stack) {
          return err;
        }
        return {
          type: err.constructor.name,
          message: err.message,
          stack: err.stack,
          code: err.code,
          statusCode: err.statusCode,
          ...err,
        };
      },
    },
  };

  // En desarrollo, usar pino-pretty para logs más legibles
  if (!isProduction && config.prettyPrint !== false) {
    return pino({
      ...pinoConfig,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
          singleLine: false,
          errorProps: 'type,message,stack,code,statusCode',
        },
      },
    });
  }

  return pino(pinoConfig);
}

// Logger middleware para HTTP requests
export function createHttpLogger(logger: pino.Logger) {
  const pinoHttp = require('pino-http');
  
  return pinoHttp({
    logger,
    // Personalizar la generación de request ID
    genReqId: (req: any) => {
      // Usar trace ID si está disponible
      const traceId = getTraceId();
      return traceId || req.id || req.headers['x-request-id'];
    },
    // Personalizar el log de request
    customLogLevel: (res: any, err: any) => {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return 'warn';
      } else if (res.statusCode >= 500 || err) {
        return 'error';
      }
      return 'info';
    },
    // Agregar propiedades adicionales al log
    customProps: (req: any, res: any) => {
      return {
        traceId: getTraceId(),
        spanId: getSpanId(),
        method: req.method,
        url: req.url,
        statusCode: res.statusCode,
        duration: Date.now() - req.startTime,
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.connection.remoteAddress,
      };
    },
    // Configurar qué loguear
    autoLogging: {
      ignore: (req: any) => {
        // Ignorar health checks
        return req.url === '/health' || req.url === '/metrics';
      },
    },
  });
}

// Utilidades para logging estructurado
export class StructuredLogger {
  private logger: pino.Logger;

  constructor(logger: pino.Logger) {
    this.logger = logger;
  }

  // Log con contexto adicional
  logWithContext(level: string, message: string, context: Record<string, any>) {
    const span = trace.getActiveSpan();
    if (span) {
      // Agregar atributos al span actual
      Object.entries(context).forEach(([key, value]) => {
        span.setAttribute(key, value as any);
      });
    }
    
    (this.logger as any)[level]({
      ...context,
      msg: message,
    });
  }

  // Métodos convenientes
  info(message: string, context?: Record<string, any>) {
    this.logWithContext('info', message, context || {});
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.logWithContext('error', message, {
      ...(context || {}),
      error: error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : undefined,
    });
  }

  warn(message: string, context?: Record<string, any>) {
    this.logWithContext('warn', message, context || {});
  }

  debug(message: string, context?: Record<string, any>) {
    this.logWithContext('debug', message, context || {});
  }

  // Log de métricas de negocio
  metric(name: string, value: number, tags?: Record<string, string>) {
    this.logger.info({
      type: 'metric',
      metric: {
        name,
        value,
        tags: tags || {},
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Log de eventos de auditoría
  audit(action: string, userId: string, resource: string, details?: Record<string, any>) {
    this.logger.info({
      type: 'audit',
      audit: {
        action,
        userId,
        resource,
        timestamp: new Date().toISOString(),
        ...details,
      },
    });
  }
}