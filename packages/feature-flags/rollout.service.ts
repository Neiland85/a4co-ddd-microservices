import { Injectable } from '@nestjs/common';
import { ProductionFeatureFlagService } from './production-feature-flag.service';
import { RolloutStrategy } from './rollout.strategy';

@Injectable()
export class RolloutService {
  constructor(private featureFlagService: ProductionFeatureFlagService) {}

  async startPercentageRollout(flagName: string, percentage: number): Promise<void> {
    const strategy: RolloutStrategy = {
      strategy: 'percentage',
      percentage: Math.max(0, Math.min(1, percentage)),
    };

    await this.featureFlagService.startRollout(flagName, strategy);
    console.log(`📊 Started ${percentage * 100}% rollout for '${flagName}'`);
  }

  async startGradualRollout(flagName: string, durationHours: number): Promise<void> {
    const strategy: RolloutStrategy = {
      strategy: 'gradual',
      duration: durationHours * 60 * 60 * 1000,
    };

    await this.featureFlagService.startRollout(flagName, strategy);
    console.log(`⏰ Started gradual rollout for '${flagName}' over ${durationHours} hours`);
  }

  async startUserListRollout(flagName: string, userIds: string[]): Promise<void> {
    const strategy: RolloutStrategy = {
      strategy: 'user_list',
      users: userIds,
    };

    await this.featureFlagService.startRollout(flagName, strategy);
    console.log(`👥 Started user list rollout for '${flagName}' with ${userIds.length} users`);
  }

  async increaseRolloutPercentage(flagName: string, increment: number): Promise<void> {
    const status = await this.featureFlagService.getFlagStatus(flagName);
    if (!status.rollout || status.rollout.strategy !== 'percentage') {
      throw new Error(`No percentage rollout active for '${flagName}'`);
    }

    const newPercentage = Math.min(1, status.rollout.percentage + increment);
    await this.startPercentageRollout(flagName, newPercentage);
  }

  async pauseRollout(flagName: string): Promise<void> {
    await this.featureFlagService.stopRollout(flagName);
    console.log(`⏸️ Paused rollout for '${flagName}'`);
  }

  async completeRollout(flagName: string): Promise<void> {
    await this.featureFlagService.setFlag(flagName, true);
    await this.featureFlagService.stopRollout(flagName);
    console.log(`✅ Completed rollout for '${flagName}'`);
  }

  async getRolloutStatus(flagName: string): Promise<any> {
    return await this.featureFlagService.getFlagStatus(flagName);
  }
}
