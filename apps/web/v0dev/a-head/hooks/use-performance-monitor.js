'use client';
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePerformanceMonitor = usePerformanceMonitor;
const react_1 = require("react");
function usePerformanceMonitor(options = {}) {
    const { enableAutoStart = true, sampleInterval = 1000, memoryThreshold = 50, fpsThreshold = 30, } = options;
    const [metrics, setMetrics] = (0, react_1.useState)({
        fps: 60,
        memoryUsage: 0,
        loadTime: 0,
        renderTime: 0,
        isOptimal: true,
    });
    const [isMonitoring, setIsMonitoring] = (0, react_1.useState)(false);
    const intervalRef = (0, react_1.useRef)(null);
    const frameCountRef = (0, react_1.useRef)(0);
    const lastTimeRef = (0, react_1.useRef)(performance.now());
    const measurePerformance = (0, react_1.useCallback)(() => {
        const now = performance.now();
        const deltaTime = now - lastTimeRef.current;
        if (deltaTime >= 1000) {
            const fps = Math.round((frameCountRef.current * 1000) / deltaTime);
            // Get memory usage if available
            const memoryInfo = performance.memory;
            const memoryUsage = memoryInfo
                ? Math.round((memoryInfo.usedJSHeapSize / memoryInfo.totalJSHeapSize) * 100)
                : 0;
            const newMetrics = {
                fps,
                memoryUsage,
                loadTime: performance.timing
                    ? performance.timing.loadEventEnd - performance.timing.navigationStart
                    : 0,
                renderTime: deltaTime,
                isOptimal: fps >= fpsThreshold && memoryUsage <= memoryThreshold,
            };
            setMetrics(newMetrics);
            frameCountRef.current = 0;
            lastTimeRef.current = now;
        }
        frameCountRef.current++;
    }, [fpsThreshold, memoryThreshold]);
    const startMonitoring = (0, react_1.useCallback)(() => {
        if (!isMonitoring) {
            setIsMonitoring(true);
            intervalRef.current = setInterval(measurePerformance, sampleInterval);
        }
    }, [isMonitoring, measurePerformance, sampleInterval]);
    const stopMonitoring = (0, react_1.useCallback)(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setIsMonitoring(false);
    }, []);
    (0, react_1.useEffect)(() => {
        if (enableAutoStart) {
            startMonitoring();
        }
        return () => {
            stopMonitoring();
        };
    }, []); // Empty dependency array to run only once
    return {
        metrics,
        isMonitoring,
        startMonitoring,
        stopMonitoring,
    };
}
//# sourceMappingURL=use-performance-monitor.js.map