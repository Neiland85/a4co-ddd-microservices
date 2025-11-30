// Base classes - exported individually to avoid conflicts
export { BaseEntity } from "./base-entity";
export { BaseAggregateRoot } from "./base-aggregate-root";
export { BaseValueObject } from "./base-value-object";
export { AggregateRoot } from "./aggregate-root";
export { ValueObject } from "./value-object";
export { DomainEvent } from "./domain-event";

// Events
export { NatsEventBus } from "./events/nats-event-bus";

// Types
export type { Address } from "./types/common-types";
export type { ApiRequest, ApiError, ServiceResponse, HealthCheckResponse } from "./types/api-types";
export type { EventMessage, IEventHandler, EventPublisher, EventSubscriber, EventBus } from "./types/event-types";

// Security
export { BracesSecurityMiddleware, type SecurityOptions } from "./security/braces-security.middleware";
