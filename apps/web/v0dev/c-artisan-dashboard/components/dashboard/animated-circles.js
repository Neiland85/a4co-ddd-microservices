'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimatedCircles = AnimatedCircles;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const react_1 = require("react");
const metrics_to_animation_1 = require("@/utils/metrics-to-animation");
function AnimatedCircles({ activeSection, metrics }) {
    const [mounted, setMounted] = (0, react_1.useState)(false);
    const [animationParams, setAnimationParams] = (0, react_1.useState)({
        intensity: 1,
        speed: 8,
        opacity: 0.15,
        scale: 1,
        colors: ['#3b82f6', '#06b6d4', '#8b5cf6'],
        particleCount: 6,
        pulseRate: 4,
    });
    (0, react_1.useEffect)(() => {
        setMounted(true);
    }, []);
    (0, react_1.useEffect)(() => {
        let params;
        switch (activeSection) {
            case 'monitor':
                params = (0, metrics_to_animation_1.getMonitorAnimationParams)(metrics.monitor);
                break;
            case 'recommendations':
                params = (0, metrics_to_animation_1.getRecommendationsAnimationParams)(metrics.recommendations);
                break;
            case 'comments':
                params = (0, metrics_to_animation_1.getCommentsAnimationParams)(metrics.comments);
                break;
            case 'settings':
                params = (0, metrics_to_animation_1.getSettingsAnimationParams)(metrics.settings);
                break;
            default:
                params = (0, metrics_to_animation_1.getMonitorAnimationParams)(metrics.monitor);
        }
        setAnimationParams(params);
    }, [activeSection, metrics]);
    if (!mounted)
        return null;
    const circles = Array.from({ length: animationParams.particleCount }, (_, i) => ({
        id: i,
        size: (Math.random() * 150 + 100) * animationParams.scale,
        initialX: Math.random() * 100,
        initialY: Math.random() * 100,
        color: animationParams.colors[i % animationParams.colors.length],
        delay: i * 0.3,
    }));
    return ((0, jsx_runtime_1.jsxs)("div", { className: "pointer-events-none fixed inset-0 z-0 overflow-hidden", children: [circles.map(circle => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute rounded-full blur-3xl", style: {
                    width: circle.size,
                    height: circle.size,
                    background: `radial-gradient(circle, ${circle.color}${Math.floor(animationParams.opacity * 255)
                        .toString(16)
                        .padStart(2, '0')}, transparent)`,
                }, initial: {
                    x: `${circle.initialX}vw`,
                    y: `${circle.initialY}vh`,
                    scale: 0,
                }, animate: {
                    x: [
                        `${circle.initialX}vw`,
                        `${(circle.initialX + 30 * animationParams.intensity) % 100}vw`,
                        `${(circle.initialX + 60 * animationParams.intensity) % 100}vw`,
                        `${circle.initialX}vw`,
                    ],
                    y: [
                        `${circle.initialY}vh`,
                        `${(circle.initialY + 20 * animationParams.intensity) % 100}vh`,
                        `${(circle.initialY + 40 * animationParams.intensity) % 100}vh`,
                        `${circle.initialY}vh`,
                    ],
                    scale: [0, animationParams.scale, animationParams.scale * 0.8, animationParams.scale],
                    rotate: [0, 180 * animationParams.intensity, 360 * animationParams.intensity],
                }, transition: {
                    duration: animationParams.speed + circle.delay,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                    delay: circle.delay,
                } }, `${activeSection}-${circle.id}-${animationParams.intensity}`))), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute left-1/2 top-1/2 rounded-full blur-2xl", style: {
                    width: 200 * animationParams.scale,
                    height: 200 * animationParams.scale,
                    background: `radial-gradient(circle, ${animationParams.colors[0]}${Math.floor(animationParams.opacity * 0.5 * 255)
                        .toString(16)
                        .padStart(2, '0')}, transparent)`,
                    transform: 'translate(-50%, -50%)',
                }, animate: {
                    scale: [0.8, 1.2, 0.8],
                    opacity: [
                        animationParams.opacity * 0.3,
                        animationParams.opacity * 0.8,
                        animationParams.opacity * 0.3,
                    ],
                }, transition: {
                    duration: animationParams.pulseRate,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'easeInOut',
                } }), activeSection === 'monitor' && metrics.monitor.activityLevel === 'critical' && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute right-4 top-4 h-4 w-4 rounded-full bg-red-500", animate: {
                    scale: [1, 1.5, 1],
                    opacity: [0.6, 1, 0.6],
                }, transition: {
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                } })), activeSection === 'recommendations' &&
                metrics.recommendations.campaignActivity === 'peak' && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { className: "absolute right-4 top-4 h-4 w-4 rounded-full bg-orange-500", animate: {
                    scale: [1, 1.3, 1],
                    opacity: [0.7, 1, 0.7],
                }, transition: {
                    duration: 0.8,
                    repeat: Number.POSITIVE_INFINITY,
                } }))] }));
}
//# sourceMappingURL=animated-circles.js.map