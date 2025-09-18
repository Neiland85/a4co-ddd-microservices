/**
 * Cliente HTTP para comunicarse con el servicio de notificaciones
 * Implementa el patrón Anti-Corruption Layer (ACL) para mantener
 * los bounded contexts aislados
 */
export interface NotificationRequest {
    type: 'email' | 'sms' | 'push' | 'slack' | 'security_alert';
    priority: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    recipients: string[];
    channels?: string[];
    data?: Record<string, any>;
}
export interface NotificationResponse {
    id: string;
    status: 'queued' | 'sent' | 'failed';
    timestamp: string;
    message?: string;
}
export interface NotificationStatus {
    sent: number;
    queued: number;
    failed: number;
    byPriority: Record<string, number>;
    byChannel: Record<string, number>;
}
export declare class NotificationApiClient {
    private client;
    constructor(config?: {
        baseURL?: string;
        timeout?: number;
        headers?: Record<string, string>;
    });
    /**
     * Envía una notificación
     */
    sendNotification(request: NotificationRequest): Promise<NotificationResponse>;
    /**
     * Obtiene el estado de una notificación
     */
    getNotificationStatus(notificationId: string): Promise<NotificationResponse>;
    /**
     * Obtiene estadísticas de notificaciones
     */
    getNotificationStats(): Promise<NotificationStatus>;
    /**
     * Envía una alerta de seguridad (método conveniente)
     */
    sendSecurityAlert(params: {
        title: string;
        message: string;
        priority: 'low' | 'medium' | 'high' | 'critical';
        recipients: string[];
        channels: string[];
        data?: Record<string, any>;
    }): Promise<NotificationResponse>;
    /**
     * Reintenta una notificación fallida
     */
    retryNotification(notificationId: string): Promise<NotificationResponse>;
    /**
     * Cancela una notificación en cola
     */
    cancelNotification(notificationId: string): Promise<void>;
}
export declare const notificationClient: NotificationApiClient;
//# sourceMappingURL=notification-client.d.ts.map