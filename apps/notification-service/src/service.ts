interface NotificationChannel {
  type: 'email' | 'sms' | 'slack' | 'discord' | 'webhook' | 'push';
  config: Record<string, any>;
  enabled: boolean;
}

interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  channels: string[];
  priority: 'low' | 'medium' | 'high' | 'critical';
}

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

export class NotificationService {
  private channels = new Map<string, NotificationChannel>();
  private templates = new Map<string, NotificationTemplate>();
  private events: NotificationEvent[] = [];
  private queue: NotificationEvent[] = [];

  constructor() {
    this.setupDefaultChannels();
    this.setupDefaultTemplates();
    this.startQueueProcessor();
  }

  // Generar ID único
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Configurar canales por defecto
  private setupDefaultChannels(): void {
    this.channels.set('email', {
      type: 'email',
      config: {
        service: 'sendgrid',
        apiKey: process.env['SENDGRID_API_KEY'],
        from: process.env['NOTIFICATION_EMAIL'] || 'noreply@backoffice.com',
      },
      enabled: true,
    });

    this.channels.set('slack', {
      type: 'slack',
      config: {
        webhookUrl: process.env['SLACK_WEBHOOK_URL'],
        channel: '#security-alerts',
      },
      enabled: !!process.env['SLACK_WEBHOOK_URL'],
    });

    this.channels.set('sms', {
      type: 'sms',
      config: {
        service: 'twilio',
        accountSid: process.env['TWILIO_ACCOUNT_SID'],
        authToken: process.env['TWILIO_AUTH_TOKEN'],
        from: process.env['TWILIO_PHONE_NUMBER'],
      },
      enabled: !!process.env['TWILIO_ACCOUNT_SID'],
    });
  }

  // Configurar plantillas por defecto
  private setupDefaultTemplates(): void {
    this.templates.set('security_alert', {
      id: 'security_alert',
      name: 'Alerta de Seguridad',
      subject: '🚨 Alerta de Seguridad - {{title}}',
      body: `
        Se ha detectado una amenaza de seguridad:

        Tipo: {{type}}
        Descripción: {{message}}
        IP de origen: {{data.source}}
        Fecha: {{timestamp}}

        Por favor, revisa el panel de seguridad inmediatamente.
      `,
      channels: ['email', 'slack'],
      priority: 'critical',
    });

    this.templates.set('system_error', {
      id: 'system_error',
      name: 'Error del Sistema',
      subject: '❌ Error del Sistema - {{title}}',
      body: `
        Se ha producido un error en el sistema:

        Error: {{message}}
        Detalles: {{data.details}}
        Fecha: {{timestamp}}
      `,
      channels: ['email'],
      priority: 'high',
    });

    this.templates.set('backup_status', {
      id: 'backup_status',
      name: 'Estado del Backup',
      subject: '💾 {{title}}',
      body: `
        Estado del backup:

        Resultado: {{message}}
        Tamaño: {{data.size}}
        Duración: {{data.duration}}
        Fecha: {{timestamp}}
      `,
      channels: ['email'],
      priority: 'medium',
    });
  }

  // Enviar notificación
  async sendNotification(
    event: Omit<NotificationEvent, 'id' | 'timestamp' | 'sent' | 'attempts'>
  ): Promise<void> {
    const notification: NotificationEvent = {
      ...event,
      id: this.generateId(),
      timestamp: new Date(),
      sent: false,
      attempts: 0,
    };

    // Agregar a la cola
    this.queue.push(notification);
    this.events.push(notification);

    console.log(`Notificación agregada a la cola: ${notification.title}`);
  }

  // Procesar cola de notificaciones
  private startQueueProcessor(): void {
    setInterval(async () => {
      if (this.queue.length === 0) return;

      const notification = this.queue.shift()!;
      await this.processNotification(notification);
    }, 1000); // Procesar cada segundo
  }

  // Procesar una notificación individual
  private async processNotification(notification: NotificationEvent): Promise<void> {
    notification.attempts++;

    try {
      for (const channelName of notification.channels) {
        const channel = this.channels.get(channelName);
        if (!channel || !channel.enabled) continue;

        await this.sendToChannel(notification, channel);
      }

      notification.sent = true;
      console.log(`Notificación enviada: ${notification.title}`);
    } catch (error) {
      console.error(`Error enviando notificación: ${error}`);

      // Reintentar hasta 3 veces
      if (notification.attempts < 3) {
        setTimeout(() => {
          this.queue.push(notification);
        }, 5000 * notification.attempts); // Delay exponencial
      }
    }
  }

  // Enviar a un canal específico
  private async sendToChannel(
    notification: NotificationEvent,
    channel: NotificationChannel
  ): Promise<void> {
    switch (channel.type) {
      case 'email':
        await this.sendEmail(notification, channel.config);
        break;
      case 'slack':
        await this.sendSlack(notification, channel.config);
        break;
      case 'sms':
        await this.sendSMS(notification, channel.config);
        break;
      case 'webhook':
        await this.sendWebhook(notification, channel.config);
        break;
      default:
        console.log(`Canal no implementado: ${channel.type}`);
    }
  }

  // Enviar email (simulado)
  private async sendEmail(notification: NotificationEvent, config: any): Promise<void> {
    console.log(`📧 Enviando email: ${notification.title}`);
    // Aquí implementarías la integración con SendGrid, Nodemailer, etc.
  }

  // Enviar a Slack (simulado)
  private async sendSlack(notification: NotificationEvent, config: any): Promise<void> {
    console.log(`💬 Enviando a Slack: ${notification.title}`);
    // Aquí implementarías la integración con Slack Webhook
  }

  // Enviar SMS (simulado)
  private async sendSMS(notification: NotificationEvent, config: any): Promise<void> {
    console.log(`📱 Enviando SMS: ${notification.title}`);
    // Aquí implementarías la integración con Twilio
  }

  // Enviar Webhook (simulado)
  private async sendWebhook(notification: NotificationEvent, config: any): Promise<void> {
    console.log(`🔗 Enviando webhook: ${notification.title}`);
    // Aquí implementarías el envío de webhook
  }

  // Obtener estadísticas de notificaciones
  getNotificationStats(timeWindow = 24 * 60 * 60 * 1000): {
    total: number;
    sent: number;
    failed: number;
    byPriority: Record<string, number>;
    byChannel: Record<string, number>;
  } {
    const cutoff = new Date(Date.now() - timeWindow);
    const recentEvents = this.events.filter(event => event.timestamp > cutoff);

    const byPriority: Record<string, number> = {};
    const byChannel: Record<string, number> = {};
    let sent = 0;
    let failed = 0;

    for (const event of recentEvents) {
      byPriority[event.priority] = (byPriority[event.priority] || 0) + 1;

      for (const channel of event.channels) {
        byChannel[channel] = (byChannel[channel] || 0) + 1;
      }

      if (event.sent) sent++;
      else if (event.attempts >= 3) failed++;
    }

    return {
      total: recentEvents.length,
      sent,
      failed,
      byPriority,
      byChannel,
    };
  }

  // Métodos legacy para compatibilidad
  sendNotificationLegacy(userId: string, message: string): string {
    return `Notificación enviada al usuario ${userId}: ${message}`;
  }

  getNotificationsLegacy(userId: string): string[] {
    return [`Notificación para el usuario ${userId}`];
  }
}
