import { EventEmitter } from 'events';
export interface EventMessage {
    eventId: string;
    eventType: string;
    timestamp: Date;
    data: any;
    metadata?: Record<string, any>;
}
export interface EventHandler<T = any> {
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
    private isConnected;
    constructor(config: NatsEventBusConfig);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    private setupConnectionListeners;
    publish<T = any>(subject: string, event: EventMessage): Promise<void>;
    subscribe(subject: string, handler: EventHandler, queueGroup?: string): Promise<void>;
    private setupMessageHandler;
    unsubscribe(subject: string, queueGroup?: string): Promise<void>;
    unsubscribeAll(): Promise<void>;
    private generateEventId;
    getConnectionStatus(): boolean;
    getActiveSubscriptions(): string[];
    publishOrderCreated(orderId: string, orderData: any): Promise<void>;
    publishStockReserved(orderId: string, stockData: any): Promise<void>;
    subscribeToOrderCreated(handler: EventHandler): Promise<void>;
    subscribeToStockReserved(handler: EventHandler): Promise<void>;
}
//# sourceMappingURL=nats-event-bus.d.ts.map