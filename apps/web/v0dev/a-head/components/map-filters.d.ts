import type { ProducerFilters, ProducerStats } from '../types/producer-types';
interface MapFiltersProps {
    filters: ProducerFilters;
    stats: ProducerStats;
    onFiltersChange: (filters: Partial<ProducerFilters>) => void;
    onReset: () => void;
}
export default function MapFilters({ filters, stats, onFiltersChange, onReset }: MapFiltersProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=map-filters.d.ts.map