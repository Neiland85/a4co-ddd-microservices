// Template base para componentes generados con v0
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
exports.EmptyState = exports.ErrorMessage = exports.LoadingSpinner = exports.useLoadingState = exports.useV0State = exports.V0ModalTemplate = exports.V0CardTemplate = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const utils_1 = require("../../lib/utils");
// Hook personalizado para manejo de estado de loading
const useLoadingState = (initialData // Cambiado de 'any' a 'unknown'
) => {
    const [state, setState] = (0, react_1.useState)({
        isLoading: false,
        error: null,
        data: initialData || null,
    });
    const setLoading = (0, react_1.useCallback)((loading) => {
        setState(prev => ({ ...prev, isLoading: loading }));
    }, []);
    const setError = (0, react_1.useCallback)((error) => {
        setState(prev => ({ ...prev, error, isLoading: false }));
    }, []);
    const setData = (0, react_1.useCallback)((data) => {
        setState(prev => ({
            ...prev,
            data: data, // Type assertion para cumplir con el tipo esperado
            isLoading: false,
            error: null,
        }));
    }, []);
    const reset = (0, react_1.useCallback)(() => {
        setState({ isLoading: false, error: null, data: initialData || null });
    }, [initialData]);
    return [state, { setLoading, setError, setData, reset }];
};
exports.useLoadingState = useLoadingState;
// Componentes auxiliares reutilizables
const LoadingSpinner = ({ size = 'md' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8',
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)('animate-spin rounded-full border-2 border-gray-300 border-t-blue-600', sizeClasses[size]) }));
};
exports.LoadingSpinner = LoadingSpinner;
const ErrorMessage = ({ message, onRetry, }) => ((0, jsx_runtime_1.jsx)("div", { className: "rounded-lg border border-red-200 bg-red-50 p-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "mr-3 text-red-600", children: "\u26A0\uFE0F" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-red-800", children: message }), onRetry && ((0, jsx_runtime_1.jsx)("button", { onClick: onRetry, className: "mt-2 rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700", children: "Reintentar" }))] })] }) }));
exports.ErrorMessage = ErrorMessage;
const EmptyState = ({ title, description, icon = '📋' }) => ((0, jsx_runtime_1.jsxs)("div", { className: "py-12 text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-4 text-4xl", children: icon }), (0, jsx_runtime_1.jsx)("h3", { className: "mb-2 text-lg font-medium text-gray-900", children: title }), description && (0, jsx_runtime_1.jsx)("p", { className: "mx-auto max-w-sm text-sm text-gray-600", children: description })] }));
exports.EmptyState = EmptyState;
// Componente principal del template
const V0ComponentTemplate = ({ title = 'Componente V0', description, variant = 'default', size = 'md', disabled = false, loading = false, onAction, onCancel, className, children, }) => {
    const [loadingState, { setLoading, setError, setData, reset }] = useLoadingState();
    // Variantes de estilo
    const variantClasses = (0, react_1.useMemo)(() => ({
        default: 'bg-white border-gray-200 text-gray-900',
        primary: 'bg-blue-50 border-blue-200 text-blue-900',
        secondary: 'bg-gray-50 border-gray-200 text-gray-900',
        accent: 'bg-green-50 border-green-200 text-green-900',
    }), []);
    const sizeClasses = (0, react_1.useMemo)(() => ({
        sm: 'p-4 text-sm',
        md: 'p-6 text-base',
        lg: 'p-8 text-lg',
    }), []);
    // Manejadores de eventos
    const handleAction = (0, react_1.useCallback)(async () => {
        if (disabled || loading)
            return;
        try {
            setLoading(true);
            // Simular operación async
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (onAction) {
                await Promise.resolve(onAction());
            }
            setData({ success: true });
        }
        catch (error) {
            setError(error instanceof Error ? error.message : 'Error desconocido');
        }
    }, [disabled, loading, onAction, setLoading, setData, setError]);
    const handleCancel = (0, react_1.useCallback)(() => {
        if (onCancel) {
            onCancel();
        }
        reset();
    }, [onCancel, reset]);
    // Renderizado condicional basado en estados
    if (loadingState.error) {
        return ((0, jsx_runtime_1.jsx)("div", { className: (0, utils_1.cn)('rounded-lg border', className), children: (0, jsx_runtime_1.jsx)(ErrorMessage, { message: loadingState.error, onRetry: () => {
                    reset();
                    handleAction();
                } }) }));
    }
    const renderContent = () => {
        if (loading || loadingState.isLoading) {
            return ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-center py-8", children: [(0, jsx_runtime_1.jsx)(LoadingSpinner, { size: size }), (0, jsx_runtime_1.jsx)("span", { className: "ml-3 text-gray-600", children: "Cargando..." })] }));
        }
        if (children) {
            return children;
        }
        return ((0, jsx_runtime_1.jsx)(EmptyState, { title: "Sin contenido", description: "No hay contenido para mostrar en este momento", icon: "\uD83D\uDCC4" }));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)('rounded-lg border', variantClasses[variant], sizeClasses[size], disabled && 'cursor-not-allowed opacity-50', className), children: [(title || description) && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "mb-2 text-xl font-semibold", children: title }), description && (0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: description })] })), (0, jsx_runtime_1.jsx)("div", { className: "mb-4", children: renderContent() }), (onAction || onCancel) && ((0, jsx_runtime_1.jsxs)("div", { className: "flex gap-3 border-t border-gray-200 pt-4", children: [onCancel && ((0, jsx_runtime_1.jsx)("button", { onClick: handleCancel, disabled: disabled || loading || loadingState.isLoading, className: "rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50", children: "Cancelar" })), onAction && ((0, jsx_runtime_1.jsxs)("button", { onClick: handleAction, disabled: disabled || loading || loadingState.isLoading, className: "flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50", children: [(loading || loadingState.isLoading) && (0, jsx_runtime_1.jsx)(LoadingSpinner, { size: "sm" }), (0, jsx_runtime_1.jsx)("span", { className: loading || loadingState.isLoading ? 'ml-2' : '', children: "Acci\u00F3n" })] }))] })), loadingState.data?.success && ((0, jsx_runtime_1.jsx)("div", { className: "mt-4 rounded-lg border border-green-200 bg-green-50 p-3", children: (0, jsx_runtime_1.jsx)("p", { className: "flex items-center text-sm text-green-800", children: "\u2705 Operaci\u00F3n completada exitosamente" }) }))] }));
};
// Exportaciones adicionales para casos de uso específicos
const V0CardTemplate = ({ title, content, footer, className, children }) => ((0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)('overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm', className), children: [(0, jsx_runtime_1.jsx)("div", { className: "border-b border-gray-200 px-6 py-4", children: (0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: title }) }), (0, jsx_runtime_1.jsxs)("div", { className: "px-6 py-4", children: [content, children] }), footer && (0, jsx_runtime_1.jsx)("div", { className: "border-t border-gray-200 bg-gray-50 px-6 py-4", children: footer })] }));
exports.V0CardTemplate = V0CardTemplate;
const V0ModalTemplate = ({ isOpen, onClose, title, size = 'md', className, children }) => {
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };
    if (!isOpen)
        return null;
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 z-50 overflow-y-auto", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex min-h-full items-center justify-center p-4", children: [(0, jsx_runtime_1.jsx)("button", { className: "fixed inset-0 bg-black bg-opacity-25", onClick: onClose, "aria-label": "Cerrar modal" // Proporciona un nombre accesible
                 }), (0, jsx_runtime_1.jsxs)("div", { className: (0, utils_1.cn)('relative w-full rounded-lg bg-white shadow-xl', sizeClasses[size], className), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between border-b border-gray-200 p-6", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-lg font-medium text-gray-900", children: title }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600", children: "\u2715" })] }), (0, jsx_runtime_1.jsx)("div", { className: "p-6", children: children })] })] }) }));
};
exports.V0ModalTemplate = V0ModalTemplate;
// Hooks utilitarios para v0 components
const useV0State = (initialValue) => {
    const [value, setValue] = (0, react_1.useState)(initialValue);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const updateValue = (0, react_1.useCallback)(async (newValue) => {
        try {
            setIsLoading(true);
            setError(null);
            if (typeof newValue === 'function') {
                setValue(prev => newValue(prev));
            }
            else {
                setValue(newValue);
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        }
        finally {
            setIsLoading(false);
        }
    }, []);
    return {
        value,
        isLoading,
        error,
        updateValue,
        setValue,
        setError,
    };
};
exports.useV0State = useV0State;
exports.default = V0ComponentTemplate;
//# sourceMappingURL=V0ComponentTemplate.js.map