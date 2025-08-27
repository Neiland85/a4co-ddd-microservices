import { Subscription } from 'nats';
import { DomainEvent } from '../domain/domain-event';
export interface IEventBus {
    connect(servers?: string[]): Promise<void>;
    disconnect(): Promise<void>;
    publish(subject: string, event: DomainEvent): Promise<void>;
    subscribe(subject: string, handler: (event: DomainEvent) => Promise<void>): Promise<Subscription>;
    subscribeQueue(subject: string, queue: string, handler: (event: DomainEvent) => Promise<void>): Promise<Subscription>;
    isConnected(): boolean;
}
export interface EventMetadata {
    eventId: string;
    correlationId: string;
    causationId?: string;
    publishedAt: string;
    version: string;
    retryCount?: number;
    source: string;
}
export interface EnhancedDomainEvent extends DomainEvent {
    metadata: EventMetadata;
}
export declare class NatsEventBus implements IEventBus {
    private nc?;
    private codec;
    private subscriptions;
    private serviceName;
    constructor(serviceName: string);
    connect(servers?: string[]): Promise<void>;
    disconnect(): Promise<void>;
    isConnected(): boolean;
    publish(subject: string, event: DomainEvent): Promise<void>;
    subscribe(subject: string, handler: (event: DomainEvent) => Promise<void>): Promise<Subscription>;
    subscribeQueue(subject: string, queue: string, handler: (event: DomainEvent) => Promise<void>): Promise<Subscription>;
    private processMessages;
    private handleEventError;
    private generateCorrelationId;
}
export declare function EventHandler(subject: string): (target: any, propertyName: string, descriptor: PropertyDescriptor) => void;
export declare abstract class EventDrivenService {
    protected eventBus: IEventBus;
    private handlerRegistrations;
    constructor(serviceName: string);
    startEventHandling(): Promise<void>;
    stopEventHandling(): Promise<void>;
    private registerEventHandlers;
    protected publishEvent(subject: string, event: DomainEvent): Promise<void>;
}
//# sourceMappingURL=event-bus.d.ts.map