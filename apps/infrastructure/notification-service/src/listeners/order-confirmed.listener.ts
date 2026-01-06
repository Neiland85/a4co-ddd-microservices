import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EventTypes, OrderConfirmedV1Data } from '@a4co/shared-events';
import { NotificationService } from '../services/notification.service';
import { SendGridService } from '../services/sendgrid.service';

/**
 * OrderConfirmed Event Listener
 * Sends email notification when order is confirmed
 */
@Controller() // Required by @EventPattern decorator
export class OrderConfirmedListener {
  private readonly logger = new Logger(OrderConfirmedListener.name);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly sendGridService: SendGridService,
  ) {}

  @EventPattern(EventTypes.ORDER_CONFIRMED_V1)
  async handleOrderConfirmed(@Payload() payload: any): Promise<void> {
    const { data, correlationId, eventId } = payload;
    const eventData = data as OrderConfirmedV1Data;

    this.logger.log(`📥 Received ${EventTypes.ORDER_CONFIRMED_V1}`, {
      orderId: eventData.orderId,
      correlationId,
      eventId,
    });

    try {
      // Get customer email - in production, this would come from a user service
      const customerEmail = await this.getCustomerEmail(eventData.customerId);

      if (!customerEmail) {
        this.logger.warn(`Customer ${eventData.customerId} has no email, skipping notification`);
        return;
      }

      // Generate email HTML
      const emailHtml = this.sendGridService.generateOrderConfirmationHtml({
        orderId: eventData.orderId,
        customerName: eventData.customerId, // In production, fetch actual name
        totalAmount: eventData.totalAmount,
        currency: eventData.currency || 'EUR',
      });

      // Send notification (with idempotency)
      await this.notificationService.sendNotification({
        orderId: eventData.orderId,
        customerId: eventData.customerId,
        correlationId: correlationId || eventId,
        eventType: EventTypes.ORDER_CONFIRMED_V1,
        channel: 'email',
        recipient: customerEmail,
        subject: `✅ Pedido Confirmado - ${eventData.orderId}`,
        content: emailHtml,
      });

      this.logger.log(`✅ Order confirmation email sent for order ${eventData.orderId}`);
    } catch (error) {
      this.logger.error(
        `❌ Error processing order confirmed event for order ${eventData.orderId}`,
        error instanceof Error ? error.stack : String(error),
      );
      // Don't throw - we don't want to block the event processing
      // The notification is marked as failed in the database
    }
  }

  /**
   * Get customer email
   * In production, this should call a user service or query a database
   */
  private async getCustomerEmail(customerId: string): Promise<string | null> {
    // Mock implementation - in production, fetch from user service
    // For now, use a test email or generate from customerId
    const mockEmail = process.env['TEST_EMAIL'] || `customer-${customerId}@example.com`;
    return mockEmail;
  }
}
