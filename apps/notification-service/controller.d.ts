import { NotificationRequestDTO, NotificationResponseDTO, NotificationStatsDTO } from './dto';
export declare class NotificationController {
    private notificationService;
    sendNotification(userId: string, message: string): string;
    getNotifications(userId: string): string[];
    sendAdvancedNotification(request: NotificationRequestDTO): Promise<NotificationResponseDTO>;
    getStats(timeWindow?: number): NotificationStatsDTO;
    sendSecurityAlert(params: {
        title: string;
        message: string;
        priority: 'low' | 'medium' | 'high' | 'critical';
        recipients: string[];
        channels: string[];
        data?: Record<string, any>;
    }): Promise<NotificationResponseDTO>;
}
//# sourceMappingURL=controller.d.ts.map