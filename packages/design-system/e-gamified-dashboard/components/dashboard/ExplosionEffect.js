'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ExplosionEffect;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const react_1 = require("react");
function ExplosionEffect({ x, y }) {
    const [particles, setParticles] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];
        const newParticles = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 20 + 10,
            angle: (Math.PI * 2 * i) / 20,
            distance: Math.random() * 200 + 100,
        }));
        setParticles(newParticles);
    }, []);
    return ((0, jsx_runtime_1.jsxs)("div", { className: "pointer-events-none fixed z-50", style: { left: x, top: y }, children: [particles.map(particle => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute rounded-full", style: {
                    backgroundColor: particle.color,
                    width: particle.size,
                    height: particle.size,
                    left: -particle.size / 2,
                    top: -particle.size / 2,
                }, initial: {
                    x: 0,
                    y: 0,
                    scale: 1,
                    opacity: 1,
                }, animate: {
                    x: Math.cos(particle.angle) * particle.distance,
                    y: Math.sin(particle.angle) * particle.distance,
                    scale: 0,
                    opacity: 0,
                }, transition: {
                    duration: 1.5,
                    ease: 'easeOut',
                } }, particle.id))), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute rounded-full bg-white", style: {
                    width: 100,
                    height: 100,
                    left: -50,
                    top: -50,
                }, initial: { scale: 0, opacity: 1 }, animate: { scale: 3, opacity: 0 }, transition: { duration: 0.5, ease: 'easeOut' } }), [1, 2, 3].map(ring => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute rounded-full border-4 border-yellow-400", style: {
                    width: 50,
                    height: 50,
                    left: -25,
                    top: -25,
                }, initial: { scale: 0, opacity: 0.8 }, animate: { scale: ring * 4, opacity: 0 }, transition: {
                    duration: 1,
                    delay: ring * 0.1,
                    ease: 'easeOut',
                } }, ring)))] }));
}
//# sourceMappingURL=ExplosionEffect.js.map