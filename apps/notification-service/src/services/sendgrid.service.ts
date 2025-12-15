import { Injectable, Logger } from '@nestjs/common';
import sgMail from '@sendgrid/mail';

export interface EmailData {
  to: string;
  subject: string;
  text: string;
  html: string;
}

@Injectable()
export class SendGridService {
  private readonly logger = new Logger(SendGridService.name);
  private readonly fromEmail: string;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // Base delay in ms

  constructor() {
    const apiKey = process.env['SENDGRID_API_KEY'];
    this.fromEmail = process.env['NOTIFICATION_EMAIL'] || 'noreply@a4co.com';

    if (apiKey) {
      sgMail.setApiKey(apiKey);
      this.logger.log('✅ SendGrid configured');
    } else {
      this.logger.warn('⚠️  SendGrid API key not configured, emails will fail');
    }
  }

  /**
   * Send email with exponential backoff retry logic
   */
  async sendEmail(emailData: EmailData, attempt = 1): Promise<void> {
    try {
      if (!process.env['SENDGRID_API_KEY']) {
        // Mock mode for development
        this.logger.log(`📧 [MOCK] Email sent to ${emailData.to}: ${emailData.subject}`);
        return;
      }

      const msg = {
        to: emailData.to,
        from: this.fromEmail,
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html,
      };

      await sgMail.send(msg);
      this.logger.log(`📧 Email sent successfully to ${emailData.to}: ${emailData.subject}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send email (attempt ${attempt}/${this.maxRetries})`, {
        error: error instanceof Error ? error.message : String(error),
        to: emailData.to,
        subject: emailData.subject,
      });

      // Retry with exponential backoff
      if (attempt < this.maxRetries) {
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        this.logger.warn(`⏳ Retrying in ${delay}ms...`);
        await this.sleep(delay);
        return this.sendEmail(emailData, attempt + 1);
      }

      // Max retries reached
      throw new Error(`Failed to send email after ${this.maxRetries} attempts: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generate order confirmation email HTML
   */
  generateOrderConfirmationHtml(data: {
    orderId: string;
    customerName: string;
    totalAmount: number;
    currency?: string;
    items?: Array<{ name: string; quantity: number; price: number }>;
  }): string {
    const { orderId, customerName, totalAmount, currency = 'EUR', items = [] } = data;

    const itemsHtml = items
      .map(
        item => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.price.toFixed(2)} ${currency}</td>
        </tr>
      `,
      )
      .join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">✅ Pedido Confirmado</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 18px; margin-top: 0;">Hola <strong>${customerName}</strong>,</p>
            
            <p>¡Tu pedido ha sido confirmado y estamos procesándolo! Aquí están los detalles:</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <p style="margin: 0 0 10px 0;"><strong>Número de pedido:</strong> ${orderId}</p>
              <p style="margin: 0;"><strong>Total:</strong> <span style="font-size: 24px; color: #667eea;">${totalAmount.toFixed(2)} ${currency}</span></p>
            </div>

            ${items.length > 0 ? `
              <h3 style="color: #667eea; margin-top: 30px;">Artículos del pedido:</h3>
              <table style="width: 100%; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <thead>
                  <tr style="background: #667eea; color: white;">
                    <th style="padding: 12px; text-align: left;">Artículo</th>
                    <th style="padding: 12px; text-align: center;">Cantidad</th>
                    <th style="padding: 12px; text-align: right;">Precio</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
            ` : ''}
            
            <div style="background: #e3f2fd; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0;"><strong>📦 Próximos pasos:</strong></p>
              <p style="margin: 10px 0 0 0;">Prepararemos tu pedido y te enviaremos un correo cuando se envíe con el número de seguimiento.</p>
            </div>
            
            <p style="margin-top: 30px; color: #666; font-size: 14px; text-align: center;">
              Gracias por tu compra. Si tienes alguna pregunta, no dudes en contactarnos.
            </p>
          </div>
        </body>
      </html>
    `;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
