import { v4 as uuidv4 } from 'uuid';

export interface IDomainEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  eventVersion: number;
  occurredOn: Date;
  eventData: any;
}

export abstract class DomainEvent implements IDomainEvent {
  public readonly eventId: string;
  public readonly eventType: string;
  public readonly aggregateId: string;
  public readonly eventVersion: number;
  public readonly occurredOn: Date;
  public readonly eventData: any;

  constructor(aggregateId: string, eventData: any, eventVersion: number = 1) {
    this.eventId = uuidv4();
    this.eventType = this.constructor.name;
    this.aggregateId = aggregateId;
    this.eventVersion = eventVersion;
    this.occurredOn = new Date();
    this.eventData = eventData;
  }
}
