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
    sendNotification(request: NotificationRequest): Promise<NotificationResponse>;
    getNotificationStatus(notificationId: string): Promise<NotificationResponse>;
    getNotificationStats(): Promise<NotificationStatus>;
    sendSecurityAlert(params: {
        title: string;
        message: string;
        severity: 'low' | 'medium' | 'high' | 'critical';
        data?: Record<string, any>;
    }): Promise<NotificationResponse>;
    retryNotification(notificationId: string): Promise<NotificationResponse>;
    cancelNotification(notificationId: string): Promise<void>;
}
export declare const notificationClient: NotificationApiClient;
//# sourceMappingURL=notification-client.d.ts.map