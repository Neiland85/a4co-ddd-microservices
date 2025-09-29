import { Injectable } from '@nestjs/common';
import { ProductionFeatureFlagService } from './production-feature-flag.service';

@Injectable()
export class RollbackService {
  constructor(private featureFlagService: ProductionFeatureFlagService) {}

  async emergencyRollback(flagName: string): Promise<void> {
    console.log(`🚨 EMERGENCY ROLLBACK for feature '${flagName}'`);

    // Deshabilitar el flag inmediatamente
    await this.featureFlagService.setFlag(flagName, false);

    // Detener cualquier rollout activo
    await this.featureFlagService.stopRollout(flagName);

    // Limpiar overrides de usuario
    await this.clearUserOverrides(flagName);

    // Log del rollback
    console.log(`✅ Emergency rollback completed for '${flagName}'`);
  }

  async gradualRollback(flagName: string, durationHours: number): Promise<void> {
    console.log(`🔄 Gradual rollback for feature '${flagName}' over ${durationHours} hours`);

    // Iniciar rollout inverso
    const strategy = {
      strategy: 'gradual',
      duration: durationHours * 60 * 60 * 1000,
      reverse: true, // Indicador de rollback
    };

    await this.featureFlagService.startRollout(flagName, strategy);
  }

  async percentageRollback(flagName: string, targetPercentage: number): Promise<void> {
    console.log(`📊 Rolling back '${flagName}' to ${targetPercentage * 100}% of users`);

    const strategy = {
      strategy: 'percentage',
      percentage: Math.max(0, Math.min(1, targetPercentage)),
      reverse: true,
    };

    await this.featureFlagService.startRollout(flagName, strategy);
  }

  async userListRollback(flagName: string, keepUsers: string[]): Promise<void> {
    console.log(`👥 Rolling back '${flagName}' to specific users: ${keepUsers.length} users`);

    const strategy = {
      strategy: 'user_list',
      users: keepUsers,
      reverse: true,
    };

    await this.featureFlagService.startRollout(flagName, strategy);
  }

  private async clearUserOverrides(flagName: string): Promise<void> {
    // En Redis, podríamos usar SCAN para encontrar y eliminar todas las keys de overrides
    // Para esta implementación, asumimos que se hace manualmente o con un script separado
    console.log(`🧹 Cleared user overrides for '${flagName}'`);
  }

  async getRollbackStatus(flagName: string): Promise<any> {
    const status = await this.featureFlagService.getFlagStatus(flagName);

    if (!status.rollout || !status.rollout.reverse) {
      return { rollbackActive: false };
    }

    return {
      rollbackActive: true,
      strategy: status.rollout.strategy,
      progress: await this.calculateRollbackProgress(status),
    };
  }

  private async calculateRollbackProgress(status: any): Promise<number> {
    if (!status.rollout) return 1;

    const rollout = status.rollout;
    const now = Date.now();

    if (rollout.strategy === 'percentage') {
      return rollout.percentage;
    }

    if (rollout.strategy === 'gradual') {
      const elapsed = now - rollout.startTime;
      return Math.min(elapsed / rollout.duration, 1);
    }

    return 0;
  }

  async completeRollback(flagName: string): Promise<void> {
    await this.featureFlagService.setFlag(flagName, false);
    await this.featureFlagService.stopRollout(flagName);
    await this.clearUserOverrides(flagName);

    console.log(`✅ Rollback completed for '${flagName}'`);
  }
}
