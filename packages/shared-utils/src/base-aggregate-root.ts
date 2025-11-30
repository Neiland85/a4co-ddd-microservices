// Clase base para Aggregate Roots en DDD

import { BaseEntity } from './base-entity';
import { DomainEvent } from './types/common-types';

export abstract class BaseAggregateRoot extends BaseEntity {
  private _domainEvents: DomainEvent[] = [];
  private _version: number = 0;

  get domainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  get version(): number {
    return this._version;
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  protected clearDomainEvents(): void {
    this._domainEvents = [];
  }

  protected incrementVersion(): void {
    this._version++;
  }

  markEventsForDispatch(): void {
    // Este método se puede sobrescribir en implementaciones específicas
    // para marcar eventos para dispatch
  }
}
