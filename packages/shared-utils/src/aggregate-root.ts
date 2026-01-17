import { BaseEntity, BaseEntityProps } from './base-entity';
import { DomainEvent } from './domain-event';

export abstract class AggregateRoot extends BaseEntity {
  private _domainEvents: DomainEvent[] = [];

  constructor(props?: string | BaseEntityProps) {
    super(props);
  }

  public get domainEvents(): DomainEvent[] {
    return this._domainEvents.slice();
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  public getUncommittedEvents(): DomainEvent[] {
    return this._domainEvents.slice();
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }

  public clearDomainEvents(): void {
    this._domainEvents = [];
  }

  public markEventsForDispatch(): void {
    // This method can be used by event dispatchers
    // to mark events as ready for dispatch
  }
}
