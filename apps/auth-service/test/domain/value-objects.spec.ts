import { Email, Password, UserName } from '../../src/domain/value-objects/user-value-objects';

describe('User Value Objects', () => {
  describe('Email', () => {
    it('should create email with valid format', () => {
      const email = new Email('user@example.com');
      expect(email.value).toBe('user@example.com');
    });

    it('should accept email with subdomain', () => {
      const email = new Email('user@mail.example.com');
      expect(email.value).toBe('user@mail.example.com');
    });

    it('should accept email with plus addressing', () => {
      const email = new Email('user+tag@example.com');
      expect(email.value).toBe('user+tag@example.com');
    });

    it('should accept email with numbers', () => {
      const email = new Email('user123@example123.com');
      expect(email.value).toBe('user123@example123.com');
    });

    it('should throw error for empty email', () => {
      expect(() => new Email('')).toThrow('Email es requerido');
    });

    it('should throw error for null/undefined email', () => {
      expect(() => new Email(null as any)).toThrow('Email es requerido');
      expect(() => new Email(undefined as any)).toThrow('Email es requerido');
    });

    it('should throw error for email without @', () => {
      expect(() => new Email('userexample.com')).toThrow('Formato de email inválido');
    });

    it('should throw error for email without domain', () => {
      expect(() => new Email('user@')).toThrow('Formato de email inválido');
    });

    it('should throw error for email without TLD', () => {
      expect(() => new Email('user@example')).toThrow('Formato de email inválido');
    });

    it('should throw error for email with spaces', () => {
      expect(() => new Email('user @example.com')).toThrow('Formato de email inválido');
      expect(() => new Email('user@ example.com')).toThrow('Formato de email inválido');
    });

    it('should throw error for too long email', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      expect(() => new Email(longEmail)).toThrow('Email demasiado largo');
    });

    it('should be immutable', () => {
      const email = new Email('user@example.com');
      expect(() => {
        (email as any)._value = 'changed@example.com';
      }).not.toThrow();
      expect(email.value).toBe('user@example.com');
    });

    it('should implement equals correctly', () => {
      const email1 = new Email('user@example.com');
      const email2 = new Email('user@example.com');
      const email3 = new Email('other@example.com');

      expect(email1.equals(email2)).toBe(true);
      expect(email1.equals(email3)).toBe(false);
    });

    it('should implement toString correctly', () => {
      const email = new Email('user@example.com');
      expect(email.toString()).toBe('user@example.com');
    });
  });

  describe('Password', () => {
    it('should create password with valid format', () => {
      const testPassword = 'TestPass123';
      const password = new Password(testPassword);
      expect(password.value).toBe(testPassword);
    });

    it('should accept password with special characters', () => {
      const testPassword = 'TestPass123!@#';
      const password = new Password(testPassword);
      expect(password.value).toBe(testPassword);
    });

    it('should accept minimum length password', () => {
      const testPassword = 'Test1234';
      const password = new Password(testPassword);
      expect(password.value).toBe(testPassword);
    });

    it('should throw error for empty password', () => {
      expect(() => new Password('')).toThrow('Password es requerido');
    });

    it('should throw error for null/undefined password', () => {
      expect(() => new Password(null as any)).toThrow('Password es requerido');
      expect(() => new Password(undefined as any)).toThrow('Password es requerido');
    });

    it('should throw error for too short password', () => {
      expect(() => new Password('Sec1')).toThrow('Password debe tener al menos 8 caracteres');
    });

    it('should throw error for too long password', () => {
      const longPassword = 'A1' + 'a'.repeat(100);
      expect(() => new Password(longPassword)).toThrow('Password demasiado largo');
    });

    it('should throw error for password without lowercase', () => {
      expect(() => new Password('TEST123')).toThrow(
        'Password debe contener al menos una minúscula, una mayúscula y un número'
      );
    });

    it('should throw error for password without uppercase', () => {
      expect(() => new Password('test123')).toThrow(
        'Password debe contener al menos una minúscula, una mayúscula y un número'
      );
    });

    it('should throw error for password without numbers', () => {
      expect(() => new Password('TestPass')).toThrow(
        'Password debe contener al menos una minúscula, una mayúscula y un número'
      );
    });

    it('should be immutable', () => {
      const testPassword = 'TestPass123';
      const password = new Password(testPassword);
      expect(() => {
        (password as any)._value = 'ModifiedTest123';
      }).not.toThrow();
      expect(password.value).toBe(testPassword);
    });

    it('should implement equals correctly', () => {
      const testPassword1 = 'TestPass123';
      const testPassword2 = 'TestPass123';
      const testPassword3 = 'DifferentTest123';

      const password1 = new Password(testPassword1);
      const password2 = new Password(testPassword2);
      const password3 = new Password(testPassword3);

      expect(password1.equals(password2)).toBe(true);
      expect(password1.equals(password3)).toBe(false);
    });
  });

  describe('UserName', () => {
    it('should create username with valid format', () => {
      const userName = new UserName('John Doe');
      expect(userName.value).toBe('John Doe');
    });

    it('should accept name with accents', () => {
      const userName = new UserName('José María');
      expect(userName.value).toBe('José María');
    });

    it('should accept name with apostrophe', () => {
      const userName = new UserName("O'Connor");
      expect(userName.value).toBe("O'Connor");
    });

    it('should accept name with hyphen', () => {
      const userName = new UserName('Ana-Lucía');
      expect(userName.value).toBe('Ana-Lucía');
    });

    it('should accept minimum length name', () => {
      const userName = new UserName('Jo');
      expect(userName.value).toBe('Jo');
    });

    it('should throw error for empty name', () => {
      expect(() => new UserName('')).toThrow('Nombre es requerido');
    });

    it('should throw error for null/undefined name', () => {
      expect(() => new UserName(null as any)).toThrow('Nombre es requerido');
      expect(() => new UserName(undefined as any)).toThrow('Nombre es requerido');
    });

    it('should throw error for too short name', () => {
      expect(() => new UserName('J')).toThrow('Nombre debe tener al menos 2 caracteres');
    });

    it('should throw error for too long name', () => {
      const longName = 'a'.repeat(51);
      expect(() => new UserName(longName)).toThrow('Nombre demasiado largo');
    });

    it('should throw error for name with numbers', () => {
      expect(() => new UserName('John123')).toThrow('Nombre contiene caracteres inválidos');
    });

    it('should throw error for name with special characters', () => {
      expect(() => new UserName('John@Doe')).toThrow('Nombre contiene caracteres inválidos');
      expect(() => new UserName('John#Doe')).toThrow('Nombre contiene caracteres inválidos');
      expect(() => new UserName('John$Doe')).toThrow('Nombre contiene caracteres inválidos');
    });

    it('should be immutable', () => {
      const userName = new UserName('John Doe');
      expect(() => {
        (userName as any)._value = 'Jane Doe';
      }).not.toThrow();
      expect(userName.value).toBe('John Doe');
    });

    it('should implement equals correctly', () => {
      const userName1 = new UserName('John Doe');
      const userName2 = new UserName('John Doe');
      const userName3 = new UserName('Jane Doe');

      expect(userName1.equals(userName2)).toBe(true);
      expect(userName1.equals(userName3)).toBe(false);
    });

    it('should implement toString correctly', () => {
      const userName = new UserName('John Doe');
      expect(userName.toString()).toBe('John Doe');
    });
  });
});