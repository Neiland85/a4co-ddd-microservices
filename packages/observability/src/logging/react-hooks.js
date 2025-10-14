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
exports.LoggingErrorBoundary = void 0;
exports.LoggerProvider = LoggerProvider;
exports.useLogger = useLogger;
exports.useComponentLogger = useComponentLogger;
exports.useInteractionLogger = useInteractionLogger;
exports.useApiLogger = useApiLogger;
exports.withLogging = withLogging;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * React hooks and HOCs for logging integration
 */
const react_1 = __importStar(require("react"));
const LoggerContext = (0, react_1.createContext)(null);
function LoggerProvider({ logger, children }) {
    return (0, jsx_runtime_1.jsx)(LoggerContext.Provider, { value: { logger }, children: children });
}
/**
 * Hook to access the logger instance
 */
function useLogger() {
    const context = (0, react_1.useContext)(LoggerContext);
    if (!context) {
        throw new Error('useLogger must be used within a LoggerProvider');
    }
    return context.logger;
}
/**
 * Hook to log component lifecycle events
 */
function useComponentLogger(componentName, props) {
    const logger = useLogger();
    const componentLogger = (0, react_1.useRef)();
    const renderCount = (0, react_1.useRef)(0);
    if (!componentLogger.current) {
        componentLogger.current = logger.child({
            custom: {
                component: componentName,
                props: props ? Object.keys(props) : undefined,
            },
        });
    }
    (0, react_1.useEffect)(() => {
        renderCount.current++;
        componentLogger.current?.trace(`Component rendered`, {
            custom: {
                renderCount: renderCount.current,
            },
        });
    });
    (0, react_1.useEffect)(() => {
        componentLogger.current?.debug(`Component mounted`);
        return () => {
            componentLogger.current?.debug(`Component unmounted`, {
                custom: {
                    totalRenders: renderCount.current,
                },
            });
        };
    }, []);
    return componentLogger.current;
}
function useInteractionLogger(interactionType, options) {
    const logger = useLogger();
    const lastLogTime = (0, react_1.useRef)(0);
    const debounceTimer = (0, react_1.useRef)();
    return (eventData) => {
        const now = Date.now();
        if (options?.throttle && now - lastLogTime.current < options.throttle) {
            return;
        }
        if (options?.debounce) {
            clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(() => {
                logger.info(`User interaction: ${interactionType}`, {
                    custom: {
                        interaction: interactionType,
                        data: eventData,
                    },
                });
                lastLogTime.current = Date.now();
            }, options.debounce);
        }
        else {
            logger.info(`User interaction: ${interactionType}`, {
                custom: {
                    interaction: interactionType,
                    data: eventData,
                },
            });
            lastLogTime.current = now;
        }
    };
}
function useApiLogger() {
    const logger = useLogger();
    return {
        logRequest: (options, traceId) => {
            const startTime = Date.now();
            logger.info(`API request started`, {
                traceId,
                http: {
                    method: options.method,
                    url: options.url,
                },
                custom: {
                    hasBody: !!options.body,
                    headers: options.headers ? Object.keys(options.headers) : undefined,
                },
            });
            return startTime;
        },
        logResponse: (startTime, options, response, traceId) => {
            const duration = Date.now() - startTime;
            logger.info(`API request completed`, {
                traceId,
                http: {
                    method: options.method,
                    url: options.url,
                    statusCode: response.status,
                    duration,
                },
            });
        },
        logError: (startTime, options, error, traceId) => {
            const duration = Date.now() - startTime;
            logger.error(`API request failed`, error, {
                traceId,
                http: {
                    method: options.method,
                    url: options.url,
                    duration,
                },
            });
        },
    };
}
class LoggingErrorBoundary extends react_1.default.Component {
    static contextType = LoggerContext;
    context;
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        const logger = this.context?.logger;
        if (logger) {
            logger.error('React error boundary caught error', error, {
                custom: {
                    componentStack: errorInfo.componentStack,
                },
            });
        }
        this.props.onError?.(error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            const Fallback = this.props.fallback;
            if (Fallback) {
                return (0, jsx_runtime_1.jsx)(Fallback, { error: this.state.error });
            }
            return ((0, jsx_runtime_1.jsxs)("div", { style: { padding: '20px', textAlign: 'center' }, children: [(0, jsx_runtime_1.jsx)("h2", { children: "Something went wrong." }), (0, jsx_runtime_1.jsx)("details", { style: { whiteSpace: 'pre-wrap' }, children: this.state.error?.toString() })] }));
        }
        return this.props.children;
    }
}
exports.LoggingErrorBoundary = LoggingErrorBoundary;
/**
 * HOC to add logging to any component
 */
function withLogging(Component, componentName) {
    const displayName = componentName || Component.displayName || Component.name || 'Component';
    return react_1.default.forwardRef((props, ref) => {
        const logger = useComponentLogger(displayName, props);
        (0, react_1.useEffect)(() => {
            logger.trace(`Props updated`, {
                custom: {
                    props: Object.keys(props),
                },
            });
        }, [props, logger]);
        return (0, jsx_runtime_1.jsx)(Component, { ...props, ref: ref });
    });
}
//# sourceMappingURL=react-hooks.js.map