"use strict";
/**
 * Plugin system for adding observability to Design System components
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservabilityStyleGuide = exports.ComponentPerformanceTracker = exports.ObservabilityNaming = exports.DesignTokenTracker = void 0;
exports.createComponentPlugin = createComponentPlugin;
/**
 * Create an observability plugin for a component
 */
function createComponentPlugin(config) {
    return {
        name: `${config.componentName}-observability`,
        version: '1.0.0',
        init(logger) {
            // Plugin initialization logic
            logger.debug(`Observability plugin initialized for ${config.componentName}`);
        },
    };
}
/**
 * Track design token usage
 */
class DesignTokenTracker {
    logger;
    tokenUsage = new Map();
    constructor(logger) {
        this.logger = logger;
    }
    trackTokenUsage(event) {
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
    getTokenUsageReport() {
        const report = {};
        this.tokenUsage.forEach((count, token) => {
            report[token] = count;
        });
        return report;
    }
}
exports.DesignTokenTracker = DesignTokenTracker;
/**
 * Naming convention for spans and logs
 */
class ObservabilityNaming {
    static PREFIX = 'ds';
    static formatSpanName(component, action, variant) {
        const parts = [this.PREFIX, component.toLowerCase()];
        if (variant) {
            parts.push(variant.toLowerCase());
        }
        parts.push(action.toLowerCase());
        return parts.join('.');
    }
    static formatLogMessage(component, event) {
        return `[${component}] ${event}`;
    }
    static formatMetricName(component, metric) {
        return `${this.PREFIX}_${component.toLowerCase()}_${metric.toLowerCase()}`;
    }
}
exports.ObservabilityNaming = ObservabilityNaming;
/**
 * Component performance tracker
 */
class ComponentPerformanceTracker {
    renderTimes = new Map();
    logger;
    constructor(logger) {
        this.logger = logger;
    }
    recordRenderTime(componentName, duration) {
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
    calculatePercentile(values, percentile) {
        const sorted = [...values].sort((a, b) => a - b);
        const index = Math.floor(sorted.length * percentile);
        return sorted[index];
    }
    getPerformanceReport() {
        const report = {};
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
exports.ComponentPerformanceTracker = ComponentPerformanceTracker;
/**
 * Style guide for observability
 */
exports.ObservabilityStyleGuide = {
    // Span naming patterns
    spans: {
        interaction: (component, action) => `ds.${component.toLowerCase()}.${action.toLowerCase()}`,
        render: (component) => `ds.${component.toLowerCase()}.render`,
        api: (component, operation) => `ds.${component.toLowerCase()}.api.${operation.toLowerCase()}`,
    },
    // Log message patterns
    logs: {
        interaction: (component, action) => `User interaction: ${action} on ${component}`,
        state: (component, state) => `Component state: ${component} - ${state}`,
        error: (component, error) => `Component error: ${component} - ${error}`,
    },
    // Attribute naming conventions
    attributes: {
        component: (name) => `ds.component.name`,
        variant: (variant) => `ds.component.variant`,
        size: (size) => `ds.component.size`,
        state: (state) => `ds.component.state`,
        theme: (theme) => `ds.theme`,
        token: (token) => `ds.token.${token}`,
    },
    // Metric naming conventions
    metrics: {
        renderTime: (component) => `ds_${component.toLowerCase()}_render_duration_ms`,
        interactionCount: (component, interaction) => `ds_${component.toLowerCase()}_${interaction.toLowerCase()}_total`,
        errorCount: (component) => `ds_${component.toLowerCase()}_errors_total`,
    },
};
//# sourceMappingURL=observable-plugin.js.map