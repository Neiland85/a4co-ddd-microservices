import { Logger } from '@nestjs/common';

/**
 * Base service class for all services
 * Provides common functionality like logging, validation, error handling
 */
export abstract class BaseService {
    protected logger: Logger;

    constructor(private serviceName: string) {
        this.logger = new Logger(serviceName);
    }

    protected log(message: string, context?: any): void {
        this.logger.log(message, context);
    }

    protected validateRequired(value: any, fieldName: string): any {
        if (!value) {
            throw new Error(`${fieldName} is required`);
        }
        return value;
    }

    protected createSuccessMessage(entity: string, action: string, id?: string): string {
        if (id) {
            return `${entity} ${id} ${action}.`;
        }
        return `${entity} ${action}.`;
    } protected handleServiceError(error: any, context: string): never {
        this.logger.error(`Error in ${context}:`, error);
        throw error;
    }
}
