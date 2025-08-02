import { Email, Password, UserName } from '../../src/domain/value-objects/user-value-objects';

// Test data constants
const VALID_EMAILS = [
  'user@example.com',
  'user@mail.example.com',
  'user+tag@example.com',
  'user123@example123.com'
];

const INVALID_EMAILS = [
  { value: '', error: 'Email es requerido' },
  { value: null, error: 'Email es requerido' },
  { value: undefined, error: 'Email es requerido' },
  { value: 'userexample.com', error: 'Formato de email inválido' },
  { value: 'user@', error: 'Formato de email inválido' },
  { value: 'user@example', error: 'Formato de email inválido' },
  { value: 'user @example.com', error: 'Formato de email inválido' },
  { value: 'user@ example.com', error: 'Formato de email inválido' },
  { value: 'a'.repeat(250) + '@example.com', error: 'Email demasiado largo' }
];

const VALID_PASSWORDS = [
  'TestPassword123',
  'TestPassword123!@#',
  'TestPassword456'
];

const INVALID_PASSWORDS = [
  { value: '', error: 'Password es requerido' },
  { value: null, error: 'Password es requerido' },
  { value: undefined, error: 'Password es requerido' },
  { value: 'Sec1', error: 'Password debe tener al menos 8 caracteres' },
  { value: 'A1' + 'a'.repeat(100), error: 'Password demasiado largo' },
  { value: 'TEST123', error: 'Password debe contener al menos una minúscula, una mayúscula y un número' },
  { value: 'test123', error: 'Password debe contener al menos una minúscula, una mayúscula y un número' },
  { value: 'TestPass', error: 'Password debe contener al menos una minúscula, una mayúscula y un número' }
];

const VALID_NAMES = [
  'John Doe',
  'José María',
  "O'Connor",
  'Ana-Lucía',
  'Jo'
];

const INVALID_NAMES = [
  { value: '', error: 'Nombre es requerido' },
  { value: null, error: 'Nombre es requerido' },
  { value: undefined, error: 'Nombre es requerido' },
  { value: 'J', error: 'Nombre debe tener al menos 2 caracteres' },
  { value: 'a'.repeat(51), error: 'Nombre demasiado largo' },
  { value: 'John123', error: 'Nombre contiene caracteres inválidos' },
  { value: 'John@Doe', error: 'Nombre contiene caracteres inválidos' },
  { value: 'John#Doe', error: 'Nombre contiene caracteres inválidos' },
  { value: 'John$Doe', error: 'Nombre contiene caracteres inválidos' }
];

// Helper function
const getValueDescription = (value: any): string => {
  if (value === '') return 'empty';
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  return `"${value}"`;
};

describe('Email Value Object', () => {
  // Valid email tests
  VALID_EMAILS.forEach(value => {
    it(`should create email with "${value}"`, () => {
      const instance = new Email(value);
      expect(instance.value).toBe(value);
    });
  });

  // Invalid email tests
  INVALID_EMAILS.forEach(({ value, error }) => {
    it(`debería lanzar un error para ${getValueDescription(value)}`, () => {
      // Forzamos el valor a string o null para evitar el error de tipo
      expect(() => new Email(value as any)).toThrow(error);
    });
  });

  // Behavior tests
  let instance: any;
  let instance2: any;
  let differentInstance: any;

  beforeEach(() => {
    instance = new Email('user@example.com');
    instance2 = new Email('user@example.com');
    differentInstance = new Email('different@example.com');
  });

  it('should be immutable', () => {
    expect(() => {
      instance._value = 'changed';
    }).not.toThrow();
    expect(instance.value).toBe('user@example.com');
  });

  it('should implement equals correctly', () => {
    expect(instance.equals(instance2)).toBe(true);
    expect(instance.equals(differentInstance)).toBe(false);
  });

  it('should implement toString correctly', () => {
    expect(instance.toString()).toBe('user@example.com');
  });
});

describe('Password Value Object', () => {
  // Valid password tests
  VALID_PASSWORDS.forEach(value => {
    it(`should create password with "${value}"`, () => {
      const instance = new Password(value);
      expect(instance.value).toBe(value);
    });
  });

  // Invalid password tests
  INVALID_PASSWORDS.forEach(({ value, error }) => {
    it(`debería lanzar un error para ${getValueDescription(value)}`, () => {
      // Forzamos el valor a string o null para evitar el error de tipo
      expect(() => new Password(value as any)).toThrow(error);
    });
  });

  // Behavior tests
  let instance: any;
  let instance2: any;
  let differentInstance: any;

  beforeEach(() => {
    instance = new Password('TestPassword123');
    instance2 = new Password('TestPassword123');
    differentInstance = new Password('DifferentTestPassword123');
  });

  it('should be immutable', () => {
    expect(() => {
      instance._value = 'changed';
    }).not.toThrow();
    expect(instance.value).toBe('TestPassword123');
  });

  it('should implement equals correctly', () => {
    expect(instance.equals(instance2)).toBe(true);
    expect(instance.equals(differentInstance)).toBe(false);
  });

  it('should implement toString correctly', () => {
    expect(instance.toString()).toBe('TestPassword123');
  });
});

describe('UserName Value Object', () => {
  // Valid name tests
  VALID_NAMES.forEach(value => {
    it(`should create name with "${value}"`, () => {
      const instance = new UserName(value);
      expect(instance.value).toBe(value);
    });
  });

  // Invalid name tests
  INVALID_NAMES.forEach(({ value, error }) => {
    it(`debería lanzar un error para ${getValueDescription(value)}`, () => {
      // Forzamos el valor a string o null para evitar el error de tipo
      expect(() => new UserName(value as any)).toThrow(error);
    });
  });

  // Behavior tests
  let instance: any;
  let instance2: any;
  let differentInstance: any;

  beforeEach(() => {
    instance = new UserName('John Doe');
    instance2 = new UserName('John Doe');
    differentInstance = new UserName('Jane Doe');
  });

  it('should be immutable', () => {
    expect(() => {
      instance._value = 'changed';
    }).not.toThrow();
    expect(instance.value).toBe('John Doe');
  });

  it('should implement equals correctly', () => {
    expect(instance.equals(instance2)).toBe(true);
    expect(instance.equals(differentInstance)).toBe(false);
  });

  it('should implement toString correctly', () => {
    expect(instance.toString()).toBe('John Doe');
  });
});