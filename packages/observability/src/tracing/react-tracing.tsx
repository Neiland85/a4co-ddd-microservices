/**
 * React hooks and HOCs for distributed tracing
 */

import type { Attributes, Span } from '@opentelemetry/api';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  addPerformanceMetricsToSpan,
  traceComponentRender,
  traceRouteNavigation,
  traceUserInteraction,
} from './web-tracer';

// Global type declarations for browser APIs
declare const setTimeout: (_callback: () => void, _delay: number) => void;

/**
 * Hook to trace component lifecycle
 */
export function useComponentTracing(componentName: string, props?: Attributes): Span | null {
  const spanRef = useRef<Span | null>(null);
  const renderCountRef = useRef(0);

  useEffect(() => {
    // Start span on mount
    spanRef.current = traceComponentRender(componentName, props);
    spanRef.current.setAttribute('component.mounted', true);
    spanRef.current.setAttribute('component.renderCount', 1);

    return (): void => {
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
export function useRouteTracing(currentRoute: string): Span | null {
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
  attributes?: Attributes;
}

export function useInteractionTracing(
  interactionType: string,
  target: string,
  options?: UseInteractionTracingOptions,
): (_metadata?: Attributes) => void {
  const lastInteractionTime = useRef(0);

  const traceInteraction = useCallback(
    (_metadata?: Attributes) => {
      const now = Date.now();

      if (options?.throttle && now - lastInteractionTime.current < options.throttle) {
        return;
      }

      const span = traceUserInteraction(interactionType, target, {
        ...options?.attributes,
        ..._metadata,
      });

      span.end();
      lastInteractionTime.current = now;
    },
    [interactionType, target, options],
  );

  return traceInteraction;
}

/**
 * Hook to trace API calls with spans
 */
export function useApiTracing(): {
  startApiTrace: (_operationName: string, _metadata?: Attributes) => string;
  endApiTrace: (_traceId: string, _success: boolean, _metadata?: Attributes) => void;
} {
  const activeSpans = useRef<Map<string, Span>>(new Map());

  const startApiTrace = useCallback((_operationName: string, _metadata?: Attributes) => {
    const span = traceUserInteraction('api-call', _operationName, _metadata);
    const traceId = span.spanContext().traceId;
    activeSpans.current.set(traceId, span);
    return traceId;
  }, []);

  const endApiTrace = useCallback((_traceId: string, _success: boolean, _metadata?: Attributes) => {
    const span = activeSpans.current.get(_traceId);
    if (span) {
      span.setAttribute('api.success', _success);
      if (_metadata) {
        Object.entries(_metadata).forEach(([key, value]) => {
          span.setAttribute(`api.${key}`, String(value));
        });
      }
      span.end();
      activeSpans.current.delete(_traceId);
    }
  }, []);

  return { startApiTrace, endApiTrace };
}

/**
 * HOC to add tracing to any component
 */
export interface WithTracingOptions {
  componentName?: string;
  trackProps?: string[];
}

export function withTracing<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  options?: WithTracingOptions,
): React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<unknown>> {
  const displayName =
    options?.componentName || Component.displayName || Component.name || 'Component';

  const WrappedComponent = React.forwardRef<unknown, P>((props, ref) => {
    const span = useComponentTracing(displayName, props as Attributes);

    // Track specific prop changes
    useEffect(
      () => {
        if (span && options?.trackProps) {
          const trackedProps: Record<string, unknown> = {};
          options.trackProps.forEach(propName => {
            if (propName in props) {
              trackedProps[propName] = (props as Record<string, unknown>)[propName];
            }
          });

          span.addEvent('props.updated', {
            props: JSON.stringify(trackedProps),
            timestamp: new Date().toISOString(),
          });
        }
      },
      options?.trackProps?.map(prop => (props as Record<string, unknown>)[prop]) || [],
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
      errorStack: error.stack || '',
      componentStack: errorInfo.componentStack || '',
    });

    this.span.recordException(error);
    this.span.end();
  }

  override render(): React.ReactNode {
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
