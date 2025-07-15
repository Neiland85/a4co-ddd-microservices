import { NotificationService } from './service';

describe('NotificationService', () => {
  const notificationService = new NotificationService();

  it('should send a notification', () => {
    const result = notificationService.sendNotification('user1', 'Hola');
    expect(result).toBe('Notificación enviada al usuario user1: Hola');
  });

  it('should get notifications', () => {
    const result = notificationService.getNotifications('user1');
    expect(result).toEqual(['Notificación para el usuario user1']);
  });
});
