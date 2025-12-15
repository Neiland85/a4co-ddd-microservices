/**
 * Central export para toda la librería de eventos compartidos
 */

// Event types
export * from './events/order.events'
export * from './events/payment.events'
export * from './events/inventory.events'
export * from './events/saga.events'

// Base types
export * from './types/event.base'
export * from './types/payload.types'

// Constants
export { EVENT_PATTERNS, type EventPattern } from './constants/event-patterns'
