import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from '../notification.service';
import { SendGridService } from '../sendgrid.service';
import { TwilioService } from '../twilio.service';

// Mock Prisma
const mockPrismaClient = {
  notification: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
}));

describe('NotificationService', () => {
  let service: NotificationService;
  let sendGridService: SendGridService;
  let twilioService: TwilioService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: SendGridService,
          useValue: {
            sendEmail: jest.fn(),
          },
        },
        {
          provide: TwilioService,
          useValue: {
            sendSMS: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    sendGridService = module.get<SendGridService>(SendGridService);
    twilioService = module.get<TwilioService>(TwilioService);
  });

  describe('sendNotification', () => {
    it('should send email notification successfully', async () => {
      mockPrismaClient.notification.findUnique.mockResolvedValue(null);
      mockPrismaClient.notification.create.mockResolvedValue({
        id: 'notif-123',
        orderId: 'order-123',
        customerId: 'customer-123',
        correlationId: 'corr-123',
        eventType: 'order.confirmed.v1',
        channel: 'email',
        recipient: 'test@example.com',
        subject: 'Test',
        content: 'Test content',
        status: 'pending',
        attempts: 0,
      });
      mockPrismaClient.notification.update.mockResolvedValue({});

      const result = await service.sendNotification({
        orderId: 'order-123',
        customerId: 'customer-123',
        correlationId: 'corr-123',
        eventType: 'order.confirmed.v1',
        channel: 'email',
        recipient: 'test@example.com',
        subject: 'Test',
        content: 'Test content',
      });

      expect(result).toBe(true);
      expect(sendGridService.sendEmail).toHaveBeenCalled();
      expect(mockPrismaClient.notification.create).toHaveBeenCalled();
      expect(mockPrismaClient.notification.update).toHaveBeenCalledWith({
        where: { id: 'notif-123' },
        data: expect.objectContaining({
          status: 'sent',
          attempts: 1,
        }),
      });
    });

    it('should send SMS notification successfully', async () => {
      mockPrismaClient.notification.findUnique.mockResolvedValue(null);
      mockPrismaClient.notification.create.mockResolvedValue({
        id: 'notif-456',
        orderId: 'order-123',
        customerId: 'customer-123',
        correlationId: 'corr-456',
        eventType: 'shipment.delivered.v1',
        channel: 'sms',
        recipient: '+34600000000',
        content: 'SMS content',
        status: 'pending',
        attempts: 0,
      });
      mockPrismaClient.notification.update.mockResolvedValue({});

      const result = await service.sendNotification({
        orderId: 'order-123',
        customerId: 'customer-123',
        correlationId: 'corr-456',
        eventType: 'shipment.delivered.v1',
        channel: 'sms',
        recipient: '+34600000000',
        content: 'SMS content',
      });

      expect(result).toBe(true);
      expect(twilioService.sendSMS).toHaveBeenCalled();
      expect(mockPrismaClient.notification.update).toHaveBeenCalledWith({
        where: { id: 'notif-456' },
        data: expect.objectContaining({
          status: 'sent',
        }),
      });
    });

    it('should skip duplicate notifications (idempotency)', async () => {
      mockPrismaClient.notification.findUnique.mockResolvedValue({
        id: 'existing-notif',
        correlationId: 'corr-123',
      });

      const result = await service.sendNotification({
        orderId: 'order-123',
        customerId: 'customer-123',
        correlationId: 'corr-123',
        eventType: 'order.confirmed.v1',
        channel: 'email',
        recipient: 'test@example.com',
        content: 'Test',
      });

      expect(result).toBe(false);
      expect(mockPrismaClient.notification.create).not.toHaveBeenCalled();
      expect(sendGridService.sendEmail).not.toHaveBeenCalled();
    });

    it('should mark notification as failed on error', async () => {
      mockPrismaClient.notification.findUnique.mockResolvedValue(null);
      mockPrismaClient.notification.create.mockResolvedValue({
        id: 'notif-789',
        status: 'pending',
      });
      mockPrismaClient.notification.update.mockResolvedValue({});

      // Mock send to fail
      (sendGridService.sendEmail as jest.Mock).mockRejectedValue(new Error('Send failed'));

      await expect(
        service.sendNotification({
          orderId: 'order-123',
          customerId: 'customer-123',
          correlationId: 'corr-789',
          eventType: 'order.confirmed.v1',
          channel: 'email',
          recipient: 'test@example.com',
          content: 'Test',
        }),
      ).rejects.toThrow('Send failed');

      expect(mockPrismaClient.notification.update).toHaveBeenCalledWith({
        where: { id: 'notif-789' },
        data: expect.objectContaining({
          status: 'failed',
          errorMessage: 'Send failed',
        }),
      });
    });
  });

  describe('getNotificationsByOrderId', () => {
    it('should retrieve notifications for an order', async () => {
      const mockNotifications = [
        { id: 'n1', orderId: 'order-123', channel: 'email', status: 'sent' },
        { id: 'n2', orderId: 'order-123', channel: 'sms', status: 'sent' },
      ];

      mockPrismaClient.notification.findMany.mockResolvedValue(mockNotifications);
      mockPrismaClient.notification.count.mockResolvedValue(2);

      const result = await service.getNotificationsByOrderId('order-123');

      expect(result.data).toEqual(mockNotifications);
      expect(result.total).toBe(2);
      expect(mockPrismaClient.notification.findMany).toHaveBeenCalledWith({
        where: { orderId: 'order-123' },
        orderBy: { createdAt: 'desc' },
        take: 10,
        skip: 0,
      });
    });

    it('should filter by channel', async () => {
      mockPrismaClient.notification.findMany.mockResolvedValue([]);
      mockPrismaClient.notification.count.mockResolvedValue(0);

      await service.getNotificationsByOrderId('order-123', { channel: 'email' });

      expect(mockPrismaClient.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ channel: 'email' }),
        }),
      );
    });

    it('should filter by status', async () => {
      mockPrismaClient.notification.findMany.mockResolvedValue([]);
      mockPrismaClient.notification.count.mockResolvedValue(0);

      await service.getNotificationsByOrderId('order-123', { status: 'failed' });

      expect(mockPrismaClient.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'failed' }),
        }),
      );
    });

    it('should support pagination', async () => {
      mockPrismaClient.notification.findMany.mockResolvedValue([]);
      mockPrismaClient.notification.count.mockResolvedValue(100);

      await service.getNotificationsByOrderId('order-123', { limit: 20, offset: 40 });

      expect(mockPrismaClient.notification.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 20,
          skip: 40,
        }),
      );
    });
  });

  describe('getStats', () => {
    it('should return statistics', async () => {
      mockPrismaClient.notification.count
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(80) // sent
        .mockResolvedValueOnce(15) // failed
        .mockResolvedValueOnce(5); // pending

      const stats = await service.getStats();

      expect(stats).toEqual({
        total: 100,
        sent: 80,
        failed: 15,
        pending: 5,
        successRate: '80.00%',
      });
    });

    it('should handle zero notifications', async () => {
      mockPrismaClient.notification.count.mockResolvedValue(0);

      const stats = await service.getStats();

      expect(stats.successRate).toBe('0%');
    });
  });
});
