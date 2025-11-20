import { Logger } from '@nestjs/common';
export * from './domain/index';
export * from './security/index';
export type { BaseEntity as BaseEntityInterface, Address, ContactInfo, PaginationParams, PaginatedResponse, ApiResponse, ValidationError, DomainEvent as DomainEventInterface, } from './types/index';
export interface UseCase<TRequest, TResponse> {
    execute(request: TRequest): Promise<TResponse>;
}
export declare abstract class BaseService {
    protected logger: Logger;
    constructor(serviceName: string);
    protected validateRequired(value: any, fieldName: string): any;
    protected log(message: string, context?: any): void;
    protected createSuccessMessage(entity: string, action: string, identifier: string): string;
    protected handleServiceError(error: unknown, operation: string): string;
}
export declare class NatsEventBus {
    private nc;
    private logger;
    private codec;
    connect(url?: string): Promise<void>;
    publish<T>(subject: string, data: T): Promise<void>;
    subscribe<T>(subject: string, handler: (data: T) => Promise<void>): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map