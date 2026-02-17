/**
 * Public API for the Order bounded context
 *
 * This file MUST ONLY re-export domain primitives.
 * No logic, no DTOs, no implementations.
 */

// Aggregate Root
export * from './entities/order.aggregate';

// Value Objects
export * from './value-objects/money.vo';

// Domain Events
export * from './events';

// Ports (repositories, gateways, etc.)
export * from './ports/order.repository';
