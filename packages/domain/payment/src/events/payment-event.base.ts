import type { DomainEvent } from '@a4co/shared-utils';

export interface PaymentEventPayload {
  paymentId: string;
}

export abstract class PaymentDomainEvent<TPayload extends PaymentEventPayload>
  implements DomainEvent {

  readonly occurredOn: Date = new Date();

  protected constructor(
    public readonly aggregateId: string,
    public readonly eventName: string,
    public readonly payload: TPayload,
    public readonly eventVersion: number = 1,
  ) {}
}
