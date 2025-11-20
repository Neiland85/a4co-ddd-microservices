import { connect, JSONCodec, NatsConnection } from 'nats';
import { Logger } from '@nestjs/common';

export * from './domain/index';
export * from './security/index';
// Exportar tipos específicos para evitar conflictos de nombres
export type {
  BaseEntity as BaseEntityInterface,
  Address,
  ContactInfo,
  PaginationParams,
  PaginatedResponse,
  ApiResponse,
  ValidationError,
  DomainEvent as DomainEventInterface,
} from './types/index';

// Base interfaces and classes
export interface UseCase<TRequest, TResponse> {
  execute(request: TRequest): Promise<TResponse>;
}

export abstract class BaseService {
  protected logger: Logger;

  constructor(serviceName: string) {
    this.logger = new Logger(serviceName);
  }

  protected validateRequired(value: any, fieldName: string): any {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      throw new Error(`${fieldName} is required`);
    }
    return value;
  }

  protected log(message: string, context?: any): void {
    this.logger.log(message, context);
  }

  protected createSuccessMessage(entity: string, action: string, identifier: string): string {
    return `${entity} ${action} successfully: ${identifier}`;
  }

  protected handleServiceError(error: unknown, operation: string): string {
    const message = error instanceof Error ? error.message : 'Unknown error';
    this.logger.error(`Error in ${operation}: ${message}`, error);
    return `Error in ${operation}: ${message}`;
  }
}

export class NatsEventBus {
  private nc: NatsConnection;
  private logger = new Logger('NatsEventBus');
  private codec = JSONCodec();

  async connect(url: string = 'nats://localhost:4222') {
    this.nc = await connect({ servers: url });
    this.logger.log(`✅ Conectado a NATS en ${url}`);
  }

  async publish<T>(subject: string, data: T) {
    if (!this.nc) await this.connect();
    this.nc.publish(subject, this.codec.encode(data));
    this.logger.log(`📤 Evento publicado → ${subject}`);
  }

  async subscribe<T>(subject: string, handler: (data: T) => Promise<void>) {
    if (!this.nc) await this.connect();
    const sub = this.nc.subscribe(subject);
    for await (const msg of sub) {
      const decoded = this.codec.decode(msg.data) as T;
      this.logger.log(`📥 Evento recibido → ${subject}`);
      await handler(decoded);
    }
  }
}
