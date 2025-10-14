#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

interface ComplexityReport {
  hotspots: Array<{
    file: string;
    complexity: number;
    loc: number;
    duplications: number;
    dependencies: number;
  }>;
  duplications: Array<{
    files: string[];
    lines: number;
    tokens: number;
  }>;
  deadCode: Array<{
    file: string;
    export: string;
    type: string;
  }>;
  circularDependencies: string[][];
  metrics: {
    totalFiles: number;
    totalLOC: number;
    avgComplexity: number;
    duplicatedLines: number;
    duplicatedPercentage: number;
  };
}

async function analyzeComplexity(): Promise<ComplexityReport> {
  console.log('🔍 Iniciando análisis de deuda técnica...\n');

  const report: ComplexityReport = {
    hotspots: [],
    duplications: [],
    deadCode: [],
    circularDependencies: [],
    metrics: {
      totalFiles: 0,
      totalLOC: 0,
      avgComplexity: 0,
      duplicatedLines: 0,
      duplicatedPercentage: 0,
    },
  };

  // 1. Análisis de dependencias circulares con madge
  console.log('📊 Analizando dependencias circulares...');
  try {
    const madgeOutput = execSync('npx madge apps/ --circular --extensions ts,tsx --json', {
      encoding: 'utf8',
      cwd: process.cwd(),
    });

    const madgeResult = JSON.parse(madgeOutput);
    report.circularDependencies = Array.isArray(madgeResult) ? madgeResult : [];
    console.log(`  ✓ Encontradas ${report.circularDependencies.length} dependencias circulares\n`);
  } catch (error) {
    console.log('  ⚠ Error en análisis de dependencias:', error.message);
  }

  // 2. Análisis de código muerto con ts-prune
  console.log('🗑️ Buscando código muerto...');
  try {
    const tsPruneOutput = execSync('npx ts-prune --error --skip test 2>&1 || true', {
      encoding: 'utf8',
      cwd: process.cwd(),
    });

    const deadCodeLines = tsPruneOutput.split('\n').filter(line => line.includes(' - '));
    deadCodeLines.forEach(line => {
      const match = line.match(/(.+):(\d+) - (.+)/);
      if (match) {
        report.deadCode.push({
          file: match[1],
          export: match[3],
          type: 'unused',
        });
      }
    });
    console.log(`  ✓ Encontrados ${report.deadCode.length} exports no utilizados\n`);
  } catch (error) {
    console.log('  ⚠ Error en análisis de código muerto:', error.message);
  }

  // 3. Análisis de complejidad por módulo con turbo
  console.log('🌀 Analizando complejidad por módulo...');

  // Analizar auth-service específicamente
  try {
    console.log('  📦 Analizando auth-service...');
    const authComplexity = execSync(
      'npx eslint src --ext .ts,.tsx --format json 2>/dev/null || true',
      {
        encoding: 'utf8',
        maxBuffer: 1024 * 1024 * 10,
        cwd: path.join(process.cwd(), 'apps/auth-service'),
<<<<<<< HEAD
      },
=======
      }
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
    );

    if (authComplexity && authComplexity.trim() !== '') {
      try {
        const results = JSON.parse(authComplexity);
        results.forEach((file: any) => {
          if (file.source) {
            const relativePath = file.filePath.replace(process.cwd() + '/', '');
            report.hotspots.push({
              file: relativePath,
              complexity: file.errorCount + file.warningCount, // Aproximación
              loc: file.source.split('\n').length,
              duplications: 0,
              dependencies: 0,
            });
          }
        });
      } catch (e) {
        console.log('    ⚠ No se pudo parsear resultado de auth-service');
      }
    }
  } catch (error) {
    console.log('  ⚠ Error analizando auth-service:', error.message);
  }

  // 4. Análisis de duplicación con jscpd
  console.log('📋 Detectando código duplicado...');
  try {
    // Crear configuración de jscpd
    const jscpdConfig = {
      threshold: 0,
      reporters: ['json'],
      output: './',
      ignore: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**', '**/dist/**', '**/build/**'],
      format: ['javascript', 'typescript', 'tsx'],
    };

    fs.writeFileSync('.jscpd.json', JSON.stringify(jscpdConfig, null, 2));

    execSync('npx jscpd apps packages --config .jscpd.json', {
      stdio: 'ignore',
    });

    if (fs.existsSync('jscpd-report.json')) {
      const jscpdReport = JSON.parse(fs.readFileSync('jscpd-report.json', 'utf8'));

      if (jscpdReport.duplicates) {
        jscpdReport.duplicates.forEach((dup: any) => {
          report.duplications.push({
            files: [dup.firstFile.name, dup.secondFile.name],
            lines: dup.lines,
            tokens: dup.tokens,
          });

          // Actualizar hotspots con info de duplicación
          [dup.firstFile.name, dup.secondFile.name].forEach(file => {
            const hotspot = report.hotspots.find(h => h.file === file);
            if (hotspot) {
              hotspot.duplications += dup.lines;
            } else {
              report.hotspots.push({
                file,
                complexity: 0,
                loc: 0,
                duplications: dup.lines,
                dependencies: 0,
              });
            }
          });
        });
      }

      report.metrics.duplicatedLines = jscpdReport.statistics?.duplicatedLines || 0;
      report.metrics.duplicatedPercentage = jscpdReport.statistics?.percentage || 0;

      fs.unlinkSync('jscpd-report.json');
    }

    fs.unlinkSync('.jscpd.json');
    console.log(`  ✓ Encontradas ${report.duplications.length} duplicaciones\n`);
  } catch (error) {
    console.log('  ⚠ Error en análisis de duplicación:', error.message);
  }

  // 5. Análisis específico de los servicios refactorizados
  console.log('🔍 Analizando servicios específicos...');
  const servicesToAnalyze = [
    'apps/order-service',
    'apps/product-service',
    'apps/user-service',
    'apps/inventory-service',
  ];

  servicesToAnalyze.forEach(servicePath => {
    ['controller.ts', 'service.ts'].forEach(file => {
      const filePath = path.join(servicePath, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n').length;

        // Buscar complejidad básica
        const functionMatches =
          content.match(/(?:function|async\s+function|\w+\s*\(.*?\)\s*{)/g) || [];
        const ifMatches = content.match(/\bif\s*\(/g) || [];
        const forMatches = content.match(/\bfor\s*\(/g) || [];
        const whileMatches = content.match(/\bwhile\s*\(/g) || [];

        const complexity =
          functionMatches.length + ifMatches.length + forMatches.length + whileMatches.length;

        const existingHotspot = report.hotspots.find(h => h.file === filePath);
        if (existingHotspot) {
          existingHotspot.complexity = Math.max(existingHotspot.complexity, complexity);
          existingHotspot.loc = lines;
        } else {
          report.hotspots.push({
            file: filePath,
            complexity: complexity,
            loc: lines,
            duplications: 0,
            dependencies: 0,
          });
        }
      }
    });
  });

  // 6. Calcular métricas generales
  console.log('📈 Calculando métricas generales...');
  const allFiles = new Set([
    ...report.hotspots.map(h => h.file),
    ...report.deadCode.map(d => d.file),
    ...report.duplications.flatMap(d => d.files),
  ]);

  report.metrics.totalFiles = allFiles.size;
  report.metrics.totalLOC = report.hotspots.reduce((sum, h) => sum + h.loc, 0);
  report.metrics.avgComplexity =
    report.hotspots.length > 0
      ? report.hotspots.reduce((sum, h) => sum + h.complexity, 0) / report.hotspots.length
      : 0;

  // 7. Ordenar hotspots por criticidad
  report.hotspots.sort((a, b) => {
    const scoreA = a.complexity * 2 + a.duplications + a.dependencies;
    const scoreB = b.complexity * 2 + b.duplications + b.dependencies;
    return scoreB - scoreA;
  });

  // 8. Generar reporte
  const reportPath = path.join(process.cwd(), 'technical-debt-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.log('\n✅ Análisis completado!');
  console.log(`📄 Reporte guardado en: ${reportPath}\n`);

  // Mostrar resumen
  console.log('📊 RESUMEN DE DEUDA TÉCNICA');
  console.log('═══════════════════════════════════════════');
  console.log(`Total de archivos analizados: ${report.metrics.totalFiles}`);
  console.log(`Líneas de código: ${report.metrics.totalLOC}`);
  console.log(`Complejidad promedio: ${report.metrics.avgComplexity.toFixed(2)}`);
  console.log(
<<<<<<< HEAD
    `Líneas duplicadas: ${report.metrics.duplicatedLines} (${report.metrics.duplicatedPercentage.toFixed(2)}%)`,
=======
    `Líneas duplicadas: ${report.metrics.duplicatedLines} (${report.metrics.duplicatedPercentage.toFixed(2)}%)`
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  );
  console.log(`Dependencias circulares: ${report.circularDependencies.length}`);
  console.log(`Código muerto: ${report.deadCode.length} exports`);

  if (report.hotspots.length > 0) {
    console.log('\n🔥 TOP 10 HOTSPOTS DE COMPLEJIDAD:');
    console.log('─────────────────────────────────────────');
    report.hotspots.slice(0, 10).forEach((hotspot, index) => {
      const score = hotspot.complexity * 2 + hotspot.duplications + hotspot.dependencies;
      console.log(`${index + 1}. ${hotspot.file}`);
      console.log(
<<<<<<< HEAD
        `   Complejidad: ${hotspot.complexity} | Duplicaciones: ${hotspot.duplications} líneas | Score: ${score}`,
=======
        `   Complejidad: ${hotspot.complexity} | Duplicaciones: ${hotspot.duplications} líneas | Score: ${score}`
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
      );
    });
  }

  if (report.circularDependencies.length > 0) {
    console.log('\n🔄 DEPENDENCIAS CIRCULARES:');
    console.log('─────────────────────────────────────────');
    report.circularDependencies.slice(0, 5).forEach((cycle, index) => {
      console.log(`${index + 1}. ${cycle.join(' → ')}`);
    });
  }

  return report;
}

// Ejecutar análisis
analyzeComplexity().catch(console.error);
