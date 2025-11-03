import { BaseEntity } from './base-entity';
import { DomainEvent } from './domain-event';
export declare abstract class AggregateRoot extends BaseEntity {
    private _domainEvents;
    constructor(id?: string);
    get domainEvents(): DomainEvent[];
    protected addDomainEvent(event: DomainEvent): void;
    getUncommittedEvents(): DomainEvent[];
    clearEvents(): void;
    clearDomainEvents(): void;
    markEventsForDispatch(): void;
}
