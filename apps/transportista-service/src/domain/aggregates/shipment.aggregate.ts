import { AggregateRoot } from '../base-classes.js';
import {
  ShipmentCreatedEvent,
  ShipmentAssignedEvent,
  ShipmentInTransitEvent,
  ShipmentDeliveredEvent,
  ShipmentFailedEvent,
} from '../events/index.js';

export enum ShipmentStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

export interface ShipmentMetadata {
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  notes?: string;
}

export class Shipment extends AggregateRoot {
  private _orderId: string;
  private _transportistaId: string | null;
  private _status: ShipmentStatus;
  private _shippingCost: number;
  private _pickupAddress: string;
  private _deliveryAddress: string;
  private _estimatedDeliveryTime: Date | null;
  private _actualDeliveryTime: Date | null;
  private _failureReason: string | null;
  private _metadata: ShipmentMetadata | null;

  constructor(
    id: string,
    orderId: string,
    pickupAddress: string,
    deliveryAddress: string,
    shippingCost: number,
    status: ShipmentStatus = ShipmentStatus.PENDING,
    transportistaId: string | null = null,
    estimatedDeliveryTime: Date | null = null,
    actualDeliveryTime: Date | null = null,
    failureReason: string | null = null,
    metadata: ShipmentMetadata | null = null,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    super(id, createdAt, updatedAt);
    this._orderId = orderId;
    this._transportistaId = transportistaId;
    this._status = status;
    this._shippingCost = shippingCost;
    this._pickupAddress = pickupAddress;
    this._deliveryAddress = deliveryAddress;
    this._estimatedDeliveryTime = estimatedDeliveryTime;
    this._actualDeliveryTime = actualDeliveryTime;
    this._failureReason = failureReason;
    this._metadata = metadata;

    // Add domain event if this is a new shipment
    if (status === ShipmentStatus.PENDING && !createdAt) {
      this.addDomainEvent(
        new ShipmentCreatedEvent(
          id,
          orderId,
          pickupAddress,
          deliveryAddress,
          shippingCost,
        ),
      );
    }
  }

  // Getters
  get orderId(): string {
    return this._orderId;
  }

  get transportistaId(): string | null {
    return this._transportistaId;
  }

  get status(): ShipmentStatus {
    return this._status;
  }

  get shippingCost(): number {
    return this._shippingCost;
  }

  get pickupAddress(): string {
    return this._pickupAddress;
  }

  get deliveryAddress(): string {
    return this._deliveryAddress;
  }

  get estimatedDeliveryTime(): Date | null {
    return this._estimatedDeliveryTime;
  }

  get actualDeliveryTime(): Date | null {
    return this._actualDeliveryTime;
  }

  get failureReason(): string | null {
    return this._failureReason;
  }

  get metadata(): ShipmentMetadata | null {
    return this._metadata;
  }

  // State machine methods

  /**
   * Assign a transportista to this shipment
   * Transition: PENDING -> ASSIGNED
   */
  assignTransportista(
    transportistaId: string,
    transportistaName: string,
    estimatedDeliveryTime: Date,
  ): void {
    if (this._status !== ShipmentStatus.PENDING) {
      throw new Error(
        `Cannot assign transportista. Shipment is in ${this._status} status. Must be PENDING.`,
      );
    }

    this._transportistaId = transportistaId;
    this._estimatedDeliveryTime = estimatedDeliveryTime;
    this._status = ShipmentStatus.ASSIGNED;
    this.touch();

    this.addDomainEvent(
      new ShipmentAssignedEvent(
        this._id,
        this._orderId,
        transportistaId,
        transportistaName,
        estimatedDeliveryTime,
      ),
    );
  }

  /**
   * Mark shipment as in transit
   * Transition: ASSIGNED -> IN_TRANSIT
   */
  markInTransit(): void {
    if (this._status !== ShipmentStatus.ASSIGNED) {
      throw new Error(
        `Cannot mark as in transit. Shipment is in ${this._status} status. Must be ASSIGNED.`,
      );
    }

    if (!this._transportistaId) {
      throw new Error('Cannot mark as in transit without assigned transportista');
    }

    this._status = ShipmentStatus.IN_TRANSIT;
    this.touch();

    this.addDomainEvent(
      new ShipmentInTransitEvent(this._id, this._orderId, this._transportistaId),
    );
  }

  /**
   * Mark shipment as delivered
   * Transition: IN_TRANSIT -> DELIVERED
   */
  markDelivered(actualDeliveryTime?: Date): void {
    if (this._status !== ShipmentStatus.IN_TRANSIT) {
      throw new Error(
        `Cannot mark as delivered. Shipment is in ${this._status} status. Must be IN_TRANSIT.`,
      );
    }

    if (!this._transportistaId) {
      throw new Error('Cannot mark as delivered without assigned transportista');
    }

    const deliveryTime = actualDeliveryTime || new Date();
    this._actualDeliveryTime = deliveryTime;
    this._status = ShipmentStatus.DELIVERED;
    this.touch();

    this.addDomainEvent(
      new ShipmentDeliveredEvent(
        this._id,
        this._orderId,
        this._transportistaId,
        deliveryTime,
      ),
    );
  }

  /**
   * Mark shipment as failed
   * Can transition from any status to FAILED
   */
  markFailed(reason: string): void {
    if (this._status === ShipmentStatus.FAILED) {
      throw new Error('Shipment is already marked as failed');
    }

    if (this._status === ShipmentStatus.DELIVERED) {
      throw new Error('Cannot mark a delivered shipment as failed');
    }

    this._failureReason = reason;
    this._status = ShipmentStatus.FAILED;
    this.touch();

    this.addDomainEvent(
      new ShipmentFailedEvent(this._id, this._orderId, reason),
    );
  }

  /**
   * Check if shipment is delayed
   */
  isDelayed(): boolean {
    if (!this._estimatedDeliveryTime) {
      return false;
    }

    if (this._status === ShipmentStatus.DELIVERED) {
      return false;
    }

    return new Date() > this._estimatedDeliveryTime;
  }

  /**
   * Check if shipment can be cancelled
   */
  canBeCancelled(): boolean {
    return (
      this._status === ShipmentStatus.PENDING ||
      this._status === ShipmentStatus.ASSIGNED
    );
  }
}
