// Base classes - exported individually to avoid conflicts
export { AggregateRoot } from "./aggregate-root";
export { BaseAggregateRoot } from "./base-aggregate-root";
export { BaseEntity } from "./base-entity";
export { BaseService } from "./base-service";
export { BaseValueObject } from "./base-value-object";
export { DomainEvent } from "./domain-event";
export { AbstractUseCase, UseCase } from "./use-case";
export { ValueObject } from "./value-object";

// Events
export { NatsEventBus } from "./events/nats-event-bus";

// Types
export type { ApiError, ApiRequest, HealthCheckResponse, ServiceResponse } from "./types/api-types";
export type { Address } from "./types/common-types";
export type { EventBus, EventMessage, EventPublisher, EventSubscriber, IEventHandler } from "./types/event-types";

// Security
export { BracesSecurityMiddleware, type SecurityOptions } from "./security/braces-security.middleware";
