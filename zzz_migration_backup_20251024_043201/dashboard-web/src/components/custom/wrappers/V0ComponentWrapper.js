'use client';
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
exports.v0WrapperPresets = void 0;
exports.V0ComponentWrapper = V0ComponentWrapper;
exports.withV0Wrapper = withV0Wrapper;
exports.useV0Wrapper = useV0Wrapper;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const utils_1 = require("@/lib/utils");
// Error Boundary personalizado para componentes v0
class V0ErrorBoundary extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        if (process.env.NODE_ENV === 'development') {
            console.error('V0 Component Error:', error, errorInfo);
        }
        this.props.onError?.(error);
    }
    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}
// Hook para datos con refresh automático
function useV0DataSource(dataSource) {
    const [error, setError] = react_1.default.useState(null);
    // Hook de datos principal
    const rawData = dataSource?.hook?.();
    // Transformación de datos
    const transformedData = react_1.default.useMemo(() => {
        if (!rawData)
            return null;
        try {
            return dataSource?.transformer ? dataSource.transformer(rawData) : rawData;
        }
        catch (err) {
            setError(err);
            return null;
        }
    }, [rawData, dataSource]);
    // Auto-refresh
    react_1.default.useEffect(() => {
        if (!dataSource?.refreshInterval || !rawData)
            return;
        const interval = setInterval(() => {
            // Trigger re-fetch si el hook lo soporta
            if (typeof rawData === 'object' && rawData !== null && 'refetch' in rawData) {
                rawData.refetch?.();
            }
        }, dataSource.refreshInterval);
        return () => clearInterval(interval);
    }, [dataSource?.refreshInterval, rawData]);
    return {
        data: transformedData,
        loading: rawData?.loading || false,
        error: error || rawData?.error || null,
    };
}
// Componente wrapper principal
function V0ComponentWrapper({ v0Component: V0Component, customizations = {}, dataSource, onError, onEvent, children, fallback = (0, jsx_runtime_1.jsx)("div", { className: "v0-loading", children: "Cargando componente..." }), ...props }) {
    // Datos del hook
    const { data, loading, error } = useV0DataSource(dataSource);
    // Analytics tracking
    const trackEvent = react_1.default.useCallback((eventName, eventData) => {
        if (customizations.analytics) {
            // Aquí podrías integrar con tu sistema de analytics
            if (process.env.NODE_ENV === 'development') {
                console.log(`📊 V0 Analytics: ${eventName}`, eventData);
            }
        }
        onEvent?.(eventName, eventData);
    }, [customizations.analytics, onEvent]);
    // Props finales para el componente v0
    const v0Props = react_1.default.useMemo(() => {
        const baseProps = {
            loading: loading || customizations.loading,
            error,
            onEvent: trackEvent,
        };
        return {
            ...props,
            ...data,
            ...baseProps,
        };
    }, [props, data, loading, customizations.loading, error, trackEvent]);
    // Clases CSS dinámicas
    const wrapperClassName = (0, utils_1.cn)('v0-component-wrapper', 
    // Temas
    customizations.theme && `v0-theme-${customizations.theme}`, 
    // Animaciones
    customizations.animation &&
        customizations.animation !== 'none' &&
        `v0-animation-${customizations.animation}`, 
    // Estados
    loading && 'v0-loading', error && 'v0-error', 
    // Personalización adicional
    customizations.className);
    // Props de accesibilidad
    const accessibilityProps = customizations.accessibility
        ? {
            'aria-label': customizations.accessibility.ariaLabel,
            role: customizations.accessibility.role,
            tabIndex: customizations.accessibility.tabIndex,
        }
        : {};
    // Error fallback personalizado
    const errorFallback = ((0, jsx_runtime_1.jsx)("div", { className: "v0-error-boundary", children: (0, jsx_runtime_1.jsxs)("div", { className: "v0-error-content", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Error al cargar el componente" }), (0, jsx_runtime_1.jsx)("p", { children: "Ha ocurrido un error inesperado. Por favor, intenta recargar la p\u00E1gina." }), process.env.NODE_ENV === 'development' && error && ((0, jsx_runtime_1.jsxs)("details", { className: "v0-error-details", children: [(0, jsx_runtime_1.jsx)("summary", { children: "Detalles del error (desarrollo)" }), (0, jsx_runtime_1.jsx)("pre", { children: error.message })] }))] }) }));
    // Componente con lazy loading
    const ComponentWithSuspense = ((0, jsx_runtime_1.jsxs)(react_1.Suspense, { fallback: fallback, children: [(0, jsx_runtime_1.jsx)(V0Component, { ...v0Props }), children] }));
    // Renderizado con o sin error boundary
    const WrappedComponent = customizations.errorBoundary ? ((0, jsx_runtime_1.jsx)(V0ErrorBoundary, { fallback: errorFallback, onError: onError, children: ComponentWithSuspense })) : (ComponentWithSuspense);
    return ((0, jsx_runtime_1.jsx)("div", { className: wrapperClassName, ...accessibilityProps, "data-v0-component": V0Component.displayName || V0Component.name || 'Unknown', children: WrappedComponent }));
}
// HOC para crear wrappers predefinidos
function withV0Wrapper(V0Component, defaultCustomizations = {}) {
    return function WrappedV0Component(props) {
        return ((0, jsx_runtime_1.jsx)(V0ComponentWrapper, { v0Component: V0Component, customizations: defaultCustomizations, ...props }));
    };
}
// Presets de customización comunes
exports.v0WrapperPresets = {
    minimal: {
        theme: 'minimal',
        animation: 'none',
        errorBoundary: true,
    },
    elevated: {
        theme: 'elevated',
        animation: 'subtle',
        errorBoundary: true,
        analytics: true,
    },
    glass: {
        theme: 'glass',
        animation: 'fade',
        errorBoundary: true,
        analytics: true,
    },
    dashboard: {
        theme: 'elevated',
        animation: 'subtle',
        errorBoundary: true,
        analytics: true,
        accessibility: {
            role: 'main',
            ariaLabel: 'Dashboard principal',
        },
    },
    modal: {
        theme: 'elevated',
        animation: 'slide',
        errorBoundary: true,
        accessibility: {
            role: 'dialog',
            ariaLabel: 'Ventana modal',
        },
    },
};
// Hook para usar el wrapper programáticamente
function useV0Wrapper(Component, customizations) {
    return react_1.default.useMemo(() => withV0Wrapper(Component, customizations), [Component, customizations]);
}
//# sourceMappingURL=V0ComponentWrapper.js.map