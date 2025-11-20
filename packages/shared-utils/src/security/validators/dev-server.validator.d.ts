export interface DevServerConfig {
    host?: string;
    port?: number;
    cors?: string[] | boolean;
    headers?: Record<string, string>;
}
export declare class DevServerValidator {
    private readonly ALLOWED_HOSTS;
    private readonly ALLOWED_PORTS;
    validateHostConfig(host: string): boolean;
    validatePortConfig(port: number): boolean;
    validateCorsConfig(cors: string[] | boolean): boolean;
    validateConfig(config: DevServerConfig): {
        isValid: boolean;
        errors: string[];
    };
}
//# sourceMappingURL=dev-server.validator.d.ts.map