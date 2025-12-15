import { Injectable, Logger, Inject } from '@nestjs/common';
import { Shipment, ShipmentStatus } from '../../domain/aggregates/shipment.aggregate.js';
import { ShipmentRepository } from '../../domain/repositories/shipment.repository.js';
import { v4 as uuidv4 } from 'uuid';

export interface CreateShipmentCommand {
  orderId: string;
  pickupAddress: string;
  deliveryAddress: string;
  shippingCost: number;
  metadata?: {
    weight?: number;
    dimensions?: {
      length: number;
      width: number;
      height: number;
    };
    notes?: string;
  };
}

@Injectable()
export class CreateShipmentUseCase {
  private readonly logger = new Logger(CreateShipmentUseCase.name);

  constructor(
    @Inject('ShipmentRepository')
    private readonly shipmentRepository: ShipmentRepository,
  ) {}

  async execute(command: CreateShipmentCommand): Promise<Shipment> {
    this.logger.log(`Creating shipment for order ${command.orderId}`);

    // Check if shipment already exists for this order
    const existingShipment = await this.shipmentRepository.findByOrderId(
      command.orderId,
    );

    if (existingShipment) {
      throw new Error(`Shipment already exists for order ${command.orderId}`);
    }

    // Create new shipment
    const shipment = new Shipment(
      uuidv4(),
      command.orderId,
      command.pickupAddress,
      command.deliveryAddress,
      command.shippingCost,
      ShipmentStatus.PENDING,
      null, // transportistaId
      null, // estimatedDeliveryTime
      null, // actualDeliveryTime
      null, // failureReason
      command.metadata || null,
    );

    // Save shipment
    const savedShipment = await this.shipmentRepository.save(shipment);

    this.logger.log(`Shipment ${savedShipment.id} created for order ${command.orderId}`);

    return savedShipment;
  }
}
