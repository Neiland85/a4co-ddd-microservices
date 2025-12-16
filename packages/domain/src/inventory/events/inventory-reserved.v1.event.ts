import { DomainEvent } from '@a4co/shared-utils';

export const INVENTORY_RESERVED_V1 = 'inventory.reserved.v1';

export interface InventoryReservedV1Payload {
  reservationId: string;
  orderId: string;
  productId: string;
  quantity: number;
  timestamp: string;
}

/**
 * Event emitted when inventory is reserved for an order
 * 
 * @version v1
 * @topic inventory.reserved.v1
 */
export class InventoryReservedV1Event extends DomainEvent {
  public readonly eventType = INVENTORY_RESERVED_V1;

  constructor(
    reservationId: string,
    payload: InventoryReservedV1Payload,
    eventVersion: number = 1,
    sagaId?: string,
  ) {
    super(reservationId, payload, eventVersion, sagaId);
  }

  static create(
    reservationId: string,
    orderId: string,
    productId: string,
    quantity: number,
    sagaId?: string,
  ): InventoryReservedV1Event {
    const payload: InventoryReservedV1Payload = {
      reservationId,
      orderId,
      productId,
      quantity,
      timestamp: new Date().toISOString(),
    };

    return new InventoryReservedV1Event(reservationId, payload, 1, sagaId);
  }
}
