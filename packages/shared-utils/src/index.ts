// Exportar clases base
export * from './base';

// Exportar constantes
export * from './constants';

// Exportar elementos de dominio
export * from './domain';

// Exportar DTOs (excluyendo ApiResponse para evitar conflictos)
export {
  BaseResponse,
  SuccessResponse,
  ErrorResponse,
  createSuccessResponse,
  createErrorResponse,
  createPaginatedResponse
} from './dto';

// Exportar tipos (excluyendo los conflictivos)
export {
  ApiRequest,
  ApiError,
  ServiceResponse,
  HealthCheckResponse,
  MetricsResponse
} from './types';

// Exportar utilidades
export * from './utils';

// Exportar utilidades de seguridad
export * from './security';

// Exportar sistema de eventos (resolviendo conflicto de EventHandler)
export {
  IEventBus,
  NatsEventBus,
  EventMetadata,
  EnhancedDomainEvent
} from './events/event-bus';
export * from './events/subjects';

// Exportar tipos específicos de eventos para evitar conflictos
export {
  OrderCreatedEvent,
  OrderConfirmedEvent,
  OrderCancelledEvent,
  PaymentSucceededEvent,
  StockUpdatedEvent,
  UserRegisteredEvent,
  UserProfileUpdatedEvent
} from './events/domain-events';

// Exportar clientes API para comunicación entre servicios
export * from './api-clients';

export * from './events/integration-events';

// Exportar sistema de sagas
export * from './saga/saga-orchestrator';

// Domain-Driven Design base classes and utilities
export * from './domain/base-entity';
export * from './domain/value-object';
export * from './domain/domain-event';
export * from './domain/aggregate-root';

// DTOs específicos (evitando conflictos con export * from './dto')
export * from './dto/base-dto';
export * from './dto/pagination-dto';

// Utils específicos (evitando conflictos con export * from './utils')
export * from './utils/date.util';
export * from './utils/uuid.util';

// Constants específicos (evitando conflictos con export * from './constants')
export * from './constants/error-codes';
export * from './types/common.types';

// Patrones de capa de aplicación
export interface UseCase<Input, Output> {
  execute(input: Input): Promise<Output>;
}
