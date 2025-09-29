// Temporary AggregateRoot implementation until shared-utils is fixed
export abstract class AggregateRoot {
    protected _id: string;
    protected _domainEvents: DomainEvent[] = [];
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

    get domainEvents(): DomainEvent[] {
        return [...this._domainEvents];
    }

    protected addDomainEvent(event: DomainEvent): void {
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
        return JSON.stringify(this._value) === JSON.stringify(other._value);
    }
}

// Domain Event base class
export abstract class DomainEvent {
    public readonly occurredOn: Date;
    public readonly eventVersion: number = 1;

    constructor(
        public readonly aggregateId: string,
        public readonly eventName: string,
    ) {
        this.occurredOn = new Date();
    }
}
