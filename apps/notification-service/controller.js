'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.NotificationController = void 0;
const service_1 = require('./service');
class NotificationController {
  notificationService = new service_1.NotificationService();
  // Método legacy para compatibilidad
  sendNotification(userId, message) {
    return this.notificationService.sendNotificationLegacy(userId, message);
  }
  // Método legacy para compatibilidad
  getNotifications(userId) {
    return this.notificationService.getNotificationsLegacy(userId);
  }
  // Nuevo método para enviar notificaciones avanzadas
  async sendAdvancedNotification(request) {
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
  getStats(timeWindow) {
    return this.notificationService.getNotificationStats(timeWindow);
  }
  // Método conveniente para alertas de seguridad
  async sendSecurityAlert(params) {
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
exports.NotificationController = NotificationController;
//# sourceMappingURL=controller.js.map
