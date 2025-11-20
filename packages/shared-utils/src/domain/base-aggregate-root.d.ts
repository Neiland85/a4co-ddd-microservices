import { BaseEntity } from './base-entity';
import { DomainEvent } from '../types/common-types';
export declare abstract class BaseAggregateRoot extends BaseEntity {
    private _domainEvents;
    private _version;
    get domainEvents(): DomainEvent[];
    get version(): number;
    protected addDomainEvent(event: DomainEvent): void;
    protected clearDomainEvents(): void;
    protected incrementVersion(): void;
    markEventsForDispatch(): void;
}
//# sourceMappingURL=base-aggregate-root.d.ts.map