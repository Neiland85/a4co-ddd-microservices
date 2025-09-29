/**
 * React hooks and HOCs for distributed tracing
 */

import { Span } from '@opentelemetry/api';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  addPerformanceMetricsToSpan,
  traceComponentRender,
  traceRouteNavigation,
  traceUserInteraction,
} from './web-tracer';

/**
 * Hook to trace component lifecycle
 */
export function useComponentTracing(componentName: string, props?: Record<string, any>) {
  const spanRef = useRef<Span | null>(null);
  const renderCountRef = useRef(0);

  useEffect(() => {
    // Start span on mount
    spanRef.current = traceComponentRender(componentName, props);
    spanRef.current.setAttribute('component.mounted', true);
    spanRef.current.setAttribute('component.renderCount', 1);

    return () => {
      // End span on unmount
      if (spanRef.current) {
        spanRef.current.setAttribute('component.unmounted', true);
        spanRef.current.setAttribute('component.totalRenders', renderCountRef.current);
        spanRef.current.end();
      }
    };
  }, [componentName]);

  useEffect(() => {
    // Track renders
    renderCountRef.current++;
    if (spanRef.current && renderCountRef.current > 1) {
      spanRef.current.addEvent('component.rerender', {
        renderCount: renderCountRef.current,
        timestamp: new Date().toISOString(),
      });
    }
  });

  return spanRef.current;
}

/**
 * Hook to trace route changes
 */
export function useRouteTracing(currentRoute: string) {
  const previousRouteRef = useRef<string>(currentRoute);
  const spanRef = useRef<Span | null>(null);

  useEffect(() => {
    if (previousRouteRef.current !== currentRoute) {
      // End previous navigation span
      if (spanRef.current) {
        spanRef.current.end();
      }

      // Start new navigation span
      spanRef.current = traceRouteNavigation(previousRouteRef.current, currentRoute);

      // Add performance metrics after navigation
      setTimeout(() => {
        if (spanRef.current) {
          addPerformanceMetricsToSpan();
        }
      }, 100);

      previousRouteRef.current = currentRoute;
    }
  }, [currentRoute]);

  return spanRef.current;
}

/**
 * Hook to trace user interactions
 */
export interface UseInteractionTracingOptions {
  throttle?: number;
  attributes?: Record<string, any>;
}

export function useInteractionTracing(
  interactionType: string,
  target: string,
  options?: UseInteractionTracingOptions
) {
  const lastInteractionTime = useRef(0);

  const traceInteraction = useCallback(
    (metadata?: Record<string, any>) => {
      const now = Date.now();

      if (options?.throttle && now - lastInteractionTime.current < options.throttle) {
        return;
      }

      const span = traceUserInteraction(interactionType, target, {
        ...options?.attributes,
        ...metadata,
      });

      span.end();
      lastInteractionTime.current = now;
    },
    [interactionType, target, options]
  );

  return traceInteraction;
}

/**
 * Hook to trace API calls with spans
 */
export function useApiTracing() {
  const activeSpans = useRef<Map<string, Span>>(new Map());

  const startApiTrace = useCallback((operationName: string, metadata?: Record<string, any>) => {
    const span = traceUserInteraction('api-call', operationName, metadata);
    const traceId = span.spanContext().traceId;
    activeSpans.current.set(traceId, span);
    return traceId;
  }, []);

  const endApiTrace = useCallback(
    (traceId: string, success: boolean, metadata?: Record<string, any>) => {
      const span = activeSpans.current.get(traceId);
      if (span) {
        span.setAttribute('api.success', success);
        if (metadata) {
          Object.entries(metadata).forEach(([key, value]) => {
            span.setAttribute(`api.${key}`, value);
          });
        }
        span.end();
        activeSpans.current.delete(traceId);
      }
    },
    []
  );

  return { startApiTrace, endApiTrace };
}

/**
 * HOC to add tracing to any component
 */
export interface WithTracingOptions {
  componentName?: string;
  trackProps?: string[];
}

export function withTracing<P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  options?: WithTracingOptions
): React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<any>> {
  const displayName =
    options?.componentName || Component.displayName || Component.name || 'Component';

  const WrappedComponent = React.forwardRef<any, P>((props, ref) => {
    const span = useComponentTracing(displayName, props);

    // Track specific prop changes
    useEffect(
      () => {
        if (span && options?.trackProps) {
          const trackedProps: Record<string, any> = {};
          options.trackProps.forEach(propName => {
            if (propName in props) {
              trackedProps[propName] = (props as any)[propName];
            }
          });

          span.addEvent('props.updated', {
            props: JSON.stringify(trackedProps),
            timestamp: new Date().toISOString(),
          });
        }
      },
      options?.trackProps?.map(prop => (props as any)[prop]) || []
    );

    return <Component {...(props as P)} ref={ref} />;
  });

  WrappedComponent.displayName = `withTracing(${displayName})`;
  return WrappedComponent;
}

/**
 * Provider component for tracing context
 */
export interface TracingProviderProps {
  children: React.ReactNode;
  serviceName: string;
  serviceVersion: string;
  environment: string;
}

export function TracingProvider({
  children,
  serviceName,
  serviceVersion,
  environment,
}: TracingProviderProps): React.ReactElement {
  useEffect(() => {
    // Initialize web tracer on mount
    import('./web-tracer').then(({ initializeWebTracer }) => {
      initializeWebTracer({
        serviceName,
        serviceVersion,
        environment,
      });
    });
  }, [serviceName, serviceVersion, environment]);

  return <>{children}</>;
}

/**
 * Error boundary with tracing
 */
interface TracingErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export interface TracingErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error }>;
  componentName?: string;
}

export class TracingErrorBoundary extends React.Component<
  TracingErrorBoundaryProps,
  TracingErrorBoundaryState
> {
  private span?: Span;

  constructor(props: TracingErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): TracingErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const componentName = this.props.componentName || 'ErrorBoundary';
    this.span = traceComponentRender(componentName, {
      error: true,
      errorMessage: error.message,
      errorStack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    this.span.recordException(error);
    this.span.end();
  }

  override render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback;

      if (Fallback) {
        return <Fallback error={this.state.error} />;
      }

      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>{this.state.error?.toString()}</details>
        </div>
      );
    }

    return this.props.children;
  }
}
