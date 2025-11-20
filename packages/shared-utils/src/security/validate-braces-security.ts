#!/usr/bin/env node

/**
 * Script de validación de seguridad para expresiones de braces
 *
 * Este script escanea el proyecto en busca de expresiones de braces
 * potencialmente peligrosas que puedan causar ataques de DoS.
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { extname, join, relative } from 'path';
import { BracesSecurityFactory, BracesSecurityValidator } from './braces-security';

interface BracesSecurityIssue {
  file: string;
  line: number;
  expression: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  issue: string;
  recommendation: string;
  stats: any;
}

class BracesSecurityScanner {
  private validator: BracesSecurityValidator;
  private issues: BracesSecurityIssue[] = [];
  private scannedFiles = 0;
  private expressionsFound = 0;

  constructor() {
    this.validator = BracesSecurityFactory.createValidator({
      // Configuración estricta para scanning
      maxExpansionSize: 100, // Muy restrictivo para análisis
      maxRangeSize: 20, // Rangos pequeños
      monitoringEnabled: false, // Desactivar alertas durante scan
    });
  }

  /**
   * Escanear directorio recursivamente
   */
  private scanDirectory(dirPath: string): void {
    try {
      const items = readdirSync(dirPath);

      for (const item of items) {
        const fullPath = join(dirPath, item);

        try {
          const stat = statSync(fullPath);

          if (stat.isDirectory() && !this.shouldSkipDirectory(item)) {
            this.scanDirectory(fullPath);
          } else if (stat.isFile() && this.shouldScanFile(item)) {
            this.scanFile(fullPath);
            this.scannedFiles++;
          }
        } catch (error) {
          // Ignorar errores de acceso a archivos
          continue;
        }
      }
    } catch (error) {
      // Ignorar errores de acceso a directorios
      return;
    }
  }

  /**
   * Verificar si el directorio debe ser omitido
   */
  private shouldSkipDirectory(dirName: string): boolean {
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

  /**
   * Verificar si el archivo debe ser escaneado
   */
  private shouldScanFile(fileName: string): boolean {
    const scanExtensions = [
      '.sh',
      '.bash',
      '.zsh', // Scripts de shell
      '.js',
      '.ts',
      '.jsx',
      '.tsx', // JavaScript/TypeScript
      '.py',
      '.rb',
      '.php',
      '.java', // Otros lenguajes
      '.yml',
      '.yaml',
      '.json', // Config files
      '.md',
      '.txt', // Documentos
    ];

    const ext = extname(fileName);
    return (
      scanExtensions.includes(ext) ||
      fileName.includes('Dockerfile') ||
      fileName.includes('Makefile')
    );
  }

  /**
   * Escanear archivo individual
   */
  private async scanFile(filePath: string): Promise<void> {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      const relativePath = relative(process.cwd(), filePath);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line !== undefined) {
          await this.analyzeLine(relativePath, line, i + 1);
        }
      }
    } catch (error) {
      // Ignorar errores de lectura
      return;
    }
  }

  /**
   * Analizar línea individual
   */
  private async analyzeLine(filePath: string, line: string, lineNumber: number): Promise<void> {
    // Buscar expresiones con braces
    const braceRegex = /\{[^}]+\}/g;
    let match;

    while ((match = braceRegex.exec(line)) !== null) {
      const expression = match[0];
      this.expressionsFound++;

      // Validar la expresión
      try {
        const validation = await this.validator.validateExpression(expression);

        if (!validation.isSafe || validation.recommendedAction === 'block') {
          let severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
          let issue = 'Potentially unsafe brace expression';
          let recommendation = 'Review and consider sanitizing this expression';

          // Determinar severidad basada en el problema
          if (validation.stats.maxRangeSize > 1000) {
            severity = 'CRITICAL';
            issue = 'Massive range expansion detected';
            recommendation = 'Replace with safe iteration or remove entirely';
          } else if (validation.stats.maxRangeSize > 100) {
            severity = 'HIGH';
            issue = 'Large range expansion detected';
            recommendation = 'Consider reducing range size or using safe alternatives';
          } else if (validation.stats.expandedLength > 100) {
            severity = 'MEDIUM';
            issue = 'Significant expansion detected';
            recommendation = 'Verify this expansion is necessary and safe';
          } else if (validation.issues.length > 0) {
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
      } catch (error) {
        // Si la validación falla, marcar como potencial problema
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

  /**
   * Ejecutar escaneo completo
   */
  public async scan(rootPath: string = process.cwd()): Promise<BracesSecurityIssue[]> {
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

  /**
   * Generar reporte de hallazgos
   */
  public generateReport(issues: BracesSecurityIssue[]): string {
    if (issues.length === 0) {
      return '✅ No dangerous brace expressions found!';
    }

    let report = '[!] Dangerous Brace Expressions Found:\n\n';

    // Agrupar por severidad
    const groupedIssues = issues.reduce(
      (groups, issue) => {
        const severity = issue.severity ?? 'MEDIUM';
        if (!groups[severity]) groups[severity] = [];
        groups[severity]!.push(issue);
        return groups;
      },
      {} as Record<string, BracesSecurityIssue[]>,
    );

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

  /**
   * Obtener estadísticas del escaneo
   */
  public getScanStats() {
    return {
      scannedFiles: this.scannedFiles,
      expressionsFound: this.expressionsFound,
      issuesFound: this.issues.length,
      issuesBySeverity: this.issues.reduce(
        (acc, issue) => {
          acc[issue.severity] = (acc[issue.severity] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
    };
  }
}

/**
 * Función principal
 */
async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  let scanPath = process.cwd(); // Default to current directory

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--path' && i + 1 < args.length) {
      scanPath = args[i + 1] || scanPath;
      i++; // Skip next arg
    }
  }

  const scanner = new BracesSecurityScanner();
  const issues = await scanner.scan(scanPath);

  const report = scanner.generateReport(issues);
  console.log(report);

  const stats = scanner.getScanStats();
  console.log('📈 Scan Statistics:', stats);

  // Exit code basado en severidad
  const hasCriticalOrHigh = issues.some(
    (issue) => issue.severity === 'CRITICAL' || issue.severity === 'HIGH',
  );
  process.exit(hasCriticalOrHigh ? 1 : 0);
}

// Ejecutar si se llama directamente (evita import.meta para compatibilidad CommonJS)
const isCliExecution = Boolean(process?.argv?.[1]?.includes('validate-braces-security'));

if (isCliExecution) {
  main().catch(console.error);
}

export { BracesSecurityScanner };
export type { BracesSecurityIssue };
