/**
 * Shared Type Definitions
 * 
 * Common types and interfaces used across bounded contexts
 */

export interface DomainEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ValueObject<T> {
  equals(other: T): boolean;
  value: unknown;
}

export type EntityId = string;
export type Timestamp = Date;

export interface AggregateRoot extends DomainEntity {
  version: number;
}

export interface DomainEvent {
  eventId: string;
  eventType: string;
  occurredAt: Date;
  aggregateId: string;
  version: string;
}

export interface Repository<T extends DomainEntity> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}
