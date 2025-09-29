/**
 * React hooks and HOCs for logging integration
 */

import React, { createContext, useContext, useEffect, useRef } from 'react';
import type { Logger } from './types';

interface LoggerContextValue {
  logger: Logger;
}

const LoggerContext = createContext<LoggerContextValue | null>(null);

/**
 * Provider component for logger context
 */
export interface LoggerProviderProps {
  logger: Logger;
  children: React.ReactNode;
}

export function LoggerProvider({ logger, children }: LoggerProviderProps): React.ReactElement {
  return <LoggerContext.Provider value={{ logger }}>{children}</LoggerContext.Provider>;
}

/**
 * Hook to access the logger instance
 */
export function useLogger(): Logger {
  const context = useContext(LoggerContext);
  if (!context) {
    throw new Error('useLogger must be used within a LoggerProvider');
  }
  return context.logger;
}

/**
 * Hook to log component lifecycle events
 */
export function useComponentLogger(componentName: string, props?: Record<string, unknown>): Logger {
  const logger = useLogger();
  const componentLogger = useRef<Logger | null>(null);
  const renderCount = useRef(0);

  if (!componentLogger.current) {
    componentLogger.current = logger.child({
      custom: {
        component: componentName,
        props: props ? Object.keys(props) : undefined,
      },
    });
  }

  useEffect(() => {
    renderCount.current++;
    componentLogger.current?.trace(`Component rendered`, {
      custom: {
        renderCount: renderCount.current,
      },
    });
  });

  useEffect(() => {
    componentLogger.current?.debug(`Component mounted`);

    return (): void => {
      componentLogger.current?.debug(`Component unmounted`, {
        custom: {
          totalRenders: renderCount.current,
        },
      });
    };
  }, []);

  return componentLogger.current;
}

/**
 * Hook to log user interactions
 */
export interface UseInteractionLoggerOptions {
  throttle?: number;
  debounce?: number;
}

export function useInteractionLogger(
  interactionType: string,
  options?: UseInteractionLoggerOptions
): (_eventData?: unknown) => void {
  const logger = useLogger();
  const lastLogTime = useRef(0);
  const debounceTimer = useRef<ReturnType<typeof globalThis.setTimeout> | null>(null);

  return (eventData?: unknown) => {
    const now = Date.now();

    if (options?.throttle && now - lastLogTime.current < options.throttle) {
      return;
    }

    if (options?.debounce) {
      if (debounceTimer.current) {
        globalThis.clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = globalThis.setTimeout(() => {
        logger.info(`User interaction: ${interactionType}`, {
          custom: {
            interaction: interactionType,
            data: eventData,
          },
        });
        lastLogTime.current = Date.now();
      }, options.debounce);
    } else {
      logger.info(`User interaction: ${interactionType}`, {
        custom: {
          interaction: interactionType,
          data: eventData,
        },
      });
      lastLogTime.current = now;
    }
  };
}

/**
 * Hook to log API calls
 */
export interface ApiCallOptions {
  method: string;
  url: string;
  body?: unknown;
  headers?: Record<string, string>;
}

interface ApiLogger {
  // eslint-disable-next-line no-unused-vars
  logRequest: (options: ApiCallOptions, traceId?: string) => number;

  logResponse: (
    startTime: number,
    options: ApiCallOptions,
    response: unknown,
    traceId?: string
  ) => void;
  // eslint-disable-next-line no-unused-vars
  logError: (startTime: number, options: ApiCallOptions, error: Error, traceId?: string) => void;
}

export function useApiLogger(): ApiLogger {
  const logger = useLogger();

  return {
    logRequest: (options: ApiCallOptions, traceId?: string): number => {
      const startTime = Date.now();

      logger.info(`API request started`, {
        traceId,
        http: {
          method: options.method,
          url: options.url,
        },
        custom: {
          hasBody: !!options.body,
          headers: options.headers ? Object.keys(options.headers) : undefined,
        },
      });

      return startTime;
    },

    logResponse: (
      startTime: number,
      options: ApiCallOptions,
      response: unknown,
      traceId?: string
    ): void => {
      const duration = Date.now() - startTime;

      const responseObj = response as { status?: number };
      logger.info(`API request completed`, {
        traceId,
        http: {
          method: options.method,
          url: options.url,
          statusCode: responseObj.status,
          duration,
        },
      });
    },

    logError: (
      startTime: number,
      options: ApiCallOptions,
      error: Error,
      traceId?: string
    ): void => {
      const duration = Date.now() - startTime;

      logger.error(`API request failed`, error, {
        traceId,
        http: {
          method: options.method,
          url: options.url,
          duration,
        },
      });
    },
  };
}

/**
 * Error boundary component with logging
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export interface LoggingErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error }>;

  onError?: (_error: Error, _errorInfo: React.ErrorInfo) => void;
}

export class LoggingErrorBoundary extends React.Component<
  LoggingErrorBoundaryProps,
  ErrorBoundaryState
> {
  static override contextType = LoggerContext;
  declare context: LoggerContextValue;

  constructor(props: LoggingErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    const logger = this.context?.logger;

    if (logger) {
      logger.error('React error boundary caught error', error, {
        custom: {
          componentStack: errorInfo.componentStack,
        },
      });
    }

    this.props.onError?.(error, errorInfo);
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

/**
 * HOC to add logging to any component
 */
export function withLogging<P extends Record<string, unknown>>(
  Component: React.ComponentType<P>,
  componentName?: string
): React.ForwardRefExoticComponent<React.PropsWithoutRef<P> & React.RefAttributes<unknown>> {
  const displayName = componentName || Component.displayName || Component.name || 'Component';

  const WrappedComponent = React.forwardRef<unknown, P>((props, ref) => {
    const logger = useComponentLogger(displayName, props);

    useEffect(() => {
      logger.trace(`Props updated`, {
        custom: {
          props: Object.keys(props),
        },
      });
    }, [props, logger]);

    return <Component {...(props as P)} ref={ref} />;
  });

  WrappedComponent.displayName = `withLogging(${displayName})`;
  return WrappedComponent;
}
