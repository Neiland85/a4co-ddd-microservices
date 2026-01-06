import { MockEmailProvider } from './email.provider';

describe('EmailProvider', () => {
  let provider: MockEmailProvider;

  beforeEach(() => {
    provider = new MockEmailProvider();
    // Spy on console.log to verify mock behavior
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('MockEmailProvider', () => {
    it('should send mock email successfully', async () => {
      const message = {
        to: ['test@example.com'],
        subject: 'Test Subject',
        text: 'Test message body',
      };

      await provider.send(message);

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('[MOCK] Email to test@example.com')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Test Subject')
      );
    });

    it('should handle multiple recipients', async () => {
      const message = {
        to: ['user1@test.com', 'user2@test.com'],
        subject: 'Multi Recipient Test',
        text: 'Test message',
      };

      await provider.send(message);

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('user1@test.com, user2@test.com')
      );
    });

    it('should handle long messages', async () => {
      const longMessage = 'A'.repeat(200);
      const message = {
        to: ['test@example.com'],
        subject: 'Long Message',
        text: longMessage,
      };

      await provider.send(message);

      expect(console.log).toHaveBeenCalled();
    });
  });
});

