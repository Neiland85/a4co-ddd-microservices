import { trace, Span } from '@opentelemetry/api';

export function initializeWebTracer(config: { serviceName: string; serviceVersion: string; environment: string }): void {
  // Implementación de inicialización
  console.log(`Web tracer initialized for ${config.serviceName}`);
}

export function traceComponentRender(componentName: string, props?: Record<string, unknown>): Span {
  return trace.getTracer('web-tracer').startSpan(`render:${componentName}`, {
    attributes: {
      'component.name': componentName,
      ...props,
    },
  });
}

export function traceRouteNavigation(from: string, to: string): Span {
  return trace.getTracer('web-tracer').startSpan('route:navigation', {
    attributes: {
      'route.from': from,
      'route.to': to,
    },
  });
}

export function traceUserInteraction(interactionType: string, target: string, attributes?: Record<string, unknown>): Span {
  return trace.getTracer('web-tracer').startSpan(`interaction:${interactionType}`, {
    attributes: {
      'interaction.type': interactionType,
      'interaction.target': target,
      ...attributes,
    },
  });
}

export function addPerformanceMetricsToSpan(): void {
  const span = trace.getActiveSpan();
  if (!span) return;

  try {
    if ('PerformanceObserver' in globalThis) {
      // Implementación de métricas de rendimiento
      const metrics = {};
      span.setAttributes(metrics);
    }
  } catch (error) {
    if (error instanceof Error) {
      span.recordException(error);
    }
  }
}
