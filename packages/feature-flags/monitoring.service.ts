import { Injectable } from '@nestjs/common';
import { ProductionFeatureFlagService } from './production-feature-flag.service';
import { ROLLOUT_CONFIG } from './rollout.config';

@Injectable()
export class FeatureFlagMonitoringService {
  private metrics: Map<string, any> = new Map();

  constructor(private featureFlagService: ProductionFeatureFlagService) {
    // Iniciar monitoreo periódico
    setInterval(() => this.collectMetrics(), ROLLOUT_CONFIG.monitoringInterval);
  }

  private async collectMetrics() {
    const flags = await this.featureFlagService.getAllFlags();

    for (const [flagName, enabled] of Object.entries(flags)) {
      if (!enabled) continue;

      const status = await this.featureFlagService.getFlagStatus(flagName);
      if (status.rollout) {
        await this.monitorRollout(flagName, status);
      }
    }
  }

  private async monitorRollout(flagName: string, status: any) {
    // Recopilar métricas de error y performance
    const metrics = await this.gatherMetrics(flagName);

    // Verificar umbrales
    if (metrics.errorRate > ROLLOUT_CONFIG.errorThreshold) {
      console.error(`[!] HIGH ERROR RATE for feature '${flagName}': ${metrics.errorRate * 100}%`);
      await this.triggerAlert(flagName, 'high_error_rate', metrics);
    }

    if (metrics.performance < ROLLOUT_CONFIG.performanceThreshold) {
      console.warn(`⚠️ LOW PERFORMANCE for feature '${flagName}': ${metrics.performance * 100}%`);
      await this.triggerAlert(flagName, 'low_performance', metrics);
    }

    // Almacenar métricas
    this.metrics.set(flagName, {
      ...metrics,
      timestamp: Date.now(),
      rollout: status.rollout,
    });
  }

  private async gatherMetrics(flagName: string): Promise<any> {
    // En una implementación real, esto vendría de tu sistema de monitoreo
    // (DataDog, New Relic, CloudWatch, etc.)
    return {
      errorRate: Math.random() * 0.1, // Simulado
      performance: 0.8 + Math.random() * 0.2, // Simulado
      usage: Math.floor(Math.random() * 1000),
      responseTime: 100 + Math.random() * 200,
    };
  }

  private async triggerAlert(flagName: string, alertType: string, metrics: any) {
    // En producción, esto enviaría alertas a Slack, PagerDuty, etc.
    console.error(`[!] ALERT: ${alertType.toUpperCase()} for feature '${flagName}'`);
    console.error(`Metrics: ${JSON.stringify(metrics, null, 2)}`);

    // Auto-pause rollout si es crítico
    if (alertType === 'high_error_rate') {
      console.error(`🛑 Auto-pausing rollout for '${flagName}' due to high error rate`);
      // await this.rolloutService.pauseRollout(flagName);
    }
  }

  async getMetrics(flagName?: string): Promise<any> {
    if (flagName) {
      return this.metrics.get(flagName) || null;
    }

    const allMetrics: Record<string, any> = {};
    for (const [key, value] of this.metrics.entries()) {
      allMetrics[key] = value;
    }
    return allMetrics;
  }

  async getHealthStatus(flagName: string): Promise<'healthy' | 'warning' | 'critical'> {
    const metrics = this.metrics.get(flagName);
    if (!metrics) return 'healthy';

    if (metrics.errorRate > ROLLOUT_CONFIG.errorThreshold) {
      return 'critical';
    }

    if (metrics.performance < ROLLOUT_CONFIG.performanceThreshold) {
      return 'warning';
    }

    return 'healthy';
  }
}
