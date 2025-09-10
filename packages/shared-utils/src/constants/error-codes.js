"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMessages = exports.ErrorCodes = void 0;
var ErrorCodes;
(function (ErrorCodes) {
    // Authentication errors
    ErrorCodes["INVALID_CREDENTIALS"] = "AUTH_001";
    ErrorCodes["TOKEN_EXPIRED"] = "AUTH_002";
    ErrorCodes["TOKEN_INVALID"] = "AUTH_003";
    ErrorCodes["UNAUTHORIZED"] = "AUTH_004";
    // Validation errors
    ErrorCodes["VALIDATION_ERROR"] = "VAL_001";
    ErrorCodes["REQUIRED_FIELD_MISSING"] = "VAL_002";
    ErrorCodes["INVALID_FORMAT"] = "VAL_003";
    // Business logic errors
    ErrorCodes["RESOURCE_NOT_FOUND"] = "BIZ_001";
    ErrorCodes["RESOURCE_ALREADY_EXISTS"] = "BIZ_002";
    ErrorCodes["OPERATION_NOT_ALLOWED"] = "BIZ_003";
    // System errors
    ErrorCodes["INTERNAL_SERVER_ERROR"] = "SYS_001";
    ErrorCodes["DATABASE_ERROR"] = "SYS_002";
    ErrorCodes["EXTERNAL_SERVICE_ERROR"] = "SYS_003";
})(ErrorCodes || (exports.ErrorCodes = ErrorCodes = {}));
exports.ErrorMessages = {
    [ErrorCodes.INVALID_CREDENTIALS]: 'Las credenciales proporcionadas no son válidas',
    [ErrorCodes.TOKEN_EXPIRED]: 'El token ha expirado',
    [ErrorCodes.TOKEN_INVALID]: 'El token no es válido',
    [ErrorCodes.UNAUTHORIZED]: 'No autorizado para realizar esta operación',
    [ErrorCodes.VALIDATION_ERROR]: 'Error de validación en los datos',
    [ErrorCodes.REQUIRED_FIELD_MISSING]: 'Campo requerido faltante',
    [ErrorCodes.INVALID_FORMAT]: 'Formato inválido',
    [ErrorCodes.RESOURCE_NOT_FOUND]: 'Recurso no encontrado',
    [ErrorCodes.RESOURCE_ALREADY_EXISTS]: 'El recurso ya existe',
    [ErrorCodes.OPERATION_NOT_ALLOWED]: 'Operación no permitida',
    [ErrorCodes.INTERNAL_SERVER_ERROR]: 'Error interno del servidor',
    [ErrorCodes.DATABASE_ERROR]: 'Error de base de datos',
    [ErrorCodes.EXTERNAL_SERVICE_ERROR]: 'Error del servicio externo',
};
//# sourceMappingURL=error-codes.js.map