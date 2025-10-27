import { context, trace } from '@opentelemetry/api';
import pino from 'pino';
import pinoHttp from 'pino-http';

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
      level: label => ({ level: label }),
      bindings: bindings => ({
        service: bindings['name'] || config.serviceName,
        pid: bindings['pid'],
        hostname: bindings['hostname'],
        environment: config.environment,
      }),
    },
    // Agregar información de contexto a cada log
    mixin() {
      const traceId = getTraceId();
      const spanId = getSpanId();
      const contextData: Record<string, unknown> = {};

      if (traceId) {
        contextData['traceId'] = traceId;
      }
      if (spanId) {
        contextData['spanId'] = spanId;
      }

      // Agregar contexto adicional si está disponible
      const baggage = context.active().getValue(Symbol.for('baggage'));
      if (baggage) {
        contextData['baggage'] = baggage;
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
      error: (err: unknown) => {
        if (!err || typeof err !== 'object' || !('stack' in err)) {
          return err;
        }
        const error = err as Error & Record<string, unknown>;
        const { message, stack, ...errorProps } = error;
        return {
          type: error.constructor.name,
          message,
          stack,
          code: 'code' in error ? error['code'] : undefined,
          statusCode: 'statusCode' in error ? error['statusCode'] : undefined,
          ...errorProps,
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
export function createHttpLogger(logger?: pino.Logger): ReturnType<typeof pinoHttp> {
  if (logger) {
    return pinoHttp({
      logger,
      // Personalizar la generación de request ID
      genReqId: (req: unknown) => {
        // Usar trace ID si está disponible
        const traceId = getTraceId();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return traceId || (req as any).id || (req as any).headers?.['x-request-id'];
      },
      // Personalizar el log de request
      customLogLevel: (res: unknown, err: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const statusCode = (res as any).statusCode;
        if (statusCode >= 400 && statusCode < 500) {
          return 'warn';
        } else if (statusCode >= 500 || err) {
          return 'error';
        }
        return 'info';
      },
      // Agregar propiedades adicionales al log
      customProps: (req: unknown, res: unknown) => {
        return {
          traceId: getTraceId(),
          spanId: getSpanId(),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          method: (req as any).method,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          url: (req as any).url,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          statusCode: (res as any).statusCode,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          duration: Date.now() - (req as any).startTime,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          userAgent: (req as any).headers?.['user-agent'],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ip: (req as any).ip || (req as any).connection?.remoteAddress,
        };
      },
      // Configurar qué loguear
      autoLogging: {
        ignore: (req: unknown) => {
          // Ignorar health checks
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (req as any).url === '/health' || (req as any).url === '/metrics';
        },
      },
    });
  } else {
    return pinoHttp();
  }
}

// Utilidades para logging estructurado
export class StructuredLogger {
  private logger: pino.Logger;

  constructor(logger: pino.Logger) {
    this.logger = logger;
  }

  // Log con contexto adicional - sobrecarga para compatibilidad
  // eslint-disable-next-line no-unused-vars
  logWithContext(level: string, message: string, context: Record<string, unknown>): void;
  // eslint-disable-next-line no-unused-vars
  logWithContext(level: string, context: Record<string, unknown>): void;
  logWithContext(
    level: string,
    messageOrContext: string | Record<string, unknown>,
    context?: Record<string, unknown>
  ): void {
    let message: string;
    let finalContext: Record<string, unknown>;

    if (typeof messageOrContext === 'string') {
      message = messageOrContext;
      finalContext = context || {};
    } else {
      message = '';
      finalContext = messageOrContext;
    }

    const span = trace.getActiveSpan();
    if (span) {
      // Agregar atributos al span actual
      Object.entries(finalContext).forEach(([key, value]) => {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
          span.setAttribute(key, value);
        } else {
          span.setAttribute(key, String(value));
        }
      });
    }

    // eslint-disable-next-line no-unused-vars
    (this.logger[level as keyof pino.Logger] as (obj: unknown, msg?: string) => void)(
      finalContext,
      message || undefined
    );
  }

  // Métodos convenientes - API simplificada
  info(message: string, context?: Record<string, unknown>): void {
    this.logWithContext('info', message, context || {});
  }

  error(
    message: string,
    errorOrContext?: Error | Record<string, unknown>,
    context?: Record<string, unknown>
  ): void {
    if (errorOrContext instanceof Error) {
      this.logWithContext('error', message, {
        ...(context || {}),
        error: {
          message: errorOrContext.message,
          stack: errorOrContext.stack,
          name: errorOrContext.name,
        },
      });
    } else {
      this.logWithContext('error', message, errorOrContext || {});
    }
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.logWithContext('warn', message, context || {});
  }

  debug(message: string, context?: Record<string, unknown>): void {
    this.logWithContext('debug', message, context || {});
  }

  // Log de métricas de negocio
  metric(name: string, value: number, tags?: Record<string, string>): void {
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
  audit(action: string, userId: string, resource: string, details?: Record<string, unknown>): void {
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

  // Métodos adicionales para compatibilidad
  fatal(message: string, context?: Record<string, unknown>): void {
    this.logWithContext('fatal', message, context || {});
  }

  withContext(context: Record<string, unknown>): StructuredLogger {
    // Crear un logger con contexto adicional
    const enhancedLogger = Object.create(this);
    enhancedLogger.defaultContext = { ...this.defaultContext, ...context };
    return enhancedLogger;
  }

  withDDD(metadata: {
    aggregateName?: string;
    aggregateId?: string;
    commandName?: string;
    eventName?: string;
  }): StructuredLogger {
    // Crear un logger con contexto DDD
    return this.withContext({
      aggregate: metadata.aggregateName,
      aggregateId: metadata.aggregateId,
      command: metadata.commandName,
      event: metadata.eventName,
    });
  }

  // Propiedad para contexto por defecto
  private defaultContext: Record<string, unknown> = {};
}

// Global logger instance
let globalLogger: StructuredLogger | null = null;

// Initialize logger
export function initializeLogger(config: LoggerConfig): StructuredLogger {
  const pinoLogger = createLogger(config);
  globalLogger = new StructuredLogger(pinoLogger);
  return globalLogger;
}

// Get logger instance
export function getLogger(): StructuredLogger {
  if (!globalLogger) {
    // Create default logger if not initialized
    const defaultConfig: LoggerConfig = {
      serviceName: 'default-service',
      environment: process.env['NODE_ENV'] || 'development',
    };
    const pinoLogger = createLogger(defaultConfig);
    globalLogger = new StructuredLogger(pinoLogger);
  }
  return globalLogger;
}
