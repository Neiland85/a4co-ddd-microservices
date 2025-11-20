import { SecureAxiosFactory } from './axios-security';
export declare const getUser: (id: string) => Promise<import("axios").AxiosResponse<any, any, {}>>;
export declare const createUser: (userData: any) => Promise<import("axios").AxiosResponse<any, any, {}>>;
export declare class SecureUserService {
    private api;
    constructor(baseURL: string);
    getUserProfile(userId: string): Promise<any>;
    updateUserProfile(userId: string, profileData: any): Promise<any>;
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
export declare const createEnvironmentApiClient: (baseURL: string, environment: "development" | "production") => import("./axios-security").SecureAxiosClient;
export declare const migrationExamples: {
    step1: {
        before: string;
        after: string;
    };
    step2: {
        before: string;
        after: string;
    };
    step3: {
        before: string;
        after: string;
    };
    step4: {
        monitoring: string;
    };
};
export declare const validateMigration: () => Promise<boolean>;
export declare const setupProductionMonitoring: (apiClient: ReturnType<typeof SecureAxiosFactory.createClient>) => void;
//# sourceMappingURL=axios-migration-guide.d.ts.map