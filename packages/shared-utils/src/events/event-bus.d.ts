import { EventEmitter } from 'events';
import { DomainEvent } from './domain-events';
export interface IEventBus {
    publish(event: DomainEvent): Promise<void>;
    subscribe(eventType: string, handler: (event: DomainEvent) => Promise<void>): void;
    unsubscribe(eventType: string, handler: (event: DomainEvent) => Promise<void>): void;
}
export declare class EventBus extends EventEmitter implements IEventBus {
    private handlers;
    publish(event: DomainEvent): Promise<void>;
    subscribe(eventType: string, handler: (event: DomainEvent) => Promise<void>): void;
    unsubscribe(eventType: string, handler: (event: DomainEvent) => Promise<void>): void;
}
//# sourceMappingURL=event-bus.d.ts.map