/**
 * React hooks and HOCs for logging integration
 */
import React from 'react';
import { Logger } from './types';
interface LoggerContextValue {
    logger: Logger;
}
/**
 * Provider component for logger context
 */
export interface LoggerProviderProps {
    logger: Logger;
    children: React.ReactNode;
}
export declare function LoggerProvider({ logger, children }: LoggerProviderProps): JSX.Element;
/**
 * Hook to access the logger instance
 */
export declare function useLogger(): Logger;
/**
 * Hook to log component lifecycle events
 */
export declare function useComponentLogger(componentName: string, props?: Record<string, any>): Logger;
/**
 * Hook to log user interactions
 */
export interface UseInteractionLoggerOptions {
    throttle?: number;
    debounce?: number;
}
export declare function useInteractionLogger(interactionType: string, options?: UseInteractionLoggerOptions): (eventData?: any) => void;
/**
 * Hook to log API calls
 */
export interface ApiCallOptions {
    method: string;
    url: string;
    body?: any;
    headers?: Record<string, string>;
}
export declare function useApiLogger(): {
    logRequest: (options: ApiCallOptions, traceId?: string) => number;
    logResponse: (startTime: number, options: ApiCallOptions, response: Response, traceId?: string) => void;
    logError: (startTime: number, options: ApiCallOptions, error: Error, traceId?: string) => void;
};
/**
 * Error boundary component with logging
 */
interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}
export interface LoggingErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{
        error?: Error;
    }>;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}
export declare class LoggingErrorBoundary extends React.Component<LoggingErrorBoundaryProps, ErrorBoundaryState> {
    static contextType: React.Context<LoggerContextValue | null>;
    context: LoggerContextValue;
    constructor(props: LoggingErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): ErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void;
    render(): string | number | bigint | boolean | import("react/jsx-runtime").JSX.Element | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined;
}
/**
 * HOC to add logging to any component
 */
export declare function withLogging<P extends object>(Component: React.ComponentType<P>, componentName?: string): React.ComponentType<P>;
export {};
//# sourceMappingURL=react-hooks.d.ts.map