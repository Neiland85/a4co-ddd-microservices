"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    constructor(serviceName) {
        this.serviceName = serviceName;
    }
    log(operation, data) {
        console.log(`[${this.serviceName}] ${operation}`, data ? JSON.stringify(data) : '');
    }
    validateId(id, entityName) {
        if (!id || id.trim() === '') {
            throw new Error(`Invalid ${entityName} ID`);
        }
        return id.trim();
    }
    validateRequired(value, fieldName) {
        if (value === null || value === undefined) {
            throw new Error(`${fieldName} is required`);
        }
        return value;
    }
    async simulateDelay(ms = 100) {
        if (process.env['NODE_ENV'] === 'development') {
            await new Promise(resolve => setTimeout(resolve, ms));
        }
    }
    handleServiceError(error, operation) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        this.log(`Error in ${operation}: ${message}`);
        throw new Error(`${this.serviceName} - ${operation} failed: ${message}`);
    }
    createSuccessMessage(entity, action, details) {
        const baseMessage = `${entity} ${action} successfully`;
        return details ? `${baseMessage}: ${details}` : `${baseMessage}.`;
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=BaseService.js.map