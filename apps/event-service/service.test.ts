import { EventService } from './service';

describe('EventService', () => {
  const eventService = new EventService();

  it('should create an event', () => {
    const result = eventService.createEvent('Concierto', new Date('2025-07-15'));
<<<<<<< HEAD
    expect(result).toBe('Evento \'Concierto\' creado para la fecha 2025-07-15T00:00:00.000Z.');
=======
    expect(result).toBe("Evento 'Concierto' creado para la fecha 2025-07-15T00:00:00.000Z.");
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  });

  it('should cancel an event', () => {
    const result = eventService.cancelEvent('event1');
    expect(result).toBe('Evento con ID event1 cancelado.');
  });
});
