"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationClient = exports.NotificationApiClient = void 0;
const axios_1 = __importDefault(require("axios"));
class NotificationApiClient {
    client;
    constructor(config) {
        this.client = axios_1.default.create({
            baseURL: config?.baseURL ||
                process.env['NOTIFICATION_SERVICE_URL'] ||
                'http://notification-service:3000',
            timeout: config?.timeout || 5000,
            headers: {
                'Content-Type': 'application/json',
                ...config?.headers,
            },
        });
        // Interceptor para manejar errores
        this.client.interceptors.response.use(response => response, error => {
            if (error.response) {
                // El servidor respondió con un código de estado fuera del rango 2xx
                throw new Error(`Notification service error: ${error.response.status} - ${error.response.data?.message || error.message}`);
            }
            else if (error.request) {
                // La solicitud se hizo pero no se recibió respuesta
                throw new Error('Notification service is not available');
            }
            else {
                // Algo sucedió al configurar la solicitud
                throw new Error(`Notification client error: ${error.message}`);
            }
        });
    }
    /**
     * Envía una notificación
     */
    async sendNotification(request) {
        try {
            const response = await this.client.post('/api/v1/notifications', request);
            return response.data;
        }
        catch (error) {
            console.error('Error sending notification:', error);
            throw error;
        }
    }
    /**
     * Obtiene el estado de una notificación
     */
    async getNotificationStatus(notificationId) {
        try {
            const response = await this.client.get(`/api/v1/notifications/${notificationId}`);
            return response.data;
        }
        catch (error) {
            console.error('Error getting notification status:', error);
            throw error;
        }
    }
    /**
     * Obtiene estadísticas de notificaciones
     */
    async getNotificationStats() {
        try {
            const response = await this.client.get('/api/v1/notifications/stats');
            return response.data;
        }
        catch (error) {
            console.error('Error getting notification stats:', error);
            throw error;
        }
    }
    /**
     * Envía una alerta de seguridad (método conveniente)
     */
    async sendSecurityAlert(params) {
        return this.sendNotification({
            type: 'security_alert',
            priority: params.priority,
            title: params.title,
            message: params.message,
            recipients: params.recipients,
            channels: params.channels,
            data: params.data || {},
        });
    }
    /**
     * Reintenta una notificación fallida
     */
    async retryNotification(notificationId) {
        try {
            const response = await this.client.post(`/api/v1/notifications/${notificationId}/retry`);
            return response.data;
        }
        catch (error) {
            console.error('Error retrying notification:', error);
            throw error;
        }
    }
    /**
     * Cancela una notificación en cola
     */
    async cancelNotification(notificationId) {
        try {
            await this.client.delete(`/api/v1/notifications/${notificationId}`);
        }
        catch (error) {
            console.error('Error canceling notification:', error);
            throw error;
        }
    }
}
exports.NotificationApiClient = NotificationApiClient;
// Exportar una instancia singleton para uso común
exports.notificationClient = new NotificationApiClient();
//# sourceMappingURL=notification-client.js.map