// apps/dashboard-web/src/components/v0/templates/V0AdapterUtils.ts
// Utilidades para adaptar componentes v0.dev al ecosistema del proyecto

export interface V0AdapterConfig {
  dataMapping?: Record<string, string>;
  eventHandlers?: Record<string, Function>;
  styleOverrides?: Record<string, any>;
  customProps?: Record<string, any>;
}

export function createV0Adapter<T extends Record<string, any>>(
  OriginalComponent: React.ComponentType<T>,
  config: V0AdapterConfig = {}
) {
  return function AdaptedComponent(props: Partial<T> & {
    customData?: any;
    onCustomEvent?: (event: string, data: any) => void;
  }) {
    // Mapeo de datos
    const mappedData = config.dataMapping
      ? Object.entries(config.dataMapping).reduce((acc, [v0Key, localKey]) => {
          acc[v0Key] = props.customData?.[localKey];
          return acc;
        }, {} as any)
      : {};

    // Handlers de eventos
    const eventHandlers = config.eventHandlers
      ? Object.entries(config.eventHandlers).reduce((acc, [eventName, handler]) => {
          acc[eventName] = (...args: any[]) => {
            handler(...args);
            props.onCustomEvent?.(eventName, args);
          };
          return acc;
        }, {} as any)
      : {};

    // Props finales
    const finalProps = {
      ...props,
      ...mappedData,
      ...eventHandlers,
      style: { ...config.styleOverrides, ...props.style },
      ...config.customProps
    };

    return <OriginalComponent {...finalProps} />;
  };
}

// Función helper para adaptar props de v0 a formato local
export function adaptV0Props<T extends Record<string, any>>(
  v0Props: T,
  localData: Record<string, any> = {},
  mappings: Record<string, string> = {}
): T {
  const adaptedProps = { ...v0Props };

  // Aplicar mapeos personalizados
  Object.entries(mappings).forEach(([v0Key, localKey]) => {
    if (localData[localKey] !== undefined) {
      (adaptedProps as any)[v0Key] = localData[localKey];
    }
  });

  return adaptedProps;
}

// Hook personalizado para integración con v0 components
export function useV0Integration<T extends Record<string, any>>(
  v0Component: React.ComponentType<T>,
  config: V0AdapterConfig = {}
) {
  const AdaptedComponent = createV0Adapter(v0Component, config);

  return {
    AdaptedComponent,
    adaptProps: (props: Partial<T>, localData?: any) =>
      adaptV0Props(props, localData, config.dataMapping)
  };
}