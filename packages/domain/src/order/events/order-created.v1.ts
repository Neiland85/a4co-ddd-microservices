import { DomainEvent } from '@a4co/shared-utils';

/**
 * Event name constant for OrderCreatedV1
 */
export const ORDER_CREATED_V1 = 'order.created.v1';

/**
 * Order item structure for OrderCreatedV1 event
 */
export interface OrderItemV1 {
  productId: string;
  quantity: number;
  unitPrice: number;
  currency: string;
}

/**
 * Payload for OrderCreatedV1 event
 */
export interface OrderCreatedV1Data {
  orderId: string;
  customerId: string;
  items: OrderItemV1[];
  totalAmount: number;
  currency: string;
  createdAt: string; // ISO timestamp
}

/**
 * Domain Event: Order Created v1
 * Emitted when a new order is created in the system.
 * This triggers the order saga orchestration.
 * 
 * @version v1
 * @pattern Saga Orchestration
 */
export class OrderCreatedV1Event extends DomainEvent {
  public readonly eventType = ORDER_CREATED_V1;

  constructor(public readonly data: OrderCreatedV1Data) {
    super();
  }

  public toJSON() {
    return {
      eventType: this.eventType,
      data: this.data,
      occurredOn: this.occurredOn,
    };
  }
}
