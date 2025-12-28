import { BaseEvent } from '../types/event.base'

/**
 * Evento emitido cuando se crea una nueva orden
 */
export interface OrderCreatedEvent extends BaseEvent {
  orderId: string
  userId: string
  productId: string
  quantity: number
  totalAmount: number
}

/**
 * Evento emitido cuando se cancela una orden
 */
export interface OrderCancelledEvent extends BaseEvent {
  orderId: string
  reason: string
}
