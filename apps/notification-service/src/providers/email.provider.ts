import sgMail from '@sendgrid/mail';

export interface EmailMessage {
  to: string[];
  subject: string;
  text: string;
  html?: string;
}

export interface EmailProvider {
  send(message: EmailMessage): Promise<void>;
}

export class SendGridEmailProvider implements EmailProvider {
  constructor(private apiKey: string, private fromEmail: string) {
    sgMail.setApiKey(apiKey);
  }

  async send(message: EmailMessage): Promise<void> {
    const msg = {
      to: message.to,
      from: this.fromEmail,
      subject: message.subject,
      text: message.text,
      html: message.html || message.text,
    };

    await sgMail.send(msg);
    console.log(`📧 Email sent to ${message.to.join(', ')}: ${message.subject}`);
  }
}

export class MockEmailProvider implements EmailProvider {
  async send(message: EmailMessage): Promise<void> {
    console.log(`📧 [MOCK] Email to ${message.to.join(', ')}: ${message.subject}`);
    console.log(`   Content: ${message.text.substring(0, 100)}...`);
  }
}

export function createEmailProvider(): EmailProvider {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromEmail = process.env.NOTIFICATION_EMAIL || 'noreply@a4co.com';

  if (apiKey) {
    console.log('✅ Using SendGrid email provider');
    return new SendGridEmailProvider(apiKey, fromEmail);
  }

  console.log('⚠️  SendGrid not configured, using mock email provider');
  return new MockEmailProvider();
}

