import { BaseEvent } from '../types/event.base'

/**
 * Evento emitido cuando el inventario reserva stock exitosamente
 */
export interface InventoryReservedEvent extends BaseEvent {
  orderId: string
  productId: string
  quantity: number
  remainingStock: number
}

/**
 * Evento emitido cuando el inventario no puede reservar stock
 */
export interface InventoryFailedEvent extends BaseEvent {
  orderId: string
  productId: string
  reason: string
}
