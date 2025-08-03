#!/usr/bin/env ts-node

/**
 * Script de Análisis de Archivos Críticos
 * Detecta archivos que requieren refactor urgente basado en múltiples métricas
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

interface FileMetrics {
  path: string;
  lines: number;
  complexity: number;
  imports: number;
  exports: number;
  duplications: number;
  lastModified: Date;
  authors: number;
  priority: 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
  issues: string[];
}

interface AnalysisResult {
  totalFiles: number;
  criticalFiles: FileMetrics[];
  techDebt: {
    todoCount: number;
    anyTypeCount: number;
    consoleLogCount: number;
    tsIgnoreCount: number;
  };
  recommendations: string[];
}

class CriticalFileAnalyzer {
  private readonly rootDir = process.cwd();
  private readonly excludePaths = ['node_modules', '.turbo', 'dist', '.next'];

  async analyzeProject(): Promise<AnalysisResult> {
    console.log('🔍 Iniciando análisis de archivos críticos...\n');

    const allFiles = this.findTypeScriptFiles();
    const fileMetrics = await this.analyzeFiles(allFiles);
    const techDebt = await this.analyzeTechDebt();
    
    const criticalFiles = this.identifyCriticalFiles(fileMetrics);
    const recommendations = this.generateRecommendations(criticalFiles, techDebt);

    return {
      totalFiles: allFiles.length,
      criticalFiles,
      techDebt,
      recommendations
    };
  }

  private findTypeScriptFiles(): string[] {
    const files: string[] = [];
    
    const walkDir = (dir: string) => {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory() && !this.excludePaths.some(p => fullPath.includes(p))) {
          walkDir(fullPath);
        } else if (stats.isFile() && /\.(ts|tsx)$/.test(item)) {
          files.push(fullPath);
        }
      }
    };

    walkDir(path.join(this.rootDir, 'apps'));
    walkDir(path.join(this.rootDir, 'packages'));
    
    return files;
  }

  private async analyzeFiles(files: string[]): Promise<FileMetrics[]> {
    const metrics: FileMetrics[] = [];
    
    console.log('📊 Analizando archivos individuales...');
    
    for (let i = 0; i < files.length; i++) {
      if (i % 50 === 0) {
        console.log(`Progreso: ${i}/${files.length} archivos analizados`);
      }
      
      try {
        const fileMetric = await this.analyzeFile(files[i]);
        metrics.push(fileMetric);
      } catch (error) {
        console.warn(`⚠️  Error analizando ${files[i]}: ${error}`);
      }
    }
    
    return metrics;
  }

  private async analyzeFile(filePath: string): Promise<FileMetrics> {
    const content = fs.readFileSync(filePath, 'utf8');
    const stats = fs.statSync(filePath);
    
    const lines = content.split('\n').length;
    const imports = (content.match(/^import\s/gm) || []).length;
    const exports = (content.match(/^export\s/gm) || []).length;
    
    // Análisis de complejidad simple (aproximado)
    const complexity = this.calculateComplexity(content);
    
    // Detección de problemas
    const issues: string[] = [];
    if (lines > 500) issues.push('Archivo muy grande (>500 líneas)');
    if (complexity > 20) issues.push('Complejidad alta (>20)');
    if (content.includes('any')) issues.push('Uso de tipo "any"');
    if (content.includes('@ts-ignore')) issues.push('Supresión de TypeScript');
    if (content.includes('console.log')) issues.push('Console.log en código');
    if (content.includes('TODO') || content.includes('FIXME')) issues.push('Comentarios de deuda técnica');

    // Calcular prioridad
    const priority = this.calculatePriority(lines, complexity, issues.length);

    return {
      path: filePath.replace(this.rootDir, ''),
      lines,
      complexity,
      imports,
      exports,
      duplications: 0, // Se calcularía con herramientas específicas
      lastModified: stats.mtime,
      authors: 1, // Se calcularía con git blame
      priority,
      issues
    };
  }

  private calculateComplexity(content: string): number {
    let complexity = 1; // Complejidad base
    
    // Contar estructuras de control
    const controlStructures = [
      /\bif\s*\(/g,
      /\belse\s+if\s*\(/g,
      /\bfor\s*\(/g,
      /\bwhile\s*\(/g,
      /\bswitch\s*\(/g,
      /\bcase\s+/g,
      /\bcatch\s*\(/g,
      /\btry\s*{/g,
      /\?.*:/g, // Operador ternario
      /&&/g,
      /\|\|/g
    ];
    
    for (const pattern of controlStructures) {
      const matches = content.match(pattern);
      if (matches) {
        complexity += matches.length;
      }
    }
    
    return complexity;
  }

  private calculatePriority(lines: number, complexity: number, issueCount: number): 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW' {
    const score = (lines / 100) + (complexity / 5) + (issueCount * 2);
    
    if (score > 20) return 'URGENT';
    if (score > 10) return 'HIGH';
    if (score > 5) return 'MEDIUM';
    return 'LOW';
  }

  private identifyCriticalFiles(metrics: FileMetrics[]): FileMetrics[] {
    return metrics
      .filter(m => m.priority === 'URGENT' || m.priority === 'HIGH')
      .sort((a, b) => {
        const priorityWeight = { 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority] || b.lines - a.lines;
      })
      .slice(0, 20); // Top 20 archivos críticos
  }

  private async analyzeTechDebt(): Promise<AnalysisResult['techDebt']> {
    console.log('💳 Analizando deuda técnica...');
    
    try {
      const todoCount = parseInt(execSync('grep -r "TODO\\|FIXME\\|HACK" apps/ --include="*.ts" --include="*.tsx" | wc -l', { encoding: 'utf8' }).trim());
      const anyTypeCount = parseInt(execSync('grep -r "\\bany\\b" apps/ --include="*.ts" --include="*.tsx" | wc -l', { encoding: 'utf8' }).trim());
      const consoleLogCount = parseInt(execSync('grep -r "console\\." apps/ --include="*.ts" --include="*.tsx" | wc -l', { encoding: 'utf8' }).trim());
      const tsIgnoreCount = parseInt(execSync('grep -r "@ts-ignore" apps/ --include="*.ts" --include="*.tsx" | wc -l', { encoding: 'utf8' }).trim());
      
      return {
        todoCount,
        anyTypeCount,
        consoleLogCount,
        tsIgnoreCount
      };
    } catch (error) {
      console.warn('⚠️ Error calculando deuda técnica:', error);
      return {
        todoCount: 0,
        anyTypeCount: 0,
        consoleLogCount: 0,
        tsIgnoreCount: 0
      };
    }
  }

  private generateRecommendations(criticalFiles: FileMetrics[], techDebt: AnalysisResult['techDebt']): string[] {
    const recommendations: string[] = [];
    
    // Recomendaciones basadas en archivos críticos
    if (criticalFiles.length > 0) {
      recommendations.push(`🚨 ${criticalFiles.length} archivos requieren refactor URGENTE`);
      
      const largeFiles = criticalFiles.filter(f => f.lines > 1000);
      if (largeFiles.length > 0) {
        recommendations.push(`📏 Dividir ${largeFiles.length} archivos >1000 líneas: ${largeFiles.slice(0, 3).map(f => f.path).join(', ')}`);
      }
      
      const complexFiles = criticalFiles.filter(f => f.complexity > 30);
      if (complexFiles.length > 0) {
        recommendations.push(`🧮 Simplificar ${complexFiles.length} archivos con alta complejidad ciclomática`);
      }
    }
    
    // Recomendaciones basadas en deuda técnica
    if (techDebt.consoleLogCount > 50) {
      recommendations.push(`🖥️ Remover ${techDebt.consoleLogCount} console.log antes de producción`);
    }
    
    if (techDebt.anyTypeCount > 30) {
      recommendations.push(`🎯 Tipificar ${techDebt.anyTypeCount} usos de "any" para mejor type safety`);
    }
    
    if (techDebt.todoCount > 20) {
      recommendations.push(`📝 Resolver ${techDebt.todoCount} TODOs/FIXMEs pendientes`);
    }
    
    if (techDebt.tsIgnoreCount > 10) {
      recommendations.push(`🚫 Revisar ${techDebt.tsIgnoreCount} supresiones de TypeScript (@ts-ignore)`);
    }
    
    return recommendations;
  }

  async generateReport(result: AnalysisResult): Promise<void> {
    const report = `
# 📊 Reporte de Análisis de Archivos Críticos
*Generado: ${new Date().toISOString()}*

## 📈 Resumen Ejecutivo
- **Total archivos analizados:** ${result.totalFiles}
- **Archivos críticos:** ${result.criticalFiles.length}
- **Prioridad URGENTE:** ${result.criticalFiles.filter(f => f.priority === 'URGENT').length}
- **Prioridad HIGH:** ${result.criticalFiles.filter(f => f.priority === 'HIGH').length}

## 💳 Deuda Técnica Detectada
- **TODOs/FIXMEs:** ${result.techDebt.todoCount}
- **Tipos "any":** ${result.techDebt.anyTypeCount}
- **Console.logs:** ${result.techDebt.consoleLogCount}
- **@ts-ignore:** ${result.techDebt.tsIgnoreCount}

## 🚨 Top 10 Archivos Críticos

| Archivo | Líneas | Complejidad | Prioridad | Principales Issues |
|---------|--------|-------------|-----------|-------------------|
${result.criticalFiles.slice(0, 10).map(f => 
  `| \`${f.path}\` | ${f.lines} | ${f.complexity} | ${f.priority} | ${f.issues.slice(0, 2).join(', ')} |`
).join('\n')}

## 🎯 Recomendaciones Prioritarias

${result.recommendations.map(r => `- ${r}`).join('\n')}

## 📊 Distribución por Directorio

${this.generateDirectoryStats(result.criticalFiles)}

---
*Para implementar las mejoras, consulta el PLAN_AUDITORIA_TECNICA_PERFORMANCE.md*
`;

    fs.writeFileSync('CRITICAL_FILES_REPORT.md', report);
    console.log('\n✅ Reporte generado: CRITICAL_FILES_REPORT.md');
  }

  private generateDirectoryStats(files: FileMetrics[]): string {
    const dirStats = new Map<string, number>();
    
    files.forEach(f => {
      const dir = path.dirname(f.path).split('/').slice(0, 3).join('/');
      dirStats.set(dir, (dirStats.get(dir) || 0) + 1);
    });
    
    return Array.from(dirStats.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([dir, count]) => `- **${dir}:** ${count} archivos críticos`)
      .join('\n');
  }
}

// Ejecutar análisis si se llama directamente
if (require.main === module) {
  const analyzer = new CriticalFileAnalyzer();
  
  analyzer.analyzeProject()
    .then(result => {
      console.log('\n🎉 Análisis completado!\n');
      console.log('📊 RESUMEN:');
      console.log(`- Total archivos: ${result.totalFiles}`);
      console.log(`- Archivos críticos: ${result.criticalFiles.length}`);
      console.log(`- Deuda técnica: ${result.techDebt.todoCount} TODOs, ${result.techDebt.anyTypeCount} anys`);
      console.log('\n🎯 RECOMENDACIONES TOP:');
      result.recommendations.slice(0, 5).forEach(r => console.log(`  ${r}`));
      
      return analyzer.generateReport(result);
    })
    .catch(error => {
      console.error('❌ Error en análisis:', error);
      process.exit(1);
    });
}

export { CriticalFileAnalyzer, FileMetrics, AnalysisResult };