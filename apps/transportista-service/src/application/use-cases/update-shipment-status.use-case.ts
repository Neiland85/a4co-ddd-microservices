import { Injectable, Logger, Inject } from '@nestjs/common';
import { Shipment, ShipmentStatus } from '../../domain/aggregates/shipment.aggregate.js';
import { ShipmentRepository } from '../../domain/repositories/shipment.repository.js';
import { TransportistaRepository } from '../../domain/repositories/transportista.repository.js';

export interface UpdateShipmentStatusCommand {
  shipmentId: string;
  newStatus: ShipmentStatus;
  failureReason?: string;
  actualDeliveryTime?: Date;
}

@Injectable()
export class UpdateShipmentStatusUseCase {
  private readonly logger = new Logger(UpdateShipmentStatusUseCase.name);

  constructor(
    @Inject('ShipmentRepository')
    private readonly shipmentRepository: ShipmentRepository,
    @Inject('TransportistaRepository')
    private readonly transportistaRepository: TransportistaRepository,
  ) {}

  async execute(command: UpdateShipmentStatusCommand): Promise<Shipment> {
    this.logger.log(
      `Updating shipment ${command.shipmentId} status to ${command.newStatus}`,
    );

    // Find shipment
    const shipment = await this.shipmentRepository.findById(command.shipmentId);
    if (!shipment) {
      throw new Error(`Shipment ${command.shipmentId} not found`);
    }

    // Apply status transition
    switch (command.newStatus) {
      case ShipmentStatus.IN_TRANSIT:
        shipment.markInTransit();
        break;

      case ShipmentStatus.DELIVERED:
        shipment.markDelivered(command.actualDeliveryTime);

        // Update transportista metrics on successful delivery
        if (shipment.transportistaId) {
          const transportista = await this.transportistaRepository.findById(
            shipment.transportistaId,
          );
          if (transportista) {
            const deliveryTimeHours = this.calculateDeliveryTimeHours(
              shipment.createdAt,
              command.actualDeliveryTime || new Date(),
            );
            transportista.recordSuccessfulShipment(deliveryTimeHours);
            await this.transportistaRepository.save(transportista);
          }
        }
        break;

      case ShipmentStatus.FAILED:
        if (!command.failureReason) {
          throw new Error('Failure reason is required when marking shipment as failed');
        }
        shipment.markFailed(command.failureReason);
        break;

      default:
        throw new Error(`Invalid status transition to ${command.newStatus}`);
    }

    // Save shipment
    const savedShipment = await this.shipmentRepository.save(shipment);

    this.logger.log(`Shipment ${shipment.id} status updated to ${command.newStatus}`);

    return savedShipment;
  }

  private calculateDeliveryTimeHours(startDate: Date, endDate: Date): number {
    const diffMs = endDate.getTime() - startDate.getTime();
    return diffMs / (1000 * 60 * 60); // Convert milliseconds to hours
  }
}
