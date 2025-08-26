     develop
// Exportar clases base
export * from './base';

// Exportar constantes
export * from './constants';

// Exportar elementos de dominio
export * from './domain';

// Exportar DTOs
export * from './dto';

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

// Exportar sistema de eventos
export * from './events/event-bus';
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

// DTOs
export * from './dto/base-dto';
export * from './dto/pagination-dto';

// Utils
export * from './utils/date.util';
export * from './utils/uuid.util';

// Constants
export * from './constants/error-codes';

// Types
export * from './types/common.types';

// Application layer patterns
export interface UseCase<Input, Output> {
  execute(input: Input): Promise<Output>;
}

// Repository pattern
export interface Repository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}
     main
