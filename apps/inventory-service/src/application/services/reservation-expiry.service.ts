import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ReservationStatus } from '../../domain/entities/stock-reservation.entity';
import { ReleaseStockUseCase } from '../use-cases/release-stock-improved.use-case';

/**
 * Servicio que se encarga de expirar reservas automáticamente
 */
@Injectable()
export class ReservationExpiryService implements OnModuleInit {
  private readonly logger = new Logger(ReservationExpiryService.name);
  private readonly CHECK_INTERVAL_MS = 60 * 1000; // 1 minuto

  constructor(
    private readonly reservationRepository: any,
    private readonly releaseStockUseCase: ReleaseStockUseCase,
  ) {}

  onModuleInit() {
    this.startExpiryChecker();
  }

  /**
   * Inicia el checker de expiración de reservas
   */
  private startExpiryChecker(): void {
    this.logger.log('🕐 Iniciando checker de expiración de reservas');

    setInterval(async () => {
      await this.checkExpiredReservations();
    }, this.CHECK_INTERVAL_MS);
  }

  /**
   * Verifica y expira reservas que han excedido su TTL
   */
  private async checkExpiredReservations(): Promise<void> {
    try {
      const now = new Date();
      
      // Buscar reservas activas que hayan expirado
      const expiredReservations = await this.reservationRepository.findExpired(now);

      if (expiredReservations.length === 0) {
        return;
      }

      this.logger.log(`⏱️ Encontradas ${expiredReservations.length} reservas expiradas`);

      // Liberar cada reserva expirada
      for (const reservation of expiredReservations) {
        try {
          await this.releaseStockUseCase.execute({
            orderId: reservation.orderId,
            reservationId: reservation.reservationId,
            reason: 'order_expired',
          });

          this.logger.log(`✅ Reserva ${reservation.reservationId} expirada y liberada`);
        } catch (error) {
          this.logger.error(`❌ Error expirando reserva ${reservation.reservationId}:`, error);
        }
      }
    } catch (error) {
      this.logger.error('❌ Error en checker de expiración:', error);
    }
  }

  /**
   * Obtiene estadísticas de reservas
   */
  async getReservationStats(): Promise<{
    active: number;
    expired: number;
    released: number;
    confirmed: number;
  }> {
    const stats = await this.reservationRepository.getStats();
    return stats;
  }
}
