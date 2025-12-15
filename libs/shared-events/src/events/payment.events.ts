import { BaseEvent } from '../types/event.base'

/**
 * Evento emitido cuando el pago se procesa exitosamente
 */
export interface PaymentConfirmedEvent extends BaseEvent {
  orderId: string
  transactionId: string
  amount: number
}

/**
 * Evento emitido cuando el pago falla
 */
export interface PaymentFailedEvent extends BaseEvent {
  orderId: string
  reason: string
}
