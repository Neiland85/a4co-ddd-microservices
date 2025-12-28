import { Injectable, Logger, Inject } from '@nestjs/common';
import { ClientProxy, EventPattern, Payload, Controller } from '@nestjs/microservices';
import { ReserveStockUseCase } from '../use-cases/reserve-stock.use-case';
import { ReleaseStockUseCase } from '../use-cases/release-stock.use-case';
import { IStockReservationRepository } from '../../infrastructure/repositories/stock-reservation.repository';
import { ProductRepository } from '../../infrastructure/repositories/product.repository';
import {
  StockReservation,
  ReservationStatus,
} from '../../domain/entities/stock-reservation.entity';
import {
  ORDER_CREATED_V1,
  ORDER_CANCELLED_V1,
  PAYMENT_CONFIRMED_V1,
  OrderCreatedV1Payload,
  OrderCancelledV1Payload,
  PaymentConfirmedV1Payload,
  InventoryReservedV1Event,
  InventoryFailedV1Event,
  InventoryReleasedV1Event,
  INVENTORY_RESERVED_V1,
  INVENTORY_FAILED_V1,
  INVENTORY_RELEASED_V1,
} from '@a4co/shared-events';

@Controller()
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

  @EventPattern(ORDER_CREATED_V1)
  async handleOrderCreated(@Payload() data: any): Promise<void> {
    const event = data.payload as OrderCreatedV1Payload;
    this.logger.log(`📦 Received ${ORDER_CREATED_V1} for order ${event.orderId}`);

    try {
      const reservationResults = [];
      const unavailableItems = [];
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
          const reservation = new StockReservation({
            orderId: event.orderId,
            customerId: event.customerId,
            items: [{ productId: item.productId, quantity: item.quantity }],
            ttlMinutes: this.RESERVATION_TTL_MINUTES,
          });

          await this.reservationRepository.save(reservation);

          reservationResults.push({
            reservationId: reservation.id,
            productId: item.productId,
            quantity: item.quantity,
            reserved: item.quantity,
          });

          this.logger.log(
            `✅ Stock reservado: ${item.quantity} unidades de producto ${item.productId}`,
          );
        } else {
          allReserved = false;
          unavailableItems.push({
            productId: item.productId,
            requestedQuantity: item.quantity,
            availableQuantity: result.availableStock || 0,
          });
          this.logger.error(
            `❌ No se pudo reservar stock para producto ${item.productId}: ${result.message}`,
          );
          break;
        }
      }

      if (allReserved) {
        // Publicar evento de stock reservado usando shared-events
        const inventoryReservedEvent = new InventoryReservedV1Event({
          reservationId: reservationResults[0]?.reservationId || 'unknown',
          orderId: event.orderId,
          items: reservationResults,
          expiresAt: new Date(
            Date.now() + this.RESERVATION_TTL_MINUTES * 60 * 1000,
          ).toISOString(),
          reservedAt: new Date().toISOString(),
        });

        this.natsClient.emit(INVENTORY_RESERVED_V1, inventoryReservedEvent.toJSON());
        this.logger.log(`📤 Emitted ${INVENTORY_RESERVED_V1} for order ${event.orderId}`);
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

        // Publicar evento de stock insuficiente usando shared-events
        const inventoryFailedEvent = new InventoryFailedV1Event({
          orderId: event.orderId,
          reason: 'Stock insuficiente para uno o más productos',
          unavailableItems,
          failedAt: new Date().toISOString(),
        });

        this.natsClient.emit(INVENTORY_FAILED_V1, inventoryFailedEvent.toJSON());
        this.logger.log(`📤 Emitted ${INVENTORY_FAILED_V1} for order ${event.orderId}`);
      }
    } catch (error) {
      this.logger.error(`❌ Error procesando reserva de stock para orden ${event.orderId}:`, error);

      // Publicar evento de error
      const inventoryFailedEvent = new InventoryFailedV1Event({
        orderId: event.orderId,
        reason: error instanceof Error ? error.message : 'Unknown error',
        unavailableItems: [],
        failedAt: new Date().toISOString(),
      });

      this.natsClient.emit(INVENTORY_FAILED_V1, inventoryFailedEvent.toJSON());
    }
  }

  @EventPattern(ORDER_CANCELLED_V1)
  async handleOrderCancelled(@Payload() data: any): Promise<void> {
    const event = data.payload as OrderCancelledV1Payload;
    this.logger.log(`📥 Received ${ORDER_CANCELLED_V1} for order ${event.orderId}`);

    try {
      // Buscar todas las reservas activas para esta orden
      const reservation = await this.reservationRepository.findByOrderId(event.orderId);

      if (reservation) {
        // Liberar stock para todos los items de la reserva
        for (const item of reservation.items) {
          await this.releaseStockUseCase.execute({
            productId: item.productId,
            quantity: item.quantity,
            reservationId: reservation.id,
            reason: event.reason || 'Orden cancelada',
          });
        }

        // Actualizar estado de reserva
        await this.reservationRepository.updateStatus(reservation.id, 'released');

        // Emit released event
        const releasedEvent = new InventoryReleasedV1Event({
          reservationId: reservation.id,
          orderId: event.orderId,
          items: reservation.items,
          reason: event.reason || 'Orden cancelada',
          releasedAt: new Date().toISOString(),
        });

        this.natsClient.emit(INVENTORY_RELEASED_V1, releasedEvent.toJSON());
        this.logger.log(`✅ Reservas liberadas para orden ${event.orderId}`);
      } else {
        this.logger.warn(`⚠️  No se encontraron reservas para orden ${event.orderId}`);
      }
    } catch (error) {
      this.logger.error(`❌ Error liberando reservas para orden ${event.orderId}:`, error);
    }
  }

  /**
   * Handle PaymentConfirmed event
   * Confirms the reservation and decrements actual stock
   */
  @EventPattern(PAYMENT_CONFIRMED_V1)
  async handlePaymentConfirmed(@Payload() data: any): Promise<void> {
    const event = data.payload as PaymentConfirmedV1Payload;
    this.logger.log(`📥 Received ${PAYMENT_CONFIRMED_V1} for order ${event.orderId}`);

    try {
      // Find the reservation
      const reservation = await this.reservationRepository.findByOrderId(event.orderId);

      if (!reservation) {
        this.logger.warn(`⚠️  No reservation found for order ${event.orderId}`);
        return;
      }

      // Confirm the reservation (convert reserved stock to confirmed)
      await this.reservationRepository.updateStatus(reservation.id, 'confirmed');

      this.logger.log(
        `✅ Inventory confirmed for order ${event.orderId}, reservation ${reservation.id}`,
      );

      // Emit inventory reserved event (confirming the stock is allocated)
      const inventoryReservedEvent = new InventoryReservedV1Event({
        reservationId: reservation.id,
        orderId: event.orderId,
        items: reservation.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          reserved: item.quantity,
        })),
        expiresAt: reservation.expiresAt.toISOString(),
        reservedAt: new Date().toISOString(),
      });

      this.natsClient.emit(INVENTORY_RESERVED_V1, inventoryReservedEvent.toJSON());
      this.logger.log(`📤 Emitted ${INVENTORY_RESERVED_V1} after payment confirmation`);
    } catch (error) {
      this.logger.error(
        `❌ Error confirming inventory for order ${event.orderId}:`,
        error,
      );
    }
  }

  @EventPattern('inventory.release')
  async handleReleaseRequest(
    @Payload() event: { orderId: string; reservationId?: string; reason: string },
  ): Promise<void> {
    this.logger.log(`🔄 Liberando reserva por solicitud para orden ${event.orderId}`);

    try {
      const reservation = event.reservationId
        ? await this.reservationRepository.findByOrderId(event.orderId)
        : await this.reservationRepository.findByOrderId(event.orderId);

      if (reservation && reservation.status === ReservationStatus.ACTIVE) {
        // Liberar stock para todos los items
        for (const item of reservation.items) {
          await this.releaseStockUseCase.execute({
            productId: item.productId,
            quantity: item.quantity,
            reservationId: reservation.id,
            reason: event.reason,
          });
        }

        await this.reservationRepository.updateStatus(reservation.id, 'released');
        this.logger.log(`✅ Reserva ${reservation.id} liberada`);
      }
    } catch (error) {
      this.logger.error(`❌ Error liberando reserva:`, error);
    }
  }
}
