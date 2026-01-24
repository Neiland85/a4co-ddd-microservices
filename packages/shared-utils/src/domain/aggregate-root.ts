import type { DomainEvent } from './domain-event';

export abstract class AggregateRoot {
  protected readonly _id: string;
  protected _createdAt: Date;
  protected _updatedAt: Date;

  private _domainEvents: DomainEvent[] = [];

  protected constructor(id: string, createdAt: Date = new Date(), updatedAt: Date = new Date()) {
    this._id = id;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  protected touch(): void {
    this._updatedAt = new Date();
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  getUncommittedEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  clearEvents(): void {
    this._domainEvents = [];
  }
}
