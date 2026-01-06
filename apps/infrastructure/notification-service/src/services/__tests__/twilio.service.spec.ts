import { Test, TestingModule } from '@nestjs/testing';
import { TwilioService } from '../twilio.service';

// Mock twilio
jest.mock('twilio', () => {
  return jest.fn(() => ({
    messages: {
      create: jest.fn(),
    },
  }));
});

describe('TwilioService', () => {
  let service: TwilioService;
  let mockTwilio: any;

  beforeEach(async () => {
    // Reset environment
    delete process.env['TWILIO_ACCOUNT_SID'];
    delete process.env['TWILIO_AUTH_TOKEN'];
    process.env['TWILIO_PHONE_NUMBER'] = '+1234567890';

    // Clear the mock
    jest.clearAllMocks();
    mockTwilio = require('twilio');

    const module: TestingModule = await Test.createTestingModule({
      providers: [TwilioService],
    }).compile();

    service = module.get<TwilioService>(TwilioService);
  });

  describe('sendSMS', () => {
    it('should send SMS in mock mode when no credentials', async () => {
      const smsData = {
        to: '+34600000000',
        message: 'Test SMS message',
      };

      await service.sendSMS(smsData);

      // Should not call Twilio in mock mode
      expect(mockTwilio).not.toHaveBeenCalled();
    });

    it('should send SMS via Twilio when credentials are configured', async () => {
      // Set credentials
      process.env['TWILIO_ACCOUNT_SID'] = 'test-sid';
      process.env['TWILIO_AUTH_TOKEN'] = 'test-token';

      const mockCreate = jest.fn().mockResolvedValue({ sid: 'SMS123' });
      mockTwilio.mockReturnValue({
        messages: { create: mockCreate },
      });

      // Recreate service with credentials
      const module: TestingModule = await Test.createTestingModule({
        providers: [TwilioService],
      }).compile();
      service = module.get<TwilioService>(TwilioService);

      const smsData = {
        to: '+34600000000',
        message: 'Test SMS message',
      };

      await service.sendSMS(smsData);

      expect(mockCreate).toHaveBeenCalledWith({
        body: smsData.message,
        from: '+1234567890',
        to: smsData.to,
      });
    });

    it('should retry on failure with exponential backoff', async () => {
      process.env['TWILIO_ACCOUNT_SID'] = 'test-sid';
      process.env['TWILIO_AUTH_TOKEN'] = 'test-token';

      const mockCreate = jest.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({ sid: 'SMS123' });

      mockTwilio.mockReturnValue({
        messages: { create: mockCreate },
      });

      const module: TestingModule = await Test.createTestingModule({
        providers: [TwilioService],
      }).compile();
      service = module.get<TwilioService>(TwilioService);

      const smsData = {
        to: '+34600000000',
        message: 'Test SMS message',
      };

      await service.sendSMS(smsData);

      // Should have been called 3 times (initial + 2 retries)
      expect(mockCreate).toHaveBeenCalledTimes(3);
    }, 10000);

    it('should throw error after max retries', async () => {
      process.env['TWILIO_ACCOUNT_SID'] = 'test-sid';
      process.env['TWILIO_AUTH_TOKEN'] = 'test-token';

      const mockCreate = jest.fn().mockRejectedValue(new Error('Network error'));
      mockTwilio.mockReturnValue({
        messages: { create: mockCreate },
      });

      const module: TestingModule = await Test.createTestingModule({
        providers: [TwilioService],
      }).compile();
      service = module.get<TwilioService>(TwilioService);

      const smsData = {
        to: '+34600000000',
        message: 'Test SMS message',
      };

      await expect(service.sendSMS(smsData)).rejects.toThrow('Failed to send SMS after 3 attempts');
      expect(mockCreate).toHaveBeenCalledTimes(3);
    }, 10000);
  });

  describe('generateDeliveryMessage', () => {
    it('should generate delivery message with tracking number', () => {
      const message = service.generateDeliveryMessage({
        orderId: 'ORD-123',
        trackingNumber: 'TRK-456',
      });

      expect(message).toContain('ORD-123');
      expect(message).toContain('TRK-456');
      expect(message).toContain('entregado');
    });

    it('should generate delivery message without tracking number', () => {
      const message = service.generateDeliveryMessage({
        orderId: 'ORD-123',
      });

      expect(message).toContain('ORD-123');
      expect(message).toContain('entregado');
      expect(message).not.toContain('seguimiento');
    });
  });
});
