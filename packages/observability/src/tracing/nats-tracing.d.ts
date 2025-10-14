/**
 * NATS integration for distributed tracing
 */
import { Span } from '@opentelemetry/api';
import { Logger } from '../logging/types';
export interface NatsTracingConfig {
    serviceName: string;
    logger?: Logger;
}
export interface TracedMessage {
    data: any;
    headers: {
        traceId: string;
        spanId: string;
        parentSpanId?: string;
        timestamp: string;
        [key: string]: any;
    };
}
/**
 * Wrap NATS publish with tracing
 */
export declare function createTracedPublisher(config: NatsTracingConfig): (subject: string, data: any, options?: {
    replyTo?: string;
    headers?: Record<string, string>;
}) => Promise<void>;
/**
 * Wrap NATS subscribe with tracing
 */
export declare function createTracedSubscriber(config: NatsTracingConfig): (subject: string, handler: (msg: any, span: Span) => Promise<void>) => (msg: any) => Promise<void>;
/**
 * Wrap NATS request-reply with tracing
 */
export declare function createTracedRequest(config: NatsTracingConfig): (subject: string, data: any, options?: {
    timeout?: number;
    headers?: Record<string, string>;
}) => Promise<any>;
/**
 * Create a traced NATS client wrapper
 */
export declare class TracedNatsClient {
    private config;
    private publish;
    private subscribe;
    private request;
    constructor(config: NatsTracingConfig);
    publishEvent(subject: string, event: {
        type: string;
        aggregateId: string;
        data: any;
        metadata?: Record<string, any>;
    }): Promise<void>;
    subscribeToEvents(subject: string, handler: (event: any, span: Span) => Promise<void>): void;
    sendCommand(subject: string, command: {
        type: string;
        aggregateId: string;
        data: any;
        metadata?: Record<string, any>;
    }, timeout?: number): Promise<any>;
}
//# sourceMappingURL=nats-tracing.d.ts.map