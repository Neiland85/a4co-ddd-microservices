export declare abstract class BaseService {
    protected readonly serviceName: string;
    constructor(serviceName: string);
    protected log(operation: string, data?: unknown): void;
    protected validateId(id: string | undefined, entityName: string): string;
    protected validateRequired<T>(value: T | null | undefined, fieldName: string): T;
    protected simulateDelay(ms?: number): Promise<void>;
    protected handleServiceError(error: unknown, operation: string): never;
    protected createSuccessMessage(entity: string, action: string, details?: string): string;
}
//# sourceMappingURL=BaseService.d.ts.map