/**
 * Tipos helper para payloads de eventos
 * 
 * Note: Este tipo es redundante con BaseEvent pero se mantiene
 * por compatibilidad con la especificación original.
 * En la práctica, los eventos deben extender BaseEvent directamente.
 */

export type EventPayload<T> = T & {
  eventId: string
  version: number
  timestamp: Date
}
