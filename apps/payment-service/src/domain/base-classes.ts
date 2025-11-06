// Base classes for DDD implementation
import { v4 as uuidv4 } from 'uuid';

export abstract class AggregateRoot {
  protected _id: string;
  protected _domainEvents: any[] = [];
  protected _createdAt: Date;
  protected _updatedAt: Date;

  constructor(id: string, createdAt?: Date, updatedAt?: Date) {
    this._id = id;
    this._createdAt = createdAt || new Date();
    this._updatedAt = updatedAt || new Date();
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

  get domainEvents(): any[] {
    return [...this._domainEvents];
  }

  protected addDomainEvent(event: any): void {
    this._domainEvents.push(event);
  }

  clearDomainEvents(): void {
    this._domainEvents = [];
  }

  protected touch(): void {
    this._updatedAt = new Date();
  }
}

export abstract class ValueObject<T> {
  protected readonly _value: T;

  constructor(value: T) {
    this._value = value;
  }

  get value(): T {
    return this._value;
  }

  equals(other: ValueObject<T>): boolean {
    return this._value === other._value;
  }
}

export abstract class DomainEvent {
  public readonly eventId: string;
  public readonly aggregateId: string;
  public readonly occurredOn: Date;
  public readonly eventVersion: number = 1;
  public readonly eventData: any;

  constructor(aggregateId: string, eventType: string, eventData: any) {
    this.eventId = uuidv4();
    this.aggregateId = aggregateId;
    this.occurredOn = new Date();
    this.eventData = eventData;
  }

  abstract eventType(): string;
}
