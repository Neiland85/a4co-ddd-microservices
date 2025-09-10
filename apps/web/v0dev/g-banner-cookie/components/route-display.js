'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RouteDisplay;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_leaflet_1 = require("react-leaflet");
const leaflet_1 = require("leaflet");
// Custom icons for start and end points
const createRouteIcon = (type) => {
    const color = type === 'start' ? '#10b981' : '#ef4444';
    const label = type === 'start' ? 'A' : 'B';
    return new leaflet_1.Icon({
        iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="30" height="40" viewBox="0 0 30 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 0C6.716 0 0 6.716 0 15c0 8.284 15 25 15 25s15-16.716 15-25C30 6.716 23.284 0 15 0z" fill="${color}"/>
        <circle cx="15" cy="15" r="8" fill="white"/>
        <text x="15" y="19" textAnchor="middle" fill="${color}" fontSize="12" fontWeight="bold">${label}</text>
      </svg>
    `)}`,
        iconSize: [30, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -40],
    });
};
function RouteDisplay({ route, startPoint, endPoint, color = '#3b82f6', }) {
    // Convert geometry to LatLng format for Leaflet
    const positions = route.geometry.map(([lng, lat]) => [lat, lng]);
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(react_leaflet_1.Polyline, { positions: positions, color: color, weight: 4, opacity: 0.8, dashArray: "0" }), (0, jsx_runtime_1.jsx)(react_leaflet_1.Marker, { position: [startPoint.lat, startPoint.lng], icon: createRouteIcon('start') }), (0, jsx_runtime_1.jsx)(react_leaflet_1.Marker, { position: [endPoint.lat, endPoint.lng], icon: createRouteIcon('end') })] }));
}
//# sourceMappingURL=route-display.js.map