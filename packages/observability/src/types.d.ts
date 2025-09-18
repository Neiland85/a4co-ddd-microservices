export interface ObservabilityConfig {
    serviceName: string;
    serviceVersion?: string;
    environment?: string;
    logging?: LoggerConfig;
    tracing?: TracingConfig;
    metrics?: MetricsConfig;
}
export interface LoggerConfig {
    level?: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';
    prettyPrint?: boolean;
    redact?: string[];
    serializers?: Record<string, (value: any) => any>;
}
export interface TracingConfig {
    enabled?: boolean;
    jaegerEndpoint?: string;
    otlpEndpoint?: string;
    enableConsoleExporter?: boolean;
    enableAutoInstrumentation?: boolean;
    propagators?: string[];
    samplingRate?: number;
}
export interface MetricsConfig {
    enabled?: boolean;
    port?: number;
    endpoint?: string;
    interval?: number;
    labels?: Record<string, string>;
}
export interface DDDMetadata {
    aggregateId?: string;
    aggregateName?: string;
    commandName?: string;
    eventName?: string;
    eventVersion?: number;
    correlationId?: string;
    causationId?: string;
    userId?: string;
    tenantId?: string;
}
export interface ObservabilityContext {
    traceId?: string;
    spanId?: string;
    correlationId?: string;
    causationId?: string;
    userId?: string;
    tenantId?: string;
    metadata?: Record<string, any>;
}
export interface LogContext extends ObservabilityContext, DDDMetadata {
    [key: string]: any;
}
export interface DDDSpanAttributes extends DDDMetadata {
    'ddd.aggregate.id'?: string;
    'ddd.aggregate.name'?: string;
    'ddd.command.name'?: string;
    'ddd.event.name'?: string;
    'ddd.event.version'?: number;
}
export interface UIEvent {
    eventType: 'click' | 'input' | 'navigation' | 'error' | 'custom';
    componentName: string;
    componentProps?: Record<string, any>;
    timestamp: number;
    sessionId: string;
    userId?: string;
    metadata?: Record<string, any>;
}
export interface ComponentTrackingConfig {
    trackProps?: string[];
    trackEvents?: string[];
    trackPerformance?: boolean;
    samplingRate?: number;
}
export interface ObservabilityTracer {
    withContext(contexto: ObservabilityContext): ObservabilityTracer;
    withDDD(metadata: DDDMetadata): ObservabilityTracer;
}
export interface MiddlewareOptions {
    ignorePaths?: string[];
    includeRequestBody?: boolean;
    includeResponseBody?: boolean;
    redactHeaders?: string[];
    customAttributes?: (req: any) => Record<string, any>;
}
export interface TraceDecoratorOptions {
    name?: string;
    attributes?: Record<string, any>;
    recordException?: boolean;
    recordResult?: boolean;
}
export type ExtractContext<T> = T extends {
    context: infer C;
} ? C : never;
export type WithContext<T, C> = T & {
    context: C;
};
//# sourceMappingURL=types.d.ts.map