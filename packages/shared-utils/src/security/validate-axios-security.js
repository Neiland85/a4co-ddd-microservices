#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosSecurityValidator = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
class AxiosSecurityValidator {
    constructor() {
        this.issues = [];
        this.secureImports = new Set([
            '@a4co/shared-utils/security/axios-security',
            './axios-security',
            '../axios-security',
        ]);
    }
    scanDirectory(dirPath) {
        const items = (0, fs_1.readdirSync)(dirPath);
        for (const item of items) {
            const fullPath = (0, path_1.join)(dirPath, item);
            const stat = (0, fs_1.statSync)(fullPath);
            if (stat.isDirectory() && !this.shouldSkipDirectory(item)) {
                this.scanDirectory(fullPath);
            }
            else if (stat.isFile() && this.isTypeScriptFile(item)) {
                this.validateFile(fullPath);
            }
        }
    }
    shouldSkipDirectory(dirName) {
        const skipDirs = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage'];
        return skipDirs.includes(dirName);
    }
    isTypeScriptFile(fileName) {
        return ['.ts', '.tsx', '.js', '.jsx'].includes((0, path_1.extname)(fileName));
    }
    validateFile(filePath) {
        try {
            const content = (0, fs_1.readFileSync)(filePath, 'utf-8');
            const lines = content.split('\n');
            lines.forEach((line, index) => {
                this.checkLine(filePath, line, index + 1);
            });
            this.checkFileImports(filePath, content);
            this.checkAxiosCreateUsage(filePath, content);
        }
        catch (error) {
            console.error(`Error reading file ${filePath}:`, error);
        }
    }
    checkLine(filePath, line, lineNumber) {
        if (line.includes('axios.create') && !line.includes('SecureAxiosFactory')) {
            const hasSizeLimits = line.includes('maxContentLength') ||
                line.includes('maxBodyLength') ||
                line.includes('maxResponseSize');
            if (!hasSizeLimits) {
                this.issues.push({
                    file: filePath,
                    line: lineNumber,
                    issue: 'axios.create without size limits',
                    severity: 'HIGH',
                    recommendation: 'Use SecureAxiosFactory.createClient() or add maxContentLength, maxBodyLength, and maxResponseSize limits',
                });
            }
        }
        if (line.includes('timeout:') && !line.includes('SecureAxiosFactory')) {
            const timeoutMatch = line.match(/timeout:\s*(\d+)/);
            if (timeoutMatch) {
                const timeout = parseInt(timeoutMatch[1]);
                if (timeout > 60000) {
                    this.issues.push({
                        file: filePath,
                        line: lineNumber,
                        issue: `Very long timeout: ${timeout}ms`,
                        severity: 'MEDIUM',
                        recommendation: 'Consider reducing timeout to prevent resource exhaustion. Max recommended: 30000ms',
                    });
                }
            }
        }
        if (line.includes("from 'axios'") && !this.isInSecureFile(filePath)) {
            this.issues.push({
                file: filePath,
                line: lineNumber,
                issue: 'Direct axios import without security wrapper',
                severity: 'HIGH',
                recommendation: 'Import from @a4co/shared-utils/security/axios-security instead of axios directly',
            });
        }
    }
    checkFileImports(filePath, content) {
        const hasSecureImport = Array.from(this.secureImports).some(secureImport => content.includes(`from '${secureImport}'`) || content.includes(`from "${secureImport}"`));
        const hasAxiosImport = content.includes("from 'axios'") || content.includes('from "axios"');
        if (hasAxiosImport && !hasSecureImport && !this.isInSecureFile(filePath)) {
            this.issues.push({
                file: filePath,
                line: 1,
                issue: 'File uses axios without security wrapper',
                severity: 'HIGH',
                recommendation: 'Replace axios imports with SecureAxiosFactory from @a4co/shared-utils/security/axios-security',
            });
        }
    }
    checkAxiosCreateUsage(filePath, content) {
        const createMatches = content.match(/axios\.create\(/g);
        if (createMatches && !this.isInSecureFile(filePath)) {
            this.issues.push({
                file: filePath,
                line: 1,
                issue: `File contains ${createMatches.length} axios.create() calls`,
                severity: 'HIGH',
                recommendation: 'Replace axios.create() with SecureAxiosFactory.createClient() for DoS protection',
            });
        }
    }
    isInSecureFile(filePath) {
        return (filePath.includes('/security/') ||
            filePath.includes('axios-security') ||
            filePath.includes('test'));
    }
    validate(rootPath = process.cwd()) {
        console.log('🔍 Scanning for axios security issues...');
        this.scanDirectory(rootPath);
        return this.issues;
    }
    generateReport(issues) {
        if (issues.length === 0) {
            return '✅ No axios security issues found!';
        }
        let report = '[!] Axios Security Issues Found:\n\n';
        const groupedIssues = issues.reduce((groups, issue) => {
            if (!groups[issue.severity])
                groups[issue.severity] = [];
            groups[issue.severity].push(issue);
            return groups;
        }, {});
        ['HIGH', 'MEDIUM', 'LOW'].forEach(severity => {
            if (groupedIssues[severity]) {
                report += `${severity} SEVERITY (${groupedIssues[severity].length} issues):\n`;
                groupedIssues[severity].forEach(issue => {
                    report += `  📁 ${issue.file}:${issue.line}\n`;
                    report += `    ❌ ${issue.issue}\n`;
                    report += `    💡 ${issue.recommendation}\n\n`;
                });
            }
        });
        report += `\nTotal issues: ${issues.length}\n`;
        return report;
    }
}
exports.AxiosSecurityValidator = AxiosSecurityValidator;
function main() {
    const validator = new AxiosSecurityValidator();
    const issues = validator.validate();
    const report = validator.generateReport(issues);
    console.log(report);
    const hasHighSeverity = issues.some(issue => issue.severity === 'HIGH');
    process.exit(hasHighSeverity ? 1 : 0);
}
if (require.main === module) {
    main();
}
//# sourceMappingURL=validate-axios-security.js.map