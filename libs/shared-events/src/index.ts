/**
 * Shared Events Library for A4CO Microservices
 * 
 * This library provides typed event definitions for communication
 * between microservices using NATS message broker.
 * 
 * All events are versioned to support backward compatibility.
 */

// Base types
export * from './base-event';

// Order events
export * from './order-events';

// Payment events
export * from './payment-events';

// Inventory events
export * from './inventory-events';
