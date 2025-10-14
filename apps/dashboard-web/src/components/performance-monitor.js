'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceMonitor = PerformanceMonitor;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const card_1 = require("@/components/ui/card");
const button_1 = require("@/components/ui/button");
const badge_1 = require("@/components/ui/badge");
const slider_1 = require("@/components/ui/slider");
const lucide_react_1 = require("lucide-react");
const use_performance_monitor_1 = require("../hooks/use-performance-monitor");
function PerformanceMonitor({ isVisible = false, onToggle }) {
    const [isDeveloperMode, setIsDeveloperMode] = (0, react_1.useState)(false);
    const [showStressControls, setShowStressControls] = (0, react_1.useState)(false);
    const { metrics, getOptimizationSuggestions, setStressLevel, isMonitoring } = (0, use_performance_monitor_1.usePerformanceMonitor)({
        enableMemoryMonitoring: true,
        fpsThreshold: 30,
        frameTimeThreshold: 33.33,
        stressTestMode: true,
    });
    // Check if we're in development mode
    (0, react_1.useEffect)(() => {
        setIsDeveloperMode(process.env.NODE_ENV === 'development');
    }, []);
    // Auto-hide in production unless explicitly shown
    if (!isDeveloperMode && !isVisible) {
        return null;
    }
    const suggestions = getOptimizationSuggestions();
    const getPerformanceStatus = () => {
        if (metrics.fps >= 50)
            return { status: 'excellent', color: 'green', icon: lucide_react_1.CheckCircle };
        if (metrics.fps >= 30)
            return { status: 'good', color: 'yellow', icon: lucide_react_1.Activity };
        if (metrics.fps >= 15)
            return { status: 'poor', color: 'orange', icon: lucide_react_1.AlertTriangle };
        return { status: 'critical', color: 'red', icon: lucide_react_1.AlertTriangle };
    };
    const performanceStatus = getPerformanceStatus();
    const StatusIcon = performanceStatus.icon;
    const handleStressLevelChange = (value) => {
        setStressLevel(value[0]);
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed right-4 top-4 z-50 max-w-sm", children: (0, jsx_runtime_1.jsxs)(card_1.Card, { className: "border bg-white/95 shadow-lg backdrop-blur-sm", children: [(0, jsx_runtime_1.jsx)(card_1.CardHeader, { className: "pb-3", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)(card_1.CardTitle, { className: "flex items-center gap-2 text-sm font-medium", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Monitor, { className: "h-4 w-4" }), "Performance Monitor"] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: () => setShowStressControls(!showStressControls), className: "h-6 w-6 p-0", title: "Toggle stress test controls", children: (0, jsx_runtime_1.jsx)(lucide_react_1.TestTube, { className: "h-3 w-3" }) }), onToggle && ((0, jsx_runtime_1.jsx)(button_1.Button, { variant: "ghost", size: "sm", onClick: onToggle, className: "h-6 w-6 p-0", children: "\u00D7" }))] })] }) }), (0, jsx_runtime_1.jsxs)(card_1.CardContent, { className: "space-y-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-xs text-gray-600", children: "Status" }), (0, jsx_runtime_1.jsxs)(badge_1.Badge, { variant: performanceStatus.color === 'green' ? 'default' : 'destructive', className: `text-xs ${performanceStatus.color === 'yellow'
                                        ? 'bg-yellow-500'
                                        : performanceStatus.color === 'orange'
                                            ? 'bg-orange-500'
                                            : ''}`, children: [(0, jsx_runtime_1.jsx)(StatusIcon, { className: "mr-1 h-3 w-3" }), performanceStatus.status] })] }), showStressControls && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-2 rounded-lg border border-blue-200 bg-blue-50 p-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-xs font-medium text-blue-800", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.TestTube, { className: "h-3 w-3" }), "FPS Stress Test"] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between text-xs", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-blue-700", children: "Stress Level" }), (0, jsx_runtime_1.jsxs)("span", { className: "font-mono text-blue-900", children: [metrics.stressLevel, "/10"] })] }), (0, jsx_runtime_1.jsx)(slider_1.Slider, { value: [metrics.stressLevel], onValueChange: handleStressLevelChange, max: 10, step: 1, className: "w-full" }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-blue-600", children: "Simulates CPU load to test performance adaptations" })] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-3 text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Activity, { className: `h-3 w-3 ${metrics.fps >= 50
                                                        ? 'text-green-500'
                                                        : metrics.fps >= 30
                                                            ? 'text-yellow-500'
                                                            : metrics.fps >= 15
                                                                ? 'text-orange-500'
                                                                : 'text-red-500'}` }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "FPS" })] }), (0, jsx_runtime_1.jsx)("div", { className: `font-mono text-lg font-bold ${metrics.fps >= 50
                                                ? 'text-green-600'
                                                : metrics.fps >= 30
                                                    ? 'text-yellow-600'
                                                    : metrics.fps >= 15
                                                        ? 'text-orange-600'
                                                        : 'text-red-600'}`, children: metrics.fps })] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: `h-3 w-3 ${metrics.frameTime <= 16.67
                                                        ? 'text-green-500'
                                                        : metrics.frameTime <= 33.33
                                                            ? 'text-yellow-500'
                                                            : metrics.frameTime <= 66.67
                                                                ? 'text-orange-500'
                                                                : 'text-red-500'}` }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Frame Time" })] }), (0, jsx_runtime_1.jsxs)("div", { className: `font-mono text-lg font-bold ${metrics.frameTime <= 16.67
                                                ? 'text-green-600'
                                                : metrics.frameTime <= 33.33
                                                    ? 'text-yellow-600'
                                                    : metrics.frameTime <= 66.67
                                                        ? 'text-orange-600'
                                                        : 'text-red-600'}`, children: [metrics.frameTime, "ms"] })] }), metrics.memoryUsage && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.MemoryStick, { className: `h-3 w-3 ${metrics.memoryUsage <= 50
                                                        ? 'text-green-500'
                                                        : metrics.memoryUsage <= 100
                                                            ? 'text-yellow-500'
                                                            : 'text-red-500'}` }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Memory" })] }), (0, jsx_runtime_1.jsxs)("div", { className: `font-mono text-lg font-bold ${metrics.memoryUsage <= 50
                                                ? 'text-green-600'
                                                : metrics.memoryUsage <= 100
                                                    ? 'text-yellow-600'
                                                    : 'text-red-600'}`, children: [metrics.memoryUsage, "MB"] })] })), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Monitor, { className: `h-3 w-3 ${metrics.animationCount <= 5
                                                        ? 'text-green-500'
                                                        : metrics.animationCount <= 10
                                                            ? 'text-yellow-500'
                                                            : 'text-red-500'}` }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "Animations" })] }), (0, jsx_runtime_1.jsx)("div", { className: `font-mono text-lg font-bold ${metrics.animationCount <= 5
                                                ? 'text-green-600'
                                                : metrics.animationCount <= 10
                                                    ? 'text-yellow-600'
                                                    : 'text-red-600'}`, children: metrics.animationCount })] }), metrics.cpuUsage !== undefined && ((0, jsx_runtime_1.jsxs)("div", { className: "col-span-2 space-y-1", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Cpu, { className: `h-3 w-3 ${metrics.cpuUsage <= 30
                                                        ? 'text-green-500'
                                                        : metrics.cpuUsage <= 70
                                                            ? 'text-yellow-500'
                                                            : 'text-red-500'}` }), (0, jsx_runtime_1.jsx)("span", { className: "text-gray-600", children: "CPU Load Estimate" })] }), (0, jsx_runtime_1.jsx)("div", { className: "h-2 w-full rounded-full bg-gray-200", children: (0, jsx_runtime_1.jsx)("div", { className: `h-2 rounded-full transition-all duration-300 ${metrics.cpuUsage <= 30
                                                    ? 'bg-green-500'
                                                    : metrics.cpuUsage <= 70
                                                        ? 'bg-yellow-500'
                                                        : 'bg-red-500'}`, style: { width: `${Math.min(100, metrics.cpuUsage)}%` } }) })] }))] }), metrics.isLowPerformance && ((0, jsx_runtime_1.jsxs)("div", { className: `rounded border p-2 text-xs ${metrics.fps < 15 ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: `mb-1 flex items-center gap-1 font-medium ${metrics.fps < 15 ? 'text-red-800' : 'text-yellow-800'}`, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertTriangle, { className: "h-3 w-3" }), metrics.fps < 15 ? 'Critical Performance' : 'Performance Warning'] }), (0, jsx_runtime_1.jsx)("p", { className: metrics.fps < 15 ? 'text-red-700' : 'text-yellow-700', children: metrics.fps < 15
                                        ? 'Severe performance issues detected. Effects are being heavily reduced.'
                                        : 'Low performance detected. Animation complexity is being reduced.' })] })), metrics.isLowPerformance && ((0, jsx_runtime_1.jsxs)("div", { className: "rounded border border-blue-200 bg-blue-50 p-2 text-xs", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-1 flex items-center gap-1 font-medium text-blue-800", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Zap, { className: "h-3 w-3" }), "Active Optimizations"] }), (0, jsx_runtime_1.jsxs)("ul", { className: "space-y-1 text-blue-700", children: [metrics.fps < 15 && (0, jsx_runtime_1.jsx)("li", { children: "\u2022 Fragments disabled" }), metrics.fps < 20 && (0, jsx_runtime_1.jsx)("li", { children: "\u2022 Sparkle effects disabled" }), metrics.fps < 30 && (0, jsx_runtime_1.jsx)("li", { children: "\u2022 Reduced fragment count" }), metrics.fps < 45 && (0, jsx_runtime_1.jsx)("li", { children: "\u2022 Shorter animation durations" }), metrics.animationCount > 10 && (0, jsx_runtime_1.jsx)("li", { children: "\u2022 Animation queue limited" })] })] })), suggestions.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "space-y-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-xs font-medium text-gray-700", children: "Suggestions:" }), (0, jsx_runtime_1.jsx)("ul", { className: "space-y-1 text-xs text-gray-600", children: suggestions.slice(0, 3).map((suggestion, index) => ((0, jsx_runtime_1.jsxs)("li", { className: "flex items-start gap-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "mt-0.5 text-blue-500", children: "\u2022" }), suggestion] }, index))) })] })), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between border-t border-gray-200 pt-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-xs text-gray-500", children: [isMonitoring ? 'Monitoring active' : 'Monitoring paused', metrics.stressLevel > 0 && ` • Stress: ${metrics.stressLevel}/10`] }), (0, jsx_runtime_1.jsx)("div", { className: `h-2 w-2 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-gray-400'}` })] })] })] }) }));
}
//# sourceMappingURL=performance-monitor.js.map