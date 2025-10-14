import type { Route, RoutingOptions } from '../types/routing-types';
interface RoutingPanelProps {
    route: Route | null;
    isCalculating: boolean;
    error: string | null;
    onCalculateRoute: (options: RoutingOptions) => void;
    onClearRoute: () => void;
    startAddress?: string;
    endAddress?: string;
    className?: string;
}
export default function RoutingPanel({ route, isCalculating, error, onCalculateRoute, onClearRoute, startAddress, endAddress, className, }: RoutingPanelProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=routing-panel.d.ts.map