import { DomainEventBase, EventTypes } from '../../base/event.base.js';

export interface InventoryReleasedItemV1 {
  productId: string;
  quantity: number;
}

export interface InventoryReleasedV1Data {
  orderId: string;
  reservationId?: string;
  items: InventoryReleasedItemV1[];
  reason: string;
  releasedAt: string; // ISO timestamp
}

export type InventoryReleasedV1Payload = InventoryReleasedV1Data;

/**
 * Event emitted when reserved inventory is released (compensation).
 *
 * @version v1
 * @pattern Saga Orchestration - Compensation
 */
export class InventoryReleasedV1Event extends DomainEventBase<InventoryReleasedV1Data> {
  constructor(
    data: InventoryReleasedV1Data,
    correlationId?: string,
    metadata?: Record<string, any>,
  ) {
    super(EventTypes.INVENTORY_RELEASED_V1, data, correlationId, metadata);
  }
}
