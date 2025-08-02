import { User, UserStatus } from '../../src/domain/aggregates/user.aggregate';
import { Email, Password, UserName } from '../../src/domain/value-objects/user-value-objects';
import {
  UserRegisteredEvent,
  UserLoginEvent,
  UserPasswordChangedEvent,
} from '../../src/domain/events/user-events';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt for testing
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123'),
}));

describe('User Aggregate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedBcrypt.hash.mockResolvedValue('hashedPassword123');
    mockedBcrypt.compare.mockResolvedValue(true);
  });

  describe('Factory Methods', () => {
    describe('create', () => {
      it('should create a new user with valid data', async () => {
        const user = await User.create('user@example.com', 'John Doe', 'SecurePass123');

        expect(user.email).toBe('user@example.com');
        expect(user.name).toBe('John Doe');
        expect(user.status).toBe(UserStatus.ACTIVE);
        expect(user.emailVerified).toBe(false);
        expect(user.hashedPassword).toBe('hashedPassword123');
        expect(mockedBcrypt.hash).toHaveBeenCalledWith('SecurePass123', 12);
      });

      it('should create user with provided id', async () => {
        const customId = 'custom-user-id';
        const user = await User.create('user@example.com', 'John Doe', 'SecurePass123', customId);

        expect(user.id).toBe(customId);
      });

      it('should generate id if not provided', async () => {
        const user = await User.create('user@example.com', 'John Doe', 'SecurePass123');

        expect(user.id).toBe('test-uuid-123');
      });

      it('should emit UserRegisteredEvent', async () => {
        const user = await User.create('user@example.com', 'John Doe', 'SecurePass123');

        const events = user.getDomainEvents();
        expect(events).toHaveLength(1);
        expect(events[0]).toBeInstanceOf(UserRegisteredEvent);
        
        const event = events[0] as UserRegisteredEvent;
        expect(event.aggregateId).toBe(user.id);
        expect(event.eventData.email).toBe('user@example.com');
        expect(event.eventData.name).toBe('John Doe');
      });

      it('should throw error for invalid email', async () => {
        await expect(
          User.create('invalid-email', 'John Doe', 'SecurePass123')
        ).rejects.toThrow('Formato de email inválido');
      });

      it('should throw error for invalid name', async () => {
        await expect(
          User.create('user@example.com', 'J', 'SecurePass123')
        ).rejects.toThrow('Nombre debe tener al menos 2 caracteres');
      });

      it('should throw error for invalid password', async () => {
        await expect(
          User.create('user@example.com', 'John Doe', 'weak')
        ).rejects.toThrow('Password debe tener al menos 8 caracteres');
      });
    });

    describe('createWithHashedPassword', () => {
      it('should create user with pre-hashed password', async () => {
        const user = await User.createWithHashedPassword(
          'user@example.com',
          'John Doe',
          'preHashedPassword123'
        );

        expect(user.email).toBe('user@example.com');
        expect(user.name).toBe('John Doe');
        expect(user.hashedPassword).toBe('preHashedPassword123');
        expect(mockedBcrypt.hash).not.toHaveBeenCalled();
      });

      it('should emit UserRegisteredEvent', async () => {
        const user = await User.createWithHashedPassword(
          'user@example.com',
          'John Doe',
          'preHashedPassword123'
        );

        const events = user.getDomainEvents();
        expect(events).toHaveLength(1);
        expect(events[0]).toBeInstanceOf(UserRegisteredEvent);
      });
    });

    describe('reconstruct', () => {
      it('should reconstruct user from persistence data', () => {
        const userData = {
          id: 'existing-user-id',
          email: 'existing@example.com',
          name: 'Existing User',
          hashedPassword: 'existingHashedPassword',
          status: UserStatus.ACTIVE,
          emailVerified: true,
          lastLoginAt: new Date('2023-01-01'),
          createdAt: new Date('2023-01-01'),
          updatedAt: new Date('2023-01-02'),
        };

        const user = User.reconstruct(
          { id: userData.id, email: userData.email, name: userData.name },
          { hashedPassword: userData.hashedPassword, status: userData.status, emailVerified: userData.emailVerified },
          { lastLoginAt: userData.lastLoginAt, createdAt: userData.createdAt, updatedAt: userData.updatedAt },
          userData
        );

        expect(user.id).toBe('existing-user-id');
        expect(user.email).toBe('existing@example.com');
        expect(user.name).toBe('Existing User');
        expect(user.status).toBe(UserStatus.ACTIVE);
        expect(user.emailVerified).toBe(true);
        expect(user.lastLoginAt).toEqual(new Date('2023-01-01'));
      });

      it('should not emit domain events when reconstructing', () => {
        const userData = {
          id: 'existing-user-id',
          email: 'existing@example.com',
          name: 'Existing User',
          hashedPassword: 'existingHashedPassword',
          status: UserStatus.ACTIVE,
          emailVerified: true,
        };

        const user = User.reconstruct(
          { id: userData.id, email: userData.email, name: userData.name },
          { hashedPassword: userData.hashedPassword, status: userData.status, emailVerified: userData.emailVerified },
          {},
          userData
        );

        expect(user.getDomainEvents()).toHaveLength(0);
      });
    });
  });

  describe('Getters', () => {
    let user: User;

    beforeEach(async () => {
      user = await User.create('user@example.com', 'John Doe', 'SecurePass123');
    });

    it('should return correct email', () => {
      expect(user.email).toBe('user@example.com');
    });

    it('should return correct name', () => {
      expect(user.name).toBe('John Doe');
    });

    it('should return correct status', () => {
      expect(user.status).toBe(UserStatus.ACTIVE);
    });

    it('should return correct email verification status', () => {
      expect(user.emailVerified).toBe(false);
    });

    it('should return correct hashed password', () => {
      expect(user.hashedPassword).toBe('hashedPassword123');
    });

    it('should return undefined for lastLoginAt initially', () => {
      expect(user.lastLoginAt).toBeUndefined();
    });
  });

  describe('Business Methods', () => {
    let user: User;

    beforeEach(async () => {
      user = await User.create('user@example.com', 'John Doe', 'SecurePass123');
      user.clearDomainEvents(); // Clear registration event for cleaner tests
    });

    describe('validatePassword', () => {
      it('should return true for correct password', async () => {
        mockedBcrypt.compare.mockResolvedValue(true);

        const isValid = await user.validatePassword('SecurePass123');

        expect(isValid).toBe(true);
        expect(mockedBcrypt.compare).toHaveBeenCalledWith('SecurePass123', 'hashedPassword123');
      });

      it('should return false for incorrect password', async () => {
        mockedBcrypt.compare.mockResolvedValue(false);

        const isValid = await user.validatePassword('WrongPassword');

        expect(isValid).toBe(false);
        expect(mockedBcrypt.compare).toHaveBeenCalledWith('WrongPassword', 'hashedPassword123');
      });
    });

    describe('recordLogin', () => {
      it('should update lastLoginAt timestamp', () => {
        const beforeLogin = new Date();
        user.recordLogin();
        const afterLogin = new Date();

        expect(user.lastLoginAt).toBeDefined();
        expect(user.lastLoginAt!.getTime()).toBeGreaterThanOrEqual(beforeLogin.getTime());
        expect(user.lastLoginAt!.getTime()).toBeLessThanOrEqual(afterLogin.getTime());
      });

      it('should emit UserLoginEvent', () => {
        user.recordLogin('192.168.1.1', 'Mozilla/5.0');

        const events = user.getDomainEvents();
        expect(events).toHaveLength(1);
        expect(events[0]).toBeInstanceOf(UserLoginEvent);
        
        const event = events[0] as UserLoginEvent;
        expect(event.aggregateId).toBe(user.id);
        expect(event.eventData.email).toBe('user@example.com');
        expect(event.eventData.ip).toBe('192.168.1.1');
        expect(event.eventData.userAgent).toBe('Mozilla/5.0');
      });

      it('should emit UserLoginEvent without optional parameters', () => {
        user.recordLogin();

        const events = user.getDomainEvents();
        expect(events).toHaveLength(1);
        
        const event = events[0] as UserLoginEvent;
        expect(event.eventData.ip).toBeUndefined();
        expect(event.eventData.userAgent).toBeUndefined();
      });
    });

    describe('changePassword', () => {
      beforeEach(() => {
        mockedBcrypt.hash.mockResolvedValue('newHashedPassword123');
      });

      it('should change password with valid current password', async () => {
        mockedBcrypt.compare.mockResolvedValue(true);

        await user.changePassword('SecurePass123', 'NewSecurePass456', 'admin-user-id');

        expect(user.hashedPassword).toBe('newHashedPassword123');
        expect(mockedBcrypt.compare).toHaveBeenCalledWith('SecurePass123', 'hashedPassword123');
        expect(mockedBcrypt.hash).toHaveBeenCalledWith('NewSecurePass456', 12);
      });

      it('should emit UserPasswordChangedEvent', async () => {
        mockedBcrypt.compare.mockResolvedValue(true);

        await user.changePassword('SecurePass123', 'NewSecurePass456', 'admin-user-id');

        const events = user.getDomainEvents();
        expect(events).toHaveLength(1);
        expect(events[0]).toBeInstanceOf(UserPasswordChangedEvent);
        
        const event = events[0] as UserPasswordChangedEvent;
        expect(event.aggregateId).toBe(user.id);
        expect(event.eventData.changedBy).toBe('admin-user-id');
      });

      it('should throw error for invalid current password', async () => {
        mockedBcrypt.compare.mockResolvedValue(false);

        await expect(
          user.changePassword('WrongPassword', 'NewSecurePass456', 'admin-user-id')
        ).rejects.toThrow('Password actual incorrecto');

        expect(user.hashedPassword).toBe('hashedPassword123'); // Should not change
      });

      it('should throw error for invalid new password', async () => {
        mockedBcrypt.compare.mockResolvedValue(true);

        await expect(
          user.changePassword('SecurePass123', 'weak', 'admin-user-id')
        ).rejects.toThrow('Password debe tener al menos 8 caracteres');

        expect(user.hashedPassword).toBe('hashedPassword123'); // Should not change
      });
    });
  });

  describe('Domain Events', () => {
    it('should manage domain events correctly', async () => {
      const user = await User.create('user@example.com', 'John Doe', 'SecurePass123');

      // Initially has registration event
      expect(user.getDomainEvents()).toHaveLength(1);

      // Clear events
      user.clearDomainEvents();
      expect(user.getDomainEvents()).toHaveLength(0);

      // Add new event
      user.recordLogin();
      expect(user.getDomainEvents()).toHaveLength(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle user with different statuses', () => {
      const userData = {
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        hashedPassword: 'hashedPassword',
        status: UserStatus.SUSPENDED,
        emailVerified: false,
      };

      const user = User.reconstruct(
        { id: userData.id, email: userData.email, name: userData.name },
        { hashedPassword: userData.hashedPassword, status: userData.status, emailVerified: userData.emailVerified },
        {},
        userData
      );

      expect(user.status).toBe(UserStatus.SUSPENDED);
    });

    it('should handle user with verified email', () => {
      const userData = {
        id: 'test-id',
        email: 'test@example.com',
        name: 'Test User',
        hashedPassword: 'hashedPassword',
        status: UserStatus.ACTIVE,
        emailVerified: true,
      };

      const user = User.reconstruct(
        { id: userData.id, email: userData.email, name: userData.name },
        { hashedPassword: userData.hashedPassword, status: userData.status, emailVerified: userData.emailVerified },
        {},
        userData
      );

      expect(user.emailVerified).toBe(true);
    });
  });
});