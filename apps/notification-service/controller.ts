import { NotificationRequestDTO, NotificationResponseDTO, NotificationStatsDTO } from './dto';
import { NotificationService } from './service';

export class NotificationController {
  private notificationService = new NotificationService();

  // Método legacy para compatibilidad
  sendNotification(userId: string, message: string): string {
    return this.notificationService.sendNotificationLegacy(userId, message);
  }

  // Método legacy para compatibilidad
  getNotifications(userId: string): string[] {
    return this.notificationService.getNotificationsLegacy(userId);
  }

  // Nuevo método para enviar notificaciones avanzadas
  async sendAdvancedNotification(
<<<<<<< HEAD
    request: NotificationRequestDTO,
=======
    request: NotificationRequestDTO
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  ): Promise<NotificationResponseDTO> {
    try {
      await this.notificationService.sendNotification({
        type: request.type,
        priority: request.priority,
        title: request.title,
        message: request.message,
        recipients: request.recipients,
        channels: request.channels || ['email'],
        data: request.data || {},
      });

      return {
        id: 'generated-id', // El servicio genera el ID internamente
        status: 'queued',
        timestamp: new Date().toISOString(),
        message: 'Notificación enviada exitosamente',
      };
    } catch (error) {
      return {
        id: '',
        status: 'failed',
        timestamp: new Date().toISOString(),
        message: `Error al enviar notificación: ${error}`,
      };
    }
  }

  // Método para obtener estadísticas
  getStats(timeWindow?: number): NotificationStatsDTO {
    return this.notificationService.getNotificationStats(timeWindow);
  }

  // Método conveniente para alertas de seguridad
  async sendSecurityAlert(params: {
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    recipients: string[];
    channels: string[];
    data?: Record<string, any>;
  }): Promise<NotificationResponseDTO> {
    return this.sendAdvancedNotification({
      type: 'security_alert',
      priority: params.priority,
      title: params.title,
      message: params.message,
      recipients: params.recipients,
      channels: params.channels,
      data: params.data || {},
    });
  }
}
