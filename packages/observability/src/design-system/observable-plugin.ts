/**
 * Plugin system for adding observability to Design System components
 */

import { Logger } from '../logging/types';
import { Span } from '@opentelemetry/api';

export interface ObservabilityPlugin {
  name: string;
  version: string;
  init(logger: Logger): void;
}

export interface ComponentObservabilityConfig {
  componentName: string;
  trackProps?: string[];
  trackEvents?: string[];
  customMetadata?: Record<string, any>;
  spanNaming?: (props: any) => string;
  logLevel?: 'trace' | 'debug' | 'info';
}

/**
 * Create an observability plugin for a component
 */
export function createComponentPlugin(config: ComponentObservabilityConfig): ObservabilityPlugin {
  return {
    name: `${config.componentName}-observability`,
    version: '1.0.0',
    init(logger: Logger) {
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
  value: any;
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
    const index = Math.floor(sorted.length * percentile);
    return sorted[index];
  }

  getPerformanceReport(): Record<string, any> {
    const report: Record<string, any> = {};

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
    interaction: (component: string, action: string) =>
      `ds.${component.toLowerCase()}.${action.toLowerCase()}`,
    render: (component: string) => `ds.${component.toLowerCase()}.render`,
    api: (component: string, operation: string) =>
      `ds.${component.toLowerCase()}.api.${operation.toLowerCase()}`,
  },

  // Log message patterns
  logs: {
    interaction: (component: string, action: string) =>
      `User interaction: ${action} on ${component}`,
    state: (component: string, state: string) => `Component state: ${component} - ${state}`,
    error: (component: string, error: string) => `Component error: ${component} - ${error}`,
  },

  // Attribute naming conventions
  attributes: {
    component: (name: string) => `ds.component.name`,
    variant: (variant: string) => `ds.component.variant`,
    size: (size: string) => `ds.component.size`,
    state: (state: string) => `ds.component.state`,
    theme: (theme: string) => `ds.theme`,
    token: (token: string) => `ds.token.${token}`,
  },

  // Metric naming conventions
  metrics: {
    renderTime: (component: string) => `ds_${component.toLowerCase()}_render_duration_ms`,
    interactionCount: (component: string, interaction: string) =>
      `ds_${component.toLowerCase()}_${interaction.toLowerCase()}_total`,
    errorCount: (component: string) => `ds_${component.toLowerCase()}_errors_total`,
  },
};
