"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableCard = exports.ObservableInput = exports.ObservableButton = exports.DesignSystemLogger = void 0;
exports.withDSObservability = withDSObservability;
exports.useDSObservability = useDSObservability;
exports.createDesignToken = createDesignToken;
exports.parseDesignToken = parseDesignToken;
exports.useDSPerformanceTracking = useDSPerformanceTracking;
exports.logDSError = logDSError;
exports.logDSMetric = logDSMetric;
var react_1 = require("react");
var frontend_1 = require("./frontend");
// Clase para logging del Design System
var DesignSystemLogger = /** @class */ (function () {
    function DesignSystemLogger() {
        this.logger = (0, frontend_1.getFrontendLogger)();
        this.tracer = (0, frontend_1.getFrontendTracer)();
    }
    DesignSystemLogger.prototype.logComponentEvent = function (event) {
        if (this.logger) {
            var dsEvent = __assign(__assign({}, event), { timestamp: Date.now(), sessionId: this.getSessionId() });
            this.logger.info("DS Event: ".concat(event.component, ".").concat(event.action), dsEvent);
        }
    };
    DesignSystemLogger.prototype.createComponentSpan = function (componentName, action, attributes) {
        if (this.tracer) {
            var span = this.tracer.createSpan("ds.".concat(componentName, ".").concat(action));
            if (attributes) {
                this.tracer.setAttributes(span, __assign({ 'ds.component': componentName, 'ds.action': action }, attributes));
            }
            return span;
        }
        return null;
    };
    DesignSystemLogger.prototype.getSessionId = function () {
        // Obtener sessionId del logger si está disponible
        return 'session_' + Math.random().toString(36).substr(2, 9);
    };
    return DesignSystemLogger;
}());
exports.DesignSystemLogger = DesignSystemLogger;
// Instancia global del logger del DS
var dsLogger = new DesignSystemLogger();
// HOC para instrumentar componentes del DS
function withDSObservability(WrappedComponent, componentName, defaultVariant, defaultSize) {
    return (0, react_1.forwardRef)(function (props, ref) {
        var onInteraction = props.onInteraction, propComponentName = props.componentName, _a = props.variant, variant = _a === void 0 ? defaultVariant : _a, _b = props.size, size = _b === void 0 ? defaultSize : _b, disabled = props.disabled, loading = props.loading, restProps = __rest(props, ["onInteraction", "componentName", "variant", "size", "disabled", "loading"]);
        var finalComponentName = propComponentName || componentName;
        var spanRef = (0, react_1.useRef)(null);
        // Crear span al montar el componente
        (0, react_1.useEffect)(function () {
            spanRef.current = dsLogger.createComponentSpan(finalComponentName, 'mount', {
                'ds.variant': variant,
                'ds.size': size,
                'ds.disabled': disabled,
                'ds.loading': loading,
            });
            return function () {
                if (spanRef.current && dsLogger.tracer) {
                    dsLogger.tracer.endSpan(spanRef.current);
                }
            };
        }, [finalComponentName, variant, size, disabled, loading]);
        // Handler para interacciones
        var handleInteraction = (0, react_1.useCallback)(function (action, data) {
            // Crear span para la interacción
            var interactionSpan = dsLogger.createComponentSpan(finalComponentName, action, __assign({ 'ds.variant': variant, 'ds.size': size, 'ds.action': action }, data));
            // Loggear el evento
            dsLogger.logComponentEvent({
                component: finalComponentName,
                action: action,
                variant: variant,
                size: size,
                props: __assign({ disabled: disabled, loading: loading }, data),
                designToken: "".concat(finalComponentName, ".").concat(variant, ".").concat(size),
            });
            // Llamar al callback original si existe
            if (onInteraction) {
                onInteraction(action, data);
            }
            // Finalizar el span
            if (interactionSpan && dsLogger.tracer) {
                dsLogger.tracer.endSpan(interactionSpan);
            }
        }, [finalComponentName, variant, size, disabled, loading, onInteraction]);
        return __assign({}, restProps);
        ref = { ref: ref };
        onInteraction = { handleInteraction: handleInteraction }
            /  >
        ;
    });
}
;
// Hook para componentes del DS
function useDSObservability(componentName, variant, size) {
    var spanRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        spanRef.current = dsLogger.createComponentSpan(componentName, 'mount', {
            'ds.variant': variant,
            'ds.size': size,
        });
        return function () {
            if (spanRef.current && dsLogger.tracer) {
                dsLogger.tracer.endSpan(spanRef.current);
            }
        };
    }, [componentName, variant, size]);
    var logInteraction = (0, react_1.useCallback)(function (action, data) {
        var interactionSpan = dsLogger.createComponentSpan(componentName, action, __assign({ 'ds.variant': variant, 'ds.size': size, 'ds.action': action }, data));
        dsLogger.logComponentEvent({
            component: componentName,
            action: action,
            variant: variant,
            size: size,
            props: data,
            designToken: "".concat(componentName, ".").concat(variant, ".").concat(size),
        });
        if (interactionSpan && dsLogger.tracer) {
            dsLogger.tracer.endSpan(interactionSpan);
        }
    }, [componentName, variant, size]);
    return { logInteraction: logInteraction };
}
// Componente Button con observabilidad integrada
exports.ObservableButton = withDSObservability((0, react_1.forwardRef)(function (_a, ref) {
    var onInteraction = _a.onInteraction, _b = _a.variant, variant = _b === void 0 ? 'primary' : _b, _c = _a.size, size = _c === void 0 ? 'md' : _c, children = _a.children, onClick = _a.onClick, props = __rest(_a, ["onInteraction", "variant", "size", "children", "onClick"]);
    var handleClick = function (e) {
        // Loggear el click
        onInteraction === null || onInteraction === void 0 ? void 0 : onInteraction('click', {
            variant: variant,
            size: size,
            eventType: 'click',
        });
        // Llamar al onClick original
        onClick === null || onClick === void 0 ? void 0 : onClick(e);
    };
    return ref = { ref: ref };
    onClick = { handleClick: handleClick };
    className = {}(templateObject_1 || (templateObject_1 = __makeTemplateObject(["ds-button ds-button--", " ds-button--", ""], ["ds-button ds-button--", " ds-button--", ""])), variant, size);
}, __assign({}, props) >
    { children: children }
    < /button>));
'Button',
    'primary',
    'md';
;
// Componente Input con observabilidad integrada
exports.ObservableInput = withDSObservability((0, react_1.forwardRef)(function (_a, ref) {
    var onInteraction = _a.onInteraction, _b = _a.variant, variant = _b === void 0 ? 'default' : _b, _c = _a.size, size = _c === void 0 ? 'md' : _c, onChange = _a.onChange, onFocus = _a.onFocus, onBlur = _a.onBlur, props = __rest(_a, ["onInteraction", "variant", "size", "onChange", "onFocus", "onBlur"]);
    var handleChange = function (e) {
        onInteraction === null || onInteraction === void 0 ? void 0 : onInteraction('change', {
            variant: variant,
            size: size,
            value: e.target.value,
            eventType: 'change',
        });
        onChange === null || onChange === void 0 ? void 0 : onChange(e);
    };
    var handleFocus = function (e) {
        onInteraction === null || onInteraction === void 0 ? void 0 : onInteraction('focus', {
            variant: variant,
            size: size,
            eventType: 'focus',
        });
        onFocus === null || onFocus === void 0 ? void 0 : onFocus(e);
    };
    var handleBlur = function (e) {
        onInteraction === null || onInteraction === void 0 ? void 0 : onInteraction('blur', {
            variant: variant,
            size: size,
            value: e.target.value,
            eventType: 'blur',
        });
        onBlur === null || onBlur === void 0 ? void 0 : onBlur(e);
    };
    return ref = { ref: ref };
    onChange = { handleChange: handleChange };
    onFocus = { handleFocus: handleFocus };
    onBlur = { handleBlur: handleBlur };
    className = {}(templateObject_2 || (templateObject_2 = __makeTemplateObject(["ds-input ds-input--", " ds-input--", ""], ["ds-input ds-input--", " ds-input--", ""])), variant, size);
}, __assign({}, props) /  >
));
'Input',
    'default',
    'md';
;
// Componente Card con observabilidad integrada
exports.ObservableCard = withDSObservability((0, react_1.forwardRef)(function (_a, ref) {
    var onInteraction = _a.onInteraction, _b = _a.variant, variant = _b === void 0 ? 'default' : _b, _c = _a.size, size = _c === void 0 ? 'md' : _c, children = _a.children, props = __rest(_a, ["onInteraction", "variant", "size", "children"]);
    return ref = { ref: ref };
    className = {}(templateObject_3 || (templateObject_3 = __makeTemplateObject(["ds-card ds-card--", " ds-card--", ""], ["ds-card ds-card--", " ds-card--", ""])), variant, size);
}, __assign({}, props) >
    { children: children }
    < /div>));
'Card',
    'default',
    'md';
;
// Función para crear tokens de diseño consistentes
function createDesignToken(component, variant, size) {
    var parts = [component];
    if (variant)
        parts.push(variant);
    if (size)
        parts.push(size);
    return parts.join('.');
}
// Función para extraer metadata de tokens de diseño
function parseDesignToken(token) {
    var parts = token.split('.');
    return {
        component: parts[0],
        variant: parts[1],
        size: parts[2],
    };
}
// Hook para tracking de performance de componentes del DS
function useDSPerformanceTracking(componentName) {
    var mountTimeRef = (0, react_1.useRef)(0);
    var renderCountRef = (0, react_1.useRef)(0);
    (0, react_1.useEffect)(function () {
        mountTimeRef.current = performance.now();
        renderCountRef.current = 0;
        return function () {
            var unmountTime = performance.now();
            var totalTime = unmountTime - mountTimeRef.current;
            dsLogger.logComponentEvent({
                component: componentName,
                action: 'unmount',
                props: {
                    totalRenderTime: totalTime,
                    renderCount: renderCountRef.current,
                },
            });
        };
    }, [componentName]);
    (0, react_1.useEffect)(function () {
        renderCountRef.current += 1;
        dsLogger.logComponentEvent({
            component: componentName,
            action: 'render',
            props: {
                renderCount: renderCountRef.current,
            },
        });
    });
    return {
        renderCount: renderCountRef.current,
        mountTime: mountTimeRef.current,
    };
}
// Función para registrar errores de componentes del DS
function logDSError(componentName, error, context) {
    dsLogger.logComponentEvent({
        component: componentName,
        action: 'error',
        props: {
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
            },
            context: context,
        },
    });
}
// Función para registrar métricas de uso del DS
function logDSMetric(componentName, metricName, value, tags) {
    dsLogger.logComponentEvent({
        component: componentName,
        action: 'metric',
        props: {
            metric: {
                name: metricName,
                value: value,
                tags: tags,
            },
        },
    });
}
var templateObject_1, templateObject_2, templateObject_3;
