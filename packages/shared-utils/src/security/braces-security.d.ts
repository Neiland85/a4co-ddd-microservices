import { ExecOptions, SpawnOptions } from 'child_process';
export interface BracesSecurityConfig {
    maxExpansionSize?: number;
    maxRangeSize?: number;
    maxBraceDepth?: number;
    timeoutMs?: number;
    maxMemoryMB?: number;
    maxCpuPercent?: number;
    allowedPatterns?: RegExp[];
    blockedPatterns?: RegExp[];
    monitoringEnabled?: boolean;
    alertThresholds?: {
        expansionSize: number;
        processingTime: number;
        memoryUsage: number;
    };
}
export interface BracesExpansionStats {
    originalLength: number;
    expandedLength: number;
    expansionRatio: number;
    processingTime: number;
    memoryUsage: number;
    cpuUsage: number;
    braceCount: number;
    rangeCount: number;
    maxRangeSize: number;
}
export interface BracesValidationResult {
    isValid: boolean;
    isSafe: boolean;
    issues: string[];
    stats: BracesExpansionStats;
    recommendedAction: 'allow' | 'block' | 'limit' | 'monitor';
}
export declare class BracesSecurityValidator {
    private config;
    private eventEmitter;
    constructor(config?: BracesSecurityConfig);
    validateExpression(expression: string): Promise<BracesValidationResult>;
    private analyzeExpression;
    private getBraceDepth;
    maskSensitiveData(expression: string): string;
    private createEmptyStats;
    on(event: 'securityAlert', listener: (alert: any) => void): void;
    getConfig(): BracesSecurityConfig;
    updateConfig(newConfig: Partial<BracesSecurityConfig>): void;
}
export declare class SecureShellExecutor {
    private validator;
    private activeProcesses;
    constructor(securityConfig?: BracesSecurityConfig);
    executeSecure(command: string, options?: ExecOptions): Promise<{
        stdout: string;
        stderr: string;
    }>;
    spawnSecure(command: string, args: string[], options?: SpawnOptions): Promise<number>;
    getActiveProcesses(): {
        runningTime: number;
        startTime: number;
        command: string;
        pid: number;
    }[];
    killLongRunningProcesses(maxAgeMs?: number): number;
}
export declare class BracesSecurityFactory {
    static createValidator(config?: BracesSecurityConfig): BracesSecurityValidator;
    static createShellExecutor(config?: BracesSecurityConfig): SecureShellExecutor;
    static createDefaultConfig(): BracesSecurityConfig;
}
export declare const bracesSecurityFactory: typeof BracesSecurityFactory;
//# sourceMappingURL=braces-security.d.ts.map