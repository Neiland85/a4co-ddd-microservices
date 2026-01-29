// packages/shared-utils/src/domain/aggregate-root.ts

import type { DomainEvent } from './domain-event';

export abstract class AggregateRoot {
  protected readonly _aggregateId: string;

  protected readonly createdAt: Date;
  protected updatedAt: Date;

  private readonly _domainEvents: DomainEvent[] = [];

  protected constructor(
    aggregateId: string,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    const now = new Date();

    this._aggregateId = aggregateId;
    this.createdAt = createdAt ?? now;
    this.updatedAt = updatedAt ?? now;
  }

  /**
   * Identidad del agregado (DDD)
   */
  public get aggregateId(): string {
    return this._aggregateId;
  }

  /**
   * Exposición controlada de timestamps (útil para DTOs/lectura).
   * Se usan métodos (no getters) para no colisionar con los campos protegidos.
   */
  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  /**
   * Marca el agregado como modificado
   */
  protected touch(): void {
    this.updatedAt = new Date();
  }

  /**
   * Registra un evento de dominio
   */
  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  /**
   * Punto oficial de salida de eventos de dominio.
   * Devuelve los eventos y limpia el buffer interno.
   */
  public pullDomainEvents(): DomainEvent[] {
    const events = [...this._domainEvents];
    this._domainEvents.length = 0;
    return events;
  }
}
