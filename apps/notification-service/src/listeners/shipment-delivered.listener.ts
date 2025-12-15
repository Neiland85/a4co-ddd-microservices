import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EventTypes, ShipmentDeliveredV1Data } from '@a4co/shared-events';
import { NotificationService } from '../services/notification.service';
import { TwilioService } from '../services/twilio.service';

/**
 * ShipmentDelivered Event Listener
 * Sends SMS notification when shipment is delivered
 */
@Controller()
export class ShipmentDeliveredListener {
  private readonly logger = new Logger(ShipmentDeliveredListener.name);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly twilioService: TwilioService,
  ) {}

  @EventPattern(EventTypes.SHIPMENT_DELIVERED_V1)
  async handleShipmentDelivered(@Payload() payload: any): Promise<void> {
    const { data, correlationId, eventId } = payload;
    const eventData = data as ShipmentDeliveredV1Data;

    this.logger.log(`📥 Received ${EventTypes.SHIPMENT_DELIVERED_V1}`, {
      shipmentId: eventData.shipmentId,
      orderId: eventData.orderId,
      correlationId,
      eventId,
    });

    try {
      // Get customer phone - in production, this would come from a user service
      const customerPhone = await this.getCustomerPhone(eventData.customerId);

      if (!customerPhone) {
        this.logger.warn(`Customer ${eventData.customerId} has no phone, skipping SMS notification`);
        return;
      }

      // Generate SMS message
      const smsMessage = this.twilioService.generateDeliveryMessage({
        orderId: eventData.orderId,
        trackingNumber: eventData.trackingNumber,
      });

      // Send notification (with idempotency)
      await this.notificationService.sendNotification({
        orderId: eventData.orderId,
        customerId: eventData.customerId,
        correlationId: correlationId || eventId,
        eventType: EventTypes.SHIPMENT_DELIVERED_V1,
        channel: 'sms',
        recipient: customerPhone,
        content: smsMessage,
      });

      this.logger.log(`✅ Delivery SMS sent for order ${eventData.orderId}`);
    } catch (error) {
      this.logger.error(
        `❌ Error processing shipment delivered event for order ${eventData.orderId}`,
        error instanceof Error ? error.stack : String(error),
      );
      // Don't throw - we don't want to block the event processing
      // The notification is marked as failed in the database
    }
  }

  /**
   * Get customer phone number
   * In production, this should call a user service or query a database
   */
  private async getCustomerPhone(customerId: string): Promise<string | null> {
    // Mock implementation - in production, fetch from user service
    // For now, use a test phone or generate from customerId
    const mockPhone = process.env['TEST_PHONE'] || '+34600000000';
    return mockPhone;
  }
}
