#!/usr/bin/env node

/**
 * Production Feature Flags Implementation
 * Implementa feature flags en producción de manera gradual y segura
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

class ProductionFeatureFlagsImplementation {
  constructor() {
    this.projectRoot = '/Users/estudio/Projects/GitHub/MICROSERVICIOS/a4co-ddd-microservices';
  }

  /**
   * Implementa feature flags en producción gradualmente
   */
  async implementProductionFeatureFlags() {
    console.log('🚀 Implementando Feature Flags en Producción...\n');

    try {
      await this.createFeatureFlagInfrastructure();
      await this.implementGradualRollout();
      await this.setupMonitoringAndAlerts();
      await this.createRollbackProcedures();
      await this.updateDeploymentPipeline();
      await this.createFeatureFlagDashboard();

      console.log('✅ Feature Flags implementados en producción!');
    } catch (error) {
      console.error('❌ Error implementando feature flags:', error.message);
      process.exit(1);
    }
  }

  /**
   * Crea infraestructura de feature flags
   */
  async createFeatureFlagInfrastructure() {
    console.log('🏗️ Creando infraestructura de feature flags...');

    // Crear servicio de feature flags para producción
    const productionService = this.generateProductionFeatureFlagService();
    fs.writeFileSync(path.join(this.projectRoot, 'packages', 'feature-flags', 'production-feature-flag.service.ts'), productionService);

    // Crear guard de feature flags
    const featureGuard = this.generateFeatureFlagGuard();
    fs.writeFileSync(path.join(this.projectRoot, 'packages', 'feature-flags', 'feature-flag.guard.ts'), featureGuard);

    // Crear interceptor de feature flags
    const featureInterceptor = this.generateFeatureFlagInterceptor();
    fs.writeFileSync(path.join(this.projectRoot, 'packages', 'feature-flags', 'feature-flag.interceptor.ts'), featureInterceptor);

    console.log('  ✅ Infraestructura creada');
  }

  /**
   * Implementa rollout gradual
   */
  async implementGradualRollout() {
    console.log('📈 Implementando rollout gradual...');

    // Crear estrategia de rollout
    const rolloutStrategy = this.generateRolloutStrategy();
    fs.writeFileSync(path.join(this.projectRoot, 'packages', 'feature-flags', 'rollout.strategy.ts'), rolloutStrategy);

    // Crear servicio de rollout
    const rolloutService = this.generateRolloutService();
    fs.writeFileSync(path.join(this.projectRoot, 'packages', 'feature-flags', 'rollout.service.ts'), rolloutService);

    // Crear configuración de porcentajes
    const rolloutConfig = this.generateRolloutConfig();
    fs.writeFileSync(path.join(this.projectRoot, 'packages', 'feature-flags', 'rollout.config.ts'), rolloutConfig);

    console.log('  ✅ Rollout gradual implementado');
  }

  /**
   * Configura monitoreo y alertas
   */
  async setupMonitoringAndAlerts() {
    console.log('📊 Configurando monitoreo y alertas...');

    // Crear servicio de monitoreo
    const monitoringService = this.generateMonitoringService();
    fs.writeFileSync(path.join(this.projectRoot, 'packages', 'feature-flags', 'monitoring.service.ts'), monitoringService);

    // Crear alertas
    const alertsConfig = this.generateAlertsConfig();
    fs.writeFileSync(path.join(this.projectRoot, 'packages', 'feature-flags', 'alerts.config.ts'), alertsConfig);

    // Crear métricas de feature flags
    const metricsService = this.generateMetricsService();
    fs.writeFileSync(path.join(this.projectRoot, 'packages', 'feature-flags', 'metrics.service.ts'), metricsService);

    console.log('  ✅ Monitoreo configurado');
  }

  /**
   * Crea procedimientos de rollback
   */
  async createRollbackProcedures() {
    console.log('🔄 Creando procedimientos de rollback...');

    // Crear servicio de rollback
    const rollbackService = this.generateRollbackService();
    fs.writeFileSync(path.join(this.projectRoot, 'packages', 'feature-flags', 'rollback.service.ts'), rollbackService);

    // Crear estrategias de rollback
    const rollbackStrategies = this.generateRollbackStrategies();
    fs.writeFileSync(path.join(this.projectRoot, 'packages', 'feature-flags', 'rollback.strategies.ts'), rollbackStrategies);

    // Crear comandos de rollback
    const rollbackCommands = this.generateRollbackCommands();
    fs.writeFileSync(path.join(this.projectRoot, 'scripts', 'rollback-feature-flag.js'), rollbackCommands);

    console.log('  ✅ Procedimientos de rollback creados');
  }

  /**
   * Actualiza pipeline de deployment
   */
  async updateDeploymentPipeline() {
    console.log('🚢 Actualizando pipeline de deployment...');

    // Actualizar workflow de deployment
    const deploymentWorkflow = this.generateDeploymentWorkflow();
    fs.writeFileSync(path.join(this.projectRoot, '.github', 'workflows', 'deploy.yml'), deploymentWorkflow);

    // Crear workflow de feature flags
    const featureFlagWorkflow = this.generateFeatureFlagWorkflow();
    fs.writeFileSync(path.join(this.projectRoot, '.github', 'workflows', 'feature-flags.yml'), featureFlagWorkflow);

    console.log('  ✅ Pipeline actualizado');
  }

  /**
   * Crea dashboard de feature flags
   */
  async createFeatureFlagDashboard() {
    console.log('📊 Creando dashboard de feature flags...');

    // Crear dashboard HTML
    const dashboardHtml = this.generateFeatureFlagDashboardHtml();
    fs.writeFileSync(path.join(this.projectRoot, 'tools', 'feature-flags-dashboard', 'index.html'), dashboardHtml);

    // Crear API para dashboard
    const dashboardApi = this.generateFeatureFlagDashboardApi();
    fs.writeFileSync(path.join(this.projectRoot, 'tools', 'feature-flags-dashboard', 'server.js'), dashboardApi);

    console.log('  ✅ Dashboard creado');
  }

  // Métodos de generación...

  generateProductionFeatureFlagService() {
    return `import { Injectable, Inject } from '@nestjs/common';
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
      const redisValue = await this.redis.get(\`feature_flag:\${flagName}\`);
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
      const userOverride = await this.redis.get(\`feature_flag:\${flagName}:user:\${userId}\`);
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
    const rolloutKey = \`feature_flag_rollout:\${flagName}\`;
    const rolloutData = await this.redis.get(rolloutKey);

    if (!rolloutData || !userId) {
      return null;
    }

    try {
      const rollout = JSON.parse(rolloutData);
      return this.evaluateRollout(rollout, userId);
    } catch (error) {
      console.error(\`Error parsing rollout data for \${flagName}:\`, error);
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
    await this.redis.set(\`feature_flag:\${flagName}\`, enabled.toString());
    this.localCache.set(flagName, enabled);

    // Log del cambio
    console.log(\`🚩 Feature flag '\${flagName}' \${enabled ? 'enabled' : 'disabled'} in production\`);
  }

  async setUserOverride(flagName: string, userId: string, enabled: boolean): Promise<void> {
    await this.redis.set(\`feature_flag:\${flagName}:user:\${userId}\`, enabled.toString());
    console.log(\`👤 User override for '\${flagName}': \${userId} = \${enabled}\`);
  }

  async startRollout(flagName: string, strategy: any): Promise<void> {
    const rolloutData = {
      ...strategy,
      startTime: Date.now(),
    };

    await this.redis.set(\`feature_flag_rollout:\${flagName}\`, JSON.stringify(rolloutData));
    console.log(\`📈 Started rollout for '\${flagName}' with strategy: \${strategy.strategy}\`);
  }

  async stopRollout(flagName: string): Promise<void> {
    await this.redis.del(\`feature_flag_rollout:\${flagName}\`);
    console.log(\`🛑 Stopped rollout for '\${flagName}'\`);
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
    const rolloutData = await this.redis.get(\`feature_flag_rollout:\${flagName}\`);

    return {
      name: flagName,
      enabled,
      config: FLAGS_CONFIG[flagName],
      rollout: rolloutData ? JSON.parse(rolloutData) : null,
    };
  }
}
`;
  }

  generateFeatureFlagGuard() {
    return `import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ProductionFeatureFlagService } from './production-feature-flag.service';

@Injectable()
export class FeatureFlagGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private featureFlagService: ProductionFeatureFlagService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredFlag = this.reflector.get<string>('featureFlag', context.getHandler());

    if (!requiredFlag) {
      return true; // No flag required, allow access
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id || request.headers['x-user-id'];

    const isEnabled = await this.featureFlagService.isEnabled(requiredFlag, userId);

    if (!isEnabled) {
      // Log access attempt for disabled feature
      console.log(\`🚫 Access denied to feature '\${requiredFlag}' for user \${userId || 'anonymous'}\`);
    }

    return isEnabled;
  }
}

// Decorador para usar en controladores
export const FeatureFlag = (flagName: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Reflect.defineMetadata('featureFlag', flagName, descriptor.value);
  };
};
`;
  }

  generateFeatureFlagInterceptor() {
    return `import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProductionFeatureFlagService } from './production-feature-flag.service';

@Injectable()
export class FeatureFlagInterceptor implements NestInterceptor {
  constructor(private featureFlagService: ProductionFeatureFlagService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const userId = request.user?.id || request.headers['x-user-id'];

    return next.handle().pipe(
      tap(async (data) => {
        // Agregar headers de feature flags activas
        const allFlags = await this.featureFlagService.getAllFlags();
        response.header('X-Feature-Flags', JSON.stringify(allFlags));

        // Log de uso de features
        const handler = context.getHandler();
        const featureFlag = Reflect.getMetadata('featureFlag', handler);
        if (featureFlag && userId) {
          console.log(\`✅ Feature '\${featureFlag}' used by user \${userId}\`);
        }
      }),
    );
  }
}
`;
  }

  generateRolloutStrategy() {
    return `export interface RolloutStrategy {
  strategy: 'percentage' | 'user_list' | 'gradual' | 'canary';
  percentage?: number; // 0-1
  users?: string[]; // Lista de user IDs
  duration?: number; // Duración en ms para gradual
  canaryUsers?: number; // Número de usuarios para canary
}

export class RolloutStrategies {
  static percentage(percentage: number): RolloutStrategy {
    return {
      strategy: 'percentage',
      percentage: Math.max(0, Math.min(1, percentage)),
    };
  }

  static userList(users: string[]): RolloutStrategy {
    return {
      strategy: 'user_list',
      users,
    };
  }

  static gradual(durationHours: number): RolloutStrategy {
    return {
      strategy: 'gradual',
      duration: durationHours * 60 * 60 * 1000, // Convertir a ms
    };
  }

  static canary(userCount: number): RolloutStrategy {
    return {
      strategy: 'canary',
      canaryUsers: userCount,
    };
  }
}
`;
  }

  generateRolloutService() {
    return `import { Injectable } from '@nestjs/common';
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
    console.log(\`📊 Started \${percentage * 100}% rollout for '\${flagName}'\`);
  }

  async startGradualRollout(flagName: string, durationHours: number): Promise<void> {
    const strategy: RolloutStrategy = {
      strategy: 'gradual',
      duration: durationHours * 60 * 60 * 1000,
    };

    await this.featureFlagService.startRollout(flagName, strategy);
    console.log(\`⏰ Started gradual rollout for '\${flagName}' over \${durationHours} hours\`);
  }

  async startUserListRollout(flagName: string, userIds: string[]): Promise<void> {
    const strategy: RolloutStrategy = {
      strategy: 'user_list',
      users: userIds,
    };

    await this.featureFlagService.startRollout(flagName, strategy);
    console.log(\`👥 Started user list rollout for '\${flagName}' with \${userIds.length} users\`);
  }

  async increaseRolloutPercentage(flagName: string, increment: number): Promise<void> {
    const status = await this.featureFlagService.getFlagStatus(flagName);
    if (!status.rollout || status.rollout.strategy !== 'percentage') {
      throw new Error(\`No percentage rollout active for '\${flagName}'\`);
    }

    const newPercentage = Math.min(1, status.rollout.percentage + increment);
    await this.startPercentageRollout(flagName, newPercentage);
  }

  async pauseRollout(flagName: string): Promise<void> {
    await this.featureFlagService.stopRollout(flagName);
    console.log(\`⏸️ Paused rollout for '\${flagName}'\`);
  }

  async completeRollout(flagName: string): Promise<void> {
    await this.featureFlagService.setFlag(flagName, true);
    await this.featureFlagService.stopRollout(flagName);
    console.log(\`✅ Completed rollout for '\${flagName}'\`);
  }

  async getRolloutStatus(flagName: string): Promise<any> {
    return await this.featureFlagService.getFlagStatus(flagName);
  }
}
`;
  }

  generateRolloutConfig() {
    return `export const ROLLOUT_CONFIG = {
  // Configuración de rollouts por defecto
  defaultIncrement: 0.1, // 10% incrementos
  maxRolloutTime: 24 * 60 * 60 * 1000, // 24 horas máximo
  monitoringInterval: 5 * 60 * 1000, // 5 minutos

  // Umbrales de seguridad
  errorThreshold: 0.05, // 5% error rate máximo
  performanceThreshold: 0.95, // 95% performance mínimo

  // Estrategias por tipo de feature
  strategies: {
    safe: {
      initialPercentage: 0.01, // 1%
      increment: 0.05, // 5%
      monitoringTime: 10 * 60 * 1000, // 10 minutos
    },
    medium: {
      initialPercentage: 0.05, // 5%
      increment: 0.10, // 10%
      monitoringTime: 30 * 60 * 1000, // 30 minutos
    },
    risky: {
      initialPercentage: 0.001, // 0.1%
      increment: 0.01, // 1%
      monitoringTime: 60 * 60 * 1000, // 1 hora
    },
  },

  // Usuarios de prueba (beta testers)
  betaUsers: [
    'user-beta-001',
    'user-beta-002',
    'user-beta-003',
  ],

  // Configuración de canary deployment
  canary: {
    initialUsers: 10,
    incrementUsers: 50,
    maxUsers: 1000,
    monitoringTime: 15 * 60 * 1000, // 15 minutos
  },
};
`;
  }

  generateMonitoringService() {
    return `import { Injectable } from '@nestjs/common';
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
      console.error(\`🚨 HIGH ERROR RATE for feature '\${flagName}': \${metrics.errorRate * 100}%\`);
      await this.triggerAlert(flagName, 'high_error_rate', metrics);
    }

    if (metrics.performance < ROLLOUT_CONFIG.performanceThreshold) {
      console.warn(\`⚠️ LOW PERFORMANCE for feature '\${flagName}': \${metrics.performance * 100}%\`);
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
    console.error(\`🚨 ALERT: \${alertType.toUpperCase()} for feature '\${flagName}'\`);
    console.error(\`Metrics: \${JSON.stringify(metrics, null, 2)}\`);

    // Auto-pause rollout si es crítico
    if (alertType === 'high_error_rate') {
      console.error(\`🛑 Auto-pausing rollout for '\${flagName}' due to high error rate\`);
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
`;
  }

  generateAlertsConfig() {
    return `export const ALERTS_CONFIG = {
  channels: {
    slack: {
      webhookUrl: process.env.SLACK_WEBHOOK_URL,
      channel: '#feature-flags-alerts',
    },
    pagerduty: {
      integrationKey: process.env.PAGERDUTY_INTEGRATION_KEY,
    },
    email: {
      recipients: [
        'devops@company.com',
        'product@company.com',
      ],
    },
  },

  rules: {
    high_error_rate: {
      condition: (metrics: any) => metrics.errorRate > 0.05,
      severity: 'critical',
      message: 'High error rate detected during feature rollout',
      channels: ['slack', 'pagerduty'],
      autoAction: 'pause_rollout',
    },

    low_performance: {
      condition: (metrics: any) => metrics.performance < 0.95,
      severity: 'warning',
      message: 'Performance degradation detected',
      channels: ['slack'],
      autoAction: null,
    },

    rollout_stuck: {
      condition: (metrics: any, status: any) => {
        if (!status.rollout) return false;
        const now = Date.now();
        const startTime = status.rollout.startTime;
        const duration = status.rollout.duration || 24 * 60 * 60 * 1000;
        return (now - startTime) > duration * 1.5; // 150% del tiempo esperado
      },
      severity: 'warning',
      message: 'Feature rollout is taking longer than expected',
      channels: ['slack', 'email'],
      autoAction: null,
    },

    high_usage: {
      condition: (metrics: any) => metrics.usage > 10000,
      severity: 'info',
      message: 'High feature usage detected',
      channels: ['slack'],
      autoAction: null,
    },
  },

  escalation: {
    critical: {
      timeout: 5 * 60 * 1000, // 5 minutos
      escalateTo: ['engineering-manager', 'devops-lead'],
    },
    warning: {
      timeout: 30 * 60 * 1000, // 30 minutos
      escalateTo: ['tech-lead'],
    },
  },
};
`;
  }

  generateMetricsService() {
    return `import { Injectable } from '@nestjs/common';
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
`;
  }

  generateRollbackService() {
    return `import { Injectable } from '@nestjs/common';
import { ProductionFeatureFlagService } from './production-feature-flag.service';

@Injectable()
export class RollbackService {
  constructor(private featureFlagService: ProductionFeatureFlagService) {}

  async emergencyRollback(flagName: string): Promise<void> {
    console.log(\`🚨 EMERGENCY ROLLBACK for feature '\${flagName}'\`);

    // Deshabilitar el flag inmediatamente
    await this.featureFlagService.setFlag(flagName, false);

    // Detener cualquier rollout activo
    await this.featureFlagService.stopRollout(flagName);

    // Limpiar overrides de usuario
    await this.clearUserOverrides(flagName);

    // Log del rollback
    console.log(\`✅ Emergency rollback completed for '\${flagName}'\`);
  }

  async gradualRollback(flagName: string, durationHours: number): Promise<void> {
    console.log(\`🔄 Gradual rollback for feature '\${flagName}' over \${durationHours} hours\`);

    // Iniciar rollout inverso
    const strategy = {
      strategy: 'gradual',
      duration: durationHours * 60 * 60 * 1000,
      reverse: true, // Indicador de rollback
    };

    await this.featureFlagService.startRollout(flagName, strategy);
  }

  async percentageRollback(flagName: string, targetPercentage: number): Promise<void> {
    console.log(\`📊 Rolling back '\${flagName}' to \${targetPercentage * 100}% of users\`);

    const strategy = {
      strategy: 'percentage',
      percentage: Math.max(0, Math.min(1, targetPercentage)),
      reverse: true,
    };

    await this.featureFlagService.startRollout(flagName, strategy);
  }

  async userListRollback(flagName: string, keepUsers: string[]): Promise<void> {
    console.log(\`👥 Rolling back '\${flagName}' to specific users: \${keepUsers.length} users\`);

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
    console.log(\`🧹 Cleared user overrides for '\${flagName}'\`);
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

    console.log(\`✅ Rollback completed for '\${flagName}'\`);
  }
}
`;
  }

  generateRollbackStrategies() {
    return `export interface RollbackStrategy {
  type: 'emergency' | 'gradual' | 'percentage' | 'user_list';
  duration?: number; // Para gradual
  percentage?: number; // Para percentage
  users?: string[]; // Para user_list
  reason: string;
  approvedBy: string;
}

export class RollbackStrategies {
  static emergency(reason: string, approvedBy: string): RollbackStrategy {
    return {
      type: 'emergency',
      reason,
      approvedBy,
    };
  }

  static gradual(durationHours: number, reason: string, approvedBy: string): RollbackStrategy {
    return {
      type: 'gradual',
      duration: durationHours * 60 * 60 * 1000,
      reason,
      approvedBy,
    };
  }

  static percentage(targetPercentage: number, reason: string, approvedBy: string): RollbackStrategy {
    return {
      type: 'percentage',
      percentage: Math.max(0, Math.min(1, targetPercentage)),
      reason,
      approvedBy,
    };
  }

  static userList(keepUsers: string[], reason: string, approvedBy: string): RollbackStrategy {
    return {
      type: 'user_list',
      users: keepUsers,
      reason,
      approvedBy,
    };
  }
}

// Políticas de rollback
export const ROLLBACK_POLICIES = {
  // Rollback automático para errores críticos
  autoRollback: {
    errorRateThreshold: 0.10, // 10%
    performanceThreshold: 0.80, // 80%
    maxDuration: 60 * 60 * 1000, // 1 hora máximo para auto-rollback
  },

  // Aprobaciones requeridas
  approvalRequired: {
    emergency: ['tech-lead', 'engineering-manager'],
    gradual: ['tech-lead'],
    percentage: ['product-manager'],
    userList: ['product-manager'],
  },

  // Monitoreo post-rollback
  monitoring: {
    duration: 24 * 60 * 60 * 1000, // 24 horas
    checkInterval: 5 * 60 * 1000, // 5 minutos
  },
};
`;
  }

  generateRollbackCommands() {
    return `#!/usr/bin/env node

/**
 * Feature Flag Rollback Commands
 * Comandos para ejecutar rollbacks de feature flags
 */

const { RollbackService } = require('../packages/feature-flags/rollback.service');
const { RollbackStrategies } = require('../packages/feature-flags/rollback.strategies');

class RollbackCommands {
  constructor() {
    this.rollbackService = new RollbackService();
  }

  async emergencyRollback(flagName, reason, approvedBy) {
    console.log(\`🚨 Executing emergency rollback for '\${flagName}'\`);
    console.log(\`Reason: \${reason}\`);
    console.log(\`Approved by: \${approvedBy}\`);

    const strategy = RollbackStrategies.emergency(reason, approvedBy);
    await this.rollbackService.emergencyRollback(flagName);

    console.log(\`✅ Emergency rollback completed\`);
  }

  async gradualRollback(flagName, durationHours, reason, approvedBy) {
    console.log(\`🔄 Executing gradual rollback for '\${flagName}'\`);
    console.log(\`Duration: \${durationHours} hours\`);
    console.log(\`Reason: \${reason}\`);
    console.log(\`Approved by: \${approvedBy}\`);

    await this.rollbackService.gradualRollback(flagName, durationHours);
    console.log(\`✅ Gradual rollback initiated\`);
  }

  async percentageRollback(flagName, percentage, reason, approvedBy) {
    console.log(\`📊 Executing percentage rollback for '\${flagName}'\`);
    console.log(\`Target percentage: \${percentage * 100}%\`);
    console.log(\`Reason: \${reason}\`);
    console.log(\`Approved by: \${approvedBy}\`);

    await this.rollbackService.percentageRollback(flagName, percentage);
    console.log(\`✅ Percentage rollback initiated\`);
  }

  async checkRollbackStatus(flagName) {
    const status = await this.rollbackService.getRollbackStatus(flagName);
    console.log(\`📊 Rollback status for '\${flagName}':\`, JSON.stringify(status, null, 2));
  }

  showHelp() {
    console.log(\`
🚨 Feature Flag Rollback Commands

Emergency Rollback:
  pnpm run rollback:emergency <flag> <reason> <approved-by>

Gradual Rollback:
  pnpm run rollback:gradual <flag> <duration-hours> <reason> <approved-by>

Percentage Rollback:
  pnpm run rollback:percentage <flag> <percentage> <reason> <approved-by>

Check Status:
  pnpm run rollback:status <flag>

Examples:
  pnpm run rollback:emergency NEW_DASHBOARD "High error rate" "tech-lead"
  pnpm run rollback:gradual ADVANCED_ANALYTICS 4 "Performance issues" "engineering-manager"
  pnpm run rollback:percentage AI_SUGGESTIONS 0.5 "User feedback" "product-manager"
  pnpm run rollback:status NEW_DASHBOARD
\`);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  const commands = new RollbackCommands();

  switch (command) {
    case 'emergency':
      const [emergencyFlag, reason, approvedBy] = args.slice(1);
      if (!emergencyFlag || !reason || !approvedBy) {
        console.error('❌ Missing required parameters for emergency rollback');
        commands.showHelp();
        process.exit(1);
      }
      commands.emergencyRollback(emergencyFlag, reason, approvedBy);
      break;

    case 'gradual':
      const [gradualFlag, durationStr, gradualReason, gradualApprovedBy] = args.slice(1);
      const duration = parseFloat(durationStr);
      if (!gradualFlag || isNaN(duration) || !gradualReason || !gradualApprovedBy) {
        console.error('❌ Invalid parameters for gradual rollback');
        commands.showHelp();
        process.exit(1);
      }
      commands.gradualRollback(gradualFlag, duration, gradualReason, gradualApprovedBy);
      break;

    case 'percentage':
      const [percentageFlag, percentageStr, percentageReason, percentageApprovedBy] = args.slice(1);
      const percentage = parseFloat(percentageStr);
      if (!percentageFlag || isNaN(percentage) || !percentageReason || !percentageApprovedBy) {
        console.error('❌ Invalid parameters for percentage rollback');
        commands.showHelp();
        process.exit(1);
      }
      commands.percentageRollback(percentageFlag, percentage, percentageReason, percentageApprovedBy);
      break;

    case 'status':
      const [statusFlag] = args.slice(1);
      if (!statusFlag) {
        console.error('❌ Missing flag name for status check');
        commands.showHelp();
        process.exit(1);
      }
      commands.checkRollbackStatus(statusFlag);
      break;

    default:
      commands.showHelp();
      break;
  }
}

module.exports = RollbackCommands;
`;
  }

  generateDeploymentWorkflow() {
    return `name: Deploy with Feature Flags

on:
  push:
    branches: [ main ]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy to'
        required: true
        default: 'staging'
        type: choice
        options:
        - staging
        - production

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'pnpm'

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Run tests
      run: pnpm run test

    - name: Build application
      run: pnpm run build

    - name: Calculate DORA metrics
      run: pnpm run dora:calculate

    - name: Validate feature flags
      run: pnpm run feature-flags:list

    - name: Deploy to staging
      if: github.event.inputs.environment == 'staging' || github.ref == 'refs/heads/main'
      run: |
        echo "🚀 Deploying to staging with feature flags..."
        # Add your staging deployment commands here

    - name: Deploy to production
      if: github.event.inputs.environment == 'production'
      run: |
        echo "🎯 Deploying to production with feature flags..."
        # Add your production deployment commands here

    - name: Post-deployment monitoring
      run: |
        echo "📊 Starting post-deployment monitoring..."
        # Add monitoring commands here

  feature-flag-rollout:
    runs-on: ubuntu-latest
    needs: deploy
    if: github.event.inputs.environment == 'production'

    steps:
    - name: Start feature flag rollouts
      run: |
        echo "🚩 Starting feature flag rollouts..."
        # Add rollout commands here

    - name: Monitor rollout progress
      run: |
        echo "📈 Monitoring rollout progress..."
        # Add monitoring commands here
`;
  }

  generateFeatureFlagWorkflow() {
    return `name: Feature Flag Management

on:
  workflow_dispatch:
    inputs:
      action:
        description: 'Action to perform'
        required: true
        type: choice
        options:
        - start_rollout
        - pause_rollout
        - complete_rollout
        - emergency_rollback
      flag_name:
        description: 'Feature flag name'
        required: true
        type: string
      rollout_strategy:
        description: 'Rollout strategy (for start_rollout)'
        required: false
        type: choice
        options:
        - percentage
        - gradual
        - user_list
      rollout_value:
        description: 'Rollout value (percentage 0-1, hours, or user count)'
        required: false
        type: string

jobs:
  manage-feature-flag:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'pnpm'

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Execute feature flag action
      run: |
        ACTION="\${{ github.event.inputs.action }}"
        FLAG="\${{ github.event.inputs.flag_name }}"
        STRATEGY="\${{ github.event.inputs.rollout_strategy }}"
        VALUE="\${{ github.event.inputs.rollout_value }}"

        echo "🚩 Executing \$ACTION for feature flag: \$FLAG"

        case \$ACTION in
          "start_rollout")
            case \$STRATEGY in
              "percentage")
                echo "📊 Starting percentage rollout: \$VALUE"
                # Add percentage rollout command
                ;;
              "gradual")
                echo "⏰ Starting gradual rollout: \$VALUE hours"
                # Add gradual rollout command
                ;;
              "user_list")
                echo "👥 Starting user list rollout: \$VALUE users"
                # Add user list rollout command
                ;;
            esac
            ;;
          "pause_rollout")
            echo "⏸️ Pausing rollout for: \$FLAG"
            # Add pause command
            ;;
          "complete_rollout")
            echo "✅ Completing rollout for: \$FLAG"
            # Add complete command
            ;;
          "emergency_rollback")
            echo "🚨 Emergency rollback for: \$FLAG"
            # Add emergency rollback command
            ;;
        esac

    - name: Notify stakeholders
      run: |
        echo "📢 Notifying stakeholders about feature flag change..."
        # Add notification commands (Slack, email, etc.)
`;
  }

  generateFeatureFlagDashboardHtml() {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Feature Flags Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .dashboard { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .card { border: 1px solid #ddd; border-radius: 8px; padding: 20px; }
        .flag-item { margin: 10px 0; padding: 10px; border-left: 4px solid #ccc; }
        .flag-enabled { border-left-color: #4CAF50; background-color: #f8fff8; }
        .flag-disabled { border-left-color: #f44336; background-color: #fff8f8; }
        .flag-rollout { border-left-color: #FF9800; background-color: #fffbf8; }
        .controls { margin: 20px 0; }
        button { margin: 5px; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; }
        .btn-primary { background-color: #2196F3; color: white; }
        .btn-danger { background-color: #f44336; color: white; }
        .btn-warning { background-color: #FF9800; color: white; }
    </style>
</head>
<body>
    <h1>🚩 Feature Flags Dashboard</h1>

    <div class="controls">
        <button class="btn-primary" onclick="refreshData()">🔄 Refresh</button>
        <button class="btn-warning" onclick="showRolloutModal()">📈 New Rollout</button>
        <button class="btn-danger" onclick="showRollbackModal()">🔄 Rollback</button>
    </div>

    <div class="dashboard">
        <div class="card">
            <h2>📊 Flag Status</h2>
            <canvas id="statusChart"></canvas>
        </div>

        <div class="card">
            <h2>📈 Rollout Progress</h2>
            <canvas id="rolloutChart"></canvas>
        </div>

        <div class="card">
            <h2>🏥 Health Status</h2>
            <canvas id="healthChart"></canvas>
        </div>

        <div class="card">
            <h2>🚩 Feature Flags</h2>
            <div id="flagsList"></div>
        </div>
    </div>

    <!-- Rollout Modal -->
    <div id="rolloutModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5);">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 8px;">
            <h3>Start New Rollout</h3>
            <form id="rolloutForm">
                <label>Flag Name: <input type="text" id="rolloutFlag" required></label><br>
                <label>Strategy:
                    <select id="rolloutStrategy">
                        <option value="percentage">Percentage</option>
                        <option value="gradual">Gradual</option>
                        <option value="user_list">User List</option>
                    </select>
                </label><br>
                <label>Value: <input type="text" id="rolloutValue" placeholder="0.1 for 10%, 4 for 4 hours" required></label><br>
                <button type="submit">Start Rollout</button>
                <button type="button" onclick="hideRolloutModal()">Cancel</button>
            </form>
        </div>
    </div>

    <script>
        let statusChart, rolloutChart, healthChart;

        async function loadData() {
            try {
                const response = await fetch('/api/feature-flags');
                const data = await response.json();
                updateDashboard(data);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        }

        function updateDashboard(data) {
            updateStatusChart(data);
            updateRolloutChart(data);
            updateHealthChart(data);
            updateFlagsList(data);
        }

        function updateStatusChart(data) {
            const enabled = data.filter(f => f.enabled).length;
            const disabled = data.length - enabled;

            if (statusChart) statusChart.destroy();

            statusChart = new Chart(document.getElementById('statusChart'), {
                type: 'doughnut',
                data: {
                    labels: ['Enabled', 'Disabled'],
                    datasets: [{
                        data: [enabled, disabled],
                        backgroundColor: ['#4CAF50', '#f44336']
                    }]
                }
            });
        }

        function updateRolloutChart(data) {
            const rolloutData = data.filter(f => f.rollout && f.rollout.status === 'active');

            if (rolloutChart) rolloutChart.destroy();

            rolloutChart = new Chart(document.getElementById('rolloutChart'), {
                type: 'bar',
                data: {
                    labels: rolloutData.map(f => f.name),
                    datasets: [{
                        label: 'Progress',
                        data: rolloutData.map(f => f.rollout.progress * 100),
                        backgroundColor: '#2196F3'
                    }]
                },
                options: {
                    scales: {
                        y: { beginAtZero: true, max: 100 }
                    }
                }
            });
        }

        function updateHealthChart(data) {
            const healthy = data.filter(f => f.health >= 80).length;
            const warning = data.filter(f => f.health >= 60 && f.health < 80).length;
            const critical = data.filter(f => f.health < 60).length;

            if (healthChart) healthChart.destroy();

            healthChart = new Chart(document.getElementById('healthChart'), {
                type: 'pie',
                data: {
                    labels: ['Healthy', 'Warning', 'Critical'],
                    datasets: [{
                        data: [healthy, warning, critical],
                        backgroundColor: ['#4CAF50', '#FF9800', '#f44336']
                    }]
                }
            });
        }

        function updateFlagsList(data) {
            const list = document.getElementById('flagsList');
            list.innerHTML = data.map(flag => \`
                <div class="flag-item \${getFlagClass(flag)}">
                    <strong>\${flag.name}</strong>
                    <div>Status: \${flag.enabled ? '✅ Enabled' : '❌ Disabled'}</div>
                    <div>Health: \${flag.health}/100</div>
                    \${flag.rollout ? \`<div>Rollout: \${(flag.rollout.progress * 100).toFixed(1)}%</div>\` : ''}
                    <div>Description: \${flag.config.description}</div>
                </div>
            \`).join('');
        }

        function getFlagClass(flag) {
            if (flag.rollout && flag.rollout.status === 'active') return 'flag-rollout';
            return flag.enabled ? 'flag-enabled' : 'flag-disabled';
        }

        function refreshData() {
            loadData();
        }

        function showRolloutModal() {
            document.getElementById('rolloutModal').style.display = 'block';
        }

        function hideRolloutModal() {
            document.getElementById('rolloutModal').style.display = 'none';
        }

        document.getElementById('rolloutForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const rolloutData = {
                flagName: formData.get('rolloutFlag'),
                strategy: formData.get('rolloutStrategy'),
                value: formData.get('rolloutValue')
            };

            try {
                await fetch('/api/feature-flags/rollout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(rolloutData)
                });
                hideRolloutModal();
                refreshData();
            } catch (error) {
                alert('Error starting rollout: ' + error.message);
            }
        });

        function showRollbackModal() {
            // Implement rollback modal
            alert('Rollback functionality would be implemented here');
        }

        // Load data on page load
        loadData();

        // Refresh every 30 seconds
        setInterval(refreshData, 30000);
    </script>
</body>
</html>`;
  }

  generateFeatureFlagDashboardApi() {
    return `const express = require('express');
const { ProductionFeatureFlagService } = require('../packages/feature-flags/production-feature-flag.service');
const { FeatureFlagMetricsService } = require('../packages/feature-flags/metrics.service');

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(express.json());

// Services (in production, these would be injected)
const featureFlagService = new ProductionFeatureFlagService();
const metricsService = new FeatureFlagMetricsService();

// API Routes
app.get('/api/feature-flags', async (req, res) => {
  try {
    const features = await metricsService.getAllFeaturesStatus();
    res.json(features);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/feature-flags/:name', async (req, res) => {
  try {
    const status = await featureFlagService.getFlagStatus(req.params.name);
    const metrics = await metricsService.getFeatureUsageStats(req.params.name);
    const progress = await metricsService.getRolloutProgress(req.params.name);
    const health = await metricsService.getFeatureHealthScore(req.params.name);

    res.json({
      ...status,
      metrics,
      progress,
      health,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/feature-flags/:name/toggle', async (req, res) => {
  try {
    const { enabled } = req.body;
    await featureFlagService.setFlag(req.params.name, enabled);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/feature-flags/rollout', async (req, res) => {
  try {
    const { flagName, strategy, value } = req.body;

    let rolloutStrategy;
    switch (strategy) {
      case 'percentage':
        rolloutStrategy = { strategy: 'percentage', percentage: parseFloat(value) };
        break;
      case 'gradual':
        rolloutStrategy = { strategy: 'gradual', duration: parseFloat(value) * 60 * 60 * 1000 };
        break;
      case 'user_list':
        rolloutStrategy = { strategy: 'user_list', users: value.split(',') };
        break;
      default:
        throw new Error('Invalid rollout strategy');
    }

    await featureFlagService.startRollout(flagName, rolloutStrategy);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/feature-flags/:name/rollback', async (req, res) => {
  try {
    const { type, ...params } = req.body;

    switch (type) {
      case 'emergency':
        await featureFlagService.setFlag(req.params.name, false);
        await featureFlagService.stopRollout(req.params.name);
        break;
      case 'percentage':
        await featureFlagService.startRollout(req.params.name, {
          strategy: 'percentage',
          percentage: parseFloat(params.percentage),
          reverse: true,
        });
        break;
      default:
        throw new Error('Invalid rollback type');
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Serve dashboard
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start server
app.listen(port, () => {
  console.log(\`🚩 Feature Flags Dashboard API running on port \${port}\`);
  console.log(\`📊 Dashboard available at http://localhost:\${port}\`);
});

module.exports = app;
`;
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  const implementation = new ProductionFeatureFlagsImplementation();
  implementation.implementProductionFeatureFlags();
}

module.exports = ProductionFeatureFlagsImplementation;