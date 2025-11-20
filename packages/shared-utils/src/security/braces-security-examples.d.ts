import { BracesSecurityValidator } from './braces-security';
export declare function basicValidationExample(): Promise<void>;
export declare function customConfigurationExample(): {
    strictValidator: BracesSecurityValidator;
    permissiveValidator: BracesSecurityValidator;
};
export declare function secureShellExecutionExample(): Promise<void>;
export declare function monitoringExample(): BracesSecurityValidator;
export declare class SecureCommandProcessor {
    private validator;
    constructor();
    processUserCommand(command: string): Promise<{
        allowed: boolean;
        result?: string;
        error?: string;
    }>;
    getSecurityStats(): {
        config: import("./braces-security").BracesSecurityConfig;
    };
}
export declare function attackPreventionExample(): Promise<void>;
export declare const environmentConfigs: {
    development: {
        maxExpansionSize: number;
        maxRangeSize: number;
        monitoringEnabled: boolean;
        alertThresholds: {
            expansionSize: number;
            processingTime: number;
            memoryUsage: number;
        };
    };
    staging: {
        maxExpansionSize: number;
        maxRangeSize: number;
        monitoringEnabled: boolean;
        alertThresholds: {
            expansionSize: number;
            processingTime: number;
            memoryUsage: number;
        };
    };
    production: {
        maxExpansionSize: number;
        maxRangeSize: number;
        monitoringEnabled: boolean;
        alertThresholds: {
            expansionSize: number;
            processingTime: number;
            memoryUsage: number;
        };
    };
};
export declare function createEnvironmentValidator(environment: keyof typeof environmentConfigs): BracesSecurityValidator;
export declare function runAllExamples(): Promise<void>;
//# sourceMappingURL=braces-security-examples.d.ts.map