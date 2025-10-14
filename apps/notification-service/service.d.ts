interface NotificationEvent {
    id: string;
    type: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    title: string;
    message: string;
    data: Record<string, any>;
    recipients: string[];
    channels: string[];
    timestamp: Date;
    sent: boolean;
    attempts: number;
}
export declare class NotificationService {
    private channels;
    private templates;
    private events;
    private queue;
    constructor();
    private generateId;
    private setupDefaultChannels;
    private setupDefaultTemplates;
    sendNotification(event: Omit<NotificationEvent, 'id' | 'timestamp' | 'sent' | 'attempts'>): Promise<void>;
    private startQueueProcessor;
    private processNotification;
    private sendToChannel;
    private sendEmail;
    private sendSlack;
    private sendSMS;
    private sendWebhook;
    getNotificationStats(timeWindow?: number): {
        total: number;
        sent: number;
        failed: number;
        byPriority: Record<string, number>;
        byChannel: Record<string, number>;
    };
    sendNotificationLegacy(userId: string, message: string): string;
    getNotificationsLegacy(userId: string): string[];
}
export {};
//# sourceMappingURL=service.d.ts.map