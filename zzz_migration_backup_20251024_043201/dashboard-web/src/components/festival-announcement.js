'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FestivalAnnouncement = FestivalAnnouncement;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const badge_1 = require("@/components/ui/badge");
const featured_businesses_1 = require("@/data/featured-businesses");
function FestivalAnnouncement() {
    const floatingElements = Array.from({ length: 8 }, (_, i) => i);
    return ((0, jsx_runtime_1.jsxs)("section", { className: "relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-16", children: [(0, jsx_runtime_1.jsxs)("div", { className: "absolute inset-0", children: [floatingElements.map(i => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 blur-xl", style: {
                            width: Math.random() * 200 + 100,
                            height: Math.random() * 200 + 100,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }, animate: {
                            x: [0, Math.random() * 100 - 50],
                            y: [0, Math.random() * 100 - 50],
                            scale: [1, 1.2, 1],
                        }, transition: {
                            duration: Math.random() * 10 + 10,
                            repeat: Number.POSITIVE_INFINITY,
                            repeatType: 'reverse',
                        } }, i))), Array.from({ length: 12 }, (_, i) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute text-4xl text-white/10", style: {
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }, animate: {
                            y: [0, -50, 0],
                            rotate: [0, 360],
                            opacity: [0.1, 0.3, 0.1],
                        }, transition: {
                            duration: Math.random() * 8 + 5,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: Math.random() * 2,
                        }, children: "\u266A" }, `note-${i}`)))] }), (0, jsx_runtime_1.jsxs)("div", { className: "container relative z-10 mx-auto px-4", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, className: "mb-12 text-center", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.h2, { className: "mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-5xl font-bold text-transparent text-white", animate: {
                                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                                }, transition: {
                                    duration: 3,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: 'linear',
                                }, children: "\u00A1Festival de M\u00FAsica Electr\u00F3nica!" }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.p, { className: "text-xl text-purple-200", initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: 0.3 }, children: "El evento m\u00E1s esperado del a\u00F1o est\u00E1 aqu\u00ED" })] }), (0, jsx_runtime_1.jsx)("div", { className: "mx-auto max-w-4xl", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.6, delay: 0.2 }, children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "overflow-hidden border-purple-500/30 bg-black/40 backdrop-blur-lg", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)("img", { src: featured_businesses_1.festivalEvent.image || '/placeholder.svg', alt: featured_businesses_1.festivalEvent.title, className: "h-64 w-full object-cover" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute right-4 top-4", animate: {
                                                    rotate: [0, 5, -5, 0],
                                                    scale: [1, 1.1, 1],
                                                }, transition: {
                                                    duration: 2,
                                                    repeat: Number.POSITIVE_INFINITY,
                                                    ease: 'easeInOut',
                                                }, children: (0, jsx_runtime_1.jsxs)(badge_1.Badge, { className: "bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 text-lg text-white", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Music, { className: "mr-2 h-5 w-5" }), "FESTIVAL 2024"] }) })] }), (0, jsx_runtime_1.jsx)(card_1.CardContent, { className: "p-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "grid gap-8 md:grid-cols-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "mb-2 text-3xl font-bold text-white", children: featured_businesses_1.festivalEvent.title }), (0, jsx_runtime_1.jsx)("p", { className: "text-purple-200", children: featured_businesses_1.festivalEvent.description })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-white", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "mr-3 h-5 w-5 text-pink-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-lg", children: featured_businesses_1.festivalEvent.date })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-white", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MapPin, { className: "mr-3 h-5 w-5 text-pink-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-lg", children: featured_businesses_1.festivalEvent.location })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-white", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Clock, { className: "mr-3 h-5 w-5 text-pink-400" }), (0, jsx_runtime_1.jsx)("span", { className: "text-lg", children: featured_businesses_1.festivalEvent.duration })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center text-white", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Ticket, { className: "mr-3 h-5 w-5 text-pink-400" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-lg", children: ["Desde \u20AC", featured_businesses_1.festivalEvent.price] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-6", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h4", { className: "mb-4 text-2xl font-bold text-white", children: "Lineup" }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "mb-4 rounded-lg border border-pink-500/30 bg-gradient-to-r from-pink-500/20 to-purple-500/20 p-4", whileHover: { scale: 1.02 }, transition: { duration: 0.2 }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(badge_1.Badge, { className: "mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black", children: "HEADLINER" }), (0, jsx_runtime_1.jsx)("h5", { className: "text-2xl font-bold text-white", children: featured_businesses_1.festivalEvent.headliner })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex", children: [...Array(5)].map((_, i) => ((0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "h-5 w-5 fill-current text-yellow-400" }, i))) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-2", children: featured_businesses_1.festivalEvent.supportingActs.map((artist, index) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "rounded-lg border border-white/20 bg-white/10 p-3 backdrop-blur-sm", initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, transition: { delay: 0.1 * index }, whileHover: { scale: 1.02, backgroundColor: 'rgba(255,255,255,0.15)' }, children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-medium text-white", children: artist }), (0, jsx_runtime_1.jsx)("div", { className: "flex", children: [...Array(4)].map((_, i) => ((0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "h-4 w-4 fill-current text-yellow-400" }, i))) })] }) }, artist))) })] }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, children: (0, jsx_runtime_1.jsxs)(button_1.Button, { size: "lg", className: "group relative w-full overflow-hidden rounded-full border-0 bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 text-lg font-bold text-white shadow-2xl hover:from-pink-600 hover:to-purple-700", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute inset-0 bg-gradient-to-r from-white/20 to-transparent", initial: { x: '-100%' }, whileHover: { x: '100%' }, transition: { duration: 0.6 } }), (0, jsx_runtime_1.jsxs)("span", { className: "relative z-10 flex items-center justify-center", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Ticket, { className: "mr-2 h-6 w-6" }), "Comprar Entradas"] })] }) })] })] }) })] }) }) })] })] }));
}
//# sourceMappingURL=festival-announcement.js.map