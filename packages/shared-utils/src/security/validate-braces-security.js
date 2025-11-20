#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BracesSecurityScanner = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const braces_security_1 = require("./braces-security");
class BracesSecurityScanner {
    constructor() {
        this.issues = [];
        this.scannedFiles = 0;
        this.expressionsFound = 0;
        this.validator = braces_security_1.BracesSecurityFactory.createValidator({
            maxExpansionSize: 100,
            maxRangeSize: 20,
            monitoringEnabled: false,
        });
    }
    scanDirectory(dirPath) {
        try {
            const items = (0, fs_1.readdirSync)(dirPath);
            for (const item of items) {
                const fullPath = (0, path_1.join)(dirPath, item);
                try {
                    const stat = (0, fs_1.statSync)(fullPath);
                    if (stat.isDirectory() && !this.shouldSkipDirectory(item)) {
                        this.scanDirectory(fullPath);
                    }
                    else if (stat.isFile() && this.shouldScanFile(item)) {
                        this.scanFile(fullPath);
                        this.scannedFiles++;
                    }
                }
                catch (error) {
                    continue;
                }
            }
        }
        catch (error) {
            return;
        }
    }
    shouldSkipDirectory(dirName) {
        const skipDirs = [
            'node_modules',
            '.git',
            'dist',
            'build',
            'coverage',
            '.next',
            '.nuxt',
            'target',
            '.gradle',
            '__pycache__',
            '.pytest_cache',
        ];
        return skipDirs.includes(dirName);
    }
    shouldScanFile(fileName) {
        const scanExtensions = [
            '.sh',
            '.bash',
            '.zsh',
            '.js',
            '.ts',
            '.jsx',
            '.tsx',
            '.py',
            '.rb',
            '.php',
            '.java',
            '.yml',
            '.yaml',
            '.json',
            '.md',
            '.txt',
        ];
        const ext = (0, path_1.extname)(fileName);
        return (scanExtensions.includes(ext) ||
            fileName.includes('Dockerfile') ||
            fileName.includes('Makefile'));
    }
    async scanFile(filePath) {
        try {
            const content = (0, fs_1.readFileSync)(filePath, 'utf-8');
            const lines = content.split('\n');
            const relativePath = (0, path_1.relative)(process.cwd(), filePath);
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line !== undefined) {
                    await this.analyzeLine(relativePath, line, i + 1);
                }
            }
        }
        catch (error) {
            return;
        }
    }
    async analyzeLine(filePath, line, lineNumber) {
        const braceRegex = /\{[^}]+\}/g;
        let match;
        while ((match = braceRegex.exec(line)) !== null) {
            const expression = match[0];
            this.expressionsFound++;
            try {
                const validation = await this.validator.validateExpression(expression);
                if (!validation.isSafe || validation.recommendedAction === 'block') {
                    let severity = 'LOW';
                    let issue = 'Potentially unsafe brace expression';
                    let recommendation = 'Review and consider sanitizing this expression';
                    if (validation.stats.maxRangeSize > 1000) {
                        severity = 'CRITICAL';
                        issue = 'Massive range expansion detected';
                        recommendation = 'Replace with safe iteration or remove entirely';
                    }
                    else if (validation.stats.maxRangeSize > 100) {
                        severity = 'HIGH';
                        issue = 'Large range expansion detected';
                        recommendation = 'Consider reducing range size or using safe alternatives';
                    }
                    else if (validation.stats.expandedLength > 100) {
                        severity = 'MEDIUM';
                        issue = 'Significant expansion detected';
                        recommendation = 'Verify this expansion is necessary and safe';
                    }
                    else if (validation.issues.length > 0) {
                        severity = 'MEDIUM';
                        issue = validation.issues[0] || 'Unknown issue';
                    }
                    this.issues.push({
                        file: filePath,
                        line: lineNumber,
                        expression: expression,
                        severity,
                        issue,
                        recommendation,
                        stats: validation.stats,
                    });
                }
            }
            catch (error) {
                this.issues.push({
                    file: filePath,
                    line: lineNumber,
                    expression: expression,
                    severity: 'MEDIUM',
                    issue: 'Failed to analyze brace expression',
                    recommendation: 'Manual review required',
                    stats: {},
                });
            }
        }
    }
    async scan(rootPath = process.cwd()) {
        console.log('🔍 Scanning for dangerous brace expressions...');
        console.log(`Root path: ${rootPath}\n`);
        const startTime = Date.now();
        this.scanDirectory(rootPath);
        const scanTime = Date.now() - startTime;
        console.log(`📊 Scan completed in ${scanTime}ms`);
        console.log(`📁 Files scanned: ${this.scannedFiles}`);
        console.log(`🔍 Expressions found: ${this.expressionsFound}`);
        return this.issues;
    }
    generateReport(issues) {
        if (issues.length === 0) {
            return '✅ No dangerous brace expressions found!';
        }
        let report = '[!] Dangerous Brace Expressions Found:\n\n';
        const groupedIssues = issues.reduce((groups, issue) => {
            const severity = issue.severity ?? 'MEDIUM';
            if (!groups[severity])
                groups[severity] = [];
            groups[severity].push(issue);
            return groups;
        }, {});
        const severityOrder = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
        for (const severity of severityOrder) {
            if (groupedIssues[severity]) {
                report += `${severity} SEVERITY (${groupedIssues[severity].length} issues):\n`;
                for (const issue of groupedIssues[severity]) {
                    report += `  📁 ${issue.file}:${issue.line}\n`;
                    report += `    ❌ ${issue.issue}\n`;
                    report += `    🔍 Expression: ${issue.expression}\n`;
                    report += `    📊 Stats: expansion=${issue.stats.expandedLength}, maxRange=${issue.stats.maxRangeSize}\n`;
                    report += `    💡 ${issue.recommendation}\n\n`;
                }
            }
        }
        report += `\nTotal issues: ${issues.length}\n`;
        report += '\n🔧 Quick Fix Recommendations:\n';
        report += '1. Replace large ranges {1..N} with safe loops\n';
        report += '2. Use configuration files instead of inline expansions\n';
        report += '3. Implement input validation for user-controlled expressions\n';
        report += '4. Use safe alternatives like Array.from() in JavaScript\n';
        report += '5. Set resource limits in shell scripts\n';
        return report;
    }
    getScanStats() {
        return {
            scannedFiles: this.scannedFiles,
            expressionsFound: this.expressionsFound,
            issuesFound: this.issues.length,
            issuesBySeverity: this.issues.reduce((acc, issue) => {
                acc[issue.severity] = (acc[issue.severity] || 0) + 1;
                return acc;
            }, {}),
        };
    }
}
exports.BracesSecurityScanner = BracesSecurityScanner;
async function main() {
    const args = process.argv.slice(2);
    let scanPath = process.cwd();
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '--path' && i + 1 < args.length) {
            scanPath = args[i + 1] || scanPath;
            i++;
        }
    }
    const scanner = new BracesSecurityScanner();
    const issues = await scanner.scan(scanPath);
    const report = scanner.generateReport(issues);
    console.log(report);
    const stats = scanner.getScanStats();
    console.log('📈 Scan Statistics:', stats);
    const hasCriticalOrHigh = issues.some((issue) => issue.severity === 'CRITICAL' || issue.severity === 'HIGH');
    process.exit(hasCriticalOrHigh ? 1 : 0);
}
const isCliExecution = Boolean(process?.argv?.[1]?.includes('validate-braces-security'));
if (isCliExecution) {
    main().catch(console.error);
}
//# sourceMappingURL=validate-braces-security.js.map