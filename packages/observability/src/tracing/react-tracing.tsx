import type { Attributes, Span } from '@opentelemetry/api';
import React, { useCallback, useEffect, useRef } from 'react';
import {
  addPerformanceMetricsToSpan,
  traceComponentRender,
  traceRouteNavigation,
  traceUserInteraction,
} from './web-tracer';

// Tipos para tracing
interface WithTracingOptions {
  componentName?: string;
  trackProps?: string[];
}

interface TracingProviderProps {
  children: React.ReactNode;
  serviceName: string;
  serviceVersion: string;
  environment: string;
}

/**
 * Hook to trace component lifecycle
 */
export function useComponentTracing(componentName: string, props?: Attributes): Span | null {
  const spanRef = useRef<Span | null>(null);
  const renderCountRef = useRef(0);

  useEffect(() => {
    // Start span on mount
    spanRef.current = traceComponentRender(componentName, props);
    spanRef.current?.setAttribute('component.mounted', true);
    spanRef.current?.setAttribute('component.renderCount', 1);

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
  options?: UseInteractionTracingOptions
): (metadata?: Attributes) => void {
  const lastInteractionTime = useRef(0);

  const traceInteraction = useCallback(
    (metadata?: Attributes) => {
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
    [interactionType, target, options?.throttle, options?.attributes]
  );

  return traceInteraction;
}

/**
 * HOC to trace component rendering and props
 */
export function withTracing<P extends object>(
  Component: React.ComponentType<P>,
  options: WithTracingOptions = {}
): React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<unknown>> {
  const displayName =
    options.componentName || Component.displayName || Component.name || 'Component';

  const WrappedComponent = React.forwardRef<unknown, P>((props, ref) => {
    const span = useComponentTracing(displayName, {
      'component.props': JSON.stringify(
        options.trackProps?.reduce(
          (acc, prop) => {
            if (prop in props) {
              acc[prop] = (props as Record<string, unknown>)[prop];
            }
            return acc;
          },
          {} as Record<string, unknown>
        )
      ),
    });

    useEffect(
      () => {
        if (span && options.trackProps) {
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
        // Build dependencies safely
        // eslint-disable-next-line react-hooks/exhaustive-deps
      },
      (() => {
        const deps: unknown[] = [span];
        if (options.trackProps) {
          deps.push(...options.trackProps.map(prop => (props as Record<string, unknown>)[prop]));
        }
        return deps;
      })()
    );

    // Do not forward ref to arbitrary component types to keep typing simple
    return <Component {...(props as P)} />;
  });

  WrappedComponent.displayName = `withTracing(${displayName})`;
  return WrappedComponent;
}

/**
 * Provider component for tracing context
 */
export function TracingProvider({
  children,
  serviceName,
  serviceVersion,
  environment,
}: TracingProviderProps): React.ReactElement {
  useEffect(() => {
    // Initialize web tracer on mount
    import('./web-tracer.js').then(({ initializeWebTracer }) => {
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
