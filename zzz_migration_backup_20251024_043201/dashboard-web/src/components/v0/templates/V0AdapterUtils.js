"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adapterPresets = void 0;
exports.createV0Adapter = createV0Adapter;
exports.mapCommonV0Data = mapCommonV0Data;
exports.useV0Events = useV0Events;
exports.transformV0Styles = transformV0Styles;
exports.validateV0Props = validateV0Props;
exports.debugV0Component = debugV0Component;
const react_1 = __importDefault(require("react"));
// Función principal para crear adaptadores
function createV0Adapter(OriginalComponent, config = {}) {
    return function AdaptedComponent(props) {
        const { customData, onCustomEvent, ...restProps } = props;
        // Validación de props requeridas
        if (config.validation?.required) {
            for (const requiredProp of config.validation.required) {
                if (!props[requiredProp] && !customData?.[requiredProp]) {
                    console.warn(`V0Adapter: Required prop '${requiredProp}' is missing`);
                }
            }
        }
        // Mapeo de datos personalizados
        const mappedData = config.dataMapping && customData
            ? Object.entries(config.dataMapping).reduce((acc, [v0Key, localKey]) => {
                const value = customData[localKey];
                if (value !== undefined) {
                    acc[v0Key] = value;
                }
                return acc;
            }, {})
            : {};
        // Configuración de event handlers
        const eventHandlers = config.eventHandlers
            ? Object.entries(config.eventHandlers).reduce((acc, [eventName, handler]) => {
                acc[eventName] = (...args) => {
                    // Ejecutar handler original
                    if (typeof handler === 'function') {
                        handler(...args);
                    }
                    // Notificar evento personalizado
                    onCustomEvent?.(eventName, args);
                };
                return acc;
            }, {})
            : {};
        // Props finales combinadas
        const finalProps = {
            ...restProps,
            ...mappedData,
            ...eventHandlers,
            ...config.customProps,
            style: {
                ...config.styleOverrides,
                ...props.style,
            },
            className: [props.className, config.customProps?.className].filter(Boolean).join(' ') || undefined,
        };
        return react_1.default.createElement(OriginalComponent, finalProps);
    };
}
// Utilidad para mapear datos comunes
function mapCommonV0Data(localData) {
    return {
        // Mapeos comunes para componentes v0
        items: localData?.products || localData?.items || [],
        loading: localData?.loading || localData?.isLoading || false,
        error: localData?.error || localData?.errorMessage || null,
        title: localData?.title || localData?.heading || '',
        description: localData?.description || localData?.subtitle || '',
        // Datos de usuario
        user: localData?.user || localData?.currentUser || null,
        // Configuración de UI
        theme: localData?.theme || 'default',
        variant: localData?.variant || 'default',
        size: localData?.size || 'md',
    };
}
// Hook para manejo de eventos v0
function useV0Events(onCustomEvent) {
    const handleEvent = react_1.default.useCallback((eventName, ...args) => {
        // Log para debugging
        if (process.env.NODE_ENV === 'development') {
            console.log(`V0 Event: ${eventName}`, args);
        }
        // Ejecutar callback personalizado
        onCustomEvent?.(eventName, args);
    }, [onCustomEvent]);
    return {
        onClick: (data) => handleEvent('click', data),
        onSubmit: (data) => handleEvent('submit', data),
        onChange: (data) => handleEvent('change', data),
        onSelect: (data) => handleEvent('select', data),
        onFilter: (data) => handleEvent('filter', data),
        onSearch: (data) => handleEvent('search', data),
    };
}
// Utilidad para transformar estilos
function transformV0Styles(originalStyles, customizations = {}) {
    return {
        ...originalStyles,
        ...customizations,
        // Aplicar variables CSS personalizadas
        '--v0-primary': customizations.primaryColor || 'var(--primary)',
        '--v0-secondary': customizations.secondaryColor || 'var(--secondary)',
        '--v0-background': customizations.backgroundColor || 'var(--background)',
        '--v0-foreground': customizations.textColor || 'var(--foreground)',
        '--v0-border': customizations.borderColor || 'var(--border)',
        '--v0-radius': customizations.borderRadius || 'var(--radius)',
    };
}
// Validador de tipos para componentes v0
function validateV0Props(props, schema) {
    const errors = [];
    // Validar props requeridas
    if (schema.required) {
        for (const prop of schema.required) {
            if (props[prop] === undefined || props[prop] === null) {
                errors.push(`Required prop '${String(prop)}' is missing`);
            }
        }
    }
    // Validar tipos
    if (schema.types) {
        for (const [prop, expectedType] of Object.entries(schema.types)) {
            const value = props[prop];
            if (value !== undefined && typeof value !== expectedType) {
                errors.push(`Prop '${prop}' should be of type '${expectedType}', got '${typeof value}'`);
            }
        }
    }
    return {
        isValid: errors.length === 0,
        errors,
    };
}
// Factory para crear configuraciones de adaptador comunes
exports.adapterPresets = {
    // Preset para catálogos de productos
    productCatalog: () => ({
        dataMapping: {
            products: 'products',
            loading: 'loading',
            error: 'error',
            searchQuery: 'searchQuery',
            filters: 'filters',
        },
        eventHandlers: {
            onProductClick: (product) => console.log('Product clicked:', product),
            onSearchChange: (query) => console.log('Search query:', query),
            onFilterChange: (filters) => console.log('Filters changed:', filters),
        },
        validation: {
            required: ['products'],
            optional: ['loading', 'error', 'searchQuery', 'filters'],
        },
    }),
    // Preset para dashboards
    dashboard: () => ({
        dataMapping: {
            metrics: 'metrics',
            charts: 'chartData',
            loading: 'loading',
            user: 'currentUser',
        },
        eventHandlers: {
            onMetricClick: (metric) => console.log('Metric clicked:', metric),
            onChartInteraction: (data) => console.log('Chart interaction:', data),
        },
        validation: {
            required: ['metrics'],
            optional: ['charts', 'loading', 'user'],
        },
    }),
    // Preset para formularios
    form: () => ({
        dataMapping: {
            initialValues: 'defaultValues',
            errors: 'validationErrors',
            loading: 'isSubmitting',
        },
        eventHandlers: {
            onSubmit: (values) => console.log('Form submitted:', values),
            onChange: (field, value) => console.log('Field changed:', { field, value }),
            onValidation: (errors) => console.log('Validation errors:', errors),
        },
        validation: {
            required: [],
            optional: ['initialValues', 'errors', 'loading'],
        },
    }),
};
// Utilidad para debugging de componentes v0
function debugV0Component(componentName, props, config) {
    if (process.env.NODE_ENV === 'development') {
        console.group(`🎨 V0 Component Debug: ${componentName}`);
        console.log('Props:', props);
        console.log('Config:', config);
        console.log('Mapped Data:', config.dataMapping);
        console.log('Event Handlers:', Object.keys(config.eventHandlers || {}));
        console.groupEnd();
    }
}
//# sourceMappingURL=V0AdapterUtils.js.map