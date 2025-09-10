import type { DashboardMetrics } from '@/hooks/use-dashboard-metrics';
export interface AnimationParams {
    intensity: number;
    speed: number;
    opacity: number;
    scale: number;
    colors: string[];
    particleCount: number;
    pulseRate: number;
}
export declare function getMonitorAnimationParams(metrics: DashboardMetrics['monitor']): AnimationParams;
export declare function getRecommendationsAnimationParams(metrics: DashboardMetrics['recommendations']): AnimationParams;
export declare function getCommentsAnimationParams(metrics: DashboardMetrics['comments']): AnimationParams;
export declare function getSettingsAnimationParams(metrics: DashboardMetrics['settings']): AnimationParams;
//# sourceMappingURL=metrics-to-animation.d.ts.map