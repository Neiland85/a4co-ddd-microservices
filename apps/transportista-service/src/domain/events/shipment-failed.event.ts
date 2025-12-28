export const SHIPMENT_FAILED_V1 = 'shipment.failed.v1';

export interface ShipmentFailedV1Payload {
  shipmentId: string;
  orderId: string;
  reason: string;
  timestamp: Date;
}

export class ShipmentFailedEvent {
  public readonly eventType = SHIPMENT_FAILED_V1;

  constructor(
    public readonly shipmentId: string,
    public readonly orderId: string,
    public readonly reason: string,
    public readonly timestamp: Date = new Date(),
  ) {}

  toJSON(): ShipmentFailedV1Payload {
    return {
      shipmentId: this.shipmentId,
      orderId: this.orderId,
      reason: this.reason,
      timestamp: this.timestamp,
    };
  }
}
