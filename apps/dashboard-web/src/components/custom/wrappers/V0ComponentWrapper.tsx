'use client';

import React, { Suspense } from 'react';
import { cn } from '@/lib/utils';

// Error Boundary personalizado para componentes v0
class V0ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: {
    children: React.ReactNode;
    fallback: React.ReactNode;
    onError?: (error: Error) => void;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
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

// Interfaces
interface V0WrapperCustomizations {
  readonly className?: string;
  readonly theme?: 'light' | 'dark' | 'auto' | 'minimal' | 'elevated' | 'glass';
  readonly animation?: 'none' | 'subtle' | 'bounce' | 'fade' | 'slide';
  readonly analytics?: boolean;
  readonly errorBoundary?: boolean;
  readonly loading?: boolean;
  readonly accessibility?: {
    readonly ariaLabel?: string;
    readonly role?: string;
    readonly tabIndex?: number;
  };
}

interface V0DataSource {
  readonly hook?: () => unknown;
  readonly transformer?: (data: unknown) => unknown;
  readonly refreshInterval?: number;
}

interface V0DataResult {
  readonly loading?: boolean;
  readonly error?: Error | null;
  readonly refetch?: () => void;
}

interface V0WrapperProps {
  readonly v0Component: React.ComponentType<Record<string, unknown>>;
  readonly customizations?: V0WrapperCustomizations;
  readonly dataSource?: V0DataSource;
  readonly onError?: (error: Error) => void;
  readonly onEvent?: (event: string, data: unknown) => void;
  readonly children?: React.ReactNode;
  readonly fallback?: React.ReactNode;
  readonly [key: string]: unknown; // Props adicionales para el componente v0
}

// Hook para datos con refresh automático
function useV0DataSource(dataSource?: V0DataSource) {
  const [error, setError] = React.useState<Error | null>(null);

  // Hook de datos principal
  const rawData = dataSource?.hook?.();

  // Transformación de datos
  const transformedData = React.useMemo(() => {
    if (!rawData) return null;

    try {
      return dataSource?.transformer ? dataSource.transformer(rawData) : rawData;
    } catch (err) {
      setError(err as Error);
      return null;
    }
  }, [rawData, dataSource]);

  // Auto-refresh
  React.useEffect(() => {
    if (!dataSource?.refreshInterval || !rawData) return;

    const interval = setInterval(() => {
      // Trigger re-fetch si el hook lo soporta
      if (typeof rawData === 'object' && rawData !== null && 'refetch' in rawData) {
        (rawData as V0DataResult).refetch?.();
      }
    }, dataSource.refreshInterval);

    return () => clearInterval(interval);
  }, [dataSource?.refreshInterval, rawData]);

  return {
    data: transformedData,
    loading: (rawData as V0DataResult)?.loading || false,
    error: error || (rawData as V0DataResult)?.error || null,
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
}: Readonly<V0WrapperProps>) {
  // Datos del hook
  const { data, loading, error } = useV0DataSource(dataSource);

  // Analytics tracking
  const trackEvent = React.useCallback(
    (eventName: string, eventData: unknown) => {
      if (customizations.analytics) {
        // Aquí podrías integrar con tu sistema de analytics
        if (process.env.NODE_ENV === 'development') {
          console.log(`📊 V0 Analytics: ${eventName}`, eventData);
        }
      }
      onEvent?.(eventName, eventData);
    },
<<<<<<< HEAD
    [customizations.analytics, onEvent],
=======
    [customizations.analytics, onEvent]
>>>>>>> 71cbc2c58c860ff50f27fffbe7b249882f6413f6
  );

  // Props finales para el componente v0
  const v0Props = React.useMemo(() => {
    const baseProps = {
      loading: loading || customizations.loading,
      error,
      onEvent: trackEvent,
    };

    return {
      ...props,
      ...(data as Record<string, unknown>),
      ...baseProps,
    };
  }, [props, data, loading, customizations.loading, error, trackEvent]);

  // Clases CSS dinámicas
  const wrapperClassName = cn(
    'v0-component-wrapper',
    // Temas
    customizations.theme && `v0-theme-${customizations.theme}`,
    // Animaciones
    customizations.animation &&
      customizations.animation !== 'none' &&
      `v0-animation-${customizations.animation}`,
    // Estados
    loading && 'v0-loading',
    error && 'v0-error',
    // Personalización adicional
    customizations.className,
  );

  // Props de accesibilidad
  const accessibilityProps = customizations.accessibility
    ? {
        'aria-label': customizations.accessibility.ariaLabel,
        role: customizations.accessibility.role,
        tabIndex: customizations.accessibility.tabIndex,
      }
    : {};

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
    <V0ErrorBoundary fallback={errorFallback} onError={onError}>
      {ComponentWithSuspense}
    </V0ErrorBoundary>
  ) : (
    ComponentWithSuspense
  );

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
  V0Component: React.ComponentType<Record<string, unknown>>,
  defaultCustomizations: V0WrapperCustomizations = {},
) {
  return function WrappedV0Component(props: Readonly<Record<string, unknown>>) {
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
  Component: React.ComponentType<Record<string, unknown>>,
  customizations?: V0WrapperCustomizations,
) {
  return React.useMemo(() => withV0Wrapper(Component, customizations), [Component, customizations]);
}
