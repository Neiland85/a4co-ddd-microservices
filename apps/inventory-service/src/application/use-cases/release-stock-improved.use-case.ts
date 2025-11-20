import { Injectable, Logger } from '@nestjs/common';
import { InventoryReleasedEvent } from '../../domain/events';
import { ReservationStatus } from '../../domain/entities/stock-reservation.entity';

export interface ReleaseStockCommand {
  orderId: string;
  reservationId: string;
  reason: 'order_cancelled' | 'order_expired' | 'payment_failed';
}

@Injectable()
export class ReleaseStockUseCase {
  private readonly logger = new Logger(ReleaseStockUseCase.name);

  constructor(
    private readonly inventoryRepository: any,
    private readonly reservationRepository: any,
    private readonly eventBus: any,
  ) {}

  async execute(command: ReleaseStockCommand): Promise<void> {
    this.logger.log(
      `🔄 Liberando stock para orden ${command.orderId}, reserva ${command.reservationId}`,
    );

    try {
      // Paso 1: Obtener la reserva
      const reservation = await this.reservationRepository.findByReservationId(
        command.reservationId,
      );

      if (!reservation) {
        this.logger.warn(`⚠️ Reserva ${command.reservationId} no encontrada`);
        return;
      }

      if (reservation.status !== ReservationStatus.ACTIVE) {
        this.logger.warn(
          `⚠️ Reserva ${command.reservationId} ya está en estado ${reservation.status}`,
        );
        return;
      }

      // Paso 2: Liberar el stock en el inventario
      await this.inventoryRepository.transaction(async (tx: any) => {
        for (const item of reservation.items) {
          await tx.releaseStock(item.productId, item.quantity);
        }

        // Actualizar estado de la reserva
        reservation.release(command.reason);
        await tx.updateReservation(reservation);
      });

      this.logger.log(`✅ Stock liberado exitosamente para orden ${command.orderId}`);

      // Paso 3: Publicar evento de inventario liberado
      const event = new InventoryReleasedEvent(
        command.orderId,
        command.reservationId,
        reservation.items,
        command.reason,
      );

      await this.eventBus.publish('inventory.released', event.toJSON());
    } catch (error) {
      this.logger.error(`❌ Error liberando stock para orden ${command.orderId}:`, error);
      throw error;
    }
  }
}
