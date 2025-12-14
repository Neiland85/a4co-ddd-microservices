// Base classes - exported individually to avoid conflicts
export { AggregateRoot } from "./aggregate-root";
export { BaseAggregateRoot } from "./base-aggregate-root";
export { BaseEntity } from "./base-entity";
export { BaseService } from "./base-service";
export { BaseValueObject } from "./base-value-object";
export { DomainEvent } from "./domain-event";
export { AbstractUseCase, UseCase } from "./use-case";
export { ValueObject } from "./value-object";

// Base patterns (new consolidated base classes)
export * from "./base";

// Configuration utilities
export * from "./config";

// Filters
export * from "./filters";

// Decorators
export * from "./decorators";

// Validators
export * from "./validators";

// DTOs
export * from "./dto";

// Events
export { NatsEventBus } from "./events/nats-event-bus";

// Types
export type { ApiError, ApiRequest, HealthCheckResponse, ServiceResponse } from "./types/api-types";
export type { Address } from "./types/common-types";
export type { EventBus, EventMessage, EventPublisher, EventSubscriber, IEventHandler } from "./types/event-types";

// Security
export { BracesSecurityMiddleware, type SecurityOptions } from "./security/braces-security.middleware";
