export const SHIPMENT_CREATED_V1 = 'shipment.created.v1';

export interface ShipmentCreatedV1Payload {
  shipmentId: string;
  orderId: string;
  pickupAddress: string;
  deliveryAddress: string;
  shippingCost: number;
  timestamp: Date;
}

export class ShipmentCreatedEvent {
  public readonly eventType = SHIPMENT_CREATED_V1;

  constructor(
    public readonly shipmentId: string,
    public readonly orderId: string,
    public readonly pickupAddress: string,
    public readonly deliveryAddress: string,
    public readonly shippingCost: number,
    public readonly timestamp: Date = new Date(),
  ) {}

  toJSON(): ShipmentCreatedV1Payload {
    return {
      shipmentId: this.shipmentId,
      orderId: this.orderId,
      pickupAddress: this.pickupAddress,
      deliveryAddress: this.deliveryAddress,
      shippingCost: this.shippingCost,
      timestamp: this.timestamp,
    };
  }
}
