import { context, propagation, SpanStatusCode, trace } from '@opentelemetry/api';
import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import type { NextFunction, Request, Response } from 'express';

// Tipos para mejorar type safety
export interface TracedRequest extends Request {
  traceId?: string;
  spanId?: string;
  parentSpanId?: string;
  baggage?: Record<string, string>;
}

// Headers estándar para propagación de contexto
export const TRACE_HEADERS = {
  TRACE_ID: 'x-trace-id',
  SPAN_ID: 'x-span-id',
  PARENT_SPAN_ID: 'x-parent-span-id',
  TRACE_PARENT: 'traceparent',
  TRACE_STATE: 'tracestate',
  BAGGAGE: 'baggage',
  B3_TRACE_ID: 'x-b3-traceid',
  B3_SPAN_ID: 'x-b3-spanid',
  B3_PARENT_SPAN_ID: 'x-b3-parentspanid',
  B3_SAMPLED: 'x-b3-sampled',
  B3_FLAGS: 'x-b3-flags',
};

// Middleware principal para Express

export function observabilityMiddleware(): (
  _req: TracedRequest,
  _res: Response,
  _next: NextFunction
) => void {
  return (req: TracedRequest, res: Response, next: NextFunction): void => {
    // Extraer contexto de los headers entrantes
    const extractedContext = propagation.extract(context.active(), req.headers);

    // Ejecutar el resto del request en el contexto extraído
    context.with(extractedContext, () => {
      const span = trace.getActiveSpan();

      if (span) {
        const spanContext = span.spanContext();

        // Asignar IDs al request para fácil acceso
        req.traceId = spanContext.traceId;
        req.spanId = spanContext.spanId;

        // Agregar trace ID a los headers de respuesta
        res.setHeader(TRACE_HEADERS.TRACE_ID, spanContext.traceId);
        res.setHeader(TRACE_HEADERS.SPAN_ID, spanContext.spanId);

        // Agregar atributos adicionales al span
        span.setAttributes({
          'http.request_id': String(req.headers['x-request-id'] || req.id),
          'http.user_agent': req.headers['user-agent'],
          'http.referer': req.headers['referer'],
          'http.forwarded_for': req.headers['x-forwarded-for'],
          'http.real_ip': req.headers['x-real-ip'],
          'user.id': (req as unknown as { user?: { id?: string } }).user?.id,
          'user.role': (req as unknown as { user?: { role?: string } }).user?.role,
        });

        // Log del inicio del request
        if ((req as unknown as { log?: { info: (_data: unknown) => void } }).log) {
          (req as unknown as { log: { info: (_data: unknown) => void } }).log.info({
            msg: 'Request started',
            traceId: spanContext.traceId,
            spanId: spanContext.spanId,
            method: req.method,
            path: req.path,
            query: req.query,
          });
        }
      }

      // Interceptar el método end de response para logging
      const originalEnd = res.end;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      res.end = function(...args: any[]): Response {
        // Log del fin del request
        const tracedReq = req as TracedRequest & {
          log?: { info: (_data: unknown) => void };
          startTime?: number;
        };
        if (tracedReq.log) {
          tracedReq.log.info({
            msg: 'Request completed',
            traceId: req.traceId,
            spanId: req.spanId,
            statusCode: res.statusCode,
            duration: Date.now() - (tracedReq.startTime || Date.now()),
          });
        }

        // Llamar al método original
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (originalEnd as any).call(this, ...args);
      };

      next();
    });
  };
}

// Cliente HTTP con propagación automática de contexto
export class TracedHttpClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private axiosInstance: any;

  constructor(baseConfig?: AxiosRequestConfig) {
    this.axiosInstance = axios.create(baseConfig);

    // Interceptor para agregar headers de tracing
    this.axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        // Inyectar contexto actual en los headers
        const headers = config.headers || {};
        propagation.inject(context.active(), headers);

        // Agregar trace ID explícito si está disponible
        const span = trace.getActiveSpan();
        if (span) {
          const spanContext = span.spanContext();
          headers[TRACE_HEADERS.TRACE_ID] = spanContext.traceId;
          headers[TRACE_HEADERS.SPAN_ID] = spanContext.spanId;
        }

        config.headers = headers;
        return config;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error: any) => Promise.reject(error),
    );

    // Interceptor para logging de respuestas
    this.axiosInstance.interceptors.response.use(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (response: any) => {
        const span = trace.getActiveSpan();
        if (span) {
          span.setAttributes({
            'http.response.status_code': response.status,
            'http.response.size': response.headers['content-length'] || 0,
          });
        }
        return response;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (error: any) => {
        const span = trace.getActiveSpan();
        if (span && error.response) {
          span.setAttributes({
            'http.response.status_code': error.response.status,
            'http.response.error': error.message,
          });
        }
        return Promise.reject(error);
      },
    );
  }

  get(url: string, config?: AxiosRequestConfig): Promise<unknown> {
    return this.axiosInstance.get(url, config);
  }

  post(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<unknown> {
    return this.axiosInstance.post(url, data, config);
  }

  put(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<unknown> {
    return this.axiosInstance.put(url, data, config);
  }

  delete(url: string, config?: AxiosRequestConfig): Promise<unknown> {
    return this.axiosInstance.delete(url, config);
  }

  patch(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<unknown> {
    return this.axiosInstance.patch(url, data, config);
  }
}

// Función helper para extraer trace ID de diferentes formatos de headers
export function extractTraceId(headers: Record<string, unknown>): string | undefined {
  // Intentar diferentes formatos de trace ID
  const stringHeaders = headers as Record<string, string | undefined>;
  return (
    stringHeaders[TRACE_HEADERS.TRACE_ID] ||
    stringHeaders[TRACE_HEADERS.B3_TRACE_ID] ||
    extractTraceIdFromTraceparent(stringHeaders[TRACE_HEADERS.TRACE_PARENT])
  );
}

// Extraer trace ID del header traceparent (W3C format)
function extractTraceIdFromTraceparent(traceparent?: string): string | undefined {
  if (!traceparent) return undefined;

  // Format: version-trace-id-parent-id-trace-flags
  const parts = traceparent.split('-');
  return parts.length >= 3 ? parts[1] : undefined;
}

// Middleware para correlación de logs
export function logCorrelationMiddleware(
  logger: any,
): (_req: TracedRequest, _res: Response, _next: NextFunction) => void {
  return (req: TracedRequest, res: Response, next: NextFunction): void => {
    // Crear un logger child con contexto de tracing
    const childLogger = logger.child({
      traceId: req.traceId || extractTraceId(req.headers),
      spanId: req.spanId,
      requestId: req.headers['x-request-id'] || req.id,
      method: req.method,
      path: req.path,
      userAgent: req.headers['user-agent'],
    });

    // Adjuntar el logger al request
    (req as any).log = childLogger;
    (req as any).startTime = Date.now();

    next();
  };
}

// Función para propagar contexto en operaciones asíncronas
export async function withPropagatedContext<T>(
  fn: () => Promise<T>,
  parentContext?: any,
): Promise<T> {
  const contextToUse = parentContext || context.active();

  return context.with(contextToUse, async() => {
    try {
      return await fn();
    } catch (error) {
      // Asegurar que el error se propague con el contexto
      const span = trace.getActiveSpan();
      if (span && error instanceof Error) {
        span.recordException(error);
      }
      throw error;
    }
  });
}

// Utilidad para crear headers con contexto de tracing
export function createTracingHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};

  // Inyectar contexto actual
  propagation.inject(context.active(), headers);

  // Agregar trace ID explícito
  const span = trace.getActiveSpan();
  if (span) {
    const spanContext = span.spanContext();
    headers[TRACE_HEADERS.TRACE_ID] = spanContext.traceId;
    headers[TRACE_HEADERS.SPAN_ID] = spanContext.spanId;
  }

  return headers;
}

// Middleware para manejar errores con contexto de tracing
export function errorHandlingMiddleware(logger: any) {
  return (err: Error, req: TracedRequest, res: Response, _next: NextFunction) => {
    const span = trace.getActiveSpan();

    // Registrar el error en el span
    if (span) {
      span.recordException(err);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: err.message,
      });
    }

    // Log estructurado del error
    const errorLogger = (req as any).log || logger;
    errorLogger.error({
      msg: 'Request error',
      error: {
        message: err.message,
        stack: err.stack,
        name: err.name,
      },
      traceId: req.traceId,
      spanId: req.spanId,
      method: req.method,
      path: req.path,
      statusCode: (err as any).statusCode || 500,
    });

    // Enviar respuesta de error con trace ID
    const statusCode = (err as any).statusCode || 500;
    res.status(statusCode).json({
      error: {
        message: err.message,
        code: (err as any).code || 'INTERNAL_ERROR',
        traceId: req.traceId,
      },
    });
  };
}
