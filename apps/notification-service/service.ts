export class NotificationService {
  sendNotification(userId: string, message: string): string {
    return `Notificación enviada al usuario ${userId}: ${message}`;
  }

  getNotifications(userId: string): string[] {
    return [`Notificación para el usuario ${userId}`];
  }
}
