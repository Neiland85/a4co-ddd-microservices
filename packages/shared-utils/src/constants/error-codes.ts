export enum ErrorCodes {
  // Authentication errors
  INVALID_CREDENTIALS = 'AUTH_001',
  TOKEN_EXPIRED = 'AUTH_002',
  TOKEN_INVALID = 'AUTH_003',
  UNAUTHORIZED = 'AUTH_004',

  // Validation errors
  VALIDATION_ERROR = 'VAL_001',
  REQUIRED_FIELD_MISSING = 'VAL_002',
  INVALID_FORMAT = 'VAL_003',

  // Business logic errors
  RESOURCE_NOT_FOUND = 'BIZ_001',
  RESOURCE_ALREADY_EXISTS = 'BIZ_002',
  OPERATION_NOT_ALLOWED = 'BIZ_003',

  // System errors
  INTERNAL_SERVER_ERROR = 'SYS_001',
  DATABASE_ERROR = 'SYS_002',
  EXTERNAL_SERVICE_ERROR = 'SYS_003',
}

export const ErrorMessages = {
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
