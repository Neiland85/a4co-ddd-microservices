import { SpanKind } from '@opentelemetry/api';
export interface AggregateMetadata {
    aggregateName: string;
    aggregateId: string;
    version?: number;
}
export interface CommandMetadata {
    commandName: string;
    commandId: string;
    aggregateId?: string;
    userId?: string;
    correlationId?: string;
}
export interface EventMetadata {
    eventName: string;
    eventId: string;
    aggregateId?: string;
    correlationId?: string;
    causationId?: string;
}
export interface DomainEvent {
    eventId: string;
    eventName: string;
    aggregateId: string;
    aggregateName: string;
    version: number;
    timestamp: Date;
    data: any;
    metadata: {
        correlationId?: string;
        causationId?: string;
        userId?: string;
    };
}
export declare function TraceAggregateMethod(aggregateName: string): (target: any, propertyName: string, descriptor: PropertyDescriptor) => void;
export declare function TraceCommand(commandName: string): (target: any, propertyName: string, descriptor: PropertyDescriptor) => void;
export declare function TraceEventHandler(eventName: string): (target: any, propertyName: string, descriptor: PropertyDescriptor) => void;
export declare class DDDContext {
    private static correlationIdKey;
    private static userIdKey;
    private static causationIdKey;
    static setCorrelationId(correlationId: string): void;
    static getCorrelationId(): string | undefined;
    static setUserId(userId: string): void;
    static getUserId(): string | undefined;
    static setCausationId(causationId: string): void;
    static getCausationId(): string | undefined;
    static createContext(metadata: {
        correlationId?: string;
        userId?: string;
        causationId?: string;
    }): import("@opentelemetry/api").Context;
}
export declare function createDomainSpan(operation: string, metadata: AggregateMetadata | CommandMetadata | EventMetadata, kind?: SpanKind): any;
export declare function injectNATSTraceContext(headers: Record<string, string>): Record<string, string>;
export declare function extractNATSTraceContext(headers: Record<string, string>): void;
export declare function dddContextMiddleware(): (req: any, res: any, next: any) => void;
export declare function traceDomainTransaction<T>(operation: string, metadata: AggregateMetadata | CommandMetadata | EventMetadata, fn: () => Promise<T>): Promise<T>;
//# sourceMappingURL=ddd-tracing.d.ts.map