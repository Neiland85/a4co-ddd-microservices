"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
/**
 * BaseService - Clase abstracta que encapsula la lógica común de todos los servicios
 * Implementa el patrón DRY para reducir duplicación de código detectada por SonarQube
 */
class BaseService {
    serviceName;
    constructor(serviceName) {
        this.serviceName = serviceName;
    }
    /**
     * Loguea operaciones de forma consistente
     */
    log(operation, data) {
        console.log(`[${this.serviceName}] ${operation}`, data ? JSON.stringify(data) : '');
    }
    /**
     * Valida datos de entrada comunes
     */
    validateId(id, entityName) {
        if (!id || id.trim() === '') {
            throw new Error(`Invalid ${entityName} ID`);
        }
        return id.trim();
    }
    /**
     * Valida que un valor no sea null o undefined
     */
    validateRequired(value, fieldName) {
        if (value === null || value === undefined) {
            throw new Error(`${fieldName} is required`);
        }
        return value;
    }
    /**
     * Simula una operación asíncrona con retraso (para desarrollo)
     */
    async simulateDelay(ms = 100) {
        if (process.env['NODE_ENV'] === 'development') {
            await new Promise(resolve => setTimeout(resolve, ms));
        }
    }
    /**
     * Maneja errores del servicio de forma consistente
     */
    handleServiceError(error, operation) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        this.log(`Error in ${operation}: ${message}`);
        throw new Error(`${this.serviceName} - ${operation} failed: ${message}`);
    }
    /**
     * Crea una respuesta exitosa estándar
     */
    createSuccessMessage(entity, action, details) {
        const baseMessage = `${entity} ${action} successfully`;
        return details ? `${baseMessage}: ${details}` : `${baseMessage}.`;
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=BaseService.js.map