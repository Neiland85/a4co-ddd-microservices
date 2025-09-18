"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTracedFetch = exports.PerformanceTracker = exports.useEventTracking = exports.useComponentTracking = exports.useObservability = exports.ObservabilityProvider = void 0;
exports.withObservability = withObservability;
var react_1 = require("react");
var uuid_1 = require("uuid");
var ObservabilityContext = (0, react_1.createContext)(null);
// Default browser logger that sends to backend
var createBrowserLogger = function (apiEndpoint, sessionId) {
    var sendLog = function (level, message, data) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetch("".concat(apiEndpoint, "/logs"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Session-ID': sessionId,
                            },
                            body: JSON.stringify({
                                level: level,
                                message: message,
                                data: data,
                                timestamp: new Date().toISOString(),
                                url: window.location.href,
                                userAgent: navigator.userAgent,
                            }),
                        })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Failed to send log to backend:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return {
        debug: function (message, data) {
            console.debug(message, data);
            sendLog('debug', message, data);
        },
        info: function (message, data) {
            console.info(message, data);
            sendLog('info', message, data);
        },
        warn: function (message, data) {
            console.warn(message, data);
            sendLog('warn', message, data);
        },
        error: function (message, data) {
            console.error(message, data);
            sendLog('error', message, data);
        },
    };
};
var ObservabilityProvider = function (_a) {
    var children = _a.children, apiEndpoint = _a.apiEndpoint, userId = _a.userId, _b = _a.enablePerformanceTracking, enablePerformanceTracking = _b === void 0 ? true : _b, _c = _a.enableErrorBoundary, enableErrorBoundary = _c === void 0 ? true : _c, onError = _a.onError;
    var sessionId = (0, react_1.useState)(function () { return (0, uuid_1.v4)(); })[0];
    var logger = (0, react_1.useRef)(createBrowserLogger(apiEndpoint, sessionId));
    var eventQueue = (0, react_1.useRef)([]);
    var flushTimer = (0, react_1.useRef)();
    // Flush events to backend
    var flushEvents = function () { return __awaiter(void 0, void 0, void 0, function () {
        var events, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (eventQueue.current.length === 0)
                        return [2 /*return*/];
                    events = __spreadArray([], eventQueue.current, true);
                    eventQueue.current = [];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch("".concat(apiEndpoint, "/events"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-Session-ID': sessionId,
                            },
                            body: JSON.stringify({ events: events }),
                        })];
                case 2:
                    _b.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _b.sent();
                    logger.current.error('Failed to send events to backend', error_2);
                    // Re-queue events on failure
                    (_a = eventQueue.current).unshift.apply(_a, events);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Log UI event
    var logEvent = function (event) {
        eventQueue.current.push(__assign(__assign({}, event), { sessionId: sessionId, userId: userId, timestamp: Date.now() }));
        // Debounce flush
        if (flushTimer.current) {
            clearTimeout(flushTimer.current);
        }
        flushTimer.current = setTimeout(flushEvents, 1000);
    };
    // Track component usage
    var trackComponent = function (componentName, config) {
        logEvent({
            eventType: 'custom',
            componentName: componentName,
            componentProps: (config === null || config === void 0 ? void 0 : config.trackProps) ? {} : undefined,
            timestamp: Date.now(),
            sessionId: sessionId,
            metadata: {
                action: 'component_rendered',
            },
        });
    };
    // Measure performance
    var measurePerformance = function (name, fn) { return __awaiter(void 0, void 0, void 0, function () {
        var startTime, duration, error_3, duration;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startTime = performance.now();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fn()];
                case 2:
                    _a.sent();
                    duration = performance.now() - startTime;
                    logger.current.info("Performance: ".concat(name), { duration: duration });
                    logEvent({
                        eventType: 'custom',
                        componentName: 'performance',
                        timestamp: Date.now(),
                        sessionId: sessionId,
                        metadata: {
                            measurement: name,
                            duration: duration,
                        },
                    });
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    duration = performance.now() - startTime;
                    logger.current.error("Performance error: ".concat(name), { duration: duration, error: error_3 });
                    throw error_3;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Track page views
    (0, react_1.useEffect)(function () {
        var trackPageView = function () {
            logEvent({
                eventType: 'navigation',
                componentName: 'page',
                timestamp: Date.now(),
                sessionId: sessionId,
                metadata: {
                    url: window.location.href,
                    referrer: document.referrer,
                    title: document.title,
                },
            });
        };
        trackPageView();
        window.addEventListener('popstate', trackPageView);
        return function () {
            window.removeEventListener('popstate', trackPageView);
            // Flush remaining events
            flushEvents();
        };
    }, []);
    // Track performance metrics
    (0, react_1.useEffect)(function () {
        if (!enablePerformanceTracking)
            return;
        // Wait for page load
        var trackPerformance = function () {
            var _a, _b;
            if ('performance' in window) {
                var perfData = performance.getEntriesByType('navigation')[0];
                if (perfData) {
                    logger.current.info('Page performance metrics', {
                        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                        firstPaint: (_a = performance.getEntriesByName('first-paint')[0]) === null || _a === void 0 ? void 0 : _a.startTime,
                        firstContentfulPaint: (_b = performance.getEntriesByName('first-contentful-paint')[0]) === null || _b === void 0 ? void 0 : _b.startTime,
                    });
                }
            }
        };
        if (document.readyState === 'complete') {
            trackPerformance();
        }
        else {
            window.addEventListener('load', trackPerformance);
            return function () { return window.removeEventListener('load', trackPerformance); };
        }
    }, [enablePerformanceTracking]);
    var value = {
        sessionId: sessionId,
        userId: userId,
        logger: logger.current,
        logEvent: logEvent,
        trackComponent: trackComponent,
        measurePerformance: measurePerformance,
    };
    if (enableErrorBoundary) {
        return (<ObservabilityContext.Provider value={value}>
        <ErrorBoundary onError={onError} logger={logger.current}>
          {children}
        </ErrorBoundary>
      </ObservabilityContext.Provider>);
    }
    return (<ObservabilityContext.Provider value={value}>
      {children}
    </ObservabilityContext.Provider>);
};
exports.ObservabilityProvider = ObservabilityProvider;
var ErrorBoundary = /** @class */ (function (_super) {
    __extends(ErrorBoundary, _super);
    function ErrorBoundary(props) {
        var _this = _super.call(this, props) || this;
        _this.state = { hasError: false };
        return _this;
    }
    ErrorBoundary.getDerivedStateFromError = function (error) {
        return { hasError: true, error: error };
    };
    ErrorBoundary.prototype.componentDidCatch = function (error, errorInfo) {
        this.props.logger.error('React error boundary caught error', {
            error: error.toString(),
            stack: error.stack,
            componentStack: errorInfo.componentStack,
        });
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    };
    ErrorBoundary.prototype.render = function () {
        var _a;
        if (this.state.hasError) {
            return (<div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <p>We're sorry for the inconvenience. Please refresh the page.</p>
          {process.env.NODE_ENV === 'development' && (<details style={{ marginTop: '20px', textAlign: 'left' }}>
              <summary>Error details</summary>
              <pre>{(_a = this.state.error) === null || _a === void 0 ? void 0 : _a.stack}</pre>
            </details>)}
        </div>);
        }
        return this.props.children;
    };
    return ErrorBoundary;
}(react_1.default.Component));
// Hooks
var useObservability = function () {
    var context = (0, react_1.useContext)(ObservabilityContext);
    if (!context) {
        throw new Error('useObservability must be used within ObservabilityProvider');
    }
    return context;
};
exports.useObservability = useObservability;
// Hook for tracking component lifecycle
var useComponentTracking = function (componentName, config) {
    var _a = (0, exports.useObservability)(), trackComponent = _a.trackComponent, logEvent = _a.logEvent;
    var renderCount = (0, react_1.useRef)(0);
    (0, react_1.useEffect)(function () {
        renderCount.current++;
        trackComponent(componentName, config);
        return function () {
            logEvent({
                eventType: 'custom',
                componentName: componentName,
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
var useEventTracking = function () {
    var _a = (0, exports.useObservability)(), logEvent = _a.logEvent, sessionId = _a.sessionId;
    var trackClick = function (componentName, metadata) {
        logEvent({
            eventType: 'click',
            componentName: componentName,
            timestamp: Date.now(),
            sessionId: sessionId,
            metadata: metadata,
        });
    };
    var trackInput = function (componentName, value, metadata) {
        logEvent({
            eventType: 'input',
            componentName: componentName,
            timestamp: Date.now(),
            sessionId: '',
            metadata: __assign({ value: typeof value === 'string' && value.length > 100 ? value.substring(0, 100) + '...' : value }, metadata),
        });
    };
    var trackCustom = function (componentName, action, metadata) {
        logEvent({
            eventType: 'custom',
            componentName: componentName,
            timestamp: Date.now(),
            sessionId: '',
            metadata: __assign({ action: action }, metadata),
        });
    };
    return { trackClick: trackClick, trackInput: trackInput, trackCustom: trackCustom };
};
exports.useEventTracking = useEventTracking;
// HOC for component tracking
function withObservability(Component, componentName, config) {
    return function (props) {
        (0, exports.useComponentTracking)(componentName, config);
        return <Component {...props}/>;
    };
}
// Performance tracking component
var PerformanceTracker = function (_a) {
    var name = _a.name, children = _a.children;
    var measurePerformance = (0, exports.useObservability)().measurePerformance;
    var _b = (0, react_1.useState)(null), content = _b[0], setContent = _b[1];
    (0, react_1.useEffect)(function () {
        measurePerformance(name, function () { return __awaiter(void 0, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                result = children();
                setContent(result);
                return [2 /*return*/];
            });
        }); });
    }, []);
    return <>{content}</>;
};
exports.PerformanceTracker = PerformanceTracker;
// Traced fetch wrapper
var createTracedFetch = function (apiEndpoint, sessionId) {
    return function (url, options) { return __awaiter(void 0, void 0, void 0, function () {
        var traceId, startTime, tracedOptions, response, duration, error_4, duration;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    traceId = (0, uuid_1.v4)();
                    startTime = performance.now();
                    tracedOptions = __assign(__assign({}, options), { headers: __assign(__assign({}, options === null || options === void 0 ? void 0 : options.headers), { 'X-Trace-ID': traceId, 'X-Session-ID': sessionId }) });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch(url, tracedOptions)];
                case 2:
                    response = _a.sent();
                    duration = performance.now() - startTime;
                    // Log to console in development
                    if (process.env.NODE_ENV === 'development') {
                        console.debug("[Trace ".concat(traceId, "] ").concat((options === null || options === void 0 ? void 0 : options.method) || 'GET', " ").concat(url, " - ").concat(response.status, " (").concat(duration.toFixed(2), "ms)"));
                    }
                    return [2 /*return*/, response];
                case 3:
                    error_4 = _a.sent();
                    duration = performance.now() - startTime;
                    console.error("[Trace ".concat(traceId, "] ").concat((options === null || options === void 0 ? void 0 : options.method) || 'GET', " ").concat(url, " - Failed (").concat(duration.toFixed(2), "ms)"), error_4);
                    throw error_4;
                case 4: return [2 /*return*/];
            }
        });
    }); };
};
exports.createTracedFetch = createTracedFetch;
