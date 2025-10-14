import type { Producer } from '../types/producer-types';
import 'leaflet/dist/leaflet.css';
interface MapViewProps {
    producers: Producer[];
    selectedProducer?: Producer | null;
    onProducerSelect?: (producer: Producer) => void;
    className?: string;
}
export default function MapView({ producers, selectedProducer, onProducerSelect, className, }: MapViewProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=map-view.d.ts.map