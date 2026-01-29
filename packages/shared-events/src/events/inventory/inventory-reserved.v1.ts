import { DomainEventBase, EventTypes } from '../../base/event.base.js';

export interface InventoryReservedItemV1 {
  reservationId?: string;
  productId: string;
  quantity: number;
  reserved?: number;
}

export interface InventoryReservedV1Data {
  reservationId: string;
  orderId: string;
  items: InventoryReservedItemV1[];
  expiresAt: string; // ISO timestamp
  reservedAt: string; // ISO timestamp
}

export type InventoryReservedV1Payload = InventoryReservedV1Data;

/**
 * Event emitted when inventory is successfully reserved for an order.
 *
 * @version v1
 * @pattern Saga Orchestration
 */
export class InventoryReservedV1Event extends DomainEventBase<InventoryReservedV1Data> {
  constructor(
    data: InventoryReservedV1Data,
    correlationId?: string,
    metadata?: Record<string, any>,
  ) {
    super(EventTypes.INVENTORY_RESERVED_V1, data, correlationId, metadata);
  }
}
