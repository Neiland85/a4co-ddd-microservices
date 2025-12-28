export const SHIPMENT_IN_TRANSIT_V1 = 'shipment.in_transit.v1';

export interface ShipmentInTransitV1Payload {
  shipmentId: string;
  orderId: string;
  transportistaId: string;
  timestamp: Date;
}

export class ShipmentInTransitEvent {
  public readonly eventType = SHIPMENT_IN_TRANSIT_V1;

  constructor(
    public readonly shipmentId: string,
    public readonly orderId: string,
    public readonly transportistaId: string,
    public readonly timestamp: Date = new Date(),
  ) {}

  toJSON(): ShipmentInTransitV1Payload {
    return {
      shipmentId: this.shipmentId,
      orderId: this.orderId,
      transportistaId: this.transportistaId,
      timestamp: this.timestamp,
    };
  }
}
