"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
/**
 * BaseController - Clase abstracta que encapsula la lógica común de todos los controllers
 * Implementa el patrón DRY para reducir duplicación de código detectada por SonarQube
 */
class BaseController {
    service;
    constructor(ServiceClass) {
        this.service = new ServiceClass();
    }
    /**
     * Maneja errores de forma consistente en todos los controllers
     */
    handleError(error) {
        if (error instanceof Error) {
            return { error: error.message, code: 400 };
        }
        return { error: 'Internal server error', code: 500 };
    }
    /**
     * Valida parámetros de entrada de forma consistente
     */
    validateRequest(request, requiredFields) {
        if (!request || typeof request !== 'object') {
            throw new Error('Invalid request format');
        }
        const req = request;
        for (const field of requiredFields) {
            if (!(field in req)) {
                throw new Error(`Missing required field: ${String(field)}`);
            }
        }
        return request;
    }
    /**
     * Envuelve las respuestas en un formato consistente
     */
    formatResponse(data, status = 'success') {
        return {
            status,
            data,
            timestamp: new Date().toISOString(),
        };
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=BaseController.js.map