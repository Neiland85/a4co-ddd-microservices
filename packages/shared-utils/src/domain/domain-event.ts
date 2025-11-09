import { v4 as uuidv4 } from 'uuid';

export interface IDomainEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  eventVersion: number;
  occurredOn: Date;
  eventData: any;
  sagaId?: string; // Añadir sagaId como opcional
}

export abstract class DomainEvent implements IDomainEvent {
  public readonly eventId: string;
  public readonly eventType: string;
  public readonly aggregateId: string;
  public readonly eventVersion: number;
  public readonly occurredOn: Date;
  public readonly eventData: any;
  public readonly sagaId?: string; // Añadir sagaId como opcional

  constructor(aggregateId: string, eventData: any, eventVersion: number = 1, sagaId?: string) {
    this.eventId = uuidv4();
    this.eventType = this.constructor.name;
    this.aggregateId = aggregateId;
    this.eventVersion = eventVersion;
    this.occurredOn = new Date();
    this.eventData = eventData;
    if (sagaId !== undefined) {
      this.sagaId = sagaId; // Asignar sagaId solo cuando está definido
    }
  }
}
