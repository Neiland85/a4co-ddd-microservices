"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTracedFetch = exports.PerformanceTracker = exports.useEventTracking = exports.useComponentTracking = exports.useObservability = exports.ObservabilityProvider = void 0;
exports.withObservability = withObservability;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const uuid_1 = require("uuid");
const ObservabilityContext = (0, react_1.createContext)(null);
// Default browser logger that sends to backend
const createBrowserLogger = (apiEndpoint, sessionId) => {
    const sendLog = async (level, message, data) => {
        try {
            await fetch(`${apiEndpoint}/logs`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': sessionId,
                },
                body: JSON.stringify({
                    level,
                    message,
                    data,
                    timestamp: new Date().toISOString(),
                    url: window.location.href,
                    userAgent: navigator.userAgent,
                }),
            });
        }
        catch (error) {
            console.error('Failed to send log to backend:', error);
        }
    };
    return {
        debug: (message, data) => {
            console.debug(message, data);
            sendLog('debug', message, data);
        },
        info: (message, data) => {
            console.info(message, data);
            sendLog('info', message, data);
        },
        warn: (message, data) => {
            console.warn(message, data);
            sendLog('warn', message, data);
        },
        error: (message, data) => {
            console.error(message, data);
            sendLog('error', message, data);
        },
    };
};
const ObservabilityProvider = ({ children, apiEndpoint, userId, enablePerformanceTracking = true, enableErrorBoundary = true, onError, }) => {
    const [sessionId] = (0, react_1.useState)(() => (0, uuid_1.v4)());
    const logger = (0, react_1.useRef)(createBrowserLogger(apiEndpoint, sessionId));
    const eventQueue = (0, react_1.useRef)([]);
    const flushTimer = (0, react_1.useRef)();
    // Flush events to backend
    const flushEvents = async () => {
        if (eventQueue.current.length === 0)
            return;
        const events = [...eventQueue.current];
        eventQueue.current = [];
        try {
            await fetch(`${apiEndpoint}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Session-ID': sessionId,
                },
                body: JSON.stringify({ events }),
            });
        }
        catch (error) {
            logger.current.error('Failed to send events to backend', error);
            // Re-queue events on failure
            eventQueue.current.unshift(...events);
        }
    };
    // Log UI event
    const logEvent = (event) => {
        eventQueue.current.push({
            ...event,
            sessionId,
            userId,
            timestamp: Date.now(),
        });
        // Debounce flush
        if (flushTimer.current) {
            clearTimeout(flushTimer.current);
        }
        flushTimer.current = setTimeout(flushEvents, 1000);
    };
    // Track component usage
    const trackComponent = (componentName, config) => {
        logEvent({
            eventType: 'custom',
            componentName,
            componentProps: config?.trackProps ? {} : undefined,
            timestamp: Date.now(),
            sessionId,
            metadata: {
                action: 'component_rendered',
            },
        });
    };
    // Measure performance
    const measurePerformance = async (name, fn) => {
        const startTime = performance.now();
        try {
            await fn();
            const duration = performance.now() - startTime;
            logger.current.info(`Performance: ${name}`, { duration });
            logEvent({
                eventType: 'custom',
                componentName: 'performance',
                timestamp: Date.now(),
                sessionId,
                metadata: {
                    measurement: name,
                    duration,
                },
            });
        }
        catch (error) {
            const duration = performance.now() - startTime;
            logger.current.error(`Performance error: ${name}`, { duration, error });
            throw error;
        }
    };
    // Track page views
    (0, react_1.useEffect)(() => {
        const trackPageView = () => {
            logEvent({
                eventType: 'navigation',
                componentName: 'page',
                timestamp: Date.now(),
                sessionId,
                metadata: {
                    url: window.location.href,
                    referrer: document.referrer,
                    title: document.title,
                },
            });
        };
        trackPageView();
        window.addEventListener('popstate', trackPageView);
        return () => {
            window.removeEventListener('popstate', trackPageView);
            // Flush remaining events
            flushEvents();
        };
    }, []);
    // Track performance metrics
    (0, react_1.useEffect)(() => {
        if (!enablePerformanceTracking)
            return;
        // Wait for page load
        const trackPerformance = () => {
            if ('performance' in window) {
                const perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    logger.current.info('Page performance metrics', {
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                        firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
                        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
                    });
                }
            }
        };
        if (document.readyState === 'complete') {
            trackPerformance();
        }
        else {
            window.addEventListener('load', trackPerformance);
            return () => window.removeEventListener('load', trackPerformance);
        }
    }, [enablePerformanceTracking]);
    const value = {
        sessionId,
        userId,
        logger: logger.current,
        logEvent,
        trackComponent,
        measurePerformance,
    };
    if (enableErrorBoundary) {
        return ((0, jsx_runtime_1.jsx)(ObservabilityContext.Provider, { value: value, children: (0, jsx_runtime_1.jsx)(ErrorBoundary, { onError: onError, logger: logger.current, children: children }) }));
    }
    return (0, jsx_runtime_1.jsx)(ObservabilityContext.Provider, { value: value, children: children });
};
exports.ObservabilityProvider = ObservabilityProvider;
class ErrorBoundary extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        this.props.logger.error('React error boundary caught error', {
            error: error.toString(),
            stack: error.stack,
            componentStack: errorInfo.componentStack,
        });
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }
    render() {
        if (this.state.hasError) {
            return ((0, jsx_runtime_1.jsxs)("div", { style: { padding: '20px', textAlign: 'center' }, children: [(0, jsx_runtime_1.jsx)("h2", { children: "Something went wrong" }), (0, jsx_runtime_1.jsx)("p", { children: "We're sorry for the inconvenience. Please refresh the page." }), process.env.NODE_ENV === 'development' && ((0, jsx_runtime_1.jsxs)("details", { style: { marginTop: '20px', textAlign: 'left' }, children: [(0, jsx_runtime_1.jsx)("summary", { children: "Error details" }), (0, jsx_runtime_1.jsx)("pre", { children: this.state.error?.stack })] }))] }));
        }
        return this.props.children;
    }
}
// Hooks
const useObservability = () => {
    const context = (0, react_1.useContext)(ObservabilityContext);
    if (!context) {
        throw new Error('useObservability must be used within ObservabilityProvider');
    }
    return context;
};
exports.useObservability = useObservability;
// Hook for tracking component lifecycle
const useComponentTracking = (componentName, config) => {
    const { trackComponent, logEvent } = (0, exports.useObservability)();
    const renderCount = (0, react_1.useRef)(0);
    (0, react_1.useEffect)(() => {
        renderCount.current++;
        trackComponent(componentName, config);
        return () => {
            logEvent({
                eventType: 'custom',
                componentName,
                timestamp: Date.now(),
                sessionId: '',
                metadata: {
                    action: 'component_unmounted',
                    renderCount: renderCount.current,
                },
            });
        };
    }, []);
};
exports.useComponentTracking = useComponentTracking;
// Hook for tracking user interactions
const useEventTracking = () => {
    const { logEvent, sessionId } = (0, exports.useObservability)();
    const trackClick = (componentName, metadata) => {
        logEvent({
            eventType: 'click',
            componentName,
            timestamp: Date.now(),
            sessionId,
            metadata,
        });
    };
    const trackInput = (componentName, value, metadata) => {
        logEvent({
            eventType: 'input',
            componentName,
            timestamp: Date.now(),
            sessionId: '',
            metadata: {
                value: typeof value === 'string' && value.length > 100 ? value.substring(0, 100) + '...' : value,
                ...metadata,
            },
        });
    };
    const trackCustom = (componentName, action, metadata) => {
        logEvent({
            eventType: 'custom',
            componentName,
            timestamp: Date.now(),
            sessionId: '',
            metadata: {
                action,
                ...metadata,
            },
        });
    };
    return { trackClick, trackInput, trackCustom };
};
exports.useEventTracking = useEventTracking;
// HOC for component tracking
function withObservability(Component, componentName, config) {
    return (props) => {
        (0, exports.useComponentTracking)(componentName, config);
        return (0, jsx_runtime_1.jsx)(Component, { ...props });
    };
}
// Performance tracking component
const PerformanceTracker = ({ name, children }) => {
    const { measurePerformance } = (0, exports.useObservability)();
    const [content, setContent] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        measurePerformance(name, async () => {
            const result = children();
            setContent(result);
        });
    }, []);
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: content });
};
exports.PerformanceTracker = PerformanceTracker;
// Traced fetch wrapper
const createTracedFetch = (apiEndpoint, sessionId) => {
    return async (url, options) => {
        const traceId = (0, uuid_1.v4)();
        const startTime = performance.now();
        const tracedOptions = {
            ...options,
            headers: {
                ...options?.headers,
                'X-Trace-ID': traceId,
                'X-Session-ID': sessionId,
            },
        };
        try {
            const response = await fetch(url, tracedOptions);
            const duration = performance.now() - startTime;
            // Log to console in development
            if (process.env.NODE_ENV === 'development') {
                console.debug(`[Trace ${traceId}] ${options?.method || 'GET'} ${url} - ${response.status} (${duration.toFixed(2)}ms)`);
            }
            return response;
        }
        catch (error) {
            const duration = performance.now() - startTime;
            console.error(`[Trace ${traceId}] ${options?.method || 'GET'} ${url} - Failed (${duration.toFixed(2)}ms)`, error);
            throw error;
        }
    };
};
exports.createTracedFetch = createTracedFetch;
//# sourceMappingURL=index.js.map