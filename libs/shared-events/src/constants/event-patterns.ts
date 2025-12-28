/**
 * NATS subject patterns para todos los eventos
 * Formato: {domain}.{action}
 */
export const EVENT_PATTERNS = {
  // Order events
  ORDER_CREATED: 'order.created',
  ORDER_CANCELLED: 'order.cancelled',

  // Payment events
  PAYMENT_CONFIRMED: 'payment.confirmed',
  PAYMENT_FAILED: 'payment.failed',

  // Inventory events
  INVENTORY_RESERVED: 'inventory.reserved',
  INVENTORY_FAILED: 'inventory.failed',

  // Saga events
  SAGA_STARTED: 'saga.started',
  SAGA_COMPLETED: 'saga.completed',
  SAGA_FAILED: 'saga.failed',
  SAGA_COMPENSATION_REQUIRED: 'saga.compensation-required',
} as const

/**
 * Type para validar que las claves son válidas
 */
export type EventPattern = typeof EVENT_PATTERNS[keyof typeof EVENT_PATTERNS]
