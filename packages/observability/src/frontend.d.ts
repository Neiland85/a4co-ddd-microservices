import { SpanStatusCode, SpanKind } from '@opentelemetry/api';
interface FrontendLoggerConfig {
    serviceName: string;
    serviceVersion?: string;
    environment?: string;
    endpoint?: string;
    level?: 'debug' | 'info' | 'warn' | 'error';
}
interface FrontendTracingConfig {
    serviceName: string;
    serviceVersion?: string;
    environment?: string;
    endpoint?: string;
    enableConsoleExporter?: boolean;
}
interface UIEvent {
    component: string;
    action: string;
    variant?: string;
    size?: string;
    props?: Record<string, any>;
    timestamp: number;
    sessionId: string;
    userId?: string;
}
declare class FrontendLogger {
    private config;
    private sessionId;
    constructor(config: FrontendLoggerConfig);
    private generateSessionId;
    private createLogEntry;
    private getUserId;
    private sendLog;
    debug(message: string, data?: any): void;
    info(message: string, data?: any): void;
    warn(message: string, data?: any): void;
    error(message: string, error?: Error, data?: any): void;
    logUIEvent(event: Omit<UIEvent, 'timestamp' | 'sessionId'>): void;
}
declare class FrontendTracer {
    private provider;
    private config;
    constructor(config: FrontendTracingConfig);
    private initializeTracer;
    createSpan(name: string, kind?: SpanKind): any;
    createChildSpan(parentSpan: any, name: string, kind?: SpanKind): any;
    addEvent(span: any, name: string, attributes?: Record<string, any>): void;
    setAttributes(span: any, attributes: Record<string, any>): void;
    endSpan(span: any, status?: SpanStatusCode): void;
}
export declare function initializeFrontendObservability(loggerConfig: FrontendLoggerConfig, tracingConfig: FrontendTracingConfig): {
    logger: FrontendLogger;
    tracer: FrontendTracer;
};
export declare function useErrorLogger(): {
    logError: (error: Error, context?: string) => void;
};
export declare function useUILogger(): {
    logUIEvent: (event: Omit<UIEvent, "timestamp" | "sessionId">) => void;
};
export declare function useComponentTracing(componentName: string): {
    createChildSpan: (action: string) => any;
};
export declare function withObservability<P extends object>(WrappedComponent: React.ComponentType<P>, componentName: string): (props: P) => WrappedComponent;
export declare function createObservableFetch(baseURL?: string): (url: string, options?: RequestInit) => Promise<Response>;
export declare function getFrontendLogger(): FrontendLogger | null;
export declare function getFrontendTracer(): FrontendTracer | null;
export type { FrontendLoggerConfig, FrontendTracingConfig, UIEvent };
//# sourceMappingURL=frontend.d.ts.map