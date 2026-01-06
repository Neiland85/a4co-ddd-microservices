import { Test, TestingModule } from '@nestjs/testing';
import { SendGridService } from '../sendgrid.service';

// Mock @sendgrid/mail
jest.mock('@sendgrid/mail', () => ({
  __esModule: true,
  default: {
    setApiKey: jest.fn(),
    send: jest.fn(),
  },
}));

describe('SendGridService', () => {
  let service: SendGridService;
  let sgMail: any;

  beforeEach(async () => {
    // Reset environment
    delete process.env['SENDGRID_API_KEY'];
    process.env['NOTIFICATION_EMAIL'] = 'test@a4co.com';

    // Import the mocked module
    sgMail = require('@sendgrid/mail').default;
    sgMail.send.mockClear();
    sgMail.setApiKey.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [SendGridService],
    }).compile();

    service = module.get<SendGridService>(SendGridService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendEmail', () => {
    it('should send email in mock mode when no API key', async () => {
      const emailData = {
        to: 'customer@example.com',
        subject: 'Test Email',
        text: 'Test content',
        html: '<p>Test content</p>',
      };

      await service.sendEmail(emailData);

      // Should not call SendGrid in mock mode
      expect(sgMail.send).not.toHaveBeenCalled();
    });

    it('should send email via SendGrid when API key is configured', async () => {
      // Set API key
      process.env['SENDGRID_API_KEY'] = 'test-api-key';
      
      // Recreate service with API key
      const module: TestingModule = await Test.createTestingModule({
        providers: [SendGridService],
      }).compile();
      service = module.get<SendGridService>(SendGridService);

      sgMail.send.mockResolvedValue([{ statusCode: 202 }]);

      const emailData = {
        to: 'customer@example.com',
        subject: 'Test Email',
        text: 'Test content',
        html: '<p>Test content</p>',
      };

      await service.sendEmail(emailData);

      expect(sgMail.send).toHaveBeenCalledWith({
        to: emailData.to,
        from: 'test@a4co.com',
        subject: emailData.subject,
        text: emailData.text,
        html: emailData.html,
      });
    });

    it('should retry on failure with exponential backoff', async () => {
      process.env['SENDGRID_API_KEY'] = 'test-api-key';
      
      const module: TestingModule = await Test.createTestingModule({
        providers: [SendGridService],
      }).compile();
      service = module.get<SendGridService>(SendGridService);

      // Mock to fail twice, then succeed
      sgMail.send
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce([{ statusCode: 202 }]);

      const emailData = {
        to: 'customer@example.com',
        subject: 'Test Email',
        text: 'Test content',
        html: '<p>Test content</p>',
      };

      await service.sendEmail(emailData);

      // Should have been called 3 times (initial + 2 retries)
      expect(sgMail.send).toHaveBeenCalledTimes(3);
    }, 10000); // Increase timeout for retries

    it('should throw error after max retries', async () => {
      process.env['SENDGRID_API_KEY'] = 'test-api-key';
      
      const module: TestingModule = await Test.createTestingModule({
        providers: [SendGridService],
      }).compile();
      service = module.get<SendGridService>(SendGridService);

      // Mock to always fail
      sgMail.send.mockRejectedValue(new Error('Network error'));

      const emailData = {
        to: 'customer@example.com',
        subject: 'Test Email',
        text: 'Test content',
        html: '<p>Test content</p>',
      };

      await expect(service.sendEmail(emailData)).rejects.toThrow('Failed to send email after 3 attempts');
      expect(sgMail.send).toHaveBeenCalledTimes(3);
    }, 10000);
  });

  describe('generateOrderConfirmationHtml', () => {
    it('should generate HTML for order confirmation', () => {
      const html = service.generateOrderConfirmationHtml({
        orderId: 'ORD-123',
        customerName: 'John Doe',
        totalAmount: 99.99,
        currency: 'EUR',
      });

      expect(html).toContain('ORD-123');
      expect(html).toContain('John Doe');
      expect(html).toContain('99.99');
      expect(html).toContain('EUR');
      expect(html).toContain('Pedido Confirmado');
    });

    it('should include items in HTML when provided', () => {
      const html = service.generateOrderConfirmationHtml({
        orderId: 'ORD-123',
        customerName: 'John Doe',
        totalAmount: 150.00,
        currency: 'EUR',
        items: [
          { name: 'Product 1', quantity: 2, price: 50.00 },
          { name: 'Product 2', quantity: 1, price: 50.00 },
        ],
      });

      expect(html).toContain('Product 1');
      expect(html).toContain('Product 2');
      expect(html).toContain('50.00');
    });

    it('should use default currency when not provided', () => {
      const html = service.generateOrderConfirmationHtml({
        orderId: 'ORD-123',
        customerName: 'John Doe',
        totalAmount: 99.99,
      });

      expect(html).toContain('EUR'); // Default currency
    });
  });
});
