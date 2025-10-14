/**
 * Plugin system for adding observability to Design System components
 */
import { Logger } from '../logging/types';
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
export declare function createComponentPlugin(config: ComponentObservabilityConfig): ObservabilityPlugin;
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
export declare class DesignTokenTracker {
    private logger;
    private tokenUsage;
    constructor(logger: Logger);
    trackTokenUsage(event: DesignTokenEvent): void;
    getTokenUsageReport(): Record<string, number>;
}
/**
 * Naming convention for spans and logs
 */
export declare class ObservabilityNaming {
    private static readonly PREFIX;
    static formatSpanName(component: string, action: string, variant?: string): string;
    static formatLogMessage(component: string, event: string): string;
    static formatMetricName(component: string, metric: string): string;
}
/**
 * Component performance tracker
 */
export declare class ComponentPerformanceTracker {
    private renderTimes;
    private logger;
    constructor(logger: Logger);
    recordRenderTime(componentName: string, duration: number): void;
    private calculatePercentile;
    getPerformanceReport(): Record<string, any>;
}
/**
 * Style guide for observability
 */
export declare const ObservabilityStyleGuide: {
    spans: {
        interaction: (component: string, action: string) => string;
        render: (component: string) => string;
        api: (component: string, operation: string) => string;
    };
    logs: {
        interaction: (component: string, action: string) => string;
        state: (component: string, state: string) => string;
        error: (component: string, error: string) => string;
    };
    attributes: {
        component: (name: string) => string;
        variant: (variant: string) => string;
        size: (size: string) => string;
        state: (state: string) => string;
        theme: (theme: string) => string;
        token: (token: string) => string;
    };
    metrics: {
        renderTime: (component: string) => string;
        interactionCount: (component: string, interaction: string) => string;
        errorCount: (component: string) => string;
    };
};
//# sourceMappingURL=observable-plugin.d.ts.map