import type { DashboardMetrics } from '@/hooks/use-dashboard-metrics';
import type { AnimationParams } from '@/utils/metrics-to-animation';
interface SectionCirclesProps {
    section: string;
    animationParams: AnimationParams;
    metrics: Partial<DashboardMetrics>;
}
export declare function SectionCircles({ section, animationParams, metrics }: SectionCirclesProps): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=section-circles.d.ts.map