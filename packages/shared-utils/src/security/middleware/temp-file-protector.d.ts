import { TempFileConfig } from '../validators/temp-file.validator';
export interface TempFileProtectionStats {
    totalOperations: number;
    blockedOperations: number;
    symlinkAttempts: number;
    invalidPathAttempts: number;
    lastBlockedOperation?: {
        path: string;
        reason: string;
        timestamp: Date;
    };
}
export declare class TempFileProtector {
    private config;
    private stats;
    constructor(config?: Partial<TempFileConfig>);
    protect(operation: string, filePath: string, context?: string): boolean;
    createProtectedTempDir(prefix?: string, context?: string): Promise<string>;
    createProtectedTempFile(prefix?: string, suffix?: string, context?: string): Promise<string>;
    getStats(): TempFileProtectionStats;
    resetStats(): void;
    private getUserAgent;
}
//# sourceMappingURL=temp-file-protector.d.ts.map