'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InteractiveMap;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const locations = [
    {
        id: 1,
        name: 'Pizza Palace',
        type: 'restaurant',
        lat: 40.7128,
        lng: -74.006,
        offers: 3,
        rating: 4.8,
    },
    { id: 2, name: 'Spa Zen', type: 'wellness', lat: 40.7589, lng: -73.9851, offers: 2, rating: 4.9 },
    {
        id: 3,
        name: 'Adventure Park',
        type: 'entertainment',
        lat: 40.7505,
        lng: -73.9934,
        offers: 5,
        rating: 4.7,
    },
    {
        id: 4,
        name: 'Tech Store',
        type: 'shopping',
        lat: 40.7282,
        lng: -73.9942,
        offers: 4,
        rating: 4.6,
    },
];
function InteractiveMap() {
    const [selectedLocation, setSelectedLocation] = (0, react_1.useState)(null);
    const [pulsingLocations, setPulsingLocations] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        const interval = setInterval(() => {
            const randomId = locations[Math.floor(Math.random() * locations.length)].id;
            setPulsingLocations(prev => ({
                ...prev,
                [randomId]: !prev[randomId],
            }));
        }, 2000);
        return () => clearInterval(interval);
    }, []);
    const getLocationIcon = (type) => {
        switch (type) {
            case 'restaurant':
                return '🍕';
            case 'wellness':
                return '🧘';
            case 'entertainment':
                return '🎢';
            case 'shopping':
                return '🛍️';
            default:
                return '📍';
        }
    };
    const getLocationColor = (type) => {
        switch (type) {
            case 'restaurant':
                return 'from-orange-400 to-red-500';
            case 'wellness':
                return 'from-green-400 to-teal-500';
            case 'entertainment':
                return 'from-purple-400 to-pink-500';
            case 'shopping':
                return 'from-blue-400 to-indigo-500';
            default:
                return 'from-gray-400 to-gray-500';
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "rounded-3xl border-4 border-cyan-400 bg-gradient-to-br from-teal-600 via-blue-600 to-purple-600 p-6 shadow-2xl", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { y: -20, opacity: 0 }, animate: { y: 0, opacity: 1 }, className: "mb-6 flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "flex items-center text-3xl font-bold text-white", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Navigation, { className: "mr-3 h-8 w-8 text-cyan-400" }), "Mapa de Aventuras", (0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "ml-2 h-6 w-6 text-yellow-400" })] }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: { rotate: 360 }, transition: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }, className: "flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Navigation, { className: "h-4 w-4 text-blue-900" }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative h-96 overflow-hidden rounded-2xl bg-gradient-to-br from-green-200 via-blue-200 to-purple-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 opacity-20", children: (0, jsx_runtime_1.jsx)("div", { className: "grid h-full grid-cols-8 grid-rows-6", children: [...Array(48)].map((_, i) => ((0, jsx_runtime_1.jsx)("div", { className: "border border-gray-400" }, i))) }) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: { pathLength: [0, 1, 0] }, transition: { duration: 3, repeat: Number.POSITIVE_INFINITY }, className: "absolute left-0 top-1/2 h-1 w-full bg-yellow-400 opacity-60" }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: { pathLength: [0, 1, 0] }, transition: { duration: 3, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }, className: "absolute left-1/2 top-0 h-full w-1 bg-yellow-400 opacity-60" }), locations.map((location, index) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "absolute cursor-pointer", style: {
                                    left: `${20 + index * 20}%`,
                                    top: `${30 + index * 15}%`,
                                }, whileHover: { scale: 1.2, zIndex: 10 }, whileTap: { scale: 0.9 }, onClick: () => setSelectedLocation(location), animate: pulsingLocations[location.id]
                                    ? {
                                        scale: [1, 1.3, 1],
                                        boxShadow: [
                                            '0 0 0 0 rgba(59, 130, 246, 0.7)',
                                            '0 0 0 20px rgba(59, 130, 246, 0)',
                                            '0 0 0 0 rgba(59, 130, 246, 0)',
                                        ],
                                    }
                                    : {}, transition: { duration: 1.5 }, children: [(0, jsx_runtime_1.jsx)("div", { className: `h-12 w-12 bg-gradient-to-r ${getLocationColor(location.type)} flex items-center justify-center rounded-full border-2 border-white shadow-lg`, children: (0, jsx_runtime_1.jsx)("span", { className: "text-xl", children: getLocationIcon(location.type) }) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: { y: [-2, 2, -2] }, transition: { duration: 2, repeat: Number.POSITIVE_INFINITY }, className: "absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white", children: location.offers })] }, location.id))), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform", animate: {
                                    scale: [1, 1.2, 1],
                                    boxShadow: [
                                        '0 0 0 0 rgba(34, 197, 94, 0.7)',
                                        '0 0 0 15px rgba(34, 197, 94, 0)',
                                        '0 0 0 0 rgba(34, 197, 94, 0)',
                                    ],
                                }, transition: { duration: 2, repeat: Number.POSITIVE_INFINITY }, children: (0, jsx_runtime_1.jsx)("div", { className: "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-green-500 shadow-lg", children: (0, jsx_runtime_1.jsx)("div", { className: "h-3 w-3 rounded-full bg-white" }) }) })] }), selectedLocation && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 }, className: "absolute bottom-4 left-4 right-4 rounded-2xl border-2 border-cyan-400 bg-white p-4 shadow-xl", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("h3", { className: "flex items-center text-lg font-bold text-gray-800", children: [(0, jsx_runtime_1.jsx)("span", { className: "mr-2", children: getLocationIcon(selectedLocation.type) }), selectedLocation.name] }), (0, jsx_runtime_1.jsx)("p", { className: "capitalize text-gray-600", children: selectedLocation.type }), (0, jsx_runtime_1.jsxs)("div", { className: "mt-2 flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex items-center space-x-1", children: [...Array(5)].map((_, i) => ((0, jsx_runtime_1.jsx)("span", { className: `text-sm ${i < Math.floor(selectedLocation.rating) ? 'text-yellow-400' : 'text-gray-300'}`, children: "\u2B50" }, i))) }), (0, jsx_runtime_1.jsx)("span", { className: "ml-2 text-sm text-gray-600", children: selectedLocation.rating })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "text-right", children: [(0, jsx_runtime_1.jsxs)("div", { className: "rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-sm font-semibold text-white", children: [selectedLocation.offers, " ofertas"] }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: "mt-2 rounded-full bg-cyan-500 px-4 py-2 text-sm font-semibold text-white", onClick: () => setSelectedLocation(null), children: "Cerrar" })] })] }) }))] })] }));
}
//# sourceMappingURL=InteractiveMap.js.map