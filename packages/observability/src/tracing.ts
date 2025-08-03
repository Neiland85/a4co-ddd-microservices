import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { 
  BatchSpanProcessor, 
  ConsoleSpanExporter, 
  SpanExporter,
  Tracer,
  Span,
  SpanStatusCode,
  SpanKind
} from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { trace, metrics, context, SpanStatusCode as ApiSpanStatusCode } from '@opentelemetry/api';
import { W3CTraceContextPropagator } from '@opentelemetry/core';
import { B3Propagator, B3InjectEncoding } from '@opentelemetry/propagator-b3';
import { CompositePropagator } from '@opentelemetry/core';
import { Request, Response, NextFunction } from 'express';

export interface TracingConfig {
  serviceName: string;
  serviceVersion?: string;
  environment?: string;
  jaegerEndpoint?: string;
  enableConsoleExporter?: boolean;
  enableAutoInstrumentation?: boolean;
  instrumentations?: any[];
}

export interface MetricsConfig {
  port?: number;
  endpoint?: string;
}

// Interfaz para metadata DDD
export interface DDDMetadata {
  aggregate?: string;
  command?: string;
  event?: string;
  domain?: string;
  boundedContext?: string;
}

// Interfaz para decorador de controlador
export interface ControllerSpanOptions {
  operationName?: string;
  aggregate?: string;
  command?: string;
  event?: string;
  domain?: string;
  boundedContext?: string;
  captureRequestBody?: boolean;
  captureResponseBody?: boolean;
  captureHeaders?: boolean;
}

let sdk: NodeSDK | null = null;
let prometheusExporter: PrometheusExporter | null = null;

// Crear exportador de spans
function createSpanExporter(config: TracingConfig): SpanExporter {
  if (config.jaegerEndpoint) {
    return new JaegerExporter({
      endpoint: config.jaegerEndpoint,
      // Agregar tags del servicio
      tags: [
        { key: 'service.name', value: config.serviceName },
        { key: 'service.version', value: config.serviceVersion || '1.0.0' },
        { key: 'deployment.environment', value: config.environment || 'development' },
      ],
    });
  }
  
  // Por defecto usar console exporter
  return new ConsoleSpanExporter();
}

// Inicializar tracing con OpenTelemetry
export function initializeTracing(config: TracingConfig): NodeSDK {
  // Crear recurso con metadatos del servicio
  const resource = Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
      [SemanticResourceAttributes.SERVICE_VERSION]: config.serviceVersion || '1.0.0',
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: config.environment || 'development',
      [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: process.env.HOSTNAME || `${config.serviceName}-${Date.now()}`,
      [SemanticResourceAttributes.PROCESS_PID]: process.pid,
      [SemanticResourceAttributes.PROCESS_RUNTIME_NAME]: 'nodejs',
      [SemanticResourceAttributes.PROCESS_RUNTIME_VERSION]: process.version,
    })
  );

  // Configurar propagadores para context propagation
  const propagators = new CompositePropagator({
    propagators: [
      new W3CTraceContextPropagator(),
      new B3Propagator({
        injectEncoding: B3InjectEncoding.MULTI_HEADER,
      }),
    ],
  });

  // Crear span processor
  const spanExporter = createSpanExporter(config);
  const spanProcessor = new BatchSpanProcessor(spanExporter, {
    maxQueueSize: 2048,
    maxExportBatchSize: 512,
    scheduledDelayMillis: 5000,
    exportTimeoutMillis: 30000,
  });

  // Configurar instrumentaciones
  let instrumentations = config.instrumentations || [];
  
  if (config.enableAutoInstrumentation !== false) {
    instrumentations = [
      ...instrumentations,
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': {
          enabled: false, // Deshabilitar fs para evitar ruido
        },
        '@opentelemetry/instrumentation-dns': {
          enabled: false, // Deshabilitar dns para evitar ruido
        },
        '@opentelemetry/instrumentation-net': {
          enabled: false, // Deshabilitar net para evitar ruido
        },
      }),
    ];
  }

  // Crear SDK
  sdk = new NodeSDK({
    resource,
    spanProcessor,
    instrumentations,
    textMapPropagator: propagators,
  });

  // Inicializar SDK
  sdk.start();

  // Log de confirmación
  console.log(`OpenTelemetry tracing initialized for ${config.serviceName}`);

  return sdk;
}

// Inicializar métricas con Prometheus
export function initializeMetrics(config: MetricsConfig & { serviceName: string }): PrometheusExporter {
  prometheusExporter = new PrometheusExporter(
    {
      port: config.port || 9464,
      endpoint: config.endpoint || '/metrics',
    },
    () => {
      console.log(`Prometheus metrics server started on port ${config.port || 9464}`);
    }
  );

  // Crear meter provider
  const meterProvider = new MeterProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
    }),
  });

  // Registrar el meter provider globalmente
  metrics.setGlobalMeterProvider(meterProvider);

  // Agregar el reader de Prometheus
  meterProvider.addMetricReader(prometheusExporter);

  return prometheusExporter;
}

// Obtener tracer para un componente
export function getTracer(name?: string): Tracer {
  return trace.getTracer(name || 'default-tracer');
}

// Decorador para controladores Express con metadata DDD
export function withTracing(options: ControllerSpanOptions = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (req: Request, res: Response, next: NextFunction) {
      const tracer = getTracer('express-controller');
      const operationName = options.operationName || `${target.constructor.name}.${propertyKey}`;
      
      const span = tracer.startSpan(operationName, {
        kind: SpanKind.SERVER,
        attributes: {
          'http.method': req.method,
          'http.url': req.url,
          'http.route': req.route?.path || req.path,
          'http.user_agent': req.get('User-Agent'),
          'http.request_id': req.headers['x-request-id'] as string,
          // Metadata DDD
          'ddd.aggregate': options.aggregate,
          'ddd.command': options.command,
          'ddd.event': options.event,
          'ddd.domain': options.domain,
          'ddd.bounded_context': options.boundedContext,
        },
      });

      // Capturar request body si está habilitado
      if (options.captureRequestBody && req.body) {
        span.setAttribute('http.request.body', JSON.stringify(req.body));
      }

      // Capturar headers si está habilitado
      if (options.captureHeaders) {
        span.setAttribute('http.request.headers', JSON.stringify(req.headers));
      }

      try {
        // Ejecutar el método original
        const result = await originalMethod.call(this, req, res, next);
        
        // Capturar response body si está habilitado
        if (options.captureResponseBody && res.locals?.responseBody) {
          span.setAttribute('http.response.body', JSON.stringify(res.locals.responseBody));
        }
        
        span.setStatus({ code: ApiSpanStatusCode.OK });
        span.setAttribute('http.status_code', res.statusCode);
        
        return result;
      } catch (error) {
        span.setStatus({ 
          code: ApiSpanStatusCode.ERROR, 
          message: error instanceof Error ? error.message : 'Unknown error' 
        });
        span.recordException(error as Error);
        throw error;
      } finally {
        span.end();
      }
    };
    
    return descriptor;
  };
}

// Middleware para propagación automática de Trace ID
export function tracePropagationMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const tracer = getTracer('http-middleware');
    const span = tracer.startSpan('http.request', {
      kind: SpanKind.SERVER,
      attributes: {
        'http.method': req.method,
        'http.url': req.url,
        'http.route': req.route?.path || req.path,
        'http.user_agent': req.get('User-Agent'),
        'http.request_id': req.headers['x-request-id'] as string,
      },
    });

    // Agregar trace ID a los headers de respuesta
    const traceId = span.spanContext().traceId;
    res.setHeader('X-Trace-ID', traceId);
    res.setHeader('X-Span-ID', span.spanContext().spanId);

    // Agregar span al request para uso posterior
    (req as any).span = span;

    // Interceptar el final de la respuesta
    const originalEnd = res.end;
    res.end = function(chunk?: any, encoding?: any) {
      span.setAttribute('http.status_code', res.statusCode);
      span.setAttribute('http.response_size', res.get('Content-Length') || 0);
      
      if (res.statusCode >= 400) {
        span.setStatus({ 
          code: ApiSpanStatusCode.ERROR,
          message: `HTTP ${res.statusCode}`
        });
      } else {
        span.setStatus({ code: ApiSpanStatusCode.OK });
      }
      
      span.end();
      return originalEnd.call(this, chunk, encoding);
    };

    next();
  };
}

// Función helper para crear spans con metadata DDD
export function createDDDSpan(
  operationName: string, 
  metadata: DDDMetadata, 
  fn: (span: Span) => Promise<any>
) {
  const tracer = getTracer('ddd-operation');
  const span = tracer.startSpan(operationName, {
    attributes: {
      'ddd.aggregate': metadata.aggregate,
      'ddd.command': metadata.command,
      'ddd.event': metadata.event,
      'ddd.domain': metadata.domain,
      'ddd.bounded_context': metadata.boundedContext,
    },
  });

  return context.with(trace.setSpan(context.active(), span), async () => {
    try {
      const result = await fn(span);
      span.setStatus({ code: ApiSpanStatusCode.OK });
      return result;
    } catch (error) {
      span.setStatus({ 
        code: ApiSpanStatusCode.ERROR, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
      span.recordException(error as Error);
      throw error;
    } finally {
      span.end();
    }
  });
}

// Función para propagar trace context en headers HTTP
export function injectTraceContext(headers: Record<string, string> = {}): Record<string, string> {
  const currentSpan = trace.getActiveSpan();
  if (currentSpan) {
    const spanContext = currentSpan.spanContext();
    return {
      ...headers,
      'X-Trace-ID': spanContext.traceId,
      'X-Span-ID': spanContext.spanId,
      'traceparent': `00-${spanContext.traceId}-${spanContext.spanId}-${spanContext.traceFlags.toString(16).padStart(2, '0')}`,
    };
  }
  return headers;
}

// Shutdown graceful
export async function shutdown(): Promise<void> {
  if (sdk) {
    try {
      await sdk.shutdown();
      console.log('OpenTelemetry SDK shut down successfully');
    } catch (error) {
      console.error('Error shutting down OpenTelemetry SDK', error);
    }
  }
  
  if (prometheusExporter) {
    prometheusExporter.shutdown();
  }
}

// Registrar handlers para shutdown graceful
process.on('SIGTERM', async () => {
  await shutdown();
});

process.on('SIGINT', async () => {
  await shutdown();
});