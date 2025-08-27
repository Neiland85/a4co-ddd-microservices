export interface EventMessage {
    id: string;
    type: string;
    data: any;
    timestamp: Date;
    aggregateId: string;
    version: number;
    correlationId?: string;
    sagaId?: string;
}
export interface EventHandler<T = any> {
    handle(event: T): Promise<void> | void;
}
export interface EventPublisher {
    publish<T = any>(event: EventMessage): Promise<void>;
}
export interface EventSubscriber {
    subscribe<T = any>(eventType: string, handler: EventHandler<T>): void;
    unsubscribe(eventType: string, handler: EventHandler<any>): void;
}
export interface EventBus extends EventPublisher, EventSubscriber {
    start(): Promise<void>;
    stop(): Promise<void>;
}
export interface EventStore {
    save(event: EventMessage): Promise<void>;
    getEvents(aggregateId: string): Promise<EventMessage[]>;
    getEventsByType(eventType: string): Promise<EventMessage[]>;
}
//# sourceMappingURL=event-types.d.ts.map