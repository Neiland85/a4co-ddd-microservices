import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { FLAGS_CONFIG, FlagConfig } from './flags.config';

@Injectable()
export class ProductionFeatureFlagService {
  private redis: Redis;
  private localCache: Map<string, boolean> = new Map();

  constructor(@Inject('REDIS_CLIENT') redis: Redis) {
    this.redis = redis;
    this.initializeCache();
  }

  private async initializeCache() {
    // Cargar flags desde Redis con fallback a configuración local
    for (const [flagName, config] of Object.entries(FLAGS_CONFIG)) {
      const redisValue = await this.redis.get(`feature_flag:${flagName}`);
      if (redisValue !== null) {
        this.localCache.set(flagName, redisValue === 'true');
      } else {
        this.localCache.set(flagName, config.production);
      }
    }
  }

  async isEnabled(flagName: string, userId?: string): Promise<boolean> {
    // Verificar si el flag existe
    if (!FLAGS_CONFIG[flagName]) {
      return false;
    }

    // Verificar overrides por usuario
    if (userId) {
      const userOverride = await this.redis.get(`feature_flag:${flagName}:user:${userId}`);
      if (userOverride !== null) {
        return userOverride === 'true';
      }
    }

    // Verificar rollout gradual
    const rolloutEnabled = await this.checkRollout(flagName, userId);
    if (rolloutEnabled !== null) {
      return rolloutEnabled;
    }

    // Retornar valor de cache
    return this.localCache.get(flagName) ?? false;
  }

  private async checkRollout(flagName: string, userId?: string): Promise<boolean | null> {
    const rolloutKey = `feature_flag_rollout:${flagName}`;
    const rolloutData = await this.redis.get(rolloutKey);

    if (!rolloutData || !userId) {
      return null;
    }

    try {
      const rollout = JSON.parse(rolloutData);
      return this.evaluateRollout(rollout, userId);
    } catch (error) {
      console.error(`Error parsing rollout data for ${flagName}:`, error);
      return null;
    }
  }

  private evaluateRollout(rollout: any, userId: string): boolean {
    switch (rollout.strategy) {
      case 'percentage':
        return this.evaluatePercentageRollout(rollout, userId);
      case 'user_list':
        return rollout.users.includes(userId);
      case 'gradual':
        return this.evaluateGradualRollout(rollout, userId);
      default:
        return false;
    }
  }

  private evaluatePercentageRollout(rollout: any, userId: string): boolean {
    const hash = this.simpleHash(userId);
    const percentage = (hash % 100) / 100;
    return percentage < rollout.percentage;
  }

  private evaluateGradualRollout(rollout: any, userId: string): boolean {
    // Implementar lógica de rollout gradual basado en tiempo
    const now = Date.now();
    const startTime = rollout.startTime;
    const duration = rollout.duration;
    const progress = Math.min((now - startTime) / duration, 1);

    const hash = this.simpleHash(userId);
    const userPercentage = (hash % 100) / 100;

    return userPercentage < progress;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a 32 bits
    }
    return Math.abs(hash);
  }

  async setFlag(flagName: string, enabled: boolean): Promise<void> {
    await this.redis.set(`feature_flag:${flagName}`, enabled.toString());
    this.localCache.set(flagName, enabled);

    // Log del cambio
    console.log(`🚩 Feature flag '${flagName}' ${enabled ? 'enabled' : 'disabled'} in production`);
  }

  async setUserOverride(flagName: string, userId: string, enabled: boolean): Promise<void> {
    await this.redis.set(`feature_flag:${flagName}:user:${userId}`, enabled.toString());
    console.log(`👤 User override for '${flagName}': ${userId} = ${enabled}`);
  }

  async startRollout(flagName: string, strategy: any): Promise<void> {
    const rolloutData = {
      ...strategy,
      startTime: Date.now(),
    };

    await this.redis.set(`feature_flag_rollout:${flagName}`, JSON.stringify(rolloutData));
    console.log(`📈 Started rollout for '${flagName}' with strategy: ${strategy.strategy}`);
  }

  async stopRollout(flagName: string): Promise<void> {
    await this.redis.del(`feature_flag_rollout:${flagName}`);
    console.log(`🛑 Stopped rollout for '${flagName}'`);
  }

  async getAllFlags(): Promise<Record<string, boolean>> {
    const result: Record<string, boolean> = {};
    for (const flagName of Object.keys(FLAGS_CONFIG)) {
      result[flagName] = await this.isEnabled(flagName);
    }
    return result;
  }

  async getFlagStatus(flagName: string): Promise<any> {
    const enabled = await this.isEnabled(flagName);
    const rolloutData = await this.redis.get(`feature_flag_rollout:${flagName}`);

    return {
      name: flagName,
      enabled,
      config: FLAGS_CONFIG[flagName],
      rollout: rolloutData ? JSON.parse(rolloutData) : null,
    };
  }
}
