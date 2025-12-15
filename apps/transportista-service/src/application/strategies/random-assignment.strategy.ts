import { Injectable, Logger } from '@nestjs/common';
import { Transportista } from '../../domain/aggregates/transportista.entity.js';
import { AssignmentStrategy } from './assignment-strategy.interface.js';

@Injectable()
export class RandomAssignmentStrategy implements AssignmentStrategy {
  private readonly logger = new Logger(RandomAssignmentStrategy.name);

  async selectTransportista(
    availableTransportistas: Transportista[],
    pickupAddress: string,
    deliveryAddress: string,
  ): Promise<Transportista | null> {
    if (availableTransportistas.length === 0) {
      this.logger.warn('No available transportistas for assignment');
      return null;
    }

    // Simple random selection
    const randomIndex = Math.floor(Math.random() * availableTransportistas.length);
    const selected = availableTransportistas[randomIndex];

    this.logger.log(
      `Randomly selected transportista ${selected.name} (${selected.id}) from ${availableTransportistas.length} available`,
    );

    return selected;
  }
}
