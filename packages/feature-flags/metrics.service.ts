import { Injectable } from '@nestjs/common';
import { ProductionFeatureFlagService } from './production-feature-flag.service';

@Injectable()
export class FeatureFlagMetricsService {
  constructor(private featureFlagService: ProductionFeatureFlagService) {}

  async getFeatureUsageStats(flagName: string): Promise<any> {
    // En producción, esto vendría de tu sistema de analytics
    return {
      totalUsers: Math.floor(Math.random() * 10000),
      activeUsers: Math.floor(Math.random() * 5000),
      conversionRate: Math.random(),
      retentionRate: 0.7 + Math.random() * 0.3,
      timeSpent: Math.floor(Math.random() * 300), // segundos
    };
  }

  async getRolloutProgress(flagName: string): Promise<any> {
    const status = await this.featureFlagService.getFlagStatus(flagName);

    if (!status.rollout) {
      return { progress: 1, status: 'completed' };
    }

    const rollout = status.rollout;
    const now = Date.now();

    switch (rollout.strategy) {
      case 'percentage':
        return {
          progress: rollout.percentage,
          status: 'active',
          strategy: 'percentage',
        };

      case 'gradual':
        const elapsed = now - rollout.startTime;
        const progress = Math.min(elapsed / rollout.duration, 1);
        return {
          progress,
          status: progress >= 1 ? 'completed' : 'active',
          strategy: 'gradual',
          timeRemaining: Math.max(0, rollout.duration - elapsed),
        };

      case 'user_list':
        // En producción, calcular basado en usuarios activos
        return {
          progress: Math.random(), // Simulado
          status: 'active',
          strategy: 'user_list',
        };

      default:
        return { progress: 0, status: 'unknown' };
    }
  }

  async getFeatureHealthScore(flagName: string): Promise<number> {
    // Calcular un score de salud basado en múltiples métricas
    const metrics = await this.getFeatureUsageStats(flagName);
    const progress = await this.getRolloutProgress(flagName);

    let score = 100;

    // Penalizar baja conversión
    if (metrics.conversionRate < 0.5) score -= 20;

    // Penalizar baja retención
    if (metrics.retentionRate < 0.7) score -= 15;

    // Penalizar rollout lento
    if (progress.progress < 0.5) score -= 10;

    // Penalizar tiempo excesivo en rollout
    if (progress.timeRemaining && progress.timeRemaining < 0) score -= 25;

    return Math.max(0, Math.min(100, score));
  }

  async getAllFeaturesStatus(): Promise<any[]> {
    const flags = await this.featureFlagService.getAllFlags();
    const features = [];

    for (const flagName of Object.keys(flags)) {
      const status = await this.featureFlagService.getFlagStatus(flagName);
      const usage = await this.getFeatureUsageStats(flagName);
      const progress = await this.getRolloutProgress(flagName);
      const health = await this.getFeatureHealthScore(flagName);

      features.push({
        name: flagName,
        enabled: status.enabled,
        rollout: progress,
        usage,
        health,
        config: status.config,
      });
    }

    return features;
  }
}
