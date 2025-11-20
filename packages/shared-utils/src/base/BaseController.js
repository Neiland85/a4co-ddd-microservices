"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
class BaseController {
    constructor(ServiceClass) {
        this.service = new ServiceClass();
    }
    handleError(error) {
        if (error instanceof Error) {
            return { error: error.message, code: 400 };
        }
        return { error: 'Internal server error', code: 500 };
    }
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