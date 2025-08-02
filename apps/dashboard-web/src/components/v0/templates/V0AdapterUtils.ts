import React from 'react';

// Interfaces para configuración de adaptación
export interface V0AdapterConfig {
  dataMapping?: Record<string, string>;
  eventHandlers?: Record<string, Function>;
  styleOverrides?: Record<string, any>;
  customProps?: Record<string, any>;
  validation?: {
    required?: string[];
    optional?: string[];
  };
}

// Tipos para componentes adaptados
export interface AdaptedComponentProps<T = any> {
  customData?: T;
  onCustomEvent?: (event: string, data: any) => void;
  className?: string;
  style?: React.CSSProperties;
}

// Función principal para crear adaptadores
export function createV0Adapter<T extends Record<string, any>>(
  OriginalComponent: React.ComponentType<T>,
  config: V0AdapterConfig = {}
) {
  return function AdaptedComponent(
    props: Partial<T> & AdaptedComponentProps
  ) {
    const { customData, onCustomEvent, ...restProps } = props;

    // Validación de props requeridas
    if (config.validation?.required) {
      for (const requiredProp of config.validation.required) {
        if (!props[requiredProp as keyof typeof props] && !customData?.[requiredProp]) {
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
        }, {} as any)
      : {};

    // Configuración de event handlers
    const eventHandlers = config.eventHandlers
      ? Object.entries(config.eventHandlers).reduce((acc, [eventName, handler]) => {
          acc[eventName] = (...args: any[]) => {
            // Ejecutar handler original
            if (typeof handler === 'function') {
              handler(...args);
            }
            
            // Notificar evento personalizado
            onCustomEvent?.(eventName, args);
          };
          return acc;
        }, {} as any)
      : {};

    // Props finales combinadas
    const finalProps = {
      ...restProps,
      ...mappedData,
      ...eventHandlers,
      ...config.customProps,
      style: { 
        ...config.styleOverrides, 
        ...props.style 
      },
      className: [
        props.className,
        config.customProps?.className
      ].filter(Boolean).join(' ') || undefined
    } as unknown as React.ComponentProps<typeof OriginalComponent>;

    return React.createElement(OriginalComponent, finalProps);
  };
}

// Utilidad para mapear datos comunes
export function mapCommonV0Data(localData: any) {
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
export function useV0Events(onCustomEvent?: (event: string, data: any) => void) {
  const handleEvent = React.useCallback((eventName: string, ...args: any[]) => {
    // Log para debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`V0 Event: ${eventName}`, args);
    }
    
    // Ejecutar callback personalizado
    onCustomEvent?.(eventName, args);
  }, [onCustomEvent]);

  return {
    onClick: (data: any) => handleEvent('click', data),
    onSubmit: (data: any) => handleEvent('submit', data),
    onChange: (data: any) => handleEvent('change', data),
    onSelect: (data: any) => handleEvent('select', data),
    onFilter: (data: any) => handleEvent('filter', data),
    onSearch: (data: any) => handleEvent('search', data),
  };
}

// Utilidad para transformar estilos
export function transformV0Styles(
  originalStyles: Record<string, any>,
  customizations: Record<string, any> = {}
) {
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
export function validateV0Props<T>(
  props: T,
  schema: {
    required?: (keyof T)[];
    optional?: (keyof T)[];
    types?: Partial<Record<keyof T, string>>;
  }
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
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
      const value = props[prop as keyof T];
      if (value !== undefined && typeof value !== expectedType) {
        errors.push(`Prop '${prop}' should be of type '${expectedType}', got '${typeof value}'`);
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Factory para crear configuraciones de adaptador comunes
export const adapterPresets = {
  // Preset para catálogos de productos
  productCatalog: (): V0AdapterConfig => ({
    dataMapping: {
      products: 'products',
      loading: 'loading',
      error: 'error',
      searchQuery: 'searchQuery',
      filters: 'filters'
    },
    eventHandlers: {
      onProductClick: (product: any) => console.log('Product clicked:', product),
      onSearchChange: (query: string) => console.log('Search query:', query),
      onFilterChange: (filters: any) => console.log('Filters changed:', filters)
    },
    validation: {
      required: ['products'],
      optional: ['loading', 'error', 'searchQuery', 'filters']
    }
  }),

  // Preset para dashboards
  dashboard: (): V0AdapterConfig => ({
    dataMapping: {
      metrics: 'metrics',
      charts: 'chartData',
      loading: 'loading',
      user: 'currentUser'
    },
    eventHandlers: {
      onMetricClick: (metric: any) => console.log('Metric clicked:', metric),
      onChartInteraction: (data: any) => console.log('Chart interaction:', data)
    },
    validation: {
      required: ['metrics'],
      optional: ['charts', 'loading', 'user']
    }
  }),

  // Preset para formularios
  form: (): V0AdapterConfig => ({
    dataMapping: {
      initialValues: 'defaultValues',
      errors: 'validationErrors',
      loading: 'isSubmitting'
    },
    eventHandlers: {
      onSubmit: (values: any) => console.log('Form submitted:', values),
      onChange: (field: string, value: any) => console.log('Field changed:', { field, value }),
      onValidation: (errors: any) => console.log('Validation errors:', errors)
    },
    validation: {
      required: [],
      optional: ['initialValues', 'errors', 'loading']
    }
  })
};

// Utilidad para debugging de componentes v0
export function debugV0Component(
  componentName: string,
  props: any,
  config: V0AdapterConfig
) {
  if (process.env.NODE_ENV === 'development') {
    console.group(`🎨 V0 Component Debug: ${componentName}`);
    console.log('Props:', props);
    console.log('Config:', config);
    console.log('Mapped Data:', config.dataMapping);
    console.log('Event Handlers:', Object.keys(config.eventHandlers || {}));
    console.groupEnd();
  }
}