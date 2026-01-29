import { DomainEvent } from '@a4co/shared-utils';

export interface PaymentEventPayload {
  paymentId: string;
  timestamp: Date;
}

export abstract class PaymentDomainEvent<TPayload extends PaymentEventPayload> extends DomainEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly eventName: string,
    public readonly payload: TPayload,
    public readonly eventVersion: number = 1,
  ) {
    super(undefined, payload.timestamp);
  }
}
