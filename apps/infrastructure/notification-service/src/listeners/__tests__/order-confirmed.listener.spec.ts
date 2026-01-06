import { Test, TestingModule } from '@nestjs/testing';
import { OrderConfirmedListener } from '../order-confirmed.listener';
import { NotificationService } from '../../services/notification.service';
import { SendGridService } from '../../services/sendgrid.service';
import { EventTypes } from '@a4co/shared-events';

describe('OrderConfirmedListener', () => {
  let listener: OrderConfirmedListener;
  let notificationService: NotificationService;
  let sendGridService: SendGridService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderConfirmedListener],
      providers: [
        {
          provide: NotificationService,
          useValue: {
            sendNotification: jest.fn(),
          },
        },
        {
          provide: SendGridService,
          useValue: {
            generateOrderConfirmationHtml: jest.fn().mockReturnValue('<html>Test</html>'),
          },
        },
      ],
    }).compile();

    listener = module.get<OrderConfirmedListener>(OrderConfirmedListener);
    notificationService = module.get<NotificationService>(NotificationService);
    sendGridService = module.get<SendGridService>(SendGridService);
  });

  it('should handle OrderConfirmedV1 event', async () => {
    const payload = {
      eventId: 'evt-123',
      correlationId: 'corr-123',
      eventType: EventTypes.ORDER_CONFIRMED_V1,
      timestamp: new Date().toISOString(),
      data: {
        orderId: 'order-123',
        customerId: 'customer-123',
        paymentId: 'payment-123',
        totalAmount: 99.99,
        currency: 'EUR',
        confirmedAt: new Date().toISOString(),
      },
    };

    await listener.handleOrderConfirmed(payload);

    expect(sendGridService.generateOrderConfirmationHtml).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: 'order-123',
        totalAmount: 99.99,
        currency: 'EUR',
      }),
    );

    expect(notificationService.sendNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: 'order-123',
        customerId: 'customer-123',
        correlationId: 'corr-123',
        eventType: EventTypes.ORDER_CONFIRMED_V1,
        channel: 'email',
      }),
    );
  });

  it('should handle errors gracefully', async () => {
    const payload = {
      eventId: 'evt-456',
      correlationId: 'corr-456',
      eventType: EventTypes.ORDER_CONFIRMED_V1,
      data: {
        orderId: 'order-456',
        customerId: 'customer-456',
        paymentId: 'payment-456',
        totalAmount: 50.0,
        confirmedAt: new Date().toISOString(),
      },
    };

    (notificationService.sendNotification as jest.Mock).mockRejectedValue(
      new Error('Send failed'),
    );

    // Should not throw - errors are logged but not propagated
    await expect(listener.handleOrderConfirmed(payload)).resolves.not.toThrow();
  });

  it('should use test email from environment', async () => {
    process.env['TEST_EMAIL'] = 'test@example.com';

    const payload = {
      eventId: 'evt-789',
      correlationId: 'corr-789',
      eventType: EventTypes.ORDER_CONFIRMED_V1,
      data: {
        orderId: 'order-789',
        customerId: 'customer-789',
        paymentId: 'payment-789',
        totalAmount: 150.0,
        confirmedAt: new Date().toISOString(),
      },
    };

    await listener.handleOrderConfirmed(payload);

    expect(notificationService.sendNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        recipient: 'test@example.com',
      }),
    );
  });
});
