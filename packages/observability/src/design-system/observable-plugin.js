"use strict";
/**
 * Plugin system for adding observability to Design System components
 */
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservabilityStyleGuide = exports.ComponentPerformanceTracker = exports.ObservabilityNaming = exports.DesignTokenTracker = void 0;
exports.createComponentPlugin = createComponentPlugin;
/**
 * Create an observability plugin for a component
 */
function createComponentPlugin(config) {
    return {
        name: "".concat(config.componentName, "-observability"),
        version: '1.0.0',
        init: function (logger) {
            // Plugin initialization logic
            logger.debug("Observability plugin initialized for ".concat(config.componentName));
        },
    };
}
/**
 * Track design token usage
 */
var DesignTokenTracker = /** @class */ (function () {
    function DesignTokenTracker(logger) {
        this.tokenUsage = new Map();
        this.logger = logger;
    }
    DesignTokenTracker.prototype.trackTokenUsage = function (event) {
        var key = "".concat(event.component, ".").concat(event.token);
        var currentCount = this.tokenUsage.get(key) || 0;
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
    };
    DesignTokenTracker.prototype.getTokenUsageReport = function () {
        var report = {};
        this.tokenUsage.forEach(function (count, token) {
            report[token] = count;
        });
        return report;
    };
    return DesignTokenTracker;
}());
exports.DesignTokenTracker = DesignTokenTracker;
/**
 * Naming convention for spans and logs
 */
var ObservabilityNaming = /** @class */ (function () {
    function ObservabilityNaming() {
    }
    ObservabilityNaming.formatSpanName = function (component, action, variant) {
        var parts = [this.PREFIX, component.toLowerCase()];
        if (variant) {
            parts.push(variant.toLowerCase());
        }
        parts.push(action.toLowerCase());
        return parts.join('.');
    };
    ObservabilityNaming.formatLogMessage = function (component, event) {
        return "[".concat(component, "] ").concat(event);
    };
    ObservabilityNaming.formatMetricName = function (component, metric) {
        return "".concat(this.PREFIX, "_").concat(component.toLowerCase(), "_").concat(metric.toLowerCase());
    };
    ObservabilityNaming.PREFIX = 'ds';
    return ObservabilityNaming;
}());
exports.ObservabilityNaming = ObservabilityNaming;
/**
 * Component performance tracker
 */
var ComponentPerformanceTracker = /** @class */ (function () {
    function ComponentPerformanceTracker(logger) {
        this.renderTimes = new Map();
        this.logger = logger;
    }
    ComponentPerformanceTracker.prototype.recordRenderTime = function (componentName, duration) {
        var times = this.renderTimes.get(componentName) || [];
        times.push(duration);
        this.renderTimes.set(componentName, times);
        if (times.length % 100 === 0) {
            // Log aggregated metrics every 100 renders
            var avg = times.reduce(function (a, b) { return a + b; }, 0) / times.length;
            var p95 = this.calculatePercentile(times, 0.95);
            this.logger.info('Component render performance', {
                custom: {
                    component: componentName,
                    averageRenderTime: avg,
                    p95RenderTime: p95,
                    sampleSize: times.length,
                },
            });
        }
    };
    ComponentPerformanceTracker.prototype.calculatePercentile = function (values, percentile) {
        var sorted = __spreadArray([], values, true).sort(function (a, b) { return a - b; });
        var index = Math.floor(sorted.length * percentile);
        return sorted[index];
    };
    ComponentPerformanceTracker.prototype.getPerformanceReport = function () {
        var _this = this;
        var report = {};
        this.renderTimes.forEach(function (times, component) {
            report[component] = {
                count: times.length,
                average: times.reduce(function (a, b) { return a + b; }, 0) / times.length,
                p50: _this.calculatePercentile(times, 0.5),
                p95: _this.calculatePercentile(times, 0.95),
                p99: _this.calculatePercentile(times, 0.99),
            };
        });
        return report;
    };
    return ComponentPerformanceTracker;
}());
exports.ComponentPerformanceTracker = ComponentPerformanceTracker;
/**
 * Style guide for observability
 */
exports.ObservabilityStyleGuide = {
    // Span naming patterns
    spans: {
        interaction: function (component, action) {
            return "ds.".concat(component.toLowerCase(), ".").concat(action.toLowerCase());
        },
        render: function (component) {
            return "ds.".concat(component.toLowerCase(), ".render");
        },
        api: function (component, operation) {
            return "ds.".concat(component.toLowerCase(), ".api.").concat(operation.toLowerCase());
        },
    },
    // Log message patterns
    logs: {
        interaction: function (component, action) {
            return "User interaction: ".concat(action, " on ").concat(component);
        },
        state: function (component, state) {
            return "Component state: ".concat(component, " - ").concat(state);
        },
        error: function (component, error) {
            return "Component error: ".concat(component, " - ").concat(error);
        },
    },
    // Attribute naming conventions
    attributes: {
        component: function (name) { return "ds.component.name"; },
        variant: function (variant) { return "ds.component.variant"; },
        size: function (size) { return "ds.component.size"; },
        state: function (state) { return "ds.component.state"; },
        theme: function (theme) { return "ds.theme"; },
        token: function (token) { return "ds.token.".concat(token); },
    },
    // Metric naming conventions
    metrics: {
        renderTime: function (component) {
            return "ds_".concat(component.toLowerCase(), "_render_duration_ms");
        },
        interactionCount: function (component, interaction) {
            return "ds_".concat(component.toLowerCase(), "_").concat(interaction.toLowerCase(), "_total");
        },
        errorCount: function (component) {
            return "ds_".concat(component.toLowerCase(), "_errors_total");
        },
    },
};
