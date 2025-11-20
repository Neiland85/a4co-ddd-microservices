export declare enum ErrorCodes {
    INVALID_CREDENTIALS = "AUTH_001",
    TOKEN_EXPIRED = "AUTH_002",
    TOKEN_INVALID = "AUTH_003",
    UNAUTHORIZED = "AUTH_004",
    VALIDATION_ERROR = "VAL_001",
    REQUIRED_FIELD_MISSING = "VAL_002",
    INVALID_FORMAT = "VAL_003",
    RESOURCE_NOT_FOUND = "BIZ_001",
    RESOURCE_ALREADY_EXISTS = "BIZ_002",
    OPERATION_NOT_ALLOWED = "BIZ_003",
    INTERNAL_SERVER_ERROR = "SYS_001",
    DATABASE_ERROR = "SYS_002",
    EXTERNAL_SERVICE_ERROR = "SYS_003"
}
export declare const ErrorMessages: {
    AUTH_001: string;
    AUTH_002: string;
    AUTH_003: string;
    AUTH_004: string;
    VAL_001: string;
    VAL_002: string;
    VAL_003: string;
    BIZ_001: string;
    BIZ_002: string;
    BIZ_003: string;
    SYS_001: string;
    SYS_002: string;
    SYS_003: string;
};
//# sourceMappingURL=error-codes.d.ts.map