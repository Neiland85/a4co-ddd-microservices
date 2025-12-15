import { Test, TestingModule } from '@nestjs/testing';
import { ShipmentDeliveredListener } from '../shipment-delivered.listener';
import { NotificationService } from '../../services/notification.service';
import { TwilioService } from '../../services/twilio.service';
import { EventTypes } from '@a4co/shared-events';

describe('ShipmentDeliveredListener', () => {
  let listener: ShipmentDeliveredListener;
  let notificationService: NotificationService;
  let twilioService: TwilioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShipmentDeliveredListener],
      providers: [
        {
          provide: NotificationService,
          useValue: {
            sendNotification: jest.fn(),
          },
        },
        {
          provide: TwilioService,
          useValue: {
            generateDeliveryMessage: jest.fn().mockReturnValue('Test SMS message'),
          },
        },
      ],
    }).compile();

    listener = module.get<ShipmentDeliveredListener>(ShipmentDeliveredListener);
    notificationService = module.get<NotificationService>(NotificationService);
    twilioService = module.get<TwilioService>(TwilioService);
  });

  it('should handle ShipmentDeliveredV1 event', async () => {
    const payload = {
      eventId: 'evt-123',
      correlationId: 'corr-123',
      eventType: EventTypes.SHIPMENT_DELIVERED_V1,
      timestamp: new Date().toISOString(),
      data: {
        shipmentId: 'ship-123',
        orderId: 'order-123',
        customerId: 'customer-123',
        trackingNumber: 'TRK-456',
        deliveredAt: new Date().toISOString(),
      },
    };

    await listener.handleShipmentDelivered(payload);

    expect(twilioService.generateDeliveryMessage).toHaveBeenCalledWith({
      orderId: 'order-123',
      trackingNumber: 'TRK-456',
    });

    expect(notificationService.sendNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        orderId: 'order-123',
        customerId: 'customer-123',
        correlationId: 'corr-123',
        eventType: EventTypes.SHIPMENT_DELIVERED_V1,
        channel: 'sms',
        content: 'Test SMS message',
      }),
    );
  });

  it('should handle errors gracefully', async () => {
    const payload = {
      eventId: 'evt-456',
      correlationId: 'corr-456',
      eventType: EventTypes.SHIPMENT_DELIVERED_V1,
      data: {
        shipmentId: 'ship-456',
        orderId: 'order-456',
        customerId: 'customer-456',
        deliveredAt: new Date().toISOString(),
      },
    };

    (notificationService.sendNotification as jest.Mock).mockRejectedValue(
      new Error('Send failed'),
    );

    // Should not throw - errors are logged but not propagated
    await expect(listener.handleShipmentDelivered(payload)).resolves.not.toThrow();
  });

  it('should use test phone from environment', async () => {
    process.env['TEST_PHONE'] = '+34611111111';

    const payload = {
      eventId: 'evt-789',
      correlationId: 'corr-789',
      eventType: EventTypes.SHIPMENT_DELIVERED_V1,
      data: {
        shipmentId: 'ship-789',
        orderId: 'order-789',
        customerId: 'customer-789',
        deliveredAt: new Date().toISOString(),
      },
    };

    await listener.handleShipmentDelivered(payload);

    expect(notificationService.sendNotification).toHaveBeenCalledWith(
      expect.objectContaining({
        recipient: '+34611111111',
      }),
    );
  });
});
