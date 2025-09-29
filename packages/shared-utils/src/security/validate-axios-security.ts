#!/usr/bin/env node

/**
 * Script de validación de seguridad para configuraciones de Axios
 *
 * Este script verifica que todas las instancias de axios en el proyecto
 * tengan las configuraciones de seguridad adecuadas para prevenir DoS.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { extname, join } from 'path';

interface AxiosSecurityIssue {
  file: string;
  line: number;
  issue: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  recommendation: string;
}

class AxiosSecurityValidator {
  private issues: AxiosSecurityIssue[] = [];
  private secureImports = new Set([
    '@a4co/shared-utils/security/axios-security',
    './axios-security',
    '../axios-security',
  ]);

  /**
   * Escanear directorio recursivamente
   */
  private scanDirectory(dirPath: string): void {
    const items = readdirSync(dirPath);

    for (const item of items) {
      const fullPath = join(dirPath, item);
      const stat = statSync(fullPath);

      if (stat.isDirectory() && !this.shouldSkipDirectory(item)) {
        this.scanDirectory(fullPath);
      } else if (stat.isFile() && this.isTypeScriptFile(item)) {
        this.validateFile(fullPath);
      }
    }
  }

  /**
   * Verificar si el directorio debe ser omitido
   */
  private shouldSkipDirectory(dirName: string): boolean {
    const skipDirs = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage'];
    return skipDirs.includes(dirName);
  }

  /**
   * Verificar si es un archivo TypeScript
   */
  private isTypeScriptFile(fileName: string): boolean {
    return ['.ts', '.tsx', '.js', '.jsx'].includes(extname(fileName));
  }

  /**
   * Validar archivo individual
   */
  private validateFile(filePath: string): void {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        this.checkLine(filePath, line, index + 1);
      });

      // Verificaciones adicionales del archivo completo
      this.checkFileImports(filePath, content);
      this.checkAxiosCreateUsage(filePath, content);
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
    }
  }

  /**
   * Verificar línea individual
   */
  private checkLine(filePath: string, line: string, lineNumber: number): void {
    // Verificar uso de axios.create sin límites de tamaño
    if (line.includes('axios.create') && !line.includes('SecureAxiosFactory')) {
      const hasSizeLimits =
        line.includes('maxContentLength') ||
        line.includes('maxBodyLength') ||
        line.includes('maxResponseSize');

      if (!hasSizeLimits) {
        this.issues.push({
          file: filePath,
          line: lineNumber,
          issue: 'axios.create without size limits',
          severity: 'HIGH',
          recommendation:
            'Use SecureAxiosFactory.createClient() or add maxContentLength, maxBodyLength, and maxResponseSize limits',
        });
      }
    }

    // Verificar timeouts muy largos
    if (line.includes('timeout:') && !line.includes('SecureAxiosFactory')) {
      const timeoutMatch = line.match(/timeout:\s*(\d+)/);
      if (timeoutMatch) {
        const timeout = parseInt(timeoutMatch[1]);
        if (timeout > 60000) {
          // 60 segundos
          this.issues.push({
            file: filePath,
            line: lineNumber,
            issue: `Very long timeout: ${timeout}ms`,
            severity: 'MEDIUM',
            recommendation:
              'Consider reducing timeout to prevent resource exhaustion. Max recommended: 30000ms',
          });
        }
      }
    }

    // Verificar imports inseguros de axios
    if (line.includes("from 'axios'") && !this.isInSecureFile(filePath)) {
      this.issues.push({
        file: filePath,
        line: lineNumber,
        issue: 'Direct axios import without security wrapper',
        severity: 'HIGH',
        recommendation:
          'Import from @a4co/shared-utils/security/axios-security instead of axios directly',
      });
    }
  }

  /**
   * Verificar imports del archivo
   */
  private checkFileImports(filePath: string, content: string): void {
    const hasSecureImport = Array.from(this.secureImports).some(
      secureImport =>
        content.includes(`from '${secureImport}'`) || content.includes(`from "${secureImport}"`)
    );

    const hasAxiosImport = content.includes("from 'axios'") || content.includes('from "axios"');

    if (hasAxiosImport && !hasSecureImport && !this.isInSecureFile(filePath)) {
      this.issues.push({
        file: filePath,
        line: 1,
        issue: 'File uses axios without security wrapper',
        severity: 'HIGH',
        recommendation:
          'Replace axios imports with SecureAxiosFactory from @a4co/shared-utils/security/axios-security',
      });
    }
  }

  /**
   * Verificar uso de axios.create
   */
  private checkAxiosCreateUsage(filePath: string, content: string): void {
    const createMatches = content.match(/axios\.create\(/g);
    if (createMatches && !this.isInSecureFile(filePath)) {
      this.issues.push({
        file: filePath,
        line: 1,
        issue: `File contains ${createMatches.length} axios.create() calls`,
        severity: 'HIGH',
        recommendation:
          'Replace axios.create() with SecureAxiosFactory.createClient() for DoS protection',
      });
    }
  }

  /**
   * Verificar si el archivo está en un directorio seguro
   */
  private isInSecureFile(filePath: string): boolean {
    return (
      filePath.includes('/security/') ||
      filePath.includes('axios-security') ||
      filePath.includes('test')
    );
  }

  /**
   * Ejecutar validación completa
   */
  public validate(rootPath: string = process.cwd()): AxiosSecurityIssue[] {
    console.log('🔍 Scanning for axios security issues...');
    this.scanDirectory(rootPath);
    return this.issues;
  }

  /**
   * Generar reporte
   */
  public generateReport(issues: AxiosSecurityIssue[]): string {
    if (issues.length === 0) {
      return '✅ No axios security issues found!';
    }

    let report = '🚨 Axios Security Issues Found:\n\n';

    const groupedIssues = issues.reduce(
      (groups, issue) => {
        if (!groups[issue.severity]) groups[issue.severity] = [];
        groups[issue.severity].push(issue);
        return groups;
      },
      {} as Record<string, AxiosSecurityIssue[]>
    );

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

/**
 * Función principal
 */
function main() {
  const validator = new AxiosSecurityValidator();
  const issues = validator.validate();

  const report = validator.generateReport(issues);
  console.log(report);

  // Exit code based on severity
  const hasHighSeverity = issues.some(issue => issue.severity === 'HIGH');
  process.exit(hasHighSeverity ? 1 : 0);
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { AxiosSecurityValidator };
export type { AxiosSecurityIssue };
