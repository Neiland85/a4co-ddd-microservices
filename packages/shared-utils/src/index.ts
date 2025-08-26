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
