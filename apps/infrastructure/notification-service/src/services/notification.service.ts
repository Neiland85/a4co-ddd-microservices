import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SendGridService } from './sendgrid.service';
import { TwilioService } from './twilio.service';

export interface SendNotificationParams {
  orderId: string;
  customerId: string;
  correlationId: string;
  eventType: string;
  channel: 'email' | 'sms';
  recipient: string;
  subject?: string;
  content: string;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly prisma: PrismaClient;

  constructor(
    private readonly sendGridService: SendGridService,
    private readonly twilioService: TwilioService,
  ) {
    this.prisma = new PrismaClient();
  }

  async onModuleInit() {
    await this.prisma.$connect();
    this.logger.log('✅ Prisma connected');
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  /**
   * Send notification with idempotency check
   * Returns true if sent, false if duplicate
   */
  async sendNotification(params: SendNotificationParams): Promise<boolean> {
    const { orderId, customerId, correlationId, eventType, channel, recipient, subject, content } = params;

    // Check for duplicate by correlationId
    const existing = await this.prisma.notification.findUnique({
      where: { correlationId },
    });

    if (existing) {
      this.logger.log(`⚠️  Duplicate notification detected for correlationId: ${correlationId}, skipping`);
      return false;
    }

    // Create notification record
    const notification = await this.prisma.notification.create({
      data: {
        orderId,
        customerId,
        correlationId,
        eventType,
        channel,
        recipient,
        subject: subject || '',
        content,
        status: 'pending',
        attempts: 0,
      },
    });

    this.logger.log(`📝 Created notification record: ${notification.id}`);

    // Send notification
    try {
      if (channel === 'email') {
        await this.sendGridService.sendEmail({
          to: recipient,
          subject: subject || 'Notificación',
          text: content,
          html: content, // Content should already be HTML
        });
      } else if (channel === 'sms') {
        await this.twilioService.sendSMS({
          to: recipient,
          message: content,
        });
      }

      // Update status to sent
      await this.prisma.notification.update({
        where: { id: notification.id },
        data: {
          status: 'sent',
          sentAt: new Date(),
          attempts: 1,
        },
      });

      this.logger.log(`✅ Notification sent successfully: ${notification.id}`);
      return true;
    } catch (error) {
      // Update status to failed
      await this.prisma.notification.update({
        where: { id: notification.id },
        data: {
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : String(error),
          attempts: 1,
        },
      });

      this.logger.error(`❌ Failed to send notification: ${notification.id}`, error);
      throw error;
    }
  }

  /**
   * Get notification history for an order
   */
  async getNotificationsByOrderId(
    orderId: string,
    filters?: {
      channel?: 'email' | 'sms';
      status?: 'pending' | 'sent' | 'failed';
      limit?: number;
      offset?: number;
    },
  ) {
    const where: any = { orderId };

    if (filters?.channel) {
      where.channel = filters.channel;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: filters?.limit || 10,
        skip: filters?.offset || 0,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      data: notifications,
      total,
      limit: filters?.limit || 10,
      offset: filters?.offset || 0,
    };
  }

  /**
   * Get statistics for debugging
   */
  async getStats() {
    const [total, sent, failed, pending] = await Promise.all([
      this.prisma.notification.count(),
      this.prisma.notification.count({ where: { status: 'sent' } }),
      this.prisma.notification.count({ where: { status: 'failed' } }),
      this.prisma.notification.count({ where: { status: 'pending' } }),
    ]);

    return {
      total,
      sent,
      failed,
      pending,
      successRate: total > 0 ? ((sent / total) * 100).toFixed(2) + '%' : '0%',
    };
  }
}
