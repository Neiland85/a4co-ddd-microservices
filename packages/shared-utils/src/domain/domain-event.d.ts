export interface IDomainEvent {
    eventId: string;
    eventType: string;
    aggregateId: string;
    eventVersion: number;
    occurredOn: Date;
    eventData: any;
    sagaId?: string;
}
export declare abstract class DomainEvent implements IDomainEvent {
    readonly eventId: string;
    readonly eventType: string;
    readonly aggregateId: string;
    readonly eventVersion: number;
    readonly occurredOn: Date;
    readonly eventData: any;
    readonly sagaId?: string;
    constructor(aggregateId: string, eventData: any, eventVersion?: number, sagaId?: string);
}
//# sourceMappingURL=domain-event.d.ts.map