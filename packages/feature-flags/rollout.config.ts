export const ROLLOUT_CONFIG = {
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
