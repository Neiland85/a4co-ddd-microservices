import { EventService } from './service';

export class EventController {
  private eventService = new EventService();

  createEvent(name: string, date: Date): string {
    return this.eventService.createEvent(name, date);
  }

  cancelEvent(eventId: string): string {
    return this.eventService.cancelEvent(eventId);
  }
}
