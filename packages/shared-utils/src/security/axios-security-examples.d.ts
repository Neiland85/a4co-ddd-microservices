import { SecureAxiosClient } from './axios-security';
export declare const createBasicSecureClient: (baseURL: string) => SecureAxiosClient;
export declare const createCriticalApiClient: (baseURL: string) => SecureAxiosClient;
export declare const createExternalServiceClient: (baseURL: string) => SecureAxiosClient;
export declare class SecureChatService {
    private client;
    constructor(baseURL: string);
    sendMessage(message: string, userId: string): Promise<any>;
    getMessages(chatId: string): Promise<any>;
    getSecurityStats(): {
        circuitBreaker: {
            state: import("./axios-security").CircuitState;
            failures: number;
            lastFailureTime: number;
            successCount: number;
        };
        memoryUsage: {
            rss: number;
            heapUsed: number;
            heapTotal: number;
            external: number;
        };
        config: Required<import("./axios-security").AxiosSecurityConfig>;
    };
}
export declare const setupAxiosMonitoring: (client: SecureAxiosClient) => void;
export declare const migrateExistingAxiosUsage: () => void;
export declare const createEnvironmentSpecificClient: (baseURL: string, isProduction: boolean) => SecureAxiosClient;
//# sourceMappingURL=axios-security-examples.d.ts.map