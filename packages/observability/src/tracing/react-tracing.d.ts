/**
 * React hooks and HOCs for distributed tracing
 */
import React from 'react';
import { Span } from '@opentelemetry/api';
/**
 * Hook to trace component lifecycle
 */
export declare function useComponentTracing(componentName: string, props?: Record<string, any>): Span | null;
/**
 * Hook to trace route changes
 */
export declare function useRouteTracing(currentRoute: string): Span | null;
/**
 * Hook to trace user interactions
 */
export interface UseInteractionTracingOptions {
    throttle?: number;
    attributes?: Record<string, any>;
}
export declare function useInteractionTracing(interactionType: string, target: string, options?: UseInteractionTracingOptions): (metadata?: Record<string, any>) => void;
/**
 * Hook to trace API calls with spans
 */
export declare function useApiTracing(): {
    startApiTrace: (operationName: string, metadata?: Record<string, any>) => string;
    endApiTrace: (traceId: string, success: boolean, metadata?: Record<string, any>) => void;
};
/**
 * HOC to add tracing to any component
 */
export interface WithTracingOptions {
    componentName?: string;
    trackProps?: string[];
}
export declare function withTracing<P extends object>(Component: React.ComponentType<P>, options?: WithTracingOptions): React.ComponentType<P>;
/**
 * Provider component for tracing context
 */
export interface TracingProviderProps {
    children: React.ReactNode;
    serviceName: string;
    serviceVersion: string;
    environment: string;
}
export declare function TracingProvider({ children, serviceName, serviceVersion, environment, }: TracingProviderProps): JSX.Element;
/**
 * Error boundary with tracing
 */
interface TracingErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}
export interface TracingErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{
        error?: Error;
    }>;
    componentName?: string;
}
export declare class TracingErrorBoundary extends React.Component<TracingErrorBoundaryProps, TracingErrorBoundaryState> {
    private span?;
    constructor(props: TracingErrorBoundaryProps);
    static getDerivedStateFromError(error: Error): TracingErrorBoundaryState;
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void;
    render(): string | number | bigint | boolean | import("react/jsx-runtime").JSX.Element | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined;
}
export {};
//# sourceMappingURL=react-tracing.d.ts.map