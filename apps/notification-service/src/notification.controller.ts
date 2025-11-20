import { Controller, Get, Post, Body, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { NotificationService } from './service';
import { NotificationRequestDTO, NotificationResponseDTO } from './dto';
import { EmailProvider } from './providers/email.provider';
import { SMSProvider } from './providers/sms.provider';
import { PushProvider } from './providers/push.provider';

@ApiTags('notifications')
@Controller()
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    @Inject('EMAIL_PROVIDER') private emailProvider: EmailProvider,
    @Inject('SMS_PROVIDER') private smsProvider: SMSProvider,
    @Inject('PUSH_PROVIDER') private pushProvider: PushProvider,
  ) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  async healthCheck() {
    return {
      status: 'healthy',
      service: 'notification-service',
      timestamp: new Date().toISOString(),
      providers: {
        email: 'configured',
        sms: 'configured',
        push: 'configured',
      },
    };
  }

  @Post('send')
  @ApiOperation({ summary: 'Send notification' })
  @ApiResponse({ status: 200, description: 'Notification sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  async sendNotification(
    @Body() request: NotificationRequestDTO,
  ): Promise<NotificationResponseDTO> {
    try {
      // Send via appropriate channels
      const promises: Promise<void>[] = [];

      if (request.channels?.includes('email')) {
        promises.push(
          this.emailProvider.send({
            to: request.recipients,
            subject: request.title,
            text: request.message,
            html: `<h2>${request.title}</h2><p>${request.message}</p>`,
          }),
        );
      }

      if (request.channels?.includes('sms')) {
        for (const recipient of request.recipients) {
          promises.push(
            this.smsProvider.send({
              to: recipient,
              message: `${request.title}: ${request.message}`,
            }),
          );
        }
      }

      if (request.channels?.includes('push')) {
        for (const recipient of request.recipients) {
          promises.push(
            this.pushProvider.send({
              token: recipient,
              title: request.title,
              body: request.message,
              data: request.data || {},
            }),
          );
        }
      }

      await Promise.all(promises);

      // Also use the notification service for tracking
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
        id: `notif_${Date.now()}`,
        status: 'sent',
        timestamp: new Date().toISOString(),
        message: 'Notification sent successfully',
      };
    } catch (error) {
      console.error('Error sending notification:', error);
      return {
        id: '',
        status: 'failed',
        timestamp: new Date().toISOString(),
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get notification statistics' })
  async getStats() {
    return this.notificationService.getNotificationStats();
  }
}
