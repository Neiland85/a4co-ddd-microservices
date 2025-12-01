/**
 * EventSubjects - Centralized definition of all event subject names
 * Used for consistent event routing across microservices
 */
export const EventSubjects = {
  // Payment events
  PAYMENT_INITIATED: 'payment.initiated.v1',
  PAYMENT_SUCCEEDED: 'payment.succeeded.v1',
  PAYMENT_FAILED: 'payment.failed.v1',
  REFUND_PROCESSED: 'payment.refunded.v1',

  // Order events
  ORDER_CREATED: 'order.created.v1',
  ORDER_UPDATED: 'order.updated.v1',
  ORDER_CANCELLED: 'order.cancelled.v1',
  ORDER_COMPLETED: 'order.completed.v1',

  // Inventory events
  INVENTORY_RESERVED: 'inventory.reserved.v1',
  INVENTORY_RELEASED: 'inventory.released.v1',
  INVENTORY_UPDATED: 'inventory.updated.v1',

  // User events
  USER_CREATED: 'user.created.v1',
  USER_UPDATED: 'user.updated.v1',

  // Product events
  PRODUCT_CREATED: 'product.created.v1',
  PRODUCT_UPDATED: 'product.updated.v1',
  PRODUCT_DELETED: 'product.deleted.v1',
} as const;

export type EventSubjectType = (typeof EventSubjects)[keyof typeof EventSubjects];
