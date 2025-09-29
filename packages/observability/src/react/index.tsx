import type { ComponentType, ErrorInfo, PropsWithChildren } from 'react';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ComponentTrackingConfig, UIEvent } from '../types';

// Browser-side logger interface
interface BrowserLogger {
  debug: (_message: string, _data?: unknown) => void;

  info: (_message: string, _data?: unknown) => void;

  warn: (_message: string, _data?: unknown) => void;

  error: (_message: string, _data?: unknown) => void;
}

// Observability context
interface ObservabilityContextValue {
  sessionId: string;
  userId?: string;
  logger: BrowserLogger;

  logEvent: (_event: UIEvent) => void;

  trackComponent: (_componentName: string, _config?: ComponentTrackingConfig) => void;

  measurePerformance: (_name: string, _fn: () => void | Promise<void>) => Promise<void>;
}

const ObservabilityContext = createContext<ObservabilityContextValue | null>(null);

// Default browser logger that sends to backend
const createBrowserLogger = (apiEndpoint: string, sessionId: string): BrowserLogger => {
  const sendLog = async (level: string, message: string, data?: unknown): Promise<void> => {
    try {
      await fetch(`${apiEndpoint}/logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId,
        },
        body: JSON.stringify({
          level,
          message,
          data,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      });
    } catch (error) {
      console.error('Failed to send log to backend:', error);
    }
  };

  return {
    debug: (message, data): void => {
      console.debug(message, data);
      sendLog('debug', message, data);
    },
    info: (message, data): void => {
      console.info(message, data);
      sendLog('info', message, data);
    },
    warn: (message, data): void => {
      console.warn(message, data);
      sendLog('warn', message, data);
    },
    error: (message, data): void => {
      console.error(message, data);
      sendLog('error', message, data);
    },
  };
};

// Observability Provider Component
export interface ObservabilityProviderProps {
  apiEndpoint: string;
  userId?: string;
  enablePerformanceTracking?: boolean;
  enableErrorBoundary?: boolean;

  onError?: (_error: Error, _errorInfo: ErrorInfo) => void;
}

export const ObservabilityProvider: React.FC<PropsWithChildren<ObservabilityProviderProps>> = ({
  children,
  apiEndpoint,
  userId,
  enablePerformanceTracking = true,
  enableErrorBoundary = true,
  onError,
}) => {
  const [sessionId] = useState(() => uuidv4());
  const logger = useRef(createBrowserLogger(apiEndpoint, sessionId));
  const eventQueue = useRef<UIEvent[]>([]);
  const flushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Flush events to backend
  const flushEvents = async (): Promise<void> => {
    if (eventQueue.current.length === 0) return;

    const events = [...eventQueue.current];
    eventQueue.current = [];

    try {
      await fetch(`${apiEndpoint}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': sessionId,
        },
        body: JSON.stringify({ events }),
      });
    } catch (error) {
      logger.current.error('Failed to send events to backend', error);
      // Re-queue events on failure
      eventQueue.current.unshift(...events);
    }
  };

  // Log UI event
  const logEvent = (event: UIEvent): void => {
    eventQueue.current.push({
      ...event,
      sessionId,
      userId,
      timestamp: Date.now(),
    });

    // Debounce flush
    if (flushTimer.current) {
      clearTimeout(flushTimer.current);
    }
    flushTimer.current = setTimeout(flushEvents, 1000);
  };

  // Track component usage
  const trackComponent = (componentName: string, config?: ComponentTrackingConfig): void => {
    logEvent({
      eventType: 'custom',
      componentName,
      componentProps: config?.trackProps ? {} : undefined,
      timestamp: Date.now(),
      sessionId,
      metadata: {
        action: 'component_rendered',
      },
    });
  };

  // Measure performance
  const measurePerformance = async (
    name: string,
    fn: () => void | Promise<void>
  ): Promise<void> => {
    const startTime = performance.now();

    try {
      await fn();
      const duration = performance.now() - startTime;

      logger.current.info(`Performance: ${name}`, { duration });

      logEvent({
        eventType: 'custom',
        componentName: 'performance',
        timestamp: Date.now(),
        sessionId,
        metadata: {
          measurement: name,
          duration,
        },
      });
    } catch (error) {
      const duration = performance.now() - startTime;
      logger.current.error(`Performance error: ${name}`, { duration, error });
      throw error;
    }
  };

  // Track page views
  useEffect(() => {
    const trackPageView = (): void => {
      logEvent({
        eventType: 'navigation',
        componentName: 'page',
        timestamp: Date.now(),
        sessionId,
        metadata: {
          url: window.location.href,
          referrer: document.referrer,
          title: document.title,
        },
      });
    };

    trackPageView();
    window.addEventListener('popstate', trackPageView);

    return () => {
      window.removeEventListener('popstate', trackPageView);
      // Flush remaining events
      flushEvents();
    };
  }, []);

  // Track performance metrics
  useEffect(() => {
    if (!enablePerformanceTracking) return undefined;

    // Wait for page load
    const trackPerformance = (): void => {
      if ('performance' in window) {
        const perfData = performance.getEntriesByType(
          'navigation'
        )[0] as PerformanceNavigationTiming;

        if (perfData) {
          logger.current.info('Page performance metrics', {
            domContentLoaded:
              perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
            firstContentfulPaint:
              performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
          });
        }
      }
    };

    if (document.readyState === 'complete') {
      trackPerformance();
    } else {
      window.addEventListener('load', trackPerformance);
      return () => window.removeEventListener('load', trackPerformance);
    }

    return undefined;
  }, [enablePerformanceTracking]);

  const value: ObservabilityContextValue = {
    sessionId,
    userId,
    logger: logger.current,
    logEvent,
    trackComponent,
    measurePerformance,
  };

  if (enableErrorBoundary) {
    return (
      <ObservabilityContext.Provider value={value}>
        <ErrorBoundary onError={onError} logger={logger.current}>
          {children}
        </ErrorBoundary>
      </ObservabilityContext.Provider>
    );
  }

  return <ObservabilityContext.Provider value={value}>{children}</ObservabilityContext.Provider>;
};

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<
  PropsWithChildren<{
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    logger: BrowserLogger;
  }>,
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.logger.error('React error boundary caught error', {
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <p>We're sorry for the inconvenience. Please refresh the page.</p>
          {process.env['NODE_ENV'] === 'development' && (
            <details style={{ marginTop: '20px', textAlign: 'left' }}>
              <summary>Error details</summary>
              <pre>{this.state.error?.stack}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// Hooks
export const useObservability = (): ObservabilityContextValue => {
  const context = useContext(ObservabilityContext);
  if (!context) {
    throw new Error('useObservability must be used within ObservabilityProvider');
  }
  return context;
};

// Hook for tracking component lifecycle
export const useComponentTracking = (componentName: string, config?: ComponentTrackingConfig) => {
  const { trackComponent, logEvent } = useObservability();
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current++;
    trackComponent(componentName, config);

    return () => {
      logEvent({
        eventType: 'custom',
        componentName,
        timestamp: Date.now(),
        sessionId: '',
        metadata: {
          action: 'component_unmounted',
          renderCount: renderCount.current,
        },
      });
    };
  }, []);
};

// Hook for tracking user interactions
export const useEventTracking = (): {
  trackClick: (_element: string, _metadata?: Record<string, unknown>) => void;

  trackInput: (_field: string, _value: string, _metadata?: Record<string, unknown>) => void;

  trackCustom: (_event: string, _properties?: Record<string, unknown>) => void;
} => {
  const { logEvent, sessionId } = useObservability();

  const trackClick = (componentName: string, metadata?: Record<string, unknown>): void => {
    logEvent({
      eventType: 'click',
      componentName,
      timestamp: Date.now(),
      sessionId,
      metadata,
    });
  };

  const trackInput = (
    componentName: string,
    value: unknown,
    metadata?: Record<string, unknown>
  ): void => {
    logEvent({
      eventType: 'input',
      componentName,
      timestamp: Date.now(),
      sessionId: '',
      metadata: {
        value:
          typeof value === 'string' && value.length > 100 ? `${value.substring(0, 100)}...` : value,
        ...metadata,
      },
    });
  };

  const trackCustom = (event: string, properties?: Record<string, unknown>): void => {
    logEvent({
      eventType: 'custom',
      componentName: event,
      timestamp: Date.now(),
      sessionId: '',
      metadata: properties,
    });
  };

  return { trackClick, trackInput, trackCustom };
};

// HOC for component tracking
export function withObservability<P extends object>(
  Component: ComponentType<P>,
  componentName: string,
  config?: ComponentTrackingConfig
): ComponentType<P> {
  return (props: P) => {
    useComponentTracking(componentName, config);

    return <Component {...props} />;
  };
}

// Performance tracking component
export const PerformanceTracker: React.FC<{
  name: string;
  children: () => React.ReactNode;
}> = ({ name, children }) => {
  const { measurePerformance } = useObservability();
  const [content, setContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    measurePerformance(name, async () => {
      const result = children();
      setContent(result);
    });
  }, []);

  return <>{content}</>;
};

// Traced fetch wrapper
export const createTracedFetch = (apiEndpoint: string, sessionId: string) => {
  return async (url: string, options?: RequestInit): Promise<Response> => {
    const traceId = uuidv4();
    const startTime = performance.now();

    const tracedOptions: RequestInit = {
      ...options,
      headers: {
        ...options?.headers,
        'X-Trace-ID': traceId,
        'X-Session-ID': sessionId,
      },
    };

    try {
      const response = await fetch(url, tracedOptions);
      const duration = performance.now() - startTime;

      // Log to console in development
      if (process.env['NODE_ENV'] === 'development') {
        console.debug(
          `[Trace ${traceId}] ${options?.method || 'GET'} ${url} - ${response.status} (${duration.toFixed(2)}ms)`
        );
      }

      return response;
    } catch (error) {
      const duration = performance.now() - startTime;
      console.error(
        `[Trace ${traceId}] ${options?.method || 'GET'} ${url} - Failed (${duration.toFixed(2)}ms)`,
        error
      );
      throw error;
    }
  };
};
