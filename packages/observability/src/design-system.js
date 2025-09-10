"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableCard = exports.ObservableInput = exports.ObservableButton = exports.DesignSystemLogger = void 0;
exports.withDSObservability = withDSObservability;
exports.useDSObservability = useDSObservability;
exports.createDesignToken = createDesignToken;
exports.parseDesignToken = parseDesignToken;
exports.useDSPerformanceTracking = useDSPerformanceTracking;
exports.logDSError = logDSError;
exports.logDSMetric = logDSMetric;
const react_1 = require("react");
const frontend_1 = require("./frontend");
// Clase para logging del Design System
class DesignSystemLogger {
    logger = (0, frontend_1.getFrontendLogger)();
    tracer = (0, frontend_1.getFrontendTracer)();
    logComponentEvent(event) {
        if (this.logger) {
            const dsEvent = {
                ...event,
                timestamp: Date.now(),
                sessionId: this.getSessionId(),
            };
            this.logger.info(`DS Event: ${event.component}.${event.action}`, dsEvent);
        }
    }
    createComponentSpan(componentName, action, attributes) {
        if (this.tracer) {
            const span = this.tracer.createSpan(`ds.${componentName}.${action}`);
            if (attributes) {
                this.tracer.setAttributes(span, {
                    'ds.component': componentName,
                    'ds.action': action,
                    ...attributes,
                });
            }
            return span;
        }
        return null;
    }
    getSessionId() {
        // Obtener sessionId del logger si está disponible
        return 'session_' + Math.random().toString(36).substr(2, 9);
    }
}
exports.DesignSystemLogger = DesignSystemLogger;
// Instancia global del logger del DS
const dsLogger = new DesignSystemLogger();
// HOC para instrumentar componentes del DS
function withDSObservability(WrappedComponent, componentName, defaultVariant, defaultSize) {
    return (0, react_1.forwardRef)((props, ref) => {
        const { onInteraction, componentName: propComponentName, variant = defaultVariant, size = defaultSize, disabled, loading, ...restProps } = props;
        const finalComponentName = propComponentName || componentName;
        const spanRef = (0, react_1.useRef)(null);
        // Crear span al montar el componente
        (0, react_1.useEffect)(() => {
            spanRef.current = dsLogger.createComponentSpan(finalComponentName, 'mount', {
                'ds.variant': variant,
                'ds.size': size,
                'ds.disabled': disabled,
                'ds.loading': loading,
            });
            return () => {
                if (spanRef.current && dsLogger.tracer) {
                    dsLogger.tracer.endSpan(spanRef.current);
                }
            };
        }, [finalComponentName, variant, size, disabled, loading]);
        // Handler para interacciones
        const handleInteraction = (0, react_1.useCallback)((action, data) => {
            // Crear span para la interacción
            const interactionSpan = dsLogger.createComponentSpan(finalComponentName, action, {
                'ds.variant': variant,
                'ds.size': size,
                'ds.action': action,
                ...data,
            });
            // Loggear el evento
            dsLogger.logComponentEvent({
                component: finalComponentName,
                action,
                variant,
                size,
                props: {
                    disabled,
                    loading,
                    ...data,
                },
                designToken: `${finalComponentName}.${variant}.${size}`,
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
        return { ...restProps };
        ref = { ref };
        onInteraction = { handleInteraction }
            /  >
        ;
    });
}
;
// Hook para componentes del DS
function useDSObservability(componentName, variant, size) {
    const spanRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        spanRef.current = dsLogger.createComponentSpan(componentName, 'mount', {
            'ds.variant': variant,
            'ds.size': size,
        });
        return () => {
            if (spanRef.current && dsLogger.tracer) {
                dsLogger.tracer.endSpan(spanRef.current);
            }
        };
    }, [componentName, variant, size]);
    const logInteraction = (0, react_1.useCallback)((action, data) => {
        const interactionSpan = dsLogger.createComponentSpan(componentName, action, {
            'ds.variant': variant,
            'ds.size': size,
            'ds.action': action,
            ...data,
        });
        dsLogger.logComponentEvent({
            component: componentName,
            action,
            variant,
            size,
            props: data,
            designToken: `${componentName}.${variant}.${size}`,
        });
        if (interactionSpan && dsLogger.tracer) {
            dsLogger.tracer.endSpan(interactionSpan);
        }
    }, [componentName, variant, size]);
    return { logInteraction };
}
// Componente Button con observabilidad integrada
exports.ObservableButton = withDSObservability((0, react_1.forwardRef)(({ onInteraction, variant = 'primary', size = 'md', children, onClick, ...props }, ref) => {
    const handleClick = (e) => {
        // Loggear el click
        onInteraction?.('click', {
            variant,
            size,
            eventType: 'click',
        });
        // Llamar al onClick original
        onClick?.(e);
    };
    return ref = { ref };
    onClick = { handleClick };
    className = {} `ds-button ds-button--${variant} ds-button--${size}`;
}, { ...props }
    >
        { children }
    < /button>));
'Button',
    'primary',
    'md';
;
// Componente Input con observabilidad integrada
exports.ObservableInput = withDSObservability((0, react_1.forwardRef)(({ onInteraction, variant = 'default', size = 'md', onChange, onFocus, onBlur, ...props }, ref) => {
    const handleChange = (e) => {
        onInteraction?.('change', {
            variant,
            size,
            value: e.target.value,
            eventType: 'change',
        });
        onChange?.(e);
    };
    const handleFocus = (e) => {
        onInteraction?.('focus', {
            variant,
            size,
            eventType: 'focus',
        });
        onFocus?.(e);
    };
    const handleBlur = (e) => {
        onInteraction?.('blur', {
            variant,
            size,
            value: e.target.value,
            eventType: 'blur',
        });
        onBlur?.(e);
    };
    return ref = { ref };
    onChange = { handleChange };
    onFocus = { handleFocus };
    onBlur = { handleBlur };
    className = {} `ds-input ds-input--${variant} ds-input--${size}`;
}, { ...props }
    /  >
));
'Input',
    'default',
    'md';
;
// Componente Card con observabilidad integrada
exports.ObservableCard = withDSObservability((0, react_1.forwardRef)(({ onInteraction, variant = 'default', size = 'md', children, ...props }, ref) => {
    return ref = { ref };
    className = {} `ds-card ds-card--${variant} ds-card--${size}`;
}, { ...props }
    >
        { children }
    < /div>));
'Card',
    'default',
    'md';
;
// Función para crear tokens de diseño consistentes
function createDesignToken(component, variant, size) {
    const parts = [component];
    if (variant)
        parts.push(variant);
    if (size)
        parts.push(size);
    return parts.join('.');
}
// Función para extraer metadata de tokens de diseño
function parseDesignToken(token) {
    const parts = token.split('.');
    return {
        component: parts[0],
        variant: parts[1],
        size: parts[2],
    };
}
// Hook para tracking de performance de componentes del DS
function useDSPerformanceTracking(componentName) {
    const mountTimeRef = (0, react_1.useRef)(0);
    const renderCountRef = (0, react_1.useRef)(0);
    (0, react_1.useEffect)(() => {
        mountTimeRef.current = performance.now();
        renderCountRef.current = 0;
        return () => {
            const unmountTime = performance.now();
            const totalTime = unmountTime - mountTimeRef.current;
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
    (0, react_1.useEffect)(() => {
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
            context,
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
                value,
                tags,
            },
        },
    });
}
//# sourceMappingURL=design-system.js.map