'use client';

import React, { Suspense, ErrorBoundary } from 'react';
import { cn } from '@/lib/utils';

// Error Boundary personalizado para componentes v0
class V0ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('V0 Component Error:', error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

// Interfaces
interface V0WrapperCustomizations {
  className?: string;
  theme?: 'light' | 'dark' | 'auto' | 'minimal' | 'elevated' | 'glass';
  animation?: 'none' | 'subtle' | 'bounce' | 'fade' | 'slide';
  analytics?: boolean;
  errorBoundary?: boolean;
  loading?: boolean;
  accessibility?: {
    ariaLabel?: string;
    role?: string;
    tabIndex?: number;
  };
}

interface V0DataSource {
  hook?: () => any;
  transformer?: (data: any) => any;
  refreshInterval?: number;
}

interface V0WrapperProps {
  v0Component: React.ComponentType<any>;
  customizations?: V0WrapperCustomizations;
  dataSource?: V0DataSource;
  onError?: (error: Error) => void;
  onEvent?: (event: string, data: any) => void;
  children?: React.ReactNode;
  fallback?: React.ReactNode;
  [key: string]: any; // Props adicionales para el componente v0
}

// Hook para datos con refresh automático
function useV0DataSource(dataSource?: V0DataSource) {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  // Hook de datos principal
  const rawData = dataSource?.hook?.();

  // Transformación de datos
  const transformedData = React.useMemo(() => {
    if (!rawData) return null;
    
    try {
      return dataSource?.transformer 
        ? dataSource.transformer(rawData) 
        : rawData;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  }, [rawData, dataSource?.transformer]);

  // Auto-refresh
  React.useEffect(() => {
    if (!dataSource?.refreshInterval) return;

    const interval = setInterval(() => {
      // Trigger re-fetch si el hook lo soporta
      if (typeof rawData === 'object' && 'refetch' in rawData) {
        (rawData as any).refetch?.();
      }
    }, dataSource.refreshInterval);

    return () => clearInterval(interval);
  }, [dataSource?.refreshInterval, rawData]);

  return {
    data: transformedData,
    loading: loading || rawData?.loading || false,
    error: error || rawData?.error || null,
  };
}

// Componente wrapper principal
export function V0ComponentWrapper({ 
  v0Component: V0Component, 
  customizations = {},
  dataSource,
  onError,
  onEvent,
  children,
  fallback = <div className="v0-loading">Cargando componente...</div>,
  ...props 
}: V0WrapperProps) {
  
  // Datos del hook
  const { data, loading, error } = useV0DataSource(dataSource);

  // Analytics tracking
  const trackEvent = React.useCallback((eventName: string, eventData: any) => {
    if (customizations.analytics) {
      // Aquí podrías integrar con tu sistema de analytics
      console.log(`📊 V0 Analytics: ${eventName}`, eventData);
    }
    onEvent?.(eventName, eventData);
  }, [customizations.analytics, onEvent]);

  // Props finales para el componente v0
  const v0Props = React.useMemo(() => ({
    ...props,
    ...data,
    loading: loading || customizations.loading,
    error,
    onEvent: trackEvent,
  }), [props, data, loading, customizations.loading, error, trackEvent]);

  // Clases CSS dinámicas
  const wrapperClassName = cn(
    'v0-component-wrapper',
    // Temas
    customizations.theme && `v0-theme-${customizations.theme}`,
    // Animaciones
    customizations.animation && customizations.animation !== 'none' && `v0-animation-${customizations.animation}`,
    // Estados
    loading && 'v0-loading',
    error && 'v0-error',
    // Personalización adicional
    customizations.className
  );

  // Props de accesibilidad
  const accessibilityProps = customizations.accessibility ? {
    'aria-label': customizations.accessibility.ariaLabel,
    'role': customizations.accessibility.role,
    'tabIndex': customizations.accessibility.tabIndex,
  } : {};

  // Error fallback personalizado
  const errorFallback = (
    <div className="v0-error-boundary">
      <div className="v0-error-content">
        <h3>Error al cargar el componente</h3>
        <p>Ha ocurrido un error inesperado. Por favor, intenta recargar la página.</p>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="v0-error-details">
            <summary>Detalles del error (desarrollo)</summary>
            <pre>{error.message}</pre>
          </details>
        )}
      </div>
    </div>
  );

  // Componente con lazy loading
  const ComponentWithSuspense = (
    <Suspense fallback={fallback}>
      <V0Component {...v0Props} />
      {children}
    </Suspense>
  );

  // Renderizado con o sin error boundary
  const WrappedComponent = customizations.errorBoundary ? (
    <V0ErrorBoundary 
      fallback={errorFallback}
      onError={onError}
    >
      {ComponentWithSuspense}
    </V0ErrorBoundary>
  ) : ComponentWithSuspense;

  return (
    <div 
      className={wrapperClassName} 
      {...accessibilityProps}
      data-v0-component={V0Component.displayName || V0Component.name || 'Unknown'}
    >
      {WrappedComponent}
    </div>
  );
}

// HOC para crear wrappers predefinidos
export function withV0Wrapper(
  V0Component: React.ComponentType<any>,
  defaultCustomizations: V0WrapperCustomizations = {}
) {
  return function WrappedV0Component(props: any) {
    return (
      <V0ComponentWrapper
        v0Component={V0Component}
        customizations={defaultCustomizations}
        {...props}
      />
    );
  };
}

// Presets de customización comunes
export const v0WrapperPresets = {
  minimal: {
    theme: 'minimal' as const,
    animation: 'none' as const,
    errorBoundary: true,
  },
  
  elevated: {
    theme: 'elevated' as const,
    animation: 'subtle' as const,
    errorBoundary: true,
    analytics: true,
  },
  
  glass: {
    theme: 'glass' as const,
    animation: 'fade' as const,
    errorBoundary: true,
    analytics: true,
  },
  
  dashboard: {
    theme: 'elevated' as const,
    animation: 'subtle' as const,
    errorBoundary: true,
    analytics: true,
    accessibility: {
      role: 'main',
      ariaLabel: 'Dashboard principal',
    },
  },
  
  modal: {
    theme: 'elevated' as const,
    animation: 'slide' as const,
    errorBoundary: true,
    accessibility: {
      role: 'dialog',
      ariaLabel: 'Ventana modal',
    },
  },
};

// Hook para usar el wrapper programáticamente
export function useV0Wrapper(
  Component: React.ComponentType<any>,
  customizations?: V0WrapperCustomizations
) {
  return React.useMemo(
    () => withV0Wrapper(Component, customizations),
    [Component, customizations]
  );
}