// Exportar clases base
export * from './base';

// Exportar constantes
export * from './constants';

// Exportar elementos de dominio
export * from './domain';

// Exportar DTOs
export * from './dto';

// Exportar tipos (excluyendo los que ya están en domain y dto)
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
export * from './events/domain-events';
export * from './events/integration-events';

// Exportar clientes API para comunicación entre servicios
export * from './api-clients';

// Exportar sistema de sagas
export * from './saga/saga-orchestrator';

// Patrones de capa de aplicación
export interface UseCase<Input, Output> {
  execute(input: Input): Promise<Output>;
}
