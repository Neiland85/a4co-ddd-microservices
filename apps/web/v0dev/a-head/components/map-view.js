'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MapView;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_leaflet_1 = require("react-leaflet");
const leaflet_1 = require("leaflet");
const producer_marker_1 = __importDefault(require("./producer-marker"));
require("leaflet/dist/leaflet.css");
// Component to fit map bounds to markers
function MapBounds({ producers }) {
    const map = (0, react_leaflet_1.useMap)();
    (0, react_1.useEffect)(() => {
        if (producers.length > 0) {
            const bounds = new leaflet_1.LatLngBounds(producers.map(producer => [producer.lat, producer.lng]));
            map.fitBounds(bounds, { padding: [20, 20] });
        }
    }, [producers, map]);
    return null;
}
function MapView({ producers, selectedProducer, onProducerSelect, className = '', }) {
    const [isClient, setIsClient] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setIsClient(true);
    }, []);
    if (!isClient) {
        return ((0, jsx_runtime_1.jsx)("div", { className: `flex items-center justify-center rounded-lg bg-gray-100 ${className}`, children: (0, jsx_runtime_1.jsx)("div", { className: "text-gray-500", children: "Cargando mapa..." }) }));
    }
    // Default center (Úbeda, Jaén)
    const defaultCenter = [38.0138, -3.3706];
    return ((0, jsx_runtime_1.jsx)("div", { className: `relative ${className}`, children: (0, jsx_runtime_1.jsxs)(react_leaflet_1.MapContainer, { center: defaultCenter, zoom: 12, className: "h-full w-full rounded-lg", zoomControl: true, children: [(0, jsx_runtime_1.jsx)(react_leaflet_1.TileLayer, { attribution: '\u00A9 <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" }), (0, jsx_runtime_1.jsx)(MapBounds, { producers: producers }), producers.map(producer => ((0, jsx_runtime_1.jsx)(producer_marker_1.default, { producer: producer, isSelected: selectedProducer?.id === producer.id, onClick: () => onProducerSelect?.(producer) }, producer.id)))] }) }));
}
//# sourceMappingURL=map-view.js.map