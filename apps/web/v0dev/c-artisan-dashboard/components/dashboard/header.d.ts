import type { DashboardMetrics } from '@/hooks/use-dashboard-metrics';
interface HeaderProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
    metrics: DashboardMetrics;
}
export declare function Header({ activeSection, setActiveSection, metrics }: HeaderProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=header.d.ts.map