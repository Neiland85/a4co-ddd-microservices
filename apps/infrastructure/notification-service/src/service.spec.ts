import { NotificationService } from './service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    service = new NotificationService();
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('sendNotification', () => {
    it('should queue notification successfully', async () => {
      await service.sendNotification({
        type: 'email',
        priority: 'high',
        title: 'Test Notification',
        message: 'Test message',
        recipients: ['test@example.com'],
        channels: ['email'],
        data: {},
      });

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('Notificación agregada a la cola')
      );
    });

    it('should handle different notification types', async () => {
      const types: Array<'email' | 'sms' | 'push' | 'slack' | 'security_alert'> = [
        'email',
        'sms',
        'push',
        'slack',
        'security_alert',
      ];

      for (const type of types) {
        await service.sendNotification({
          type,
          priority: 'medium',
          title: `${type} test`,
          message: 'Test message',
          recipients: ['recipient@test.com'],
          channels: [type === 'security_alert' ? 'email' : type],
          data: {},
        });
      }

      expect(console.log).toHaveBeenCalledTimes(types.length);
    });

    it('should handle different priorities', async () => {
      const priorities: Array<'low' | 'medium' | 'high' | 'critical'> = [
        'low',
        'medium',
        'high',
        'critical',
      ];

      for (const priority of priorities) {
        await service.sendNotification({
          type: 'email',
          priority,
          title: `Priority ${priority}`,
          message: 'Test message',
          recipients: ['test@example.com'],
          channels: ['email'],
          data: {},
        });
      }

      expect(console.log).toHaveBeenCalledTimes(priorities.length);
    });

    it('should handle multiple channels', async () => {
      await service.sendNotification({
        type: 'email',
        priority: 'high',
        title: 'Multi-channel test',
        message: 'Test message',
        recipients: ['test@example.com'],
        channels: ['email', 'sms', 'slack'],
        data: { orderId: '123' },
      });

      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('getNotificationStats', () => {
    it('should return empty stats initially', () => {
      const stats = service.getNotificationStats();

      expect(stats).toEqual({
        total: 0,
        sent: 0,
        failed: 0,
        byPriority: {},
        byChannel: {},
      });
    });

    it('should track notification statistics', async () => {
      await service.sendNotification({
        type: 'email',
        priority: 'high',
        title: 'Test 1',
        message: 'Message',
        recipients: ['test@example.com'],
        channels: ['email'],
        data: {},
      });

      await service.sendNotification({
        type: 'sms',
        priority: 'medium',
        title: 'Test 2',
        message: 'Message',
        recipients: ['+1234567890'],
        channels: ['sms'],
        data: {},
      });

      // Give time for queue processing
      await new Promise(resolve => setTimeout(resolve, 100));

      const stats = service.getNotificationStats();

      expect(stats.total).toBeGreaterThanOrEqual(2);
      expect(stats.byPriority).toHaveProperty('high');
      expect(stats.byPriority).toHaveProperty('medium');
    });
  });

  describe('Legacy methods', () => {
    it('should support legacy sendNotificationLegacy', () => {
      const result = service.sendNotificationLegacy('user-123', 'Test message');

      expect(result).toContain('user-123');
      expect(result).toContain('Test message');
    });

    it('should support legacy getNotificationsLegacy', () => {
      const notifications = service.getNotificationsLegacy('user-123');

      expect(notifications).toBeInstanceOf(Array);
      expect(notifications.length).toBeGreaterThan(0);
    });
  });
});

