import 'reflect-metadata';

// Configuraciones globales para los tests
jest.setTimeout(30000);

// Mock global para bcryptjs
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
}));

// Mock global para uuid
jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('test-uuid-1234'),
}));

// Mock para el módulo shared-utils si es necesario
jest.mock('@shared/index', () => ({
  BaseEntity: class BaseEntity {
    public readonly id: string;
    public readonly createdAt: Date;
    public updatedAt: Date;

    constructor(id?: string) {
      this.id = id || 'test-id';
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }

    protected touch(): void {
      this.updatedAt = new Date();
    }
  },
  AggregateRoot: class AggregateRoot {
    private _domainEvents: any[] = [];
    public readonly id: string;
    public readonly createdAt: Date;
    public updatedAt: Date;

    constructor(id?: string) {
      this.id = id || 'test-id';
      this.createdAt = new Date();
      this.updatedAt = new Date();
    }

    protected addDomainEvent(event: any): void {
      this._domainEvents.push(event);
    }

    protected touch(): void {
      this.updatedAt = new Date();
    }
  },
  BaseDto: class BaseDto {},
  UseCase: jest.fn(),
}));
