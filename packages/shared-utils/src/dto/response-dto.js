"use strict";
// DTOs de respuesta comunes
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaginatedResponse = exports.createErrorResponse = exports.createSuccessResponse = void 0;
// Factories para crear respuestas
const createSuccessResponse = (data, message = '') => ({
    success: true,
    data,
    message,
    timestamp: new Date(),
});
exports.createSuccessResponse = createSuccessResponse;
const createErrorResponse = (code, message, details) => ({
    success: false,
    error: { code, message, details },
    timestamp: new Date(),
});
exports.createErrorResponse = createErrorResponse;
const createPaginatedResponse = (data, page, limit, total) => ({
    success: true,
    data,
    pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
    },
    timestamp: new Date(),
});
exports.createPaginatedResponse = createPaginatedResponse;
//# sourceMappingURL=response-dto.js.map