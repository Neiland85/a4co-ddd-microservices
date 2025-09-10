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
exports.TracingErrorBoundary = void 0;
exports.useComponentTracing = useComponentTracing;
exports.useRouteTracing = useRouteTracing;
exports.useInteractionTracing = useInteractionTracing;
exports.useApiTracing = useApiTracing;
exports.withTracing = withTracing;
exports.TracingProvider = TracingProvider;
const jsx_runtime_1 = require("react/jsx-runtime");
/**
 * React hooks and HOCs for distributed tracing
 */
const react_1 = __importStar(require("react"));
const web_tracer_1 = require("./web-tracer");
/**
 * Hook to trace component lifecycle
 */
function useComponentTracing(componentName, props) {
    const spanRef = (0, react_1.useRef)(null);
    const renderCountRef = (0, react_1.useRef)(0);
    (0, react_1.useEffect)(() => {
        // Start span on mount
        spanRef.current = (0, web_tracer_1.traceComponentRender)(componentName, props);
        spanRef.current.setAttribute('component.mounted', true);
        spanRef.current.setAttribute('component.renderCount', 1);
        return () => {
            // End span on unmount
            if (spanRef.current) {
                spanRef.current.setAttribute('component.unmounted', true);
                spanRef.current.setAttribute('component.totalRenders', renderCountRef.current);
                spanRef.current.end();
            }
        };
    }, [componentName]);
    (0, react_1.useEffect)(() => {
        // Track renders
        renderCountRef.current++;
        if (spanRef.current && renderCountRef.current > 1) {
            spanRef.current.addEvent('component.rerender', {
                renderCount: renderCountRef.current,
                timestamp: new Date().toISOString(),
            });
        }
    });
    return spanRef.current;
}
/**
 * Hook to trace route changes
 */
function useRouteTracing(currentRoute) {
    const previousRouteRef = (0, react_1.useRef)(currentRoute);
    const spanRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        if (previousRouteRef.current !== currentRoute) {
            // End previous navigation span
            if (spanRef.current) {
                spanRef.current.end();
            }
            // Start new navigation span
            spanRef.current = (0, web_tracer_1.traceRouteNavigation)(previousRouteRef.current, currentRoute);
            // Add performance metrics after navigation
            setTimeout(() => {
                if (spanRef.current) {
                    (0, web_tracer_1.addPerformanceMetricsToSpan)();
                }
            }, 100);
            previousRouteRef.current = currentRoute;
        }
    }, [currentRoute]);
    return spanRef.current;
}
function useInteractionTracing(interactionType, target, options) {
    const lastInteractionTime = (0, react_1.useRef)(0);
    const traceInteraction = (0, react_1.useCallback)((metadata) => {
        const now = Date.now();
        if (options?.throttle && now - lastInteractionTime.current < options.throttle) {
            return;
        }
        const span = (0, web_tracer_1.traceUserInteraction)(interactionType, target, {
            ...options?.attributes,
            ...metadata,
        });
        span.end();
        lastInteractionTime.current = now;
    }, [interactionType, target, options]);
    return traceInteraction;
}
/**
 * Hook to trace API calls with spans
 */
function useApiTracing() {
    const activeSpans = (0, react_1.useRef)(new Map());
    const startApiTrace = (0, react_1.useCallback)((operationName, metadata) => {
        const span = (0, web_tracer_1.traceUserInteraction)('api-call', operationName, metadata);
        const traceId = span.spanContext().traceId;
        activeSpans.current.set(traceId, span);
        return traceId;
    }, []);
    const endApiTrace = (0, react_1.useCallback)((traceId, success, metadata) => {
        const span = activeSpans.current.get(traceId);
        if (span) {
            span.setAttribute('api.success', success);
            if (metadata) {
                Object.entries(metadata).forEach(([key, value]) => {
                    span.setAttribute(`api.${key}`, value);
                });
            }
            span.end();
            activeSpans.current.delete(traceId);
        }
    }, []);
    return { startApiTrace, endApiTrace };
}
function withTracing(Component, options) {
    const displayName = options?.componentName || Component.displayName || Component.name || 'Component';
    return react_1.default.forwardRef((props, ref) => {
        const span = useComponentTracing(displayName, props);
        // Track specific prop changes
        (0, react_1.useEffect)(() => {
            if (span && options?.trackProps) {
                const trackedProps = {};
                options.trackProps.forEach(propName => {
                    if (propName in props) {
                        trackedProps[propName] = props[propName];
                    }
                });
                span.addEvent('props.updated', {
                    props: trackedProps,
                    timestamp: new Date().toISOString(),
                });
            }
        }, options?.trackProps?.map(prop => props[prop]) || []);
        return (0, jsx_runtime_1.jsx)(Component, { ...props, ref: ref });
    });
}
function TracingProvider({ children, serviceName, serviceVersion, environment, }) {
    (0, react_1.useEffect)(() => {
        // Initialize web tracer on mount
        import('./web-tracer').then(({ initializeWebTracer }) => {
            initializeWebTracer({
                serviceName,
                serviceVersion,
                environment,
            });
        });
    }, [serviceName, serviceVersion, environment]);
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: children });
}
class TracingErrorBoundary extends react_1.default.Component {
    span;
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        const componentName = this.props.componentName || 'ErrorBoundary';
        this.span = (0, web_tracer_1.traceComponentRender)(componentName, {
            error: true,
            errorMessage: error.message,
            errorStack: error.stack,
            componentStack: errorInfo.componentStack,
        });
        this.span.recordException(error);
        this.span.end();
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
exports.TracingErrorBoundary = TracingErrorBoundary;
//# sourceMappingURL=react-tracing.js.map