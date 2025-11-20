export interface TempFileValidationResult {
    isValid: boolean;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    issues: string[];
    recommendations: string[];
    normalizedPath: string;
    isSymlink: boolean;
    targetPath?: string;
}
export interface TempFileConfig {
    allowedTempDirs: string[];
    maxTempFileSize: number;
    allowSymlinks: boolean;
    validateParentDirs: boolean;
}
export declare class TempFileValidator {
    private static readonly DEFAULT_CONFIG;
    static validateTempPath(filePath: string, config?: Partial<TempFileConfig>): TempFileValidationResult;
    static validateTempPaths(paths: string[], config?: Partial<TempFileConfig>): TempFileValidationResult[];
    static shouldBlockTempOperation(filePath: string, config?: Partial<TempFileConfig>): boolean;
    static sanitizeTempPath(filePath: string): string;
    private static hasSuspiciousPatterns;
    private static assessRiskLevel;
}
//# sourceMappingURL=temp-file.validator.d.ts.map