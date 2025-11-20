export declare class SecureTarHandler {
    private readonly allowedExtensions;
    private readonly maxFileSize;
    private readonly maxPathLength;
    private readonly dangerousPaths;
    validateTarFile(filePath: string): Promise<{
        isValid: boolean;
        errors: string[];
        warnings: string[];
    }>;
    extractSecurely(tarPath: string, targetDir: string, options?: {
        createSandbox?: boolean;
        user?: string;
        validateChecksum?: boolean;
        checksumFile?: string;
    }): Promise<{
        success: boolean;
        extractedFiles: string[];
        errors: string[];
    }>;
    private createSandboxDirectory;
    private buildSecureExtractCommand;
    private isDangerousPath;
    validateChecksum(filePath: string, expectedChecksum: string, algorithm?: 'sha256' | 'sha512'): Promise<boolean>;
    monitorFileChanges(watchPaths: string[], callback: (changedFiles: string[]) => void): Promise<() => void>;
}
export declare class TarSecurityMiddleware {
    private secureHandler;
    beforeExtract(tarPath: string, targetDir: string): Promise<void>;
    afterExtract(extractedFiles: string[]): Promise<void>;
    private isDangerousFile;
}
export declare const secureTarHandler: SecureTarHandler;
export declare const tarSecurityMiddleware: TarSecurityMiddleware;
//# sourceMappingURL=tar-security.d.ts.map