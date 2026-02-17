import { DomainEventBase, EventTypes } from '../../base/event.base.js';

export interface InventoryUnavailableItemV1 {
  productId: string;
  requestedQuantity: number;
  availableQuantity: number;
}

export interface InventoryFailedV1Data {
  orderId: string;
  reason: string;
  unavailableItems: InventoryUnavailableItemV1[];
  failedAt: string; // ISO timestamp
}

export type InventoryFailedV1Payload = InventoryFailedV1Data;

/**
 * Event emitted when inventory cannot be reserved for an order.
 * Uses the canonical event type `inventory.out_of_stock.v1`.
 *
 * @version v1
 * @pattern Saga Orchestration
 */
export class InventoryFailedV1Event extends DomainEventBase<InventoryFailedV1Data> {
  constructor(
    data: InventoryFailedV1Data,
    correlationId?: string,
    metadata?: Record<string, any>,
  ) {
    super(EventTypes.INVENTORY_OUT_OF_STOCK_V1, data, correlationId, metadata);
  }
}
