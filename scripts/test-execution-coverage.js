#!/usr/bin/env node

/**
 * Test Execution and Coverage Validation Script
 * Ejecuta todos los tests generados y valida la cobertura de código
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class TestExecutionAndCoverage {
  constructor() {
    this.projectRoot = '/Users/estudio/Projects/GitHub/MICROSERVICIOS/a4co-ddd-microservices';
    this.coverageTarget = 80;
  }

  /**
   * Ejecuta todos los tests y valida cobertura
   */
  async executeTestsAndValidateCoverage() {
    console.log('🧪 Ejecutando Tests y Validando Cobertura...\n');

    try {
      await this.runUnitTests();
      await this.runIntegrationTests();
      await this.runE2ETests();
      await this.generateCoverageReport();
      await this.validateCoverageThresholds();
      await this.updateCoverageBadge();

      console.log('✅ Tests ejecutados y cobertura validada!');
    } catch (error) {
      console.error('❌ Error ejecutando tests:', error.message);
      process.exit(1);
    }
  }

  /**
   * Ejecuta tests unitarios
   */
  async runUnitTests() {
    console.log('🔬 Ejecutando tests unitarios...');

    try {
      execSync('pnpm run test', {
        cwd: this.projectRoot,
        stdio: 'inherit'
      });
      console.log('  ✅ Tests unitarios pasaron');
    } catch (error) {
      console.error('  ❌ Tests unitarios fallaron');
      throw error;
    }
  }

  /**
   * Ejecuta tests de integración
   */
  async runIntegrationTests() {
    console.log('🔗 Ejecutando tests de integración...');

    try {
      // Los tests de integración están incluidos en el comando test general
      console.log('  ✅ Tests de integración incluidos en suite general');
    } catch (error) {
      console.error('  ❌ Tests de integración fallaron');
      throw error;
    }
  }

  /**
   * Ejecuta tests E2E
   */
  async runE2ETests() {
    console.log('🌐 Ejecutando tests E2E...');

    try {
      execSync('pnpm run test:e2e', {
        cwd: this.projectRoot,
        stdio: 'inherit'
      });
      console.log('  ✅ Tests E2E pasaron');
    } catch (error) {
      console.error('  ❌ Tests E2E fallaron');
      throw error;
    }
  }

  /**
   * Genera reporte de cobertura
   */
  async generateCoverageReport() {
    console.log('📊 Generando reporte de cobertura...');

    try {
      execSync('pnpm run test:coverage', {
        cwd: this.projectRoot,
        stdio: 'inherit'
      });

      // Leer el reporte generado
      const coverageSummaryPath = path.join(this.projectRoot, 'coverage', 'coverage-summary.json');
      if (fs.existsSync(coverageSummaryPath)) {
        const coverageData = JSON.parse(fs.readFileSync(coverageSummaryPath, 'utf8'));
        this.displayCoverageSummary(coverageData);
      }

      console.log('  ✅ Reporte de cobertura generado');
    } catch (error) {
      console.error('  ❌ Error generando reporte de cobertura');
      throw error;
    }
  }

  /**
   * Muestra resumen de cobertura
   */
  displayCoverageSummary(coverageData) {
    console.log('\n📈 Resumen de Cobertura:');
    console.log('=' .repeat(50));

    const total = coverageData.total;
    console.log(`📊 Cobertura Total:`);
    console.log(`  • Líneas: ${total.lines.pct}%`);
    console.log(`  • Funciones: ${total.functions.pct}%`);
    console.log(`  • Ramas: ${total.branches.pct}%`);
    console.log(`  • Statements: ${total.statements.pct}%`);

    // Mostrar cobertura por archivo/directorio
    console.log('\n📁 Cobertura por Directorio:');
    Object.entries(coverageData).forEach(([file, data]) => {
      if (file !== 'total') {
        const lines = data.lines.pct;
        const status = lines >= this.coverageTarget ? '✅' : lines >= 70 ? '⚠️' : '❌';
        console.log(`  ${status} ${file}: ${lines}%`);
      }
    });
  }

  /**
   * Valida umbrales de cobertura
   */
  async validateCoverageThresholds() {
    console.log('🎯 Validando umbrales de cobertura...');

    const coverageSummaryPath = path.join(this.projectRoot, 'coverage', 'coverage-summary.json');

    if (!fs.existsSync(coverageSummaryPath)) {
      throw new Error('Archivo de resumen de cobertura no encontrado');
    }

    const coverageData = JSON.parse(fs.readFileSync(coverageSummaryPath, 'utf8'));
    const total = coverageData.total;

    const thresholds = {
      lines: this.coverageTarget,
      functions: this.coverageTarget,
      branches: this.coverageTarget - 10, // 70% para branches
      statements: this.coverageTarget,
    };

    let allPassed = true;
    const failures = [];

    Object.entries(thresholds).forEach(([metric, threshold]) => {
      const actual = total[metric].pct;
      if (actual < threshold) {
        allPassed = false;
        failures.push(`${metric}: ${actual}% < ${threshold}%`);
      }
    });

    if (!allPassed) {
      console.error('❌ Umbrales de cobertura no cumplidos:');
      failures.forEach(failure => console.error(`  • ${failure}`));
      throw new Error('Cobertura insuficiente');
    }

    console.log('  ✅ Todos los umbrales cumplidos');
  }

  /**
   * Actualiza badge de cobertura
   */
  async updateCoverageBadge() {
    console.log('🏷️ Actualizando badge de cobertura...');

    const coverageSummaryPath = path.join(this.projectRoot, 'coverage', 'coverage-summary.json');

    if (!fs.existsSync(coverageSummaryPath)) {
      console.warn('  ⚠️ Archivo de cobertura no encontrado, saltando badge');
      return;
    }

    const coverageData = JSON.parse(fs.readFileSync(coverageSummaryPath, 'utf8'));
    const totalCoverage = coverageData.total.lines.pct;

    // Crear badge SVG simple
    const badgeSvg = this.generateCoverageBadge(totalCoverage);
    fs.writeFileSync(path.join(this.projectRoot, 'coverage-badge.svg'), badgeSvg);

    // Actualizar README con badge
    this.updateReadmeWithBadge(totalCoverage);

    console.log('  ✅ Badge actualizado');
  }

  /**
   * Genera badge SVG de cobertura
   */
  generateCoverageBadge(percentage) {
    const color = percentage >= 80 ? '#4CAF50' : percentage >= 70 ? '#FF9800' : '#f44336';
    const status = percentage >= 80 ? 'excellent' : percentage >= 70 ? 'good' : 'poor';

    return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="20">
  <rect width="50" height="20" fill="#555"/>
  <rect x="50" width="70" height="20" fill="${color}"/>
  <text x="25" y="14" fill="white" font-family="Arial" font-size="11" text-anchor="middle">coverage</text>
  <text x="85" y="14" fill="white" font-family="Arial" font-size="11" text-anchor="middle">${percentage}%</text>
</svg>`;
  }

  /**
   * Actualiza README con badge de cobertura
   */
  updateReadmeWithBadge(percentage) {
    const readmePath = path.join(this.projectRoot, 'README.md');

    if (!fs.existsSync(readmePath)) {
      console.warn('  ⚠️ README.md no encontrado');
      return;
    }

    let readme = fs.readFileSync(readmePath, 'utf8');

    // Buscar y reemplazar badge existente o agregar uno nuevo
    const badgeRegex = /!\[Coverage\]\([^)]*\)/;
    const newBadge = `![Coverage](coverage-badge.svg)`;

    if (badgeRegex.test(readme)) {
      readme = readme.replace(badgeRegex, newBadge);
    } else {
      // Agregar al inicio después del título
      const titleRegex = /^(# .*\n)/m;
      readme = readme.replace(titleRegex, `$1\n${newBadge}\n`);
    }

    fs.writeFileSync(readmePath, readme);
  }

  /**
   * Ejecuta análisis estático adicional
   */
  async runAdditionalAnalysis() {
    console.log('🔍 Ejecutando análisis adicional...');

    try {
      // Ejecutar ESLint
      execSync('pnpm run lint', {
        cwd: this.projectRoot,
        stdio: 'inherit'
      });

      // Ejecutar análisis de duplicación de código
      execSync('pnpm run jscpd', {
        cwd: this.projectRoot,
        stdio: 'inherit'
      });

      console.log('  ✅ Análisis adicional completado');
    } catch (error) {
      console.error('  ❌ Error en análisis adicional');
      throw error;
    }
  }

  /**
   * Genera reporte final
   */
  generateFinalReport() {
    console.log('📋 Generando reporte final...');

    const report = {
      timestamp: new Date().toISOString(),
      testResults: {
        unit: 'passed',
        integration: 'passed',
        e2e: 'passed'
      },
      coverage: {
        target: this.coverageTarget,
        achieved: true
      },
      quality: {
        linting: 'passed',
        duplication: 'passed'
      }
    };

    fs.writeFileSync(
      path.join(this.projectRoot, 'test-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log('  ✅ Reporte final generado');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const testExecutor = new TestExecutionAndCoverage();
  testExecutor.executeTestsAndValidateCoverage()
    .then(() => testExecutor.runAdditionalAnalysis())
    .then(() => testExecutor.generateFinalReport())
    .then(() => console.log('🎉 Todos los tests y validaciones completados exitosamente!'))
    .catch(error => {
      console.error('💥 Error en ejecución de tests:', error.message);
      process.exit(1);
    });
}

module.exports = TestExecutionAndCoverage;