import type { MapFilters } from '../types/producer-types';
interface MapFiltersProps {
    filters: MapFilters;
    onFiltersChange: (filters: MapFilters) => void;
    isOpen: boolean;
    onToggle: () => void;
    className?: string;
}
export default function ProducerFilters({ filters, onFiltersChange, isOpen, onToggle, className, }: MapFiltersProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=map-filters.d.ts.map