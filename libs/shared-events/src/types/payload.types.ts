/**
 * Tipos helper para payloads de eventos
 */

export type EventPayload<T> = T & {
  eventId: string
  version: number
  timestamp: Date
}
