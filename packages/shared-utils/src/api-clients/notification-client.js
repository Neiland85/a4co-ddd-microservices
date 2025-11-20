"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationClient = exports.NotificationApiClient = void 0;
const axios_1 = __importDefault(require("axios"));
class NotificationApiClient {
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
        this.client.interceptors.response.use(response => response, error => {
            if (error.response) {
                throw new Error(`Notification service error: ${error.response.status} - ${error.response.data?.message || error.message}`);
            }
            else if (error.request) {
                throw new Error('Notification service is not available');
            }
            else {
                throw new Error(`Notification client error: ${error.message}`);
            }
        });
    }
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
exports.notificationClient = new NotificationApiClient();
//# sourceMappingURL=notification-client.js.map