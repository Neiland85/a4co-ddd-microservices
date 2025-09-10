'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EventsSection;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const events = [
    {
        id: 1,
        title: 'Festival de Música Electrónica',
        description: 'Los mejores DJs internacionales en una noche épica',
        date: '2024-02-15',
        time: '20:00',
        location: 'Estadio Central',
        attendees: 5000,
        rating: 4.9,
        category: 'Música',
        image: '/placeholder.svg?height=150&width=200',
        price: 'Gratis',
    },
    {
        id: 2,
        title: 'Exposición de Arte Digital',
        description: 'Arte interactivo con realidad aumentada',
        date: '2024-02-18',
        time: '10:00',
        location: 'Museo de Arte Moderno',
        attendees: 300,
        rating: 4.7,
        category: 'Arte',
        image: '/placeholder.svg?height=150&width=200',
        price: '$15',
    },
    {
        id: 3,
        title: 'Workshop de Cocina Molecular',
        description: 'Aprende técnicas culinarias del futuro',
        date: '2024-02-20',
        time: '14:00',
        location: 'Centro Gastronómico',
        attendees: 50,
        rating: 4.8,
        category: 'Gastronomía',
        image: '/placeholder.svg?height=150&width=200',
        price: '$45',
    },
];
function EventsSection() {
    const [selectedEvent, setSelectedEvent] = (0, react_1.useState)(null);
    const getCategoryColor = (category) => {
        switch (category) {
            case 'Música':
                return 'from-purple-500 to-pink-500';
            case 'Arte':
                return 'from-blue-500 to-teal-500';
            case 'Gastronomía':
                return 'from-orange-500 to-red-500';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };
    const getCategoryEmoji = (category) => {
        switch (category) {
            case 'Música':
                return '🎵';
            case 'Arte':
                return '🎨';
            case 'Gastronomía':
                return '👨‍🍳';
            default:
                return '📅';
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "rounded-3xl border-4 border-violet-400 bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-6 shadow-2xl", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { y: -20, opacity: 0 }, animate: { y: 0, opacity: 1 }, className: "mb-6", children: [(0, jsx_runtime_1.jsxs)("h2", { className: "flex items-center text-3xl font-bold text-white", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "mr-3 h-8 w-8 text-violet-400" }), "Eventos \u00C9picos", (0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "ml-2 h-6 w-6 text-yellow-400" })] }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-violet-200", children: "Pr\u00F3ximas aventuras culturales" })] }), (0, jsx_runtime_1.jsx)("div", { className: "custom-scrollbar max-h-96 space-y-4 overflow-y-auto", children: events.map((event, index) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { x: 50, opacity: 0 }, animate: { x: 0, opacity: 1 }, transition: { delay: index * 0.1 }, whileHover: { scale: 1.02, rotateY: 2 }, onClick: () => setSelectedEvent(event), className: "cursor-pointer rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm transition-all hover:bg-white/20", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("img", { src: event.image || '/placeholder.svg', alt: event.title, className: "h-20 w-20 rounded-xl object-cover" }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: { scale: [1, 1.2, 1] }, transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }, className: "absolute -right-2 -top-2 text-2xl", children: getCategoryEmoji(event.category) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "min-w-0 flex-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-2 flex items-start justify-between", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-bold leading-tight text-white", children: event.title }), (0, jsx_runtime_1.jsx)("div", { className: `bg-gradient-to-r ${getCategoryColor(event.category)} rounded-full px-2 py-1 text-xs font-semibold text-white`, children: event.price })] }), (0, jsx_runtime_1.jsx)("p", { className: "mb-3 line-clamp-2 text-sm text-violet-200", children: event.description }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-2 text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-violet-200", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "mr-1 h-3 w-3" }), event.time] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-violet-200", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "mr-1 h-3 w-3" }), event.location] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-violet-200", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "mr-1 h-3 w-3" }), event.attendees, " asistentes"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-violet-200", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "mr-1 h-3 w-3 text-yellow-400" }), event.rating] })] })] })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { whileHover: { scale: 1.05 }, className: "mt-3 flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("div", { className: "font-semibold text-white", children: new Date(event.date).toLocaleDateString('es-ES', {
                                        weekday: 'short',
                                        month: 'short',
                                        day: 'numeric',
                                    }) }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, className: "flex items-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 text-sm font-semibold text-white", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Ticket, { className: "mr-1 h-4 w-4" }), "Reservar"] })] })] }, event.id))) }), selectedEvent && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4", onClick: () => setSelectedEvent(null), children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, className: "w-full max-w-md rounded-3xl bg-white p-6", onClick: e => e.stopPropagation(), children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-4 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-2 text-4xl", children: getCategoryEmoji(selectedEvent.category) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-2xl font-bold text-gray-800", children: selectedEvent.title }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-gray-600", children: selectedEvent.description })] }), (0, jsx_runtime_1.jsxs)("div", { className: "mb-6 space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Fecha:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-semibold", children: new Date(selectedEvent.date).toLocaleDateString('es-ES') })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Hora:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-semibold", children: selectedEvent.time })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Ubicaci\u00F3n:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-semibold", children: selectedEvent.location })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Precio:" }), (0, jsx_runtime_1.jsx)("span", { className: "font-semibold text-green-600", children: selectedEvent.price })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-3", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: () => setSelectedEvent(null), className: "flex-1 rounded-xl bg-gray-200 py-3 font-semibold text-gray-800", children: "Cerrar" }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, className: `flex-1 bg-gradient-to-r ${getCategoryColor(selectedEvent.category)} rounded-xl py-3 font-semibold text-white`, children: "\u00A1Reservar Ahora!" })] })] }) })), (0, jsx_runtime_1.jsx)("style", { jsx: true, children: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      ` })] }));
}
//# sourceMappingURL=EventsSection.js.map