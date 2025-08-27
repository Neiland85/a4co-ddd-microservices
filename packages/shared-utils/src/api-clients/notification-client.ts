import axios, { AxiosInstance } from 'axios';

/**
 * Cliente HTTP para comunicarse con el servicio de notificaciones
 * Implementa el patrón Anti-Corruption Layer (ACL) para mantener
 * los bounded contexts aislados
 */

// Interfaces de contrato
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

export class NotificationApiClient {
  private client: AxiosInstance;

  constructor(config?: {
    baseURL?: string;
    timeout?: number;
    headers?: Record<string, string>;
  }) {
    this.client = axios.create({
      baseURL: config?.baseURL || process.env['NOTIFICATION_SERVICE_URL'] || 'http://notification-service:3000',
      timeout: config?.timeout || 5000,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });

    // Interceptor para manejar errores
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // El servidor respondió con un código de estado fuera del rango 2xx
          throw new Error(`Notification service error: ${error.response.status} - ${error.response.data?.message || error.message}`);
        } else if (error.request) {
          // La solicitud se hizo pero no se recibió respuesta
          throw new Error('Notification service is not available');
        } else {
          // Algo sucedió al configurar la solicitud
          throw new Error(`Notification client error: ${error.message}`);
        }
      }
    );
  }

  /**
   * Envía una notificación
   */
  async sendNotification(request: NotificationRequest): Promise<NotificationResponse> {
    try {
      const response = await this.client.post<NotificationResponse>('/api/v1/notifications', request);
      return response.data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  /**
   * Obtiene el estado de una notificación
   */
  async getNotificationStatus(notificationId: string): Promise<NotificationResponse> {
    try {
      const response = await this.client.get<NotificationResponse>(`/api/v1/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting notification status:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas de notificaciones
   */
  async getNotificationStats(): Promise<NotificationStatus> {
    try {
      const response = await this.client.get<NotificationStatus>('/api/v1/notifications/stats');
      return response.data;
    } catch (error) {
      console.error('Error getting notification stats:', error);
      throw error;
    }
  }

  /**
   * Envía una alerta de seguridad (método conveniente)
   */
  async sendSecurityAlert(params: {
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    recipients: string[];
    channels: string[];
    data?: Record<string, any>;
  }): Promise<NotificationResponse> {
    return this.sendNotification({
      type: 'security_alert',
      priority: params.priority,
      title: params.title,
      message: params.message,
      recipients: params.recipients,
      channels: params.channels,
      data: params.data || {}
    });
  }

  /**
   * Reintenta una notificación fallida
   */
  async retryNotification(notificationId: string): Promise<NotificationResponse> {
    try {
      const response = await this.client.post<NotificationResponse>(`/api/v1/notifications/${notificationId}/retry`);
      return response.data;
    } catch (error) {
      console.error('Error retrying notification:', error);
      throw error;
    }
  }

  /**
   * Cancela una notificación en cola
   */
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await this.client.delete(`/api/v1/notifications/${notificationId}`);
    } catch (error) {
      console.error('Error canceling notification:', error);
      throw error;
    }
  }
}

// Exportar una instancia singleton para uso común
export const notificationClient = new NotificationApiClient();