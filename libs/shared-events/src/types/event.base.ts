/**
 * Base event interface con versionado para evolución futura
 */
export interface BaseEvent {
  eventId: string        // UUID único del evento
  version: number        // Versión del evento (para compatibilidad)
  timestamp: Date        // Timestamp ISO 8601
  aggregateId?: string   // ID de la entidad afectada (orderId, etc)
}
