'use client';
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GamifiedDashboard;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const OffersCarousel_1 = __importDefault(require("@/components/dashboard/OffersCarousel"));
const InteractiveMap_1 = __importDefault(require("@/components/dashboard/InteractiveMap"));
const EventsSection_1 = __importDefault(require("@/components/dashboard/EventsSection"));
const ActivityBars_1 = __importDefault(require("@/components/dashboard/ActivityBars"));
const ExplosionEffect_1 = __importDefault(require("@/components/dashboard/ExplosionEffect"));
const FlamencoPlayer_1 = __importDefault(require("@/components/FlamencoPlayer"));
function GamifiedDashboard() {
    const [explosions, setExplosions] = (0, react_1.useState)([]);
    const [userStats, setUserStats] = (0, react_1.useState)({
        level: 12,
        xp: 2450,
        maxXp: 3000,
        streak: 7,
        achievements: 23,
    });
    const handleOfferExplosion = (x, y) => {
        const newExplosion = { id: Date.now(), x, y };
        setExplosions(prev => [...prev, newExplosion]);
        // Remove explosion after animation
        setTimeout(() => {
            setExplosions(prev => prev.filter(exp => exp.id !== newExplosion.id));
        }, 2000);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "relative min-h-screen overflow-hidden", children: [(0, jsx_runtime_1.jsxs)("div", { className: "absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black", children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "relative", animate: { rotate: 360 }, transition: {
                                duration: 10,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: 'linear',
                            }, children: [...Array(25)].map((_, i) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute rounded-full border", style: {
                                    width: `${(i + 1) * 50}px`,
                                    height: `${(i + 1) * 50}px`,
                                    left: `${-(i + 1) * 25}px`,
                                    top: `${-(i + 1) * 25}px`,
                                    borderColor: i % 2 === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)',
                                    borderWidth: `${Math.max(1, 3 - i * 0.1)}px`,
                                    backgroundColor: i % 3 === 0 ? 'rgba(255,255,255,0.05)' : 'transparent',
                                }, animate: {
                                    opacity: [0.1, 0.7, 0.1],
                                    scale: [0.9, 1.1, 0.9],
                                }, transition: {
                                    duration: 4 + i * 0.15,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: 'easeInOut',
                                    delay: i * 0.08,
                                } }, i))) }) }), [
                        { x: '15%', y: '25%', size: 200, speed: 8 },
                        { x: '85%', y: '75%', size: 300, speed: 12 },
                        { x: '10%', y: '85%', size: 150, speed: 6 },
                        { x: '90%', y: '15%', size: 250, speed: 10 },
                        { x: '50%', y: '10%', size: 180, speed: 7 },
                        { x: '30%', y: '90%', size: 220, speed: 9 },
                    ].map((circle, index) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute", style: { left: circle.x, top: circle.y }, animate: { rotate: index % 2 === 0 ? -360 : 360 }, transition: {
                            duration: circle.speed,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: 'linear',
                        }, children: [...Array(10)].map((_, i) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute rounded-full border", style: {
                                width: `${(i + 1) * (circle.size / 10)}px`,
                                height: `${(i + 1) * (circle.size / 10)}px`,
                                left: `${-(i + 1) * (circle.size / 20)}px`,
                                top: `${-(i + 1) * (circle.size / 20)}px`,
                                borderColor: i % 2 === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.25)',
                                borderWidth: '1px',
                            }, animate: {
                                opacity: [0.05, 0.5, 0.05],
                                scale: [0.8, 1.3, 0.8],
                            }, transition: {
                                duration: 5 + i * 0.2,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: 'easeInOut',
                                delay: index * 0.3 + i * 0.1,
                            } }, i))) }, index))), [...Array(20)].map((_, i) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute", style: {
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }, animate: {
                            x: [0, Math.random() * 500 - 250, 0],
                            y: [0, Math.random() * 500 - 250, 0],
                            scale: [0.3, 2.5, 0.3],
                            opacity: [0.02, 0.3, 0.02],
                            rotate: [0, 720],
                            borderRadius: ['0%', '50%', '25%', '0%'],
                        }, transition: {
                            duration: 20 + Math.random() * 15,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: 'easeInOut',
                            delay: Math.random() * 8,
                        }, children: i % 5 === 0 ? ((0, jsx_runtime_1.jsx)("div", { className: "bg-white/8 h-24 w-24" })) : i % 5 === 1 ? ((0, jsx_runtime_1.jsx)("div", { className: "h-20 w-20 rounded-full bg-black/15" })) : i % 5 === 2 ? ((0, jsx_runtime_1.jsx)("div", { className: "bg-white/12 h-32 w-16 rotate-45 transform" })) : i % 5 === 3 ? ((0, jsx_runtime_1.jsx)("div", { className: "bg-black/8 h-16 w-32 rounded-full" })) : ((0, jsx_runtime_1.jsx)("div", { className: "h-20 w-20 rotate-12 transform bg-white/10" })) }, i))), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute inset-0", animate: {
                            background: [
                                'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0.4) 40%, rgba(255,255,255,0.03) 100%)',
                                'radial-gradient(circle at 20% 80%, rgba(0,0,0,0.3) 0%, rgba(255,255,255,0.12) 40%, rgba(0,0,0,0.5) 100%)',
                                'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.25) 40%, rgba(255,255,255,0.06) 100%)',
                                'radial-gradient(circle at 60% 40%, rgba(0,0,0,0.4) 0%, rgba(255,255,255,0.08) 40%, rgba(0,0,0,0.3) 100%)',
                            ],
                        }, transition: {
                            duration: 15,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: 'easeInOut',
                        } })] }), explosions.map(explosion => ((0, jsx_runtime_1.jsx)(ExplosionEffect_1.default, { x: explosion.x, y: explosion.y }, explosion.id))), (0, jsx_runtime_1.jsxs)("div", { className: "relative z-10 p-6", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { y: -50, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { duration: 0.8, type: 'spring' }, className: "mb-8", children: (0, jsx_runtime_1.jsx)("div", { className: "rounded-3xl border border-white/20 bg-black/30 p-6 shadow-2xl backdrop-blur-md", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: { rotate: 360 }, transition: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }, className: "flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-xl", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Trophy, { className: "h-8 w-8 text-white" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-white drop-shadow-lg", children: "\u00A1Navegador \u00C9pico!" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-yellow-200", children: ["Nivel ", userStats.level, " \u2022 ", userStats.achievements, " Logros"] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-6", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { whileHover: { scale: 1.1 }, className: "text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-2xl font-bold text-yellow-300", children: userStats.streak }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-white", children: "D\u00EDas seguidos" }), (0, jsx_runtime_1.jsx)(lucide_react_1.Flame, { className: "mx-auto mt-1 h-6 w-6 text-orange-400" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "w-48", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-1 flex justify-between text-sm text-white", children: [(0, jsx_runtime_1.jsx)("span", { children: "XP" }), (0, jsx_runtime_1.jsxs)("span", { children: [userStats.xp, "/", userStats.maxXp] })] }), (0, jsx_runtime_1.jsx)("div", { className: "h-3 w-full rounded-full bg-black/30 backdrop-blur-sm", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500", initial: { width: 0 }, animate: { width: `${(userStats.xp / userStats.maxXp) * 100}%` }, transition: { duration: 1.5, ease: 'easeOut' } }) })] })] })] }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 gap-8 xl:grid-cols-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-8 xl:col-span-2", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { x: -100, opacity: 0 }, animate: { x: 0, opacity: 1 }, transition: { duration: 0.8, delay: 0.2 }, children: (0, jsx_runtime_1.jsx)(OffersCarousel_1.default, { onOfferExplosion: handleOfferExplosion }) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { y: 100, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { duration: 0.8, delay: 0.4 }, children: (0, jsx_runtime_1.jsx)(InteractiveMap_1.default, {}) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-8", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { x: 100, opacity: 0 }, animate: { x: 0, opacity: 1 }, transition: { duration: 0.8, delay: 0.3 }, children: (0, jsx_runtime_1.jsx)(ActivityBars_1.default, {}) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { x: 100, opacity: 0 }, animate: { x: 0, opacity: 1 }, transition: { duration: 0.8, delay: 0.5 }, children: (0, jsx_runtime_1.jsx)(EventsSection_1.default, {}) })] })] })] }), (0, jsx_runtime_1.jsx)(FlamencoPlayer_1.default, {})] }));
}
//# sourceMappingURL=page.js.map