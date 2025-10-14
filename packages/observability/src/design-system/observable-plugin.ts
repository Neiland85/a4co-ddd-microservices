/**
 * Plugin system for adding observability to Design System components
 */

import type { Logger } from '../logging/types';

export interface ObservabilityPlugin {
  name: string;
  version: string;

  init(_logger: Logger): void;
}

export interface ComponentObservabilityConfig {
  componentName: string;
  trackProps?: string[];
  trackEvents?: string[];
  customMetadata?: Record<string, unknown>;

  spanNaming?: (_props: unknown) => string;

  logLevel?: 'trace' | 'debug' | 'info';
}

/**
 * Create an observability plugin for a component
 */
export function createComponentPlugin(config: ComponentObservabilityConfig): ObservabilityPlugin {
  return {
    name: `${config.componentName}-observability`,
    version: '1.0.0',
    init(logger: Logger): void {
      // Plugin initialization logic
      logger.debug(`Observability plugin initialized for ${config.componentName}`);
    },
  };
}

/**
 * Design token tracking configuration
 */
export interface DesignTokenEvent {
  token: string;
  value: unknown;
  component: string;
  variant?: string;
  timestamp: string;
}

/**
 * Track design token usage
 */
export class DesignTokenTracker {
  private logger: Logger;
  private tokenUsage: Map<string, number> = new Map();

  constructor(logger: Logger) {
    this.logger = logger;
  }

  trackTokenUsage(event: DesignTokenEvent): void {
    const key = `${event.component}.${event.token}`;
    const currentCount = this.tokenUsage.get(key) || 0;
    this.tokenUsage.set(key, currentCount + 1);

    this.logger.trace('Design token used', {
      custom: {
        token: event.token,
        value: event.value,
        component: event.component,
        variant: event.variant,
        usageCount: currentCount + 1,
      },
    });
  }

  getTokenUsageReport(): Record<string, number> {
    const report: Record<string, number> = {};
    this.tokenUsage.forEach((count, token) => {
      report[token] = count;
    });
    return report;
  }
}

/**
 * Naming convention for spans and logs
 */
export class ObservabilityNaming {
  private static readonly PREFIX = 'ds';

  static formatSpanName(component: string, action: string, variant?: string): string {
    const parts = [this.PREFIX, component.toLowerCase()];
    if (variant) {
      parts.push(variant.toLowerCase());
    }
    parts.push(action.toLowerCase());
    return parts.join('.');
  }

  static formatLogMessage(component: string, event: string): string {
    return `[${component}] ${event}`;
  }

  static formatMetricName(component: string, metric: string): string {
    return `${this.PREFIX}_${component.toLowerCase()}_${metric.toLowerCase()}`;
  }
}

/**
 * Component performance tracker
 */
export class ComponentPerformanceTracker {
  private renderTimes: Map<string, number[]> = new Map();
  private logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  recordRenderTime(componentName: string, duration: number): void {
    const times = this.renderTimes.get(componentName) || [];
    times.push(duration);
    this.renderTimes.set(componentName, times);

    if (times.length % 100 === 0) {
      // Log aggregated metrics every 100 renders
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const p95 = this.calculatePercentile(times, 0.95);

      this.logger.info('Component render performance', {
        custom: {
          component: componentName,
          averageRenderTime: avg,
          p95RenderTime: p95,
          sampleSize: times.length,
        },
      });
    }
  }

  private calculatePercentile(values: number[], percentile: number): number {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.min(Math.floor(sorted.length * percentile), sorted.length - 1);
    return sorted[index]!;
  }

<<<<<<< HEAD
  getPerformanceReport(): Record<string, unknown> {
    const report: Record<string, unknown> = {};
=======
  getPerformanceReport(): Record<string, any> {
    const report: Record<string, any> = {};
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6

    this.renderTimes.forEach((times, component) => {
      report[component] = {
        count: times.length,
        average: times.reduce((a, b) => a + b, 0) / times.length,
        p50: this.calculatePercentile(times, 0.5),
        p95: this.calculatePercentile(times, 0.95),
        p99: this.calculatePercentile(times, 0.99),
      };
    });

    return report;
  }
}

/**
 * Style guide for observability
 */
export const ObservabilityStyleGuide = {
  // Span naming patterns
  spans: {
<<<<<<< HEAD
    interaction: (component: string, action: string): string =>
      `ds.${component.toLowerCase()}.${action.toLowerCase()}`,
    render: (component: string): string => `ds.${component.toLowerCase()}.render`,
    api: (component: string, operation: string): string =>
=======
    interaction: (component: string, action: string) =>
      `ds.${component.toLowerCase()}.${action.toLowerCase()}`,
    render: (component: string) => `ds.${component.toLowerCase()}.render`,
    api: (component: string, operation: string) =>
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
      `ds.${component.toLowerCase()}.api.${operation.toLowerCase()}`,
  },

  // Log message patterns
  logs: {
<<<<<<< HEAD
    interaction: (component: string, action: string): string =>
      `User interaction: ${action} on ${component}`,
    state: (component: string, state: string): string => `Component state: ${component} - ${state}`,
    error: (component: string, error: string): string => `Component error: ${component} - ${error}`,
=======
    interaction: (component: string, action: string) =>
      `User interaction: ${action} on ${component}`,
    state: (component: string, state: string) => `Component state: ${component} - ${state}`,
    error: (component: string, error: string) => `Component error: ${component} - ${error}`,
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  },

  // Attribute naming conventions
  attributes: {
    component: (_name: string): string => 'ds.component.name',

    variant: (_variant: string): string => 'ds.component.variant',

    size: (_size: string): string => 'ds.component.size',

    state: (_state: string): string => 'ds.component.state',

    theme: (_theme: string): string => 'ds.theme',
    token: (token: string): string => `ds.token.${token}`,
  },

  // Metric naming conventions
  metrics: {
<<<<<<< HEAD
    renderTime: (component: string): string => `ds_${component.toLowerCase()}_render_duration_ms`,
    interactionCount: (component: string, interaction: string): string =>
      `ds_${component.toLowerCase()}_${interaction.toLowerCase()}_total`,
    errorCount: (component: string): string => `ds_${component.toLowerCase()}_errors_total`,
=======
    renderTime: (component: string) => `ds_${component.toLowerCase()}_render_duration_ms`,
    interactionCount: (component: string, interaction: string) =>
      `ds_${component.toLowerCase()}_${interaction.toLowerCase()}_total`,
    errorCount: (component: string) => `ds_${component.toLowerCase()}_errors_total`,
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  },
};
