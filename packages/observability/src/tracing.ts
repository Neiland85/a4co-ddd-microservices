import { metrics, trace } from '@opentelemetry/api';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
<<<<<<< HEAD
import { CompositePropagator, W3CTraceContextPropagator } from '@opentelemetry/core';
=======
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SpanExporter,
  Tracer,
} from '@opentelemetry/sdk-trace-base';
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import { Resource } from '@opentelemetry/resources';
import { MeterProvider } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SpanExporter,
  Tracer,
} from '@opentelemetry/sdk-trace-base';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

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
  serviceName: string;
  serviceVersion?: string;
  environment?: string;
  port?: number;
  endpoint?: string;
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
      [SemanticResourceAttributes.SERVICE_INSTANCE_ID]:
<<<<<<< HEAD
        process.env['HOSTNAME'] || `${config.serviceName}-${Date.now()}`,
=======
        process.env.HOSTNAME || `${config.serviceName}-${Date.now()}`,
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
      [SemanticResourceAttributes.PROCESS_PID]: process.pid,
      [SemanticResourceAttributes.PROCESS_RUNTIME_NAME]: 'nodejs',
      [SemanticResourceAttributes.PROCESS_RUNTIME_VERSION]: process.version,
    }),
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
  }) as any;

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
export function initializeMetrics(
<<<<<<< HEAD
  config: MetricsConfig & { serviceName: string },
=======
  config: MetricsConfig & { serviceName: string }
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
): PrometheusExporter {
  prometheusExporter = new PrometheusExporter(
    {
      port: config.port || 9464,
      endpoint: config.endpoint || '/metrics',
    },
    () => {
      console.log(`Prometheus metrics server started on port ${config.port || 9464}`);
    },
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
  meterProvider.addMetricReader(prometheusExporter as any);

  return prometheusExporter;
}

// Obtener tracer para un componente
export function getTracer(name?: string): Tracer {
  return trace.getTracer(name || 'default-tracer') as any;
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
process.on('SIGTERM', async() => {
  await shutdown();
});

process.on('SIGINT', async() => {
  await shutdown();
});
