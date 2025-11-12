import { Injectable, Logger } from '@nestjs/common';
import { StockReservation, ReservationStatus } from '../../domain/entities/stock-reservation.entity';
import { InventoryReservedEvent, InventoryOutOfStockEvent } from '../../domain/events';

export interface ReserveStockCommand {
  orderId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  ttlMinutes?: number;
}

export interface ReserveStockResult {
  success: boolean;
  reservation?: StockReservation;
  unavailableItems?: Array<{
    productId: string;
    requestedQuantity: number;
    availableQuantity: number;
  }>;
}

@Injectable()
export class ReserveStockUseCase {
  private readonly logger = new Logger(ReserveStockUseCase.name);

  constructor(
    private readonly inventoryRepository: any,
    private readonly reservationRepository: any,
    private readonly eventBus: any,
  ) {}

  async execute(command: ReserveStockCommand): Promise<ReserveStockResult> {
    this.logger.log(`📦 Iniciando reserva de stock para orden ${command.orderId}`);

    try {
      // Paso 1: Verificar disponibilidad de todos los productos
      const unavailableItems = [];
      
      for (const item of command.items) {
        const available = await this.inventoryRepository.getAvailableStock(item.productId);
        
        if (available < item.quantity) {
          unavailableItems.push({
            productId: item.productId,
            requestedQuantity: item.quantity,
            availableQuantity: available,
          });
        }
      }

      // Si algún producto no tiene stock suficiente, fallar toda la reserva
      if (unavailableItems.length > 0) {
        this.logger.warn(`⚠️ Stock insuficiente para orden ${command.orderId}`);
        
        // Publicar evento de stock insuficiente
        const event = new InventoryOutOfStockEvent(command.orderId, unavailableItems);
        await this.eventBus.publish('inventory.out_of_stock', event.toJSON());

        return {
          success: false,
          unavailableItems,
        };
      }

      // Paso 2: Crear la reserva
      const reservation = new StockReservation({
        orderId: command.orderId,
        items: command.items,
        ttlMinutes: command.ttlMinutes || 15,
      });

      // Paso 3: Reservar stock en el inventario (decrementar available, incrementar reserved)
      await this.inventoryRepository.transaction(async (tx: any) => {
        for (const item of command.items) {
          await tx.reserveStock(item.productId, item.quantity);
        }

        // Guardar la reserva
        await tx.saveReservation(reservation);
      });

      this.logger.log(`✅ Stock reservado exitosamente: ${reservation.reservationId}`);

      // Paso 4: Publicar evento de inventario reservado
      const event = new InventoryReservedEvent(
        command.orderId,
        reservation.reservationId,
        command.items,
        reservation.expiresAt,
      );

      await this.eventBus.publish('inventory.reserved', event.toJSON());

      return {
        success: true,
        reservation,
      };
    } catch (error) {
      this.logger.error(`❌ Error reservando stock para orden ${command.orderId}:`, error);
      throw error;
    }
  }
}
