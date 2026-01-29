export abstract class DomainEvent {
  readonly eventId: string;
  readonly occurredOn: Date;

  protected constructor(eventId?: string, occurredOn?: Date) {
    this.eventId = eventId ?? crypto.randomUUID();
    this.occurredOn = occurredOn ?? new Date();
  }
}
