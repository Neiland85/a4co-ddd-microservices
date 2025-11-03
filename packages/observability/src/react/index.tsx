import { context, propagation, SpanStatusCode, trace } from '@opentelemetry/api';
import React, { useCallback, useEffect } from 'react';

export function truncateValue(value: unknown): string {
  return typeof value === 'string' && value.length > 100
    ? value.substring(0, 100) + '...'
    : String(value);
}

export const createTracedFetch = (apiEndpoint: string, sessionId: string) => {
  return async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    const span = trace.getTracer('frontend-tracer').startSpan('fetch', {
      attributes: {
        'http.url': typeof input === 'string' ? input : input.url,
        'session.id': sessionId,
      },
    });

    return context.with(trace.setSpan(context.active(), span), async () => {
      try {
        const headers = init?.headers ? new Headers(init.headers) : new Headers();
        propagation.inject(context.active(), headers);

        const response = await fetch(input, {
          ...init,
          headers,
        });

        span.setAttributes({
          'http.status_code': response.status,
          'http.status_text': response.statusText,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response;
      } catch (error) {
        if (error instanceof Error) {
          span.recordException(error);
          span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
        }
        throw error;
      } finally {
        span.end();
      }
    });
  };
};

export function TracedComponent({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('TracedComponent mounted');
    }
  }, []);

  return <>{children}</>;
}

// Hook for component tracking
export function useComponentTracking(componentName: string, options?: { trackProps?: string[] }) {
  useEffect(() => {
    // Track component mount
    console.log(`Component ${componentName} mounted`, options);
    return () => {
      // Track component unmount
      console.log(`Component ${componentName} unmounted`);
    };
  }, [componentName, options]);
}

// Hook for event tracking
export function useEventTracking() {
  const trackClick = useCallback((eventName: string, data?: Record<string, unknown>) => {
    console.log(`Event: ${eventName}`, data);
  }, []);

  const trackInput = useCallback(
    (componentName: string, value: string, data?: Record<string, unknown>) => {
      console.log(`Input: ${componentName}`, { value, ...data });
    },
    []
  );

  const trackCustom = useCallback(
    (componentName: string, eventType: string, data?: Record<string, unknown>) => {
      console.log(`Custom event: ${componentName}.${eventType}`, data);
    },
    []
  );

  return { trackClick, trackInput, trackCustom };
}
