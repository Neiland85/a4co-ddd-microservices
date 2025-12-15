import { DomainEventBase, EventTypes } from '../../base/event.base.js';

/**
 * Payload for ShipmentDeliveredV1 event
 */
export interface ShipmentDeliveredV1Data {
  shipmentId: string;
  orderId: string;
  customerId: string;
  trackingNumber?: string;
  deliveredAt: string; // ISO timestamp
  deliveryAddress?: string;
  recipientName?: string;
  signatureUrl?: string;
}

/**
 * Event emitted when a shipment is successfully delivered.
 * This triggers customer notifications via SMS and/or email.
 * 
 * @version v1
 * @pattern Event-Driven Notification
 */
export class ShipmentDeliveredV1Event extends DomainEventBase<ShipmentDeliveredV1Data> {
  constructor(
    data: ShipmentDeliveredV1Data,
    correlationId?: string,
    metadata?: Record<string, any>,
  ) {
    super(EventTypes.SHIPMENT_DELIVERED_V1, data, correlationId, metadata);
  }
}
