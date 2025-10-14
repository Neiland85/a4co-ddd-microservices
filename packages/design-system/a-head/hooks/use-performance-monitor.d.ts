export interface PerformanceMetrics {
    fps: number;
    memoryUsage: number;
    loadTime: number;
    renderTime: number;
    isOptimal: boolean;
}
export declare function usePerformanceMonitor(options?: {
    enableAutoStart?: boolean;
    sampleInterval?: number;
    memoryThreshold?: number;
    fpsThreshold?: number;
}): {
    metrics: PerformanceMetrics;
    isMonitoring: boolean;
    startMonitoring: () => void;
    stopMonitoring: () => void;
};
//# sourceMappingURL=use-performance-monitor.d.ts.map