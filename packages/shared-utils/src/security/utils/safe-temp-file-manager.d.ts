import { TempFileConfig } from '../validators/temp-file.validator';
export interface SafeTempFileOptions {
    prefix?: string;
    suffix?: string;
    mode?: string | number;
    maxSize?: number;
    autoCleanup?: boolean;
    validateSymlinks?: boolean;
}
export declare class SafeTempFileManager {
    private protector;
    private config;
    private activeFiles;
    private activeDirs;
    constructor(config?: Partial<TempFileConfig>);
    createTempDir(options?: SafeTempFileOptions): Promise<string>;
    createTempFile(options?: SafeTempFileOptions): Promise<string>;
    writeTempFile(filePath: string, data: string | Buffer, options?: SafeTempFileOptions): Promise<void>;
    readTempFile(filePath: string): Promise<Buffer>;
    removeTempPath(filePath: string): Promise<void>;
    cleanup(): Promise<void>;
    getStats(): import("../middleware/temp-file-protector").TempFileProtectionStats;
    private setupCleanupHandlers;
}
//# sourceMappingURL=safe-temp-file-manager.d.ts.map