// packages/shared-utils/src/domain/aggregate-root.ts

import type { DomainEvent } from './domain-event';

export abstract class AggregateRoot {
  private readonly _domainEvents: DomainEvent[] = [];

  protected readonly createdAt: Date;
  protected updatedAt: Date;

  constructor(
    protected readonly _aggregateId: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    const now = new Date();
    this.createdAt = createdAt ?? now;
    this.updatedAt = updatedAt ?? now;
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  /**
   * Marca el agregado como modificado
   */
  protected touch(): void {
    this.updatedAt = new Date();
  }

  /**
   * Punto oficial de salida de eventos
   */
  public pullDomainEvents(): DomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }

  public get aggregateId(): string {
    return this._aggregateId;
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
