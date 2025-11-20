import twilio from 'twilio';

export interface SMSMessage {
  to: string;
  message: string;
}

export interface SMSProvider {
  send(message: SMSMessage): Promise<void>;
}

export class TwilioSMSProvider implements SMSProvider {
  private client: any;

  constructor(
    accountSid: string,
    authToken: string,
    private fromNumber: string,
  ) {
    this.client = twilio(accountSid, authToken);
  }

  async send(message: SMSMessage): Promise<void> {
    await this.client.messages.create({
      body: message.message,
      from: this.fromNumber,
      to: message.to,
    });

    console.log(`📱 SMS sent to ${message.to}`);
  }
}

export class MockSMSProvider implements SMSProvider {
  async send(message: SMSMessage): Promise<void> {
    console.log(`📱 [MOCK] SMS to ${message.to}: ${message.message.substring(0, 50)}...`);
  }
}

export function createSMSProvider(): SMSProvider {
  const accountSid = process.env['TWILIO_ACCOUNT_SID'];
  const authToken = process.env['TWILIO_AUTH_TOKEN'];
  const fromNumber = process.env['TWILIO_PHONE_NUMBER'] || '+1234567890';

  if (accountSid && authToken) {
    console.log('✅ Using Twilio SMS provider');
    return new TwilioSMSProvider(accountSid, authToken, fromNumber);
  }

  console.log('⚠️  Twilio not configured, using mock SMS provider');
  return new MockSMSProvider();
}
