import pino from 'pino';
export interface LoggerConfig {
    serviceName: string;
    serviceVersion?: string;
    environment?: string;
    level?: string;
    prettyPrint?: boolean;
}
export declare function createLogger(config: LoggerConfig): pino.Logger;
export declare function createHttpLogger(logger: pino.Logger): import("pino-http").HttpLogger<import("http").IncomingMessage, import("http").ServerResponse<import("http").IncomingMessage>, never>;
export declare function getGlobalLogger(): pino.Logger;
export declare function initializeLogger(config: LoggerConfig): pino.Logger;
//# sourceMappingURL=logging.d.ts.map