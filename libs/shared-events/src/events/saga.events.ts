import { BaseEvent } from '../types/event.base'

/**
 * Evento emitido cuando inicia una saga
 */
export interface SagaStartedEvent extends BaseEvent {
  sagaId: string
  orderId: string
}

/**
 * Evento emitido cuando una saga se completa exitosamente
 */
export interface SagaCompletedEvent extends BaseEvent {
  sagaId: string
  orderId: string
}

/**
 * Evento emitido cuando una saga falla
 */
export interface SagaFailedEvent extends BaseEvent {
  sagaId: string
  orderId: string
  failureReason: string
}

/**
 * Evento que dispara compensaciones en caso de fallo
 */
export interface SagaCompensationRequiredEvent extends BaseEvent {
  sagaId: string
  orderId: string
  reason: string
}
