export interface PushMessage {
  token: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}

export interface PushProvider {
  send(message: PushMessage): Promise<void>;
}

export class MockPushProvider implements PushProvider {
  async send(message: PushMessage): Promise<void> {
    console.log(`🔔 [MOCK] Push to ${message.token.substring(0, 20)}...`);
    console.log(`   Title: ${message.title}`);
    console.log(`   Body: ${message.body.substring(0, 50)}...`);
  }
}

export function createPushProvider(): PushProvider {
  // Firebase Admin SDK configuration would go here
  console.log('⚠️  Push notifications using mock provider');
  return new MockPushProvider();
}

