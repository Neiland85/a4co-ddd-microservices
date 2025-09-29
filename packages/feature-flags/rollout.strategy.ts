export interface RolloutStrategy {
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
