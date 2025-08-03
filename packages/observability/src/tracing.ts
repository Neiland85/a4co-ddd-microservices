import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { BatchSpanProcessor, ConsoleSpanExporter, SpanExporter } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { MeterProvider, PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { trace, context, propagation, SpanStatusCode, Span } from '@opentelemetry/api';
import { W3CTraceContextPropagator } from '@opentelemetry/core';
import { B3Propagator, B3InjectEncoding } from '@opentelemetry/propagator-b3';
import { CompositePropagator } from '@opentelemetry/core';

export interface TracingConfig {
  serviceName: string;
  serviceVersion: string;
  environment: string;
  exporterType?: 'jaeger' | 'otlp' | 'console';
  jaegerEndpoint?: string;
  otlpEndpoint?: string;
  enableAutoInstrumentation?: boolean;
  sampleRate?: number;
}

// Crear un sampler personalizado basado en la configuración
function createSampler(sampleRate: number = 1.0) {
  const { AlwaysOnSampler, AlwaysOffSampler, TraceIdRatioBasedSampler } = require('@opentelemetry/core');
  
  if (sampleRate >= 1.0) {
    return new AlwaysOnSampler();
  } else if (sampleRate <= 0) {
    return new AlwaysOffSampler();
  } else {
    return new TraceIdRatioBasedSampler(sampleRate);
  }
}

// Crear el exportador de spans según la configuración
function createSpanExporter(config: TracingConfig): SpanExporter {
  switch (config.exporterType) {
    case 'jaeger':
      return new JaegerExporter({
        endpoint: config.jaegerEndpoint || 'http://localhost:14268/api/traces',
        // Agregar información adicional en los tags
        tags: [
          { key: 'environment', value: config.environment },
          { key: 'service.version', value: config.serviceVersion },
        ],
      });
    
    case 'otlp':
      return new OTLPTraceExporter({
        url: config.otlpEndpoint || 'http://localhost:4318/v1/traces',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    
    case 'console':
    default:
      return new ConsoleSpanExporter();
  }
}

// Inicializar OpenTelemetry SDK
export function initializeTracing(config: TracingConfig): NodeSDK {
  // Crear recurso con metadatos del servicio
  const resource = Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
      [SemanticResourceAttributes.SERVICE_VERSION]: config.serviceVersion,
      [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: config.environment,
      [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: process.env.HOSTNAME || 'unknown',
      // Agregar metadatos adicionales
      'service.namespace': process.env.SERVICE_NAMESPACE || 'default',
      'cloud.provider': process.env.CLOUD_PROVIDER || 'local',
      'cloud.region': process.env.CLOUD_REGION || 'local',
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

  propagation.setGlobalPropagator(propagators);

  // Crear span processor
  const spanExporter = createSpanExporter(config);
  const spanProcessor = new BatchSpanProcessor(spanExporter, {
    // Configuración de batching
    maxQueueSize: 2048,
    maxExportBatchSize: 512,
    scheduledDelayMillis: 5000,
    exportTimeoutMillis: 30000,
  });

  // Configurar instrumentaciones automáticas
  const instrumentations = config.enableAutoInstrumentation !== false ? [
    getNodeAutoInstrumentations({
      // Configurar instrumentaciones específicas
      '@opentelemetry/instrumentation-fs': {
        enabled: false, // Deshabilitar fs para evitar ruido
      },
      '@opentelemetry/instrumentation-express': {
        enabled: true,
        requestHook: (span: Span, req: any) => {
          // Agregar atributos personalizados al span
          span.setAttributes({
            'http.request.body.size': req.headers['content-length'] || 0,
            'http.user_agent': req.headers['user-agent'],
            'http.client_ip': req.ip || req.connection.remoteAddress,
          });
        },
      },
      '@opentelemetry/instrumentation-http': {
        enabled: true,
        requestHook: (span: Span, req: any) => {
          // Agregar headers personalizados como atributos
          const traceId = req.headers['x-trace-id'];
          if (traceId) {
            span.setAttribute('http.request.trace_id', traceId);
          }
        },
        responseHook: (span: Span, res: any) => {
          // Agregar información de respuesta
          span.setAttribute('http.response.size', res.headers['content-length'] || 0);
        },
      },
      '@opentelemetry/instrumentation-mongodb': {
        enabled: true,
        enhancedDatabaseReporting: true,
      },
      '@opentelemetry/instrumentation-redis': {
        enabled: true,
      },
    }),
  ] : [];

  // Crear SDK
  const sdk = new NodeSDK({
    resource,
    spanProcessor,
    instrumentations,
    sampler: createSampler(config.sampleRate),
  });

  // Registrar el SDK
  sdk.start();

  // Manejar shutdown gracefully
  process.on('SIGTERM', () => {
    sdk.shutdown()
      .then(() => console.log('Tracing terminated'))
      .catch((error) => console.log('Error terminating tracing', error))
      .finally(() => process.exit(0));
  });

  return sdk;
}

// Utilidades para trabajar con spans
export class TracingUtils {
  // Crear un span manual
  static createSpan(name: string, options?: any): Span {
    const tracer = trace.getTracer('manual-instrumentation');
    return tracer.startSpan(name, options);
  }

  // Ejecutar una función dentro de un span
  static async withSpan<T>(
    name: string,
    fn: (span: Span) => Promise<T>,
    options?: any
  ): Promise<T> {
    const span = this.createSpan(name, options);
    
    try {
      // Ejecutar la función en el contexto del span
      return await context.with(trace.setSpan(context.active(), span), async () => {
        const result = await fn(span);
        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      });
    } catch (error: any) {
      // Registrar el error en el span
      span.recordException(error);
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      });
      throw error;
    } finally {
      span.end();
    }
  }

  // Agregar eventos a un span
  static addEvent(name: string, attributes?: Record<string, any>) {
    const span = trace.getActiveSpan();
    if (span) {
      span.addEvent(name, attributes);
    }
  }

  // Agregar atributos al span actual
  static setAttributes(attributes: Record<string, any>) {
    const span = trace.getActiveSpan();
    if (span) {
      span.setAttributes(attributes);
    }
  }

  // Obtener el trace ID actual
  static getTraceId(): string | undefined {
    const span = trace.getActiveSpan();
    if (span) {
      return span.spanContext().traceId;
    }
    return undefined;
  }

  // Obtener el span ID actual
  static getSpanId(): string | undefined {
    const span = trace.getActiveSpan();
    if (span) {
      return span.spanContext().spanId;
    }
    return undefined;
  }

  // Crear un contexto con baggage
  static setBaggage(key: string, value: string) {
    const baggage = propagation.getBaggage(context.active()) || propagation.createBaggage();
    const newBaggage = baggage.setEntry(key, { value });
    return propagation.setBaggage(context.active(), newBaggage);
  }

  // Obtener baggage del contexto
  static getBaggage(key: string): string | undefined {
    const baggage = propagation.getBaggage(context.active());
    return baggage?.getEntry(key)?.value;
  }
}

// Decorador para instrumentar métodos automáticamente
export function Trace(spanName?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const name = spanName || `${target.constructor.name}.${propertyKey}`;
      
      return TracingUtils.withSpan(name, async (span) => {
        // Agregar información sobre el método
        span.setAttributes({
          'code.function': propertyKey,
          'code.namespace': target.constructor.name,
          'code.arguments': JSON.stringify(args).substring(0, 1000), // Limitar tamaño
        });
        
        return originalMethod.apply(this, args);
      });
    };
    
    return descriptor;
  };
}

// Middleware para Express que propaga el contexto
export function tracingMiddleware() {
  return (req: any, res: any, next: any) => {
    // Extraer contexto de los headers entrantes
    const extractedContext = propagation.extract(context.active(), req.headers);
    
    // Ejecutar el resto del request en el contexto extraído
    context.with(extractedContext, () => {
      // Agregar trace ID a los headers de respuesta
      const traceId = TracingUtils.getTraceId();
      if (traceId) {
        res.setHeader('X-Trace-Id', traceId);
      }
      
      // Agregar información al request para uso posterior
      req.traceId = traceId;
      req.spanId = TracingUtils.getSpanId();
      
      next();
    });
  };
}