export const SHIPMENT_ASSIGNED_V1 = 'shipment.assigned.v1';

export interface ShipmentAssignedV1Payload {
  shipmentId: string;
  orderId: string;
  transportistaId: string;
  transportistaName: string;
  estimatedDeliveryTime: Date;
  timestamp: Date;
}

export class ShipmentAssignedEvent {
  public readonly eventType = SHIPMENT_ASSIGNED_V1;

  constructor(
    public readonly shipmentId: string,
    public readonly orderId: string,
    public readonly transportistaId: string,
    public readonly transportistaName: string,
    public readonly estimatedDeliveryTime: Date,
    public readonly timestamp: Date = new Date(),
  ) {}

  toJSON(): ShipmentAssignedV1Payload {
    return {
      shipmentId: this.shipmentId,
      orderId: this.orderId,
      transportistaId: this.transportistaId,
      transportistaName: this.transportistaName,
      estimatedDeliveryTime: this.estimatedDeliveryTime,
      timestamp: this.timestamp,
    };
  }
}
