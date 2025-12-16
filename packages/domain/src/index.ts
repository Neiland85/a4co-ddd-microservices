/**
 * @a4co/domain - Shared domain artifacts organized by bounded contexts
 * 
 * This package provides domain-layer artifacts that are shared across
 * multiple microservices in the A4CO platform. Each bounded context
 * (order, payment, inventory, etc.) contains its own domain model.
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

// Common domain primitives
export * from './common/index.js';

// Bounded contexts
export * from './order/index.js';
export * from './payment/index.js';
export * from './inventory/index.js';
export * from './user/index.js';
export * from './auth/index.js';
export * from './product/index.js';
export * from './shipment/index.js';
