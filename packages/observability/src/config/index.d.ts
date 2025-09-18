import { ObservabilityConfig } from '../types';
export declare function mergeConfig(config: ObservabilityConfig): ObservabilityConfig;
export declare function initializeObservability(config: ObservabilityConfig): Promise<void>;
export declare function shutdownObservability(): Promise<void>;
export declare function getEnvironmentConfig(environment: string): Partial<ObservabilityConfig>;
export declare function validateConfig(config: ObservabilityConfig): void;
export declare function quickStart(serviceName: string, options?: Partial<ObservabilityConfig>): Promise<void>;
//# sourceMappingURL=index.d.ts.map