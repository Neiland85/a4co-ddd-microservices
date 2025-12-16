/**
 * @a4co/domain - Shared Domain Layer
 * 
 * Organized by bounded contexts following Domain-Driven Design principles.
 * All domain primitives, value objects, and aggregates are versioned.
 * 
 * @example
 * ```typescript
 * import { Money, Email, OrderId, OrderStatus } from '@a4co/domain';
 * 
 * const price = Money.create(100, 'EUR');
 * const email = Email.create('customer@example.com');
 * const orderId = OrderId.generate();
 * const status = OrderStatus.pending();
 * ```
 */

// Shared kernel: Common value objects, errors, and base types
// Re-exported from ./common for single source of truth
export * from './common/index.js';

// Bounded contexts: Organized by business domains
export * from './auth/index.js';
export * from './inventory/index.js';
export * from './order/index.js';
export * from './payment/index.js';
export * from './product/index.js';
export * from './shipment/index.js';
export * from './user/index.js';

