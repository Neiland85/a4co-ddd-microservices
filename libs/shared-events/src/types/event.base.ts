/**
 * Base event interface con versionado para evolución futura
 */
export interface BaseEvent {
  eventId: string         // UUID único del evento
  version: number         // Versión del evento (para compatibilidad)
  timestamp: Date         // Date object (serialize to ISO 8601 when publishing)
  aggregateId?: string    // ID de la entidad afectada (orderId, etc)
  correlationId?: string  // ID de correlación para distributed tracing (opcional para backward compatibility)
}

/**
 * Helper para serializar eventos con timestamp en formato ISO 8601
 * 
 * @example
 * const event = { ...baseEvent, timestamp: new Date() };
 * const serialized = serializeEvent(event);
 * // serialized.timestamp será string en formato ISO 8601
 */
export function serializeEvent<T extends BaseEvent>(event: T): Omit<T, 'timestamp'> & { timestamp: string } {
  return {
    ...event,
    timestamp: event.timestamp.toISOString(),
  };
}
