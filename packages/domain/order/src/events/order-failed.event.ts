import { DomainEvent } from '@a4co/shared-utils';

export type OrderFailureStage =
  | 'inventory_check'
  | 'stock_reservation'
  | 'payment_processing';

export interface OrderFailedEventPayload {
  orderId: string;
  customerId: string;
  reason: string;
  failureStage: OrderFailureStage;
  compensationRequired: boolean;
}

export class OrderFailedEvent extends DomainEvent {
  public readonly eventType = 'orders.failed';

  constructor(
    public readonly payload: OrderFailedEventPayload,
  ) {
    super();
  }
}
