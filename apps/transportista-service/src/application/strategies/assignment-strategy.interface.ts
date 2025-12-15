import { Transportista } from '../../domain/aggregates/transportista.entity.js';

export interface AssignmentStrategy {
  selectTransportista(
    availableTransportistas: Transportista[],
    pickupAddress: string,
    deliveryAddress: string,
  ): Promise<Transportista | null>;
}
