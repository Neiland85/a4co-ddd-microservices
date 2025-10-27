interface Request {
    body: any;
    query: any;
    params: any;
}
interface Response {
    status(code: number): Response;
    json(data: any): Response;
}
interface NextFunction {
    (): void;
}
export declare class BracesSecurityMiddleware {
    private validator;
    private monitor;
    constructor(config?: any, serviceName?: string);
    validateRequestBody(fieldsToCheck?: string[]): (req: Request, res: Response, next: NextFunction) => Promise<void>;
    validateQueryParams(paramsToCheck?: string[]): (req: Request, res: Response, next: NextFunction) => Promise<void>;
    private extractFieldValue;
}
export declare class BracesSanitizer {
    private validator;
    constructor();
    sanitizeExpression(expression: string): Promise<{
        sanitized: string;
        wasModified: boolean;
        issues: string[];
    }>;
    isSafeForLogging(expression: string): Promise<boolean>;
}
export declare class BracesMonitoringService {
    private validator;
    private alerts;
    private stats;
    constructor();
    recordValidation(expression: string, source: string): Promise<void>;
    getSecurityStats(): {
        recentAlerts: any[];
        alertRate: number;
        totalValidations: number;
        blockedExpressions: number;
        alertsTriggered: number;
    };
    clearOldAlerts(maxAgeMs?: number): void;
}
export declare function createBracesSecurityMiddleware(config?: any): BracesSecurityMiddleware;
export declare function createBracesSanitizer(): BracesSanitizer;
export declare function createBracesMonitoringService(): BracesMonitoringService;
export declare const commonBracesMiddlewares: {
    searchApi: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    commandApi: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    configApi: (req: Request, res: Response, next: NextFunction) => Promise<void>;
};
export {};
