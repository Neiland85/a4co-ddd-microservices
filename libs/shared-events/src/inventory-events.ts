import { DomainEvent } from './base-event';

/**
 * Event Types (Versioned)
 */
export const INVENTORY_RESERVED_V1 = 'inventory.reserved.v1';
export const INVENTORY_FAILED_V1 = 'inventory.failed.v1';
export const INVENTORY_RELEASED_V1 = 'inventory.released.v1';

/**
 * InventoryReservedV1Event
 * Emitted when inventory is successfully reserved for an order
 */
export interface InventoryReservedV1Payload {
  reservationId: string;
  orderId: string;
  items: Array<{
    productId: string;
    quantity: number;
    reserved: number;
  }>;
  expiresAt: string;
  reservedAt: string;
}

export class InventoryReservedV1Event extends DomainEvent {
  constructor(
    public readonly payload: InventoryReservedV1Payload,
    correlationId?: string,
  ) {
    super(INVENTORY_RESERVED_V1, 'v1', correlationId);
  }

  toJSON() {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      version: this.version,
      timestamp: this.timestamp,
      correlationId: this.correlationId,
      payload: this.payload,
    };
  }
}

/**
 * InventoryFailedV1Event
 * Emitted when inventory reservation fails (out of stock)
 */
export interface InventoryFailedV1Payload {
  orderId: string;
  reason: string;
  unavailableItems: Array<{
    productId: string;
    requestedQuantity: number;
    availableQuantity: number;
  }>;
  failedAt: string;
}

export class InventoryFailedV1Event extends DomainEvent {
  constructor(
    public readonly payload: InventoryFailedV1Payload,
    correlationId?: string,
  ) {
    super(INVENTORY_FAILED_V1, 'v1', correlationId);
  }

  toJSON() {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      version: this.version,
      timestamp: this.timestamp,
      correlationId: this.correlationId,
      payload: this.payload,
    };
  }
}

/**
 * InventoryReleasedV1Event
 * Emitted when inventory reservation is released (compensation)
 */
export interface InventoryReleasedV1Payload {
  reservationId: string;
  orderId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  reason: string;
  releasedAt: string;
}

export class InventoryReleasedV1Event extends DomainEvent {
  constructor(
    public readonly payload: InventoryReleasedV1Payload,
    correlationId?: string,
  ) {
    super(INVENTORY_RELEASED_V1, 'v1', correlationId);
  }

  toJSON() {
    return {
      eventId: this.eventId,
      eventType: this.eventType,
      version: this.version,
      timestamp: this.timestamp,
      correlationId: this.correlationId,
      payload: this.payload,
    };
  }
}
