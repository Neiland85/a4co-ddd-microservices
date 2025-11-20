export interface PathValidationResult {
    isValid: boolean;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    issues: string[];
    recommendations: string[];
    normalizedPath: string;
    isSensitive: boolean;
}
export interface StaticFileConfig {
    allowedExtensions: string[];
    sensitiveDirectories: string[];
    sensitiveFiles: string[];
    allowHtmlFiles: boolean;
    allowDotFiles: boolean;
}
export declare class ViteStaticPathValidator {
    private static readonly DEFAULT_CONFIG;
    static validatePath(path: string, config?: Partial<StaticFileConfig>): PathValidationResult;
    static validatePaths(paths: string[], config?: Partial<StaticFileConfig>): PathValidationResult[];
    static sanitizePath(path: string): string;
    private static safeResolvePath;
    private static resolvePath;
    static shouldBlockPath(path: string, config?: Partial<StaticFileConfig>): boolean;
    private static normalizePath;
    private static hasDirectoryTraversal;
    private static isSensitiveDirectory;
    private static isSensitiveFile;
    private static getFileExtension;
    private static isDotFile;
    private static hasSuspiciousPatterns;
    private static assessRiskLevel;
}
//# sourceMappingURL=vite-static-path.validator.d.ts.map