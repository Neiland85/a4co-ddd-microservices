import type { Producer, ProducerFilters, ProducerStats } from '../types/producer-types';
export declare function useProducers(): {
    producers: Producer[];
    allProducers: Producer[];
    filters: ProducerFilters;
    stats: ProducerStats;
    updateFilters: (newFilters: Partial<ProducerFilters>) => void;
    resetFilters: () => void;
};
//# sourceMappingURL=use-producers.d.ts.map