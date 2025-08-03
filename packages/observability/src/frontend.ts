import { trace, context, SpanStatusCode, SpanKind } from '@opentelemetry/api';
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor, ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
import { W3CTraceContextPropagator } from '@opentelemetry/core';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

// Interfaz para configuración de frontend
export interface FrontendObservabilityConfig {
  serviceName: string;
  serviceVersion?: string;
  environment?: string;
  endpoint?: string;
  enableConsoleExporter?: boolean;
  enableAutoInstrumentation?: boolean;
  enableUserTracking?: boolean;
  enablePerformanceTracking?: boolean;
  enableErrorTracking?: boolean;
}

// Interfaz para eventos de usuario
export interface UserEvent {
  eventName: string;
  componentName?: string;
  props?: Record<string, any>;
  metadata?: Record<string, any>;
  timestamp?: number;
}

// Interfaz para performance metrics
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  metadata?: Record<string, any>;
}

let tracerProvider: WebTracerProvider | null = null;
let isInitialized = false;

// Inicializar observabilidad para frontend
export function initializeFrontendObservability(config: FrontendObservabilityConfig) {
  if (isInitialized) {
    console.warn('Frontend observability already initialized');
    return;
  }

  // Crear tracer provider
  tracerProvider = new WebTracerProvider({
    resource: {
      attributes: {
        'service.name': config.serviceName,
        'service.version': config.serviceVersion || '1.0.0',
        'deployment.environment': config.environment || 'development',
        'service.instance.id': `${config.serviceName}-${Date.now()}`,
      },
    },
  });

  // Configurar span processor
  const spanProcessor = new BatchSpanProcessor(
    config.enableConsoleExporter !== false 
      ? new ConsoleSpanExporter()
      : new OTLPTraceExporter({
          url: config.endpoint || 'http://localhost:4318/v1/traces',
        })
  );

  tracerProvider.addSpanProcessor(spanProcessor);

  // Configurar propagador
  tracerProvider.register({
    propagator: new W3CTraceContextPropagator(),
  });

  // Configurar auto-instrumentaciones
  if (config.enableAutoInstrumentation !== false) {
    registerInstrumentations({
      instrumentations: [
        getWebAutoInstrumentations({
          '@opentelemetry/instrumentation-document-load': {
            enabled: true,
          },
          '@opentelemetry/instrumentation-user-interaction': {
            enabled: true,
          },
          '@opentelemetry/instrumentation-fetch': {
            enabled: true,
            propagateTraceHeaderCorsUrls: [/.*/],
          },
          '@opentelemetry/instrumentation-xml-http-request': {
            enabled: true,
            propagateTraceHeaderCorsUrls: [/.*/],
          },
        }),
      ],
    });
  }

  isInitialized = true;
  console.log(`Frontend observability initialized for ${config.serviceName}`);
}

// Obtener tracer para frontend
export function getFrontendTracer(name?: string) {
  if (!tracerProvider) {
    throw new Error('Frontend observability not initialized. Call initializeFrontendObservability first.');
  }
  return tracerProvider.getTracer(name || 'frontend-tracer');
}

// Hook de React para tracking de componentes
export function useComponentTracking(componentName: string, props?: Record<string, any>) {
  const tracer = getFrontendTracer('react-component');
  
  const trackEvent = (eventName: string, eventProps?: Record<string, any>) => {
    const span = tracer.startSpan(`component.${componentName}.${eventName}`, {
      kind: SpanKind.INTERNAL,
      attributes: {
        'component.name': componentName,
        'component.event': eventName,
        'component.props': JSON.stringify(props || {}),
        'component.event_props': JSON.stringify(eventProps || {}),
        'user.agent': navigator.userAgent,
        'user.language': navigator.language,
        'user.timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    });

    span.setStatus({ code: SpanStatusCode.OK });
    span.end();
  };

  const trackError = (error: Error, context?: Record<string, any>) => {
    const span = tracer.startSpan(`component.${componentName}.error`, {
      kind: SpanKind.INTERNAL,
      attributes: {
        'component.name': componentName,
        'component.error.name': error.name,
        'component.error.message': error.message,
        'component.error.stack': error.stack,
        'component.context': JSON.stringify(context || {}),
      },
    });

    span.setStatus({ 
      code: SpanStatusCode.ERROR, 
      message: error.message 
    });
    span.recordException(error);
    span.end();
  };

  return { trackEvent, trackError };
}

// Hook para tracking de navegación
export function useNavigationTracking() {
  const tracer = getFrontendTracer('navigation');

  const trackPageView = (pathname: string, search?: string) => {
    const span = tracer.startSpan('navigation.page_view', {
      kind: SpanKind.INTERNAL,
      attributes: {
        'navigation.pathname': pathname,
        'navigation.search': search || '',
        'navigation.full_url': window.location.href,
        'navigation.referrer': document.referrer,
        'navigation.timestamp': Date.now(),
      },
    });

    // Medir performance de la página
    if ('performance' in window) {
      const perfEntries = performance.getEntriesByType('navigation');
      if (perfEntries.length > 0) {
        const navEntry = perfEntries[0] as PerformanceNavigationTiming;
        span.setAttributes({
          'performance.dom_content_loaded': navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart,
          'performance.load_complete': navEntry.loadEventEnd - navEntry.loadEventStart,
          'performance.first_paint': performance.getEntriesByName('first-paint')[0]?.startTime,
          'performance.first_contentful_paint': performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
        });
      }
    }

    span.setStatus({ code: SpanStatusCode.OK });
    span.end();
  };

  const trackRouteChange = (from: string, to: string) => {
    const span = tracer.startSpan('navigation.route_change', {
      kind: SpanKind.INTERNAL,
      attributes: {
        'navigation.from': from,
        'navigation.to': to,
        'navigation.timestamp': Date.now(),
      },
    });

    span.setStatus({ code: SpanStatusCode.OK });
    span.end();
  };

  return { trackPageView, trackRouteChange };
}

// Hook para tracking de API calls
export function useAPITracking() {
  const tracer = getFrontendTracer('api');

  const trackAPICall = (
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    error?: Error
  ) => {
    const span = tracer.startSpan('api.request', {
      kind: SpanKind.CLIENT,
      attributes: {
        'http.method': method,
        'http.url': url,
        'http.status_code': statusCode,
        'http.duration_ms': duration,
        'http.user_agent': navigator.userAgent,
      },
    });

    if (error) {
      span.setStatus({ 
        code: SpanStatusCode.ERROR, 
        message: error.message 
      });
      span.recordException(error);
    } else {
      span.setStatus({ code: SpanStatusCode.OK });
    }

    span.end();
  };

  return { trackAPICall };
}

// Hook para tracking de performance
export function usePerformanceTracking() {
  const tracer = getFrontendTracer('performance');

  const trackMetric = (metric: PerformanceMetric) => {
    const span = tracer.startSpan('performance.metric', {
      kind: SpanKind.INTERNAL,
      attributes: {
        'performance.metric.name': metric.name,
        'performance.metric.value': metric.value,
        'performance.metric.unit': metric.unit,
        'performance.metric.metadata': JSON.stringify(metric.metadata || {}),
        'performance.timestamp': Date.now(),
      },
    });

    span.setStatus({ code: SpanStatusCode.OK });
    span.end();
  };

  const trackWebVitals = () => {
    // Track Core Web Vitals
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          trackMetric({
            name: 'FCP',
            value: entry.startTime,
            unit: 'ms',
            metadata: { entryType: entry.entryType },
          });
        }
      }).observe({ entryTypes: ['first-contentful-paint'] });

      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          trackMetric({
            name: 'LCP',
            value: entry.startTime,
            unit: 'ms',
            metadata: { 
              entryType: entry.entryType,
              element: (entry as any).element?.tagName,
            },
          });
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          trackMetric({
            name: 'FID',
            value: entry.processingStart - entry.startTime,
            unit: 'ms',
            metadata: { 
              entryType: entry.entryType,
              name: entry.name,
            },
          });
        }
      }).observe({ entryTypes: ['first-input'] });
    }
  };

  return { trackMetric, trackWebVitals };
}

// HOC para tracking automático de componentes
export function withTracking<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string,
  options?: {
    trackProps?: boolean;
    trackEvents?: string[];
    trackErrors?: boolean;
  }
) {
  return function TrackedComponent(props: P) {
    const { trackEvent, trackError } = useComponentTracking(componentName, options?.trackProps ? props : undefined);

    // Track component mount
    React.useEffect(() => {
      trackEvent('mount');
      return () => trackEvent('unmount');
    }, []);

    // Track prop changes
    React.useEffect(() => {
      if (options?.trackProps) {
        trackEvent('props_change', props);
      }
    }, [props]);

    // Wrap component with error boundary
    if (options?.trackErrors) {
      try {
        return <WrappedComponent {...props} />;
      } catch (error) {
        trackError(error as Error, { props });
        throw error;
      }
    }

    return <WrappedComponent {...props} />;
  };
}

// Función para enviar logs al backend
export async function sendLogToBackend(log: {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  metadata?: Record<string, any>;
  timestamp?: number;
}) {
  const tracer = getFrontendTracer('logging');
  const span = tracer.startSpan('log.send', {
    kind: SpanKind.INTERNAL,
    attributes: {
      'log.level': log.level,
      'log.message': log.message,
      'log.metadata': JSON.stringify(log.metadata || {}),
      'log.timestamp': log.timestamp || Date.now(),
    },
  });

  try {
    // Enviar log al endpoint de logging del backend
    const response = await fetch('/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...injectTraceContext(),
      },
      body: JSON.stringify(log),
    });

    if (!response.ok) {
      throw new Error(`Failed to send log: ${response.statusText}`);
    }

    span.setStatus({ code: SpanStatusCode.OK });
  } catch (error) {
    span.setStatus({ 
      code: SpanStatusCode.ERROR, 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
    span.recordException(error as Error);
  } finally {
    span.end();
  }
}

// Función para propagar trace context en headers HTTP (frontend)
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

// Error boundary con tracking
export class ErrorBoundaryWithTracking extends React.Component<
  { children: React.ReactNode; componentName?: string },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; componentName?: string }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const tracer = getFrontendTracer('error-boundary');
    const span = tracer.startSpan('error.boundary', {
      kind: SpanKind.INTERNAL,
      attributes: {
        'error.name': error.name,
        'error.message': error.message,
        'error.stack': error.stack,
        'error.component_stack': errorInfo.componentStack,
        'error.component_name': this.props.componentName || 'unknown',
      },
    });

    span.setStatus({ 
      code: SpanStatusCode.ERROR, 
      message: error.message 
    });
    span.recordException(error);
    span.end();

    // Enviar log al backend
    sendLogToBackend({
      level: 'error',
      message: error.message,
      metadata: {
        name: error.name,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        componentName: this.props.componentName,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong. Please try again.</div>;
    }

    return this.props.children;
  }
}