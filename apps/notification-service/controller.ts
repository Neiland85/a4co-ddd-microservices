import { NotificationService } from './service';

export class NotificationController {
  private notificationService = new NotificationService();

  sendNotification(userId: string, message: string): string {
    return this.notificationService.sendNotification(userId, message);
  }

  getNotifications(userId: string): string[] {
    return this.notificationService.getNotifications(userId);
  }
}
