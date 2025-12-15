import { Injectable, Logger, Inject } from '@nestjs/common';
import { Shipment } from '../../domain/aggregates/shipment.aggregate.js';
import { ShipmentRepository } from '../../domain/repositories/shipment.repository.js';
import { TransportistaRepository } from '../../domain/repositories/transportista.repository.js';
import { AssignmentStrategy } from '../strategies/assignment-strategy.interface.js';

export interface AssignShipmentCommand {
  shipmentId: string;
  serviceArea?: string;
}

@Injectable()
export class AssignShipmentUseCase {
  private readonly logger = new Logger(AssignShipmentUseCase.name);

  constructor(
    @Inject('ShipmentRepository')
    private readonly shipmentRepository: ShipmentRepository,
    @Inject('TransportistaRepository')
    private readonly transportistaRepository: TransportistaRepository,
    @Inject('AssignmentStrategy')
    private readonly assignmentStrategy: AssignmentStrategy,
  ) {}

  async execute(command: AssignShipmentCommand): Promise<Shipment> {
    this.logger.log(`Assigning transportista to shipment ${command.shipmentId}`);

    // Find shipment
    const shipment = await this.shipmentRepository.findById(command.shipmentId);
    if (!shipment) {
      throw new Error(`Shipment ${command.shipmentId} not found`);
    }

    // Get available transportistas
    const availableTransportistas = await this.transportistaRepository.findActive();

    if (availableTransportistas.length === 0) {
      throw new Error('No active transportistas available');
    }

    // Use strategy to select transportista
    const selectedTransportista = await this.assignmentStrategy.selectTransportista(
      availableTransportistas,
      shipment.pickupAddress,
      shipment.deliveryAddress,
    );

    if (!selectedTransportista) {
      throw new Error('Failed to select a transportista');
    }

    // Calculate estimated delivery time (default: 48 hours from now)
    const estimatedDeliveryTime = new Date();
    estimatedDeliveryTime.setHours(estimatedDeliveryTime.getHours() + 48);

    // Assign to shipment
    shipment.assignTransportista(
      selectedTransportista.id,
      selectedTransportista.name,
      estimatedDeliveryTime,
    );

    // Update transportista metrics
    selectedTransportista.incrementShipments();

    // Save both
    await Promise.all([
      this.shipmentRepository.save(shipment),
      this.transportistaRepository.save(selectedTransportista),
    ]);

    this.logger.log(
      `Shipment ${shipment.id} assigned to transportista ${selectedTransportista.name}`,
    );

    return shipment;
  }
}
