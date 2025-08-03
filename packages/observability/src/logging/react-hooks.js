"use strict";
/**
 * React hooks and HOCs for logging integration
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingErrorBoundary = void 0;
exports.LoggerProvider = LoggerProvider;
exports.useLogger = useLogger;
exports.useComponentLogger = useComponentLogger;
exports.useInteractionLogger = useInteractionLogger;
exports.useApiLogger = useApiLogger;
exports.withLogging = withLogging;
var react_1 = require("react");
var LoggerContext = (0, react_1.createContext)(null);
function LoggerProvider(_a) {
    var logger = _a.logger, children = _a.children;
    return (<LoggerContext.Provider value={{ logger: logger }}>
      {children}
    </LoggerContext.Provider>);
}
/**
 * Hook to access the logger instance
 */
function useLogger() {
    var context = (0, react_1.useContext)(LoggerContext);
    if (!context) {
        throw new Error('useLogger must be used within a LoggerProvider');
    }
    return context.logger;
}
/**
 * Hook to log component lifecycle events
 */
function useComponentLogger(componentName, props) {
    var logger = useLogger();
    var componentLogger = (0, react_1.useRef)();
    var renderCount = (0, react_1.useRef)(0);
    if (!componentLogger.current) {
        componentLogger.current = logger.child({
            custom: {
                component: componentName,
                props: props ? Object.keys(props) : undefined,
            },
        });
    }
    (0, react_1.useEffect)(function () {
        var _a;
        renderCount.current++;
        (_a = componentLogger.current) === null || _a === void 0 ? void 0 : _a.trace("Component rendered", {
            custom: {
                renderCount: renderCount.current,
            },
        });
    });
    (0, react_1.useEffect)(function () {
        var _a;
        (_a = componentLogger.current) === null || _a === void 0 ? void 0 : _a.debug("Component mounted");
        return function () {
            var _a;
            (_a = componentLogger.current) === null || _a === void 0 ? void 0 : _a.debug("Component unmounted", {
                custom: {
                    totalRenders: renderCount.current,
                },
            });
        };
    }, []);
    return componentLogger.current;
}
function useInteractionLogger(interactionType, options) {
    var logger = useLogger();
    var lastLogTime = (0, react_1.useRef)(0);
    var debounceTimer = (0, react_1.useRef)();
    return function (eventData) {
        var now = Date.now();
        if ((options === null || options === void 0 ? void 0 : options.throttle) && now - lastLogTime.current < options.throttle) {
            return;
        }
        if (options === null || options === void 0 ? void 0 : options.debounce) {
            clearTimeout(debounceTimer.current);
            debounceTimer.current = setTimeout(function () {
                logger.info("User interaction: ".concat(interactionType), {
                    custom: {
                        interaction: interactionType,
                        data: eventData,
                    },
                });
                lastLogTime.current = Date.now();
            }, options.debounce);
        }
        else {
            logger.info("User interaction: ".concat(interactionType), {
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
    var logger = useLogger();
    return {
        logRequest: function (options, traceId) {
            var startTime = Date.now();
            logger.info("API request started", {
                traceId: traceId,
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
        logResponse: function (startTime, options, response, traceId) {
            var duration = Date.now() - startTime;
            logger.info("API request completed", {
                traceId: traceId,
                http: {
                    method: options.method,
                    url: options.url,
                    statusCode: response.status,
                    duration: duration,
                },
            });
        },
        logError: function (startTime, options, error, traceId) {
            var duration = Date.now() - startTime;
            logger.error("API request failed", error, {
                traceId: traceId,
                http: {
                    method: options.method,
                    url: options.url,
                    duration: duration,
                },
            });
        },
    };
}
var LoggingErrorBoundary = /** @class */ (function (_super) {
    __extends(LoggingErrorBoundary, _super);
    function LoggingErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { hasError: false };
        return _this;
    }
    LoggingErrorBoundary.getDerivedStateFromError = function (error) {
        return { hasError: true, error: error };
    };
    LoggingErrorBoundary.prototype.componentDidCatch = function (error, errorInfo) {
        var _a, _b, _c;
        var logger = (_a = this.context) === null || _a === void 0 ? void 0 : _a.logger;
        if (logger) {
            logger.error('React error boundary caught error', error, {
                custom: {
                    componentStack: errorInfo.componentStack,
                },
            });
        }
        (_c = (_b = this.props).onError) === null || _c === void 0 ? void 0 : _c.call(_b, error, errorInfo);
    };
    LoggingErrorBoundary.prototype.render = function () {
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
    LoggingErrorBoundary.contextType = LoggerContext;
    return LoggingErrorBoundary;
}(react_1.default.Component));
exports.LoggingErrorBoundary = LoggingErrorBoundary;
/**
 * HOC to add logging to any component
 */
function withLogging(Component, componentName) {
    var displayName = componentName || Component.displayName || Component.name || 'Component';
    return react_1.default.forwardRef(function (props, ref) {
        var logger = useComponentLogger(displayName, props);
        (0, react_1.useEffect)(function () {
            logger.trace("Props updated", {
                custom: {
                    props: Object.keys(props),
                },
            });
        }, [props, logger]);
        return <Component {...props} ref={ref}/>;
    });
}
