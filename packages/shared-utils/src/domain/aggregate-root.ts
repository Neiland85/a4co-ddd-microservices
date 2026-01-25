import type { DomainEvent } from './domain-event';

export abstract class AggregateRoot {
  private readonly _domainEvents: DomainEvent[] = [];

  constructor(protected readonly _aggregateId: string) {}

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  /**
   * Devuelve y limpia los eventos del agregado.
   * Es el punto oficial de salida hacia el mundo exterior.
   */
  public pullDomainEvents(): DomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }

  public get aggregateId(): string {
    return this._aggregateId;
  }
}
