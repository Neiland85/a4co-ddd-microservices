export class EventService {
  createEvent(name: string, date: Date): string {
    return `Evento '${name}' creado para la fecha ${date.toISOString()}.`;
  }

  cancelEvent(eventId: string): string {
    return `Evento con ID ${eventId} cancelado.`;
  }
}
