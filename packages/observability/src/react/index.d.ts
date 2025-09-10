import React, { ComponentType, PropsWithChildren, ErrorInfo } from 'react';
import { UIEvent, ComponentTrackingConfig } from '../types';
interface BrowserLogger {
    debug: (message: string, data?: any) => void;
    info: (message: string, data?: any) => void;
    warn: (message: string, data?: any) => void;
    error: (message: string, data?: any) => void;
}
interface ObservabilityContextValue {
    sessionId: string;
    userId?: string;
    logger: BrowserLogger;
    logEvent: (event: UIEvent) => void;
    trackComponent: (componentName: string, config?: ComponentTrackingConfig) => void;
    measurePerformance: (name: string, fn: () => void | Promise<void>) => Promise<void>;
}
export interface ObservabilityProviderProps {
    apiEndpoint: string;
    userId?: string;
    enablePerformanceTracking?: boolean;
    enableErrorBoundary?: boolean;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}
export declare const ObservabilityProvider: React.FC<PropsWithChildren<ObservabilityProviderProps>>;
export declare const useObservability: () => ObservabilityContextValue;
export declare const useComponentTracking: (componentName: string, config?: ComponentTrackingConfig) => void;
export declare const useEventTracking: () => {
    trackClick: (componentName: string, metadata?: Record<string, any>) => void;
    trackInput: (componentName: string, value: any, metadata?: Record<string, any>) => void;
    trackCustom: (componentName: string, action: string, metadata?: Record<string, any>) => void;
};
export declare function withObservability<P extends object>(Component: ComponentType<P>, componentName: string, config?: ComponentTrackingConfig): ComponentType<P>;
export declare const PerformanceTracker: React.FC<{
    name: string;
    children: () => React.ReactNode;
}>;
export declare const createTracedFetch: (apiEndpoint: string, sessionId: string) => (url: string, options?: RequestInit) => Promise<Response>;
export {};
//# sourceMappingURL=index.d.ts.map