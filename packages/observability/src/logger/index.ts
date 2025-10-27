import { trace } from '@opentelemetry/api';
import pino, { Logger, LoggerOptions } from 'pino';
import { v4 as uuidv4 } from 'uuid';
import type { ObservabilityLogger } from '../ObservabilityLogger';
import { LogContext, LoggerConfig } from '../types';

// Global logger instance
let globalLogger: ObservabilityLogger | null = null;

// Custom serializers for common objects
const defaultSerializers = {
  req: (req: any) => ({
    id: req.id,
    method: req.method,
    url: req.url,
    query: req.query,
    params: req.params,
    headers: {
      'user-agent': req.headers?.['user-agent'],
      'x-trace-id': req.headers?.['x-trace-id'],
      'x-correlation-id': req.headers?.['x-correlation-id'],
    },
  }),
  res: (res: any) => ({
    statusCode: res.statusCode,
    headers: res.getHeaders?.(),
  }),
  err: pino.stdSerializers.err,
  error: pino.stdSerializers.err,
  ddd: (metadata: DDDMetadata) => ({
    aggregate: metadata.aggregateName
      ? {
          id: metadata.aggregateId,
          name: metadata.aggregateName,
        }
      : undefined,
    command: metadata.commandName,
    event: metadata.eventName
      ? {
          name: metadata.eventName,
          version: metadata.eventVersion,
        }
      : undefined,
    correlationId: metadata.correlationId,
    causationId: metadata.causationId,
  }),
};

// Create enhanced logger with context support
function createEnhancedLogger(baseLogger: Logger): ObservabilityLogger {
  const enhancedLogger = Object.create(baseLogger) as ObservabilityLogger;

  enhancedLogger.withContext = function(ctx: LogContext): ObservabilityLogger {
    return createEnhancedLogger(baseLogger.child(ctx));
  };

  enhancedLogger.startSpan = function(name: string, attributes?: Record<string, any>) {
    const tracer = trace.getTracer('@a4co/observability');
    const span = tracer.startSpan(name, { attributes });
    // Log span start (opcional, solo si existe info)
    if (typeof baseLogger.info === 'function') {
      baseLogger.info({ spanId: span.spanContext().spanId, spanName: name }, 'Span started');
    }
    return span;
  };

  // Ensure all original methods are available
  Object.setPrototypeOf(enhancedLogger, baseLogger);

  return enhancedLogger;
}

// Create logger with configuration
export function createLogger(
  config: LoggerConfig & { serviceName: string; serviceVersion?: string; environment?: string },
  config: LoggerConfig & { serviceName: string; serviceVersion?: string; environment?: string }
): ObservabilityLogger {
  const options: LoggerOptions = {
    name: config.serviceName,
    level: config.level || 'info',
    serializers: {
      ...defaultSerializers,
      ...config.serializers,
    },
    base: {
      service: config.serviceName,
      version: config.serviceVersion,
      env: config.environment,
      pid: process.pid,
      hostname: (process.env['HOSTNAME'] as string) || require('os').hostname(),
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
      level: label => ({ level: label }),
      log: object => {
        // Add OpenTelemetry context if available
        const span = trace.getActiveSpan();
        if (span) {
          const spanContext = span.spanContext();
          object['traceId'] = spanContext.traceId;
          object['spanId'] = spanContext.spanId;
        }
        return object;
      },
    },
    redact: config.redact || ['password', 'token', 'apiKey', 'secret'],
  };

  // Add pretty print for development
  if (config.prettyPrint && process.env['NODE_ENV'] === 'development') {
    options.transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        levelFirst: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss.l',
        ignore: 'pid,hostname',
      },
    };
  }

  const baseLogger = pino(options);
  return createEnhancedLogger(baseLogger);
}

// Initialize global logger
export function initializeLogger(
  config: LoggerConfig & { serviceName: string; serviceVersion?: string; environment?: string },
  config: LoggerConfig & { serviceName: string; serviceVersion?: string; environment?: string }
): ObservabilityLogger {
  globalLogger = createLogger(config);
  return globalLogger;
}

// Get global logger instance
export function getLogger(): ObservabilityLogger {
  if (!globalLogger) {
    throw new Error('Logger not initialized. Call initializeLogger() first.');
  }
  return globalLogger;
}

// Create child logger with context
export function createChildLogger(context: LogContext): ObservabilityLogger {
  return getLogger().withContext(context);
}

// Create HTTP logger middleware
export function createHttpLogger(logger?: ObservabilityLogger) {
  const log = logger || getLogger();

  return (req: any, res: any, next: any) => {
    const requestId = req.headers['x-request-id'] || uuidv4();
    const traceId = req.headers['x-trace-id'] || uuidv4();
    const correlationId = req.headers['x-correlation-id'] || requestId;

    // Add to request object
    req.id = requestId;
    req.traceId = traceId;
    req.correlationId = correlationId;

    // Create child logger with request context
    req.log = log.withContext({
      requestId,
      traceId,
      correlationId,
      method: req.method,
      url: req.url,
    });

    // Log request
    req.log.info({ req }, 'Request received');

    // Log response
    const startTime = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const level = res.statusCode >= 400 ? 'error' : 'info';

      req.log[level](
        {
          res,
          duration,
          responseSize: res.get?.('content-length'),
        },
        'Request completed',
        'Request completed'
      );
    });

    next();
  };
}

// Export logger utilities
export { pino };
export type { Logger, LoggerOptions };
