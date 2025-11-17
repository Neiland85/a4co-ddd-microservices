import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload } from '@nestjs/microservices';
import { ReserveStockUseCase } from '../use-cases/reserve-stock.use-case';
import { ReleaseStockUseCase } from '../use-cases/release-stock.use-case';
import { IStockReservationRepository } from '../../infrastructure/repositories/stock-reservation.repository';
import { ProductRepository } from '../../infrastructure/repositories/product.repository';

export interface OrderCreatedEventPayload {
  orderId: string;
  customerId: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
  totalAmount: number;
  timestamp: string;
}

export interface OrderCancelledEventPayload {
  orderId: string;
  reason?: string;
  timestamp: string;
}

@Injectable()
export class ReserveStockHandler {
  private readonly logger = new Logger(ReserveStockHandler.name);
  private readonly RESERVATION_TTL_MINUTES = 15; // 15 minutos para reservar stock

  constructor(
    private readonly reserveStockUseCase: ReserveStockUseCase,
    private readonly releaseStockUseCase: ReleaseStockUseCase,
    @Inject('STOCK_RESERVATION_REPOSITORY')
    private readonly reservationRepository: IStockReservationRepository,
    @Inject('PRODUCT_REPOSITORY')
    private readonly productRepository: ProductRepository,
    @Inject('NATS_CLIENT')
    private readonly natsClient: ClientProxy,
  ) {}

  @EventPattern('order.created')
  async handleOrderCreated(@Payload() event: OrderCreatedEventPayload): Promise<void> {
    this.logger.log(`📦 Procesando reserva de stock para orden ${event.orderId}`);

    try {
      const reservationResults = [];
      let allReserved = true;

      // Reservar stock para cada item
      for (const item of event.items) {
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + this.RESERVATION_TTL_MINUTES);

        const result = await this.reserveStockUseCase.execute({
          productId: item.productId,
          quantity: item.quantity,
          orderId: event.orderId,
          customerId: event.customerId,
          expiresAt,
        });

        if (result.success) {
          // Crear registro de reserva en base de datos
          const reservation = await this.reservationRepository.create({
            productId: item.productId,
            quantity: item.quantity,
            orderId: event.orderId,
            customerId: event.customerId,
            expiresAt,
          });

          reservationResults.push({
            reservationId: reservation.id,
            productId: item.productId,
            quantity: item.quantity,
          });

          this.logger.log(
            `✅ Stock reservado: ${item.quantity} unidades de producto ${item.productId}, reservationId: ${reservation.id}`,
          );
        } else {
          allReserved = false;
          this.logger.error(
            `❌ No se pudo reservar stock para producto ${item.productId}: ${result.message}`,
          );
          break;
        }
      }

      if (allReserved) {
        // Publicar evento de stock reservado
        await this.natsClient.emit('inventory.reserved', {
          orderId: event.orderId,
          customerId: event.customerId,
          reservations: reservationResults,
          totalAmount: event.totalAmount,
          timestamp: new Date().toISOString(),
        }).toPromise();

        this.logger.log(`✅ Stock reservado exitosamente para orden ${event.orderId}`);
      } else {
        // Liberar reservas ya creadas
        for (const result of reservationResults) {
          await this.releaseStockUseCase.execute({
            productId: result.productId,
            quantity: result.quantity,
            reason: 'Fallo en reserva de otros items',
          });
          await this.reservationRepository.delete(result.reservationId);
        }

        // Publicar evento de stock insuficiente
        await this.natsClient.emit('inventory.out_of_stock', {
          orderId: event.orderId,
          reason: 'Stock insuficiente para uno o más productos',
          timestamp: new Date().toISOString(),
        }).toPromise();

        this.logger.error(`❌ Stock insuficiente para orden ${event.orderId}`);
      }
    } catch (error) {
      this.logger.error(`❌ Error procesando reserva de stock para orden ${event.orderId}:`, error);

      // Publicar evento de error
      await this.natsClient.emit('inventory.reservation_failed', {
        orderId: event.orderId,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }).toPromise();
    }
  }

  @EventPattern('order.cancelled')
  async handleOrderCancelled(@Payload() event: OrderCancelledEventPayload): Promise<void> {
    this.logger.log(`🔄 Liberando reservas para orden cancelada ${event.orderId}`);

    try {
      // Buscar todas las reservas activas para esta orden
      const reservation = await this.reservationRepository.findByOrderId(event.orderId);

      if (reservation) {
        // Liberar stock
        await this.releaseStockUseCase.execute({
          productId: reservation.productId,
          quantity: reservation.quantity,
          reservationId: reservation.id,
          reason: event.reason || 'Orden cancelada',
        });

        // Actualizar estado de reserva
        await this.reservationRepository.updateStatus(reservation.id, 'released');

        this.logger.log(`✅ Reservas liberadas para orden ${event.orderId}`);
      } else {
        this.logger.warn(`⚠️  No se encontraron reservas para orden ${event.orderId}`);
      }
    } catch (error) {
      this.logger.error(`❌ Error liberando reservas para orden ${event.orderId}:`, error);
    }
  }

  @EventPattern('inventory.release')
  async handleReleaseRequest(@Payload() event: { orderId: string; reservationId?: string; reason: string }): Promise<void> {
    this.logger.log(`🔄 Liberando reserva por solicitud para orden ${event.orderId}`);

    try {
      const reservation = event.reservationId
        ? await this.reservationRepository.findByOrderId(event.orderId)
        : await this.reservationRepository.findByOrderId(event.orderId);

      if (reservation && reservation.status === 'active') {
        await this.releaseStockUseCase.execute({
          productId: reservation.productId,
          quantity: reservation.quantity,
          reservationId: reservation.id,
          reason: event.reason,
        });

        await this.reservationRepository.updateStatus(reservation.id, 'released');
        this.logger.log(`✅ Reserva ${reservation.id} liberada`);
      }
    } catch (error) {
      this.logger.error(`❌ Error liberando reserva:`, error);
    }
  }
}
