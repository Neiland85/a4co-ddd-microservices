import * as fs from 'fs';
import { glob } from 'glob';
import * as path from 'path';
import * as ts from 'typescript';

interface ComplexityHotspot {
  file: string;
  function: string;
  complexity: number;
  loc: number;
  recommendation: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

interface ComplexityReport {
  hotspots: ComplexityHotspot[];
  summary: {
    totalFiles: number;
    totalFunctions: number;
    averageComplexity: number;
    criticalCount: number;
    highCount: number;
  };
  byLayer: Map<string, ComplexityHotspot[]>;
}

// Umbrales de complejidad por capa DDD
const COMPLEXITY_THRESHOLDS = {
  'domain/entities': { max: 5, warning: 3 },
  'domain/value-objects': { max: 3, warning: 2 },
  'domain/aggregates': { max: 10, warning: 7 },
  'application/use-cases': { max: 8, warning: 5 },
  'application/handlers': { max: 5, warning: 3 },
  'infrastructure/repositories': { max: 5, warning: 3 },
  default: { max: 10, warning: 7 },
};

export async function analyzeComplexity(): Promise<ComplexityReport> {
  console.log('🔍 Analizando complejidad ciclomática...\n');

  const files = await glob('apps/*/src/**/*.ts', {
    ignore: ['**/*.spec.ts', '**/*.test.ts', '**/node_modules/**'],
  });

  const hotspots: ComplexityHotspot[] = [];
  const byLayer = new Map<string, ComplexityHotspot[]>();

  let totalFunctions = 0;
  let totalComplexity = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);

    const fileHotspots = analyzeFile(sourceFile, file);
    hotspots.push(...fileHotspots);

    // Clasificar por capa
    const layer = detectLayer(file);
    if (!byLayer.has(layer)) {
      byLayer.set(layer, []);
    }
    byLayer.get(layer)!.push(...fileHotspots);

    totalFunctions += fileHotspots.length;
    totalComplexity += fileHotspots.reduce((sum, h) => sum + h.complexity, 0);
  }

  // Ordenar por complejidad descendente
  hotspots.sort((a, b) => b.complexity - a.complexity);

  const summary = {
    totalFiles: files.length,
    totalFunctions: totalFunctions,
    averageComplexity: totalFunctions > 0 ? totalComplexity / totalFunctions : 0,
    criticalCount: hotspots.filter(h => h.severity === 'CRITICAL').length,
    highCount: hotspots.filter(h => h.severity === 'HIGH').length,
  };

  displayResults({ hotspots, summary, byLayer });

  return { hotspots, summary, byLayer };
}

function analyzeFile(sourceFile: ts.SourceFile, filePath: string): ComplexityHotspot[] {
  const hotspots: ComplexityHotspot[] = [];

  function visit(node: ts.Node) {
    if (
      ts.isFunctionDeclaration(node) ||
      ts.isMethodDeclaration(node) ||
      ts.isArrowFunction(node) ||
      ts.isFunctionExpression(node)
    ) {
      const complexity = calculateCyclomaticComplexity(node);
      const loc = countLinesOfCode(node, sourceFile);

      if (complexity > 1) {
        // Solo funciones con alguna complejidad
        const functionName = getFunctionName(node);
        const layer = detectLayer(filePath);
        const threshold = getThresholdForLayer(layer);

        if (complexity > threshold.warning) {
          hotspots.push({
            file: filePath,
            function: functionName,
            complexity,
            loc,
            recommendation: getRefactorRecommendation(complexity, node, layer),
            severity: getSeverity(complexity, threshold),
          });
        }
      }
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return hotspots;
}

function calculateCyclomaticComplexity(node: ts.Node): number {
  let complexity = 1;

  function visit(n: ts.Node) {
    switch (n.kind) {
      case ts.SyntaxKind.IfStatement:
      case ts.SyntaxKind.ConditionalExpression:
      case ts.SyntaxKind.CaseClause:
      case ts.SyntaxKind.CatchClause:
      case ts.SyntaxKind.DoStatement:
      case ts.SyntaxKind.ForStatement:
      case ts.SyntaxKind.ForInStatement:
      case ts.SyntaxKind.ForOfStatement:
      case ts.SyntaxKind.WhileStatement:
        complexity++;
        break;

      case ts.SyntaxKind.BinaryExpression:
        const op = (n as ts.BinaryExpression).operatorToken.kind;
        if (
          op === ts.SyntaxKind.AmpersandAmpersandToken ||
          op === ts.SyntaxKind.BarBarToken ||
          op === ts.SyntaxKind.QuestionQuestionToken
        ) {
          complexity++;
        }
        break;
    }

    ts.forEachChild(n, visit);
  }

  visit(node);
  return complexity;
}

function countLinesOfCode(node: ts.Node, sourceFile: ts.SourceFile): number {
  const start = sourceFile.getLineAndCharacterOfPosition(node.getStart());
  const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd());
  return end.line - start.line + 1;
}

function getFunctionName(node: ts.Node): string {
  if (ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node)) {
    return node.name?.getText() || 'anonymous';
  }

  if (ts.isArrowFunction(node) || ts.isFunctionExpression(node)) {
    const parent = node.parent;
    if (ts.isVariableDeclaration(parent)) {
      return parent.name.getText();
    }
    if (ts.isPropertyAssignment(parent)) {
      return parent.name.getText();
    }
  }

  return 'anonymous';
}

function detectLayer(filePath: string): string {
  const normalizedPath = filePath.replace(/\\/g, '/');

  for (const [pattern, _] of Object.entries(COMPLEXITY_THRESHOLDS)) {
    if (pattern !== 'default' && normalizedPath.includes(pattern)) {
      return pattern;
    }
  }

  // Detectar por estructura de carpetas
  if (normalizedPath.includes('/domain/')) {
    if (normalizedPath.includes('/entities/')) return 'domain/entities';
    if (normalizedPath.includes('/value-objects/')) return 'domain/value-objects';
    if (normalizedPath.includes('/aggregates/')) return 'domain/aggregates';
  }

  if (normalizedPath.includes('/application/')) {
    if (normalizedPath.includes('/use-cases/')) return 'application/use-cases';
    if (normalizedPath.includes('/handlers/')) return 'application/handlers';
  }

  if (normalizedPath.includes('/infrastructure/')) {
    if (normalizedPath.includes('/repositories/')) return 'infrastructure/repositories';
  }

  return 'default';
}

function getThresholdForLayer(layer: string): { max: number; warning: number } {
  return (
    COMPLEXITY_THRESHOLDS[layer as keyof typeof COMPLEXITY_THRESHOLDS] ||
    COMPLEXITY_THRESHOLDS.default
  );
}

function getSeverity(
  complexity: number,
  threshold: { max: number; warning: number }
): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' {
  if (complexity > threshold.max * 2) return 'CRITICAL';
  if (complexity > threshold.max) return 'HIGH';
  if (complexity > threshold.warning) return 'MEDIUM';
  return 'LOW';
}

function getRefactorRecommendation(complexity: number, node: ts.Node, layer: string): string {
  const recommendations: string[] = [];

  // Recomendaciones generales por complejidad
  if (complexity > 20) {
    recommendations.push('🚨 CRÍTICO: Dividir en múltiples funciones pequeñas');
    recommendations.push('Considerar patrón Strategy o Chain of Responsibility');
  } else if (complexity > 15) {
    recommendations.push('⚠️ ALTO: Extraer lógica compleja a funciones auxiliares');
    recommendations.push('Aplicar principio de responsabilidad única');
  } else if (complexity > 10) {
    recommendations.push('📌 MEDIO: Simplificar condicionales complejos');
    recommendations.push('Usar early returns para reducir anidamiento');
  }

  // Recomendaciones específicas por capa
  switch (layer) {
    case 'domain/entities':
      recommendations.push('Extraer validaciones a Value Objects');
      recommendations.push('Mover lógica compleja a Domain Services');
      break;

    case 'application/use-cases':
      recommendations.push('Dividir en sub-casos de uso más específicos');
      recommendations.push('Delegar validaciones al dominio');
      break;

    case 'application/handlers':
      recommendations.push('Handler debe solo orquestar, no contener lógica');
      recommendations.push('Mover lógica a Use Cases correspondientes');
      break;

    case 'infrastructure/repositories':
      recommendations.push('Usar query builders para consultas complejas');
      recommendations.push('Extraer queries complejas a métodos especializados');
      break;
  }

  // Detectar patrones específicos
  const hasNestedIfs = detectNestedIfs(node);
  const hasSwitchCase = detectSwitchCase(node);

  if (hasNestedIfs > 3) {
    recommendations.push('🔄 Refactorizar ifs anidados usando guard clauses');
  }

  if (hasSwitchCase) {
    recommendations.push('🔀 Considerar reemplazar switch con polimorfismo o map de funciones');
  }

  return recommendations.join('\n   ');
}

function detectNestedIfs(node: ts.Node): number {
  let maxDepth = 0;

  function visit(n: ts.Node, depth: number) {
    if (ts.isIfStatement(n)) {
      maxDepth = Math.max(maxDepth, depth);
      ts.forEachChild(n, child => visit(child, depth + 1));
    } else {
      ts.forEachChild(n, child => visit(child, depth));
    }
  }

  visit(node, 0);
  return maxDepth;
}

function detectSwitchCase(node: ts.Node): boolean {
  let hasSwitch = false;

  function visit(n: ts.Node) {
    if (ts.isSwitchStatement(n)) {
      hasSwitch = true;
    }
    ts.forEachChild(n, visit);
  }

  visit(node);
  return hasSwitch;
}

function displayResults(report: ComplexityReport): void {
  console.log('='.repeat(80));
  console.log('📊 REPORTE DE COMPLEJIDAD CICLOMÁTICA');
  console.log('='.repeat(80));

  console.log('\n📈 RESUMEN:');
  console.log(`   Total archivos analizados: ${report.summary.totalFiles}`);
  console.log(`   Total funciones analizadas: ${report.summary.totalFunctions}`);
  console.log(`   Complejidad promedio: ${report.summary.averageComplexity.toFixed(2)}`);
  console.log(`   Funciones críticas: ${report.summary.criticalCount}`);
  console.log(`   Funciones de alta complejidad: ${report.summary.highCount}`);

  console.log('\n🔥 TOP 10 HOTSPOTS DE COMPLEJIDAD:');
  console.log('-'.repeat(80));

  const top10 = report.hotspots.slice(0, 10);
  top10.forEach((hotspot, index) => {
    const severity =
      hotspot.severity === 'CRITICAL' ? '🚨' : hotspot.severity === 'HIGH' ? '⚠️' : '📌';

    console.log(
      `\n${index + 1}. ${severity} ${hotspot.function} (Complejidad: ${hotspot.complexity})`
    );
    console.log(`   📁 ${hotspot.file}`);
    console.log(`   📏 Líneas de código: ${hotspot.loc}`);
    console.log(`   💡 Recomendación:\n   ${hotspot.recommendation}`);
  });

  console.log('\n\n📊 ANÁLISIS POR CAPA DDD:');
  console.log('-'.repeat(80));

  report.byLayer.forEach((hotspots, layer) => {
    if (hotspots.length > 0) {
      const avgComplexity = hotspots.reduce((sum, h) => sum + h.complexity, 0) / hotspots.length;
      console.log(`\n📁 ${layer}:`);
      console.log(`   Funciones complejas: ${hotspots.length}`);
      console.log(`   Complejidad promedio: ${avgComplexity.toFixed(2)}`);
      console.log(`   Peor función: ${hotspots[0]?.function} (${hotspots[0]?.complexity})`);
    }
  });

  console.log('\n' + '='.repeat(80));

  // Generar archivo de reporte
  const reportPath = path.join('reports', 'complexity-hotspots.json');
  fs.mkdirSync('reports', { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Reporte detallado guardado en: ${reportPath}`);
}

// Ejecutar si se llama directamente
if (require.main === module) {
  analyzeComplexity().catch(console.error);
}
