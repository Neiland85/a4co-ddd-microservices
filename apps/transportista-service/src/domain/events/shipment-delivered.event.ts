export const SHIPMENT_DELIVERED_V1 = 'shipment.delivered.v1';

export interface ShipmentDeliveredV1Payload {
  shipmentId: string;
  orderId: string;
  transportistaId: string;
  actualDeliveryTime: Date;
  timestamp: Date;
}

export class ShipmentDeliveredEvent {
  public readonly eventType = SHIPMENT_DELIVERED_V1;

  constructor(
    public readonly shipmentId: string,
    public readonly orderId: string,
    public readonly transportistaId: string,
    public readonly actualDeliveryTime: Date,
    public readonly timestamp: Date = new Date(),
  ) {}

  toJSON(): ShipmentDeliveredV1Payload {
    return {
      shipmentId: this.shipmentId,
      orderId: this.orderId,
      transportistaId: this.transportistaId,
      actualDeliveryTime: this.actualDeliveryTime,
      timestamp: this.timestamp,
    };
  }
}
