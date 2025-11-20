import { EventEmitter } from 'events';
export interface EventMessage {
    eventId: string;
    eventType: string;
    timestamp: Date;
    data: any;
    metadata?: Record<string, any>;
}
export interface INatsEventHandler<T = any> {
    (event: EventMessage): Promise<void> | void;
}
export interface NatsEventBusConfig {
    servers: string | string[];
    name?: string;
    timeout?: number;
    reconnect?: boolean;
    maxReconnectAttempts?: number;
    reconnectTimeWait?: number;
}
export declare class NatsEventBus extends EventEmitter {
    private connection;
    private subscriptions;
    private codec;
    private config;
    private connected;
    constructor(config: NatsEventBusConfig);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    private setupConnectionListeners;
    publish<T = any>(subject: string, event: EventMessage): Promise<void>;
    subscribe(subject: string, handler: INatsEventHandler, queueGroup?: string): Promise<void>;
    unsubscribe(subject: string, queueGroup?: string): Promise<void>;
    unsubscribeAll(): Promise<void>;
    getConnectionStatus(): boolean;
    getActiveSubscriptions(): string[];
    private generateEventId;
}
//# sourceMappingURL=nats-event-bus.d.ts.map