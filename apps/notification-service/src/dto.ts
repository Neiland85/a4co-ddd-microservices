export interface NotificationDTO {
  userId: string;
  message: string;
}

export interface NotificationRequestDTO {
  type: 'email' | 'sms' | 'push' | 'slack' | 'security_alert';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  recipients: string[];
  channels?: string[];
  data?: Record<string, any>;
}

export interface NotificationResponseDTO {
  id: string;
  status: 'queued' | 'sent' | 'failed';
  timestamp: string;
  message?: string;
}

export interface NotificationStatsDTO {
  total: number;
  sent: number;
  failed: number;
  byPriority: Record<string, number>;
  byChannel: Record<string, number>;
}
