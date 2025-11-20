#!/usr/bin/env node
interface BracesSecurityIssue {
    file: string;
    line: number;
    expression: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    issue: string;
    recommendation: string;
    stats: any;
}
declare class BracesSecurityScanner {
    private validator;
    private issues;
    private scannedFiles;
    private expressionsFound;
    constructor();
    private scanDirectory;
    private shouldSkipDirectory;
    private shouldScanFile;
    private scanFile;
    private analyzeLine;
    scan(rootPath?: string): Promise<BracesSecurityIssue[]>;
    generateReport(issues: BracesSecurityIssue[]): string;
    getScanStats(): {
        scannedFiles: number;
        expressionsFound: number;
        issuesFound: number;
        issuesBySeverity: Record<string, number>;
    };
}
export { BracesSecurityScanner };
export type { BracesSecurityIssue };
//# sourceMappingURL=validate-braces-security.d.ts.map