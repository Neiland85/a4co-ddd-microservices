import { trace } from '@opentelemetry/api';
import pino from 'pino';
import pinoHttp from 'pino-http';

export interface LoggerConfig {
  serviceName: string;
  serviceVersion?: string;
  environment?: string;
  level?: string;
  prettyPrint?: boolean;
}

// Helper para obtener el trace ID actual
function getCurrentTraceId(): string | undefined {
  const span = trace.getActiveSpan();
  if (span) {
    const spanContext = span.spanContext();
    return spanContext.traceId;
  }
  return undefined;
}

// Helper para obtener el span ID actual
function getCurrentSpanId(): string | undefined {
  const span = trace.getActiveSpan();
  if (span) {
    const spanContext = span.spanContext();
    return spanContext.spanId;
  }
  return undefined;
}

// Crear logger base con configuración estructurada
export function createLogger(config: LoggerConfig): pino.Logger {
  const isProduction = config.environment === 'production';
  const isDevelopment = config.environment === 'development' || !config.environment;

  const pinoOptions: pino.LoggerOptions = {
    name: config.serviceName,
    level: config.level || (isProduction ? 'info' : 'debug'),
    formatters: {
      level: label => ({ level: label }),
      bindings: bindings => ({
<<<<<<< HEAD
        pid: bindings['pid'],
        host: bindings['hostname'],
=======
        pid: bindings.pid,
        host: bindings.hostname,
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
        service: config.serviceName,
        version: config.serviceVersion || '1.0.0',
        environment: config.environment || 'development',
      }),
    },
    // Agregar trace context a cada log
    mixin() {
      return {
        traceId: getCurrentTraceId(),
        spanId: getCurrentSpanId(),
      };
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    serializers: {
      req: pino.stdSerializers.req,
      res: pino.stdSerializers.res,
      err: pino.stdSerializers.err,
    },
  };

  // En desarrollo, usar pino-pretty para logs más legibles
  if (isDevelopment && config.prettyPrint !== false) {
    return pino({
      ...pinoOptions,
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
          singleLine: false,
        },
      },
    });
  }

  return pino(pinoOptions);
}

// Crear HTTP logger middleware
export function createHttpLogger(logger: pino.Logger) {
  return pinoHttp({
<<<<<<< HEAD
=======
    logger,
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    genReqId: req => {
      // Usar trace ID si está disponible
      const traceId = getCurrentTraceId();
      return traceId || req.id || req.headers['x-request-id'] || 'unknown';
    },
    customLogLevel: (req, res, err) => {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return 'warn';
      } else if (res.statusCode >= 500 || err) {
        return 'error';
      } else if (res.statusCode >= 300 && res.statusCode < 400) {
        return 'silent';
      }
      return 'info';
    },
    customSuccessMessage: (req, res) => {
      if (res.statusCode === 404) {
        return `${req.method} ${req.url} - Not Found`;
      }
      return `${req.method} ${req.url}`;
    },
    customErrorMessage: (req, res, err) => {
      return `${req.method} ${req.url} - ${err.message}`;
    },
    customAttributeKeys: {
      req: 'request',
      res: 'response',
      err: 'error',
      responseTime: 'duration',
    },
    customProps: (req, res) => ({
      traceId: getCurrentTraceId(),
      spanId: getCurrentSpanId(),
    }),
    // Ignorar rutas de health check y metrics
    autoLogging: {
      ignore: req => {
        return req.url === '/health' || req.url === '/metrics' || req.url === '/ready';
      },
    },
  });
}

// Logger singleton para uso global
let globalLogger: pino.Logger | null = null;

export function getGlobalLogger(): pino.Logger {
  if (!globalLogger) {
    throw new Error('Logger not initialized. Call initializeLogger first.');
  }
  return globalLogger;
}

export function initializeLogger(config: LoggerConfig): pino.Logger {
  globalLogger = createLogger(config);
  return globalLogger;
}
<<<<<<< HEAD

// Reset function for testing purposes
export function resetLoggerState(): void {
  globalLogger = null;
}
=======
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
