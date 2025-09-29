export const ALERTS_CONFIG = {
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
