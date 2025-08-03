"use strict";
/**
 * React hooks and HOCs for distributed tracing
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TracingErrorBoundary = void 0;
exports.useComponentTracing = useComponentTracing;
exports.useRouteTracing = useRouteTracing;
exports.useInteractionTracing = useInteractionTracing;
exports.useApiTracing = useApiTracing;
exports.withTracing = withTracing;
exports.TracingProvider = TracingProvider;
var react_1 = require("react");
var web_tracer_1 = require("./web-tracer");
/**
 * Hook to trace component lifecycle
 */
function useComponentTracing(componentName, props) {
    var spanRef = (0, react_1.useRef)(null);
    var renderCountRef = (0, react_1.useRef)(0);
    (0, react_1.useEffect)(function () {
        // Start span on mount
        spanRef.current = (0, web_tracer_1.traceComponentRender)(componentName, props);
        spanRef.current.setAttribute('component.mounted', true);
        spanRef.current.setAttribute('component.renderCount', 1);
        return function () {
            // End span on unmount
            if (spanRef.current) {
                spanRef.current.setAttribute('component.unmounted', true);
                spanRef.current.setAttribute('component.totalRenders', renderCountRef.current);
                spanRef.current.end();
            }
        };
    }, [componentName]);
    (0, react_1.useEffect)(function () {
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
    var previousRouteRef = (0, react_1.useRef)(currentRoute);
    var spanRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        if (previousRouteRef.current !== currentRoute) {
            // End previous navigation span
            if (spanRef.current) {
                spanRef.current.end();
            }
            // Start new navigation span
            spanRef.current = (0, web_tracer_1.traceRouteNavigation)(previousRouteRef.current, currentRoute);
            // Add performance metrics after navigation
            setTimeout(function () {
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
    var lastInteractionTime = (0, react_1.useRef)(0);
    var traceInteraction = (0, react_1.useCallback)(function (metadata) {
        var now = Date.now();
        if ((options === null || options === void 0 ? void 0 : options.throttle) && now - lastInteractionTime.current < options.throttle) {
            return;
        }
        var span = (0, web_tracer_1.traceUserInteraction)(interactionType, target, __assign(__assign({}, options === null || options === void 0 ? void 0 : options.attributes), metadata));
        span.end();
        lastInteractionTime.current = now;
    }, [interactionType, target, options]);
    return traceInteraction;
}
/**
 * Hook to trace API calls with spans
 */
function useApiTracing() {
    var activeSpans = (0, react_1.useRef)(new Map());
    var startApiTrace = (0, react_1.useCallback)(function (operationName, metadata) {
        var span = (0, web_tracer_1.traceUserInteraction)('api-call', operationName, metadata);
        var traceId = span.spanContext().traceId;
        activeSpans.current.set(traceId, span);
        return traceId;
    }, []);
    var endApiTrace = (0, react_1.useCallback)(function (traceId, success, metadata) {
        var span = activeSpans.current.get(traceId);
        if (span) {
            span.setAttribute('api.success', success);
            if (metadata) {
                Object.entries(metadata).forEach(function (_a) {
                    var key = _a[0], value = _a[1];
                    span.setAttribute("api.".concat(key), value);
                });
            }
            span.end();
            activeSpans.current.delete(traceId);
        }
    }, []);
    return { startApiTrace: startApiTrace, endApiTrace: endApiTrace };
}
function withTracing(Component, options) {
    var displayName = (options === null || options === void 0 ? void 0 : options.componentName) || Component.displayName || Component.name || 'Component';
    return react_1.default.forwardRef(function (props, ref) {
        var _a;
        var span = useComponentTracing(displayName, props);
        // Track specific prop changes
        (0, react_1.useEffect)(function () {
            if (span && (options === null || options === void 0 ? void 0 : options.trackProps)) {
                var trackedProps_1 = {};
                options.trackProps.forEach(function (propName) {
                    if (propName in props) {
                        trackedProps_1[propName] = props[propName];
                    }
                });
                span.addEvent('props.updated', {
                    props: trackedProps_1,
                    timestamp: new Date().toISOString(),
                });
            }
        }, ((_a = options === null || options === void 0 ? void 0 : options.trackProps) === null || _a === void 0 ? void 0 : _a.map(function (prop) { return props[prop]; })) || []);
        return <Component {...props} ref={ref}/>;
    });
}
function TracingProvider(_a) {
    var children = _a.children, serviceName = _a.serviceName, serviceVersion = _a.serviceVersion, environment = _a.environment;
    (0, react_1.useEffect)(function () {
        // Initialize web tracer on mount
        Promise.resolve().then(function () { return require('./web-tracer'); }).then(function (_a) {
            var initializeWebTracer = _a.initializeWebTracer;
            initializeWebTracer({
                serviceName: serviceName,
                serviceVersion: serviceVersion,
                environment: environment,
            });
        });
    }, [serviceName, serviceVersion, environment]);
    return <>{children}</>;
}
var TracingErrorBoundary = /** @class */ (function (_super) {
    __extends(TracingErrorBoundary, _super);
    function TracingErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { hasError: false };
        return _this;
    }
    TracingErrorBoundary.getDerivedStateFromError = function (error) {
        return { hasError: true, error: error };
    };
    TracingErrorBoundary.prototype.componentDidCatch = function (error, errorInfo) {
        var componentName = this.props.componentName || 'ErrorBoundary';
        this.span = (0, web_tracer_1.traceComponentRender)(componentName, {
            error: true,
            errorMessage: error.message,
            errorStack: error.stack,
            componentStack: errorInfo.componentStack,
        });
        this.span.recordException(error);
        this.span.end();
    };
    TracingErrorBoundary.prototype.render = function () {
        var _a;
        if (this.state.hasError) {
            var Fallback = this.props.fallback;
            if (Fallback) {
                return <Fallback error={this.state.error}/>;
            }
            return (<div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {(_a = this.state.error) === null || _a === void 0 ? void 0 : _a.toString()}
          </details>
        </div>);
        }
        return this.props.children;
    };
    return TracingErrorBoundary;
}(react_1.default.Component));
exports.TracingErrorBoundary = TracingErrorBoundary;
