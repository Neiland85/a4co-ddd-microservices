#!/usr/bin/env node
interface AxiosSecurityIssue {
    file: string;
    line: number;
    issue: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    recommendation: string;
}
declare class AxiosSecurityValidator {
    private issues;
    private secureImports;
    private scanDirectory;
    private shouldSkipDirectory;
    private isTypeScriptFile;
    private validateFile;
    private checkLine;
    private checkFileImports;
    private checkAxiosCreateUsage;
    private isInSecureFile;
    validate(rootPath?: string): AxiosSecurityIssue[];
    generateReport(issues: AxiosSecurityIssue[]): string;
}
export { AxiosSecurityValidator };
export type { AxiosSecurityIssue };
//# sourceMappingURL=validate-axios-security.d.ts.map