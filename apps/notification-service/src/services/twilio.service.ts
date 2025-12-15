import { Injectable, Logger } from '@nestjs/common';
import twilio from 'twilio';

export interface SMSData {
  to: string;
  message: string;
}

@Injectable()
export class TwilioService {
  private readonly logger = new Logger(TwilioService.name);
  private readonly client: any;
  private readonly fromNumber: string;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // Base delay in ms

  constructor() {
    const accountSid = process.env['TWILIO_ACCOUNT_SID'];
    const authToken = process.env['TWILIO_AUTH_TOKEN'];
    this.fromNumber = process.env['TWILIO_PHONE_NUMBER'] || '+1234567890';

    if (accountSid && authToken) {
      this.client = twilio(accountSid, authToken);
      this.logger.log('✅ Twilio configured');
    } else {
      this.logger.warn('⚠️  Twilio credentials not configured, SMS will be mocked');
    }
  }

  /**
   * Send SMS with exponential backoff retry logic
   */
  async sendSMS(smsData: SMSData, attempt = 1): Promise<void> {
    try {
      if (!this.client) {
        // Mock mode for development
        this.logger.log(`📱 [MOCK] SMS sent to ${smsData.to}: ${smsData.message.substring(0, 50)}...`);
        return;
      }

      await this.client.messages.create({
        body: smsData.message,
        from: this.fromNumber,
        to: smsData.to,
      });

      this.logger.log(`📱 SMS sent successfully to ${smsData.to}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send SMS (attempt ${attempt}/${this.maxRetries})`, {
        error: error instanceof Error ? error.message : String(error),
        to: smsData.to,
      });

      // Retry with exponential backoff
      if (attempt < this.maxRetries) {
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        this.logger.warn(`⏳ Retrying in ${delay}ms...`);
        await this.sleep(delay);
        return this.sendSMS(smsData, attempt + 1);
      }

      // Max retries reached
      throw new Error(`Failed to send SMS after ${this.maxRetries} attempts: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generate delivery notification SMS message
   */
  generateDeliveryMessage(data: { orderId: string; trackingNumber?: string }): string {
    const { orderId, trackingNumber } = data;
    
    if (trackingNumber) {
      return `✅ ¡Tu pedido ${orderId} ha sido entregado! Número de seguimiento: ${trackingNumber}. Gracias por tu compra - A4CO`;
    }
    
    return `✅ ¡Tu pedido ${orderId} ha sido entregado! Gracias por tu compra - A4CO`;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
