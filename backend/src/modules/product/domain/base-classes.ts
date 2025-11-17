// Temporary AggregateRoot implementation until shared-utils is fixed
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

// Temporary ValueObject implementation until shared-utils is fixed
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

// Temporary DomainEvent implementation
export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly eventVersion: number = 1;

  constructor() {
    this.occurredOn = new Date();
  }

  abstract eventType(): string;
}

// Temporary IDomainEvent interface
export interface IDomainEvent {
  eventType(): string;
  occurredOn: Date;
  eventVersion: number;
}

// Temporary BaseService implementation until shared-utils is fixed
export abstract class BaseService {
  protected serviceName: string;

  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  protected validateRequired(value: any, fieldName: string): any {
    if (!value) {
      throw new Error(`${fieldName} is required`);
    }
    return value;
  }

  protected log(message: string): void {
    console.log(`[${this.serviceName}] ${message}`);
  }
}
