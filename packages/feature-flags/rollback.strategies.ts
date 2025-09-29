export interface RollbackStrategy {
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
