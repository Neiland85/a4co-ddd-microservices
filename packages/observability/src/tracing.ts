import { metrics, trace, type Tracer } from '@opentelemetry/api';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import { MeterProvider } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  type SpanExporter,
} from '@opentelemetry/sdk-trace-base';

export interface TracingConfig {
  serviceName: string;
  serviceVersion?: string;
  environment?: string;
  jaegerEndpoint?: string;
  enableConsoleExporter?: boolean;
  enableAutoInstrumentation?: boolean;
  instrumentations?: unknown; // Allow flexible instrumentation configuration
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
      tags: [
        { key: 'service.name', value: config.serviceName },
        { key: 'service.version', value: config.serviceVersion || '1.0.0' },
        { key: 'deployment.environment', value: config.environment || 'development' },
      ],
    });
  }

  return new ConsoleSpanExporter();
}

// Inicializar tracing con OpenTelemetry
export function initializeTracing(config: TracingConfig): NodeSDK {
  // TODO: Fix Resource usage for newer OpenTelemetry versions
  // const resource = Resource.default().merge(
  //   new Resource({
  //     [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
  //     [SemanticResourceAttributes.SERVICE_VERSION]: config.serviceVersion || '1.0.0',
  //     [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: config.environment || 'development',
  //     [SemanticResourceAttributes.SERVICE_INSTANCE_ID]: process.env.HOSTNAME || `${config.serviceName}-${Date.now()}`,
  //     [SemanticResourceAttributes.PROCESS_PID]: process.pid,
  //     [SemanticResourceAttributes.PROCESS_RUNTIME_NAME]: 'nodejs',
  //     [SemanticResourceAttributes.PROCESS_RUNTIME_VERSION]: process.version,
  //   })
  // );

  // TODO: Fix propagators for newer OpenTelemetry versions
  // const propagators = new CompositePropagator({
  //   propagators: [
  //     new W3CTraceContextPropagator(),
  //     new B3Propagator({
  //       injectEncoding: B3InjectEncoding.MULTI_HEADER,
  //     }),
  //   ],
  // });

  const spanExporter = createSpanExporter(config);
  const spanProcessor = new BatchSpanProcessor(spanExporter, {
    maxQueueSize: 2048,
    maxExportBatchSize: 512,
    scheduledDelayMillis: 5000,
    exportTimeoutMillis: 30000,
  });

  let instrumentations: unknown[] = [];

  if (config.enableAutoInstrumentation !== false) {
    instrumentations = [
      ...instrumentations,
      getNodeAutoInstrumentations({
        '@opentelemetry/instrumentation-fs': { enabled: false },
        '@opentelemetry/instrumentation-dns': { enabled: false },
        '@opentelemetry/instrumentation-net': { enabled: false },
      }),
    ];
  }

  if (config.instrumentations && Array.isArray(config.instrumentations)) {
    instrumentations = [...instrumentations, ...(config.instrumentations as unknown[])];
  }

  sdk = new NodeSDK({
    // resource,
    spanProcessor,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    instrumentations: instrumentations as unknown as any[],
    // textMapPropagator: propagators,
  });

  sdk.start();

  console.log(`OpenTelemetry tracing initialized for ${config.serviceName}`);

  return sdk;
}

// Inicializar métricas con Prometheus
export function initializeMetrics(
  config: MetricsConfig & { serviceName: string }
): PrometheusExporter {
  prometheusExporter = new PrometheusExporter(
    {
      port: config.port || 9464,
      endpoint: config.endpoint || '/metrics',
    },
    () => {
      console.log(`Prometheus metrics server started on port ${config.port || 9464}`);
    }
  );

  const meterProvider = new MeterProvider({
    // TODO: Fix Resource usage for newer OpenTelemetry versions
    // resource: new Resource({
    //   [SemanticResourceAttributes.SERVICE_NAME]: config.serviceName,
    // }),
  });

  metrics.setGlobalMeterProvider(meterProvider);
  // TODO: Fix addMetricReader method for newer OpenTelemetry versions
  // meterProvider.addMetricReader(prometheusExporter);

  return prometheusExporter;
}

// Obtener tracer para un componente
export function getTracer(name?: string): Tracer {
  return trace.getTracer(name || 'default-tracer');
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
