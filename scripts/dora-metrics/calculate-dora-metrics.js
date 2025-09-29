#!/usr/bin/env node

/**
 * DORA Metrics Calculator
 * Calcula métricas DORA (DevOps Research and Assessment) automáticamente
 *
 * Métricas calculadas:
 * - Deployment Frequency: Frecuencia de despliegues
 * - Lead Time for Changes: Tiempo desde commit hasta producción
 * - Change Failure Rate: Tasa de fallos en cambios
 * - Time to Restore Service: Tiempo para restaurar servicio
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class DORAMetricsCalculator {
  constructor() {
    this.metrics = {};
    this.periods = {
      daily: 1,
      weekly: 7,
      monthly: 30,
      quarterly: 90
    };
  }

  /**
   * Ejecuta todos los cálculos de métricas DORA
   */
  async calculateAllMetrics() {
    console.log('🚀 Calculando métricas DORA...\n');

    try {
      this.calculateDeploymentFrequency();
      this.calculateLeadTimeForChanges();
      this.calculateChangeFailureRate();
      this.calculateTimeToRestore();

      this.generateReport();
      this.saveMetrics();

      console.log('✅ Métricas DORA calculadas exitosamente!');
    } catch (error) {
      console.error('❌ Error calculando métricas DORA:', error.message);
      process.exit(1);
    }
  }

  /**
   * Calcula Deployment Frequency
   * Número de despliegues por período
   */
  calculateDeploymentFrequency() {
    console.log('📊 Calculando Deployment Frequency...');

    const periods = ['daily', 'weekly', 'monthly'];
    this.metrics.deploymentFrequency = {};

    for (const period of periods) {
      try {
        // Contar commits en el período (aproximación de deployments)
        const days = this.periods[period];
        const commitCount = parseInt(execSync(
          `git log --oneline --since="${days} days ago" | wc -l`,
          { encoding: 'utf8' }
        ).trim());

        // Calcular frecuencia por día
        const frequencyPerDay = commitCount / days;

        this.metrics.deploymentFrequency[period] = {
          commits: commitCount,
          frequencyPerDay: frequencyPerDay,
          category: this.categorizeDeploymentFrequency(frequencyPerDay)
        };
      } catch (error) {
        console.warn(`⚠️  Error calculando frecuencia para ${period}:`, error.message);
        this.metrics.deploymentFrequency[period] = { error: error.message };
      }
    }
  }

  /**
   * Categoriza la frecuencia de deployment según estándares DORA
   */
  categorizeDeploymentFrequency(frequencyPerDay) {
    if (frequencyPerDay >= 1) return 'ELITE'; // Múltiples por día
    if (frequencyPerDay >= 0.14) return 'HIGH'; // Semanal
    if (frequencyPerDay >= 0.03) return 'MEDIUM'; // Mensual
    return 'LOW'; // Trimestral o menos
  }

  /**
   * Calcula Lead Time for Changes
   * Tiempo promedio desde commit hasta deploy
   */
  calculateLeadTimeForChanges() {
    console.log('⏱️  Calculando Lead Time for Changes...');

    try {
      // Para un proyecto como este, aproximamos con tiempo entre commits
      // En un entorno real, esto vendría de datos de CI/CD
      const recentCommits = execSync(
        'git log --pretty=format:"%H %ct" -n 20',
        { encoding: 'utf8' }
      ).trim().split('\n');

      const timestamps = recentCommits.map(line => {
        const parts = line.split(' ');
        return parseInt(parts[1]);
      }).filter(Boolean);

      // Calcular intervalos promedio entre commits (en horas)
      let totalInterval = 0;
      let count = 0;

      for (let i = 1; i < timestamps.length; i++) {
        const interval = (timestamps[i-1] - timestamps[i]) / 3600; // horas
        if (interval > 0 && interval < 24 * 7) { // Máximo 1 semana
          totalInterval += interval;
          count++;
        }
      }

      const avgLeadTimeHours = count > 0 ? totalInterval / count : 0;

      this.metrics.leadTimeForChanges = {
        averageHours: avgLeadTimeHours,
        category: this.categorizeLeadTime(avgLeadTimeHours)
      };
    } catch (error) {
      console.warn('⚠️  Error calculando lead time:', error.message);
      this.metrics.leadTimeForChanges = { error: error.message };
    }
  }

  /**
   * Categoriza el lead time según estándares DORA
   */
  categorizeLeadTime(hours) {
    if (hours < 1) return 'ELITE'; // Menos de 1 hora
    if (hours < 24) return 'HIGH'; // Menos de 1 día
    if (hours < 168) return 'MEDIUM'; // Menos de 1 semana
    if (hours < 720) return 'LOW'; // Menos de 1 mes
    return 'VERY_LOW'; // Más de 1 mes
  }

  /**
   * Calcula Change Failure Rate
   * Porcentaje de cambios que fallan
   */
  calculateChangeFailureRate() {
    console.log('❌ Calculando Change Failure Rate...');

    try {
      // Para este proyecto, aproximamos con fallos en tests
      // En un entorno real, esto vendría de datos de CI/CD
      const testResults = this.runTestsAndGetFailureRate();

      this.metrics.changeFailureRate = {
        failureRate: testResults.failureRate,
        category: this.categorizeFailureRate(testResults.failureRate)
      };
    } catch (error) {
      console.warn('⚠️  Error calculando failure rate:', error.message);
      this.metrics.changeFailureRate = { error: error.message };
    }
  }

  /**
   * Ejecuta tests y calcula tasa de fallos
   */
  runTestsAndGetFailureRate() {
    try {
      // Ejecutar tests y capturar resultados
      const testOutput = execSync('pnpm run test 2>&1 || true', {
        encoding: 'utf8',
        timeout: 300000 // 5 minutos timeout
      });

      // Analizar output para calcular fallos
      const failedTests = (testOutput.match(/failed/gi) || []).length;
      const totalTests = (testOutput.match(/test/gi) || []).length;

      const failureRate = totalTests > 0 ? (failedTests / totalTests) * 100 : 0;

      return { failureRate, totalTests, failedTests };
    } catch (error) {
      return { failureRate: 0, error: error.message };
    }
  }

  /**
   * Categoriza la tasa de fallos según estándares DORA
   */
  categorizeFailureRate(rate) {
    if (rate < 15) return 'ELITE'; // Menos del 15%
    if (rate < 30) return 'HIGH'; // 15-30%
    if (rate < 45) return 'MEDIUM'; // 30-45%
    return 'LOW'; // Más del 45%
  }

  /**
   * Calcula Time to Restore Service
   * Tiempo promedio para restaurar servicio
   */
  calculateTimeToRestore() {
    console.log('🔄 Calculando Time to Restore Service...');

    try {
      // Para este proyecto, aproximamos con tiempo de build/restart
      // En un entorno real, esto vendría de incidentes registrados
      const buildTime = this.measureBuildTime();

      this.metrics.timeToRestore = {
        averageMinutes: buildTime / 60,
        category: this.categorizeRestoreTime(buildTime / 60)
      };
    } catch (error) {
      console.warn('⚠️  Error calculando restore time:', error.message);
      this.metrics.timeToRestore = { error: error.message };
    }
  }

  /**
   * Mide tiempo de build como aproximación de restore time
   */
  measureBuildTime() {
    try {
      const startTime = Date.now();
      execSync('pnpm run build > /dev/null 2>&1', { timeout: 300000 });
      const endTime = Date.now();

      return (endTime - startTime) / 1000; // segundos
    } catch (error) {
      // Si build falla, usar tiempo estimado
      return 300; // 5 minutos como estimación conservadora
    }
  }

  /**
   * Categoriza el tiempo de restauración según estándares DORA
   */
  categorizeRestoreTime(minutes) {
    if (minutes < 60) return 'ELITE'; // Menos de 1 hora
    if (minutes < 1440) return 'HIGH'; // Menos de 1 día
    if (minutes < 10080) return 'MEDIUM'; // Menos de 1 semana
    return 'LOW'; // Más de 1 semana
  }

  /**
   * Genera reporte en consola
   */
  generateReport() {
    console.log('\n📈 === REPORTE DE MÉTRICAS DORA ===\n');

    console.log('🚀 DEPLOYMENT FREQUENCY:');
    Object.entries(this.metrics.deploymentFrequency).forEach(([period, data]) => {
      if (data.error) {
        console.log(`  ${period}: Error - ${data.error}`);
      } else {
        console.log(`  ${period}: ${data.commits} commits (${data.frequencyPerDay.toFixed(2)}/día) - ${data.category}`);
      }
    });

    console.log('\n⏱️  LEAD TIME FOR CHANGES:');
    if (this.metrics.leadTimeForChanges.error) {
      console.log(`  Error: ${this.metrics.leadTimeForChanges.error}`);
    } else {
      console.log(`  Promedio: ${this.metrics.leadTimeForChanges.averageHours.toFixed(1)} horas - ${this.metrics.leadTimeForChanges.category}`);
    }

    console.log('\n❌ CHANGE FAILURE RATE:');
    if (this.metrics.changeFailureRate.error) {
      console.log(`  Error: ${this.metrics.changeFailureRate.error}`);
    } else {
      console.log(`  Tasa: ${this.metrics.changeFailureRate.failureRate.toFixed(1)}% - ${this.metrics.changeFailureRate.category}`);
    }

    console.log('\n🔄 TIME TO RESTORE SERVICE:');
    if (this.metrics.timeToRestore.error) {
      console.log(`  Error: ${this.metrics.timeToRestore.error}`);
    } else {
      console.log(`  Promedio: ${this.metrics.timeToRestore.averageMinutes.toFixed(1)} minutos - ${this.metrics.timeToRestore.category}`);
    }

    // Calcular puntuación general
    const overallScore = this.calculateOverallScore();
    console.log(`\n🏆 PUNTUACIÓN GENERAL: ${overallScore.score}/16 - ${overallScore.category}`);
    console.log(`📊 Nivel DORA: ${overallScore.level}`);
  }

  /**
   * Calcula puntuación general DORA
   */
  calculateOverallScore() {
    const categories = {
      'ELITE': 4,
      'HIGH': 3,
      'MEDIUM': 2,
      'LOW': 1,
      'VERY_LOW': 0
    };

    let totalScore = 0;
    let metricsCount = 0;

    // Deployment Frequency (último período disponible)
    const df = this.metrics.deploymentFrequency?.daily;
    if (df && !df.error) {
      totalScore += categories[df.category] || 0;
      metricsCount++;
    }

    // Lead Time
    const lt = this.metrics.leadTimeForChanges;
    if (lt && !lt.error) {
      totalScore += categories[lt.category] || 0;
      metricsCount++;
    }

    // Change Failure Rate
    const cfr = this.metrics.changeFailureRate;
    if (cfr && !cfr.error) {
      totalScore += categories[cfr.category] || 0;
      metricsCount++;
    }

    // Time to Restore
    const ttr = this.metrics.timeToRestore;
    if (ttr && !ttr.error) {
      totalScore += categories[ttr.category] || 0;
      metricsCount++;
    }

    const maxScore = metricsCount * 4;
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    let category, level;
    if (percentage >= 90) {
      category = 'ELITE';
      level = '🏆 EXCELENTE - Elite Performer';
    } else if (percentage >= 75) {
      category = 'HIGH';
      level = '🥇 MUY BUENO - High Performer';
    } else if (percentage >= 50) {
      category = 'MEDIUM';
      level = '🥈 BUENO - Medium Performer';
    } else {
      category = 'LOW';
      level = '🥉 MEJORABLE - Low Performer';
    }

    return {
      score: `${totalScore}/${maxScore}`,
      percentage: percentage.toFixed(1),
      category,
      level
    };
  }

  /**
   * Guarda métricas en archivo JSON
   */
  saveMetrics() {
    const timestamp = new Date().toISOString();
    const filename = `dora-metrics-${new Date().toISOString().split('T')[0]}.json`;

    const data = {
      timestamp,
      metrics: this.metrics,
      overall: this.calculateOverallScore()
    };

    fs.writeFileSync(path.join('tools/dora-dashboard', filename), JSON.stringify(data, null, 2));
    console.log(`💾 Métricas guardadas en: tools/dora-dashboard/${filename}`);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const calculator = new DORAMetricsCalculator();
  calculator.calculateAllMetrics();
}

module.exports = DORAMetricsCalculator;