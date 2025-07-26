// Template base para componentes generados con v0
'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { cn } from '../../lib/utils';

// Interfaces de tipos comunes para v0 components
interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

interface V0ComponentTemplateProps extends BaseComponentProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onAction?: () => void;
  onCancel?: () => void;
}

// Estados de loading común
interface LoadingState {
  isLoading: boolean;
  error: string | null;
  data: { success?: boolean } | null; // Cambiado para incluir la propiedad 'success'
}

// Hook personalizado para manejo de estado de loading
const useLoadingState = (
  initialData?: unknown // Cambiado de 'any' a 'unknown'
): [
  LoadingState,
  {
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setData: (data: unknown) => void; // Cambiado de 'any' a 'unknown'
    reset: () => void;
  },
] => {
  const [state, setState] = useState<LoadingState>({
    isLoading: false,
    error: null,
    data: initialData || null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState((prev) => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error, isLoading: false }));
  }, []);

  const setData = useCallback((data: unknown) => {
    setState((prev) => ({
      ...prev,
      data: data as { success?: boolean } | null, // Type assertion para cumplir con el tipo esperado
      isLoading: false,
      error: null,
    }));
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, data: initialData || null });
  }, [initialData]);

  return [state, { setLoading, setError, setData, reset }];
};

// Componentes auxiliares reutilizables
const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
        sizeClasses[size]
      )}
    />
  );
};

const ErrorMessage: React.FC<{ message: string; onRetry?: () => void }> = ({
  message,
  onRetry,
}) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="flex items-center">
      <div className="text-red-600 mr-3">⚠️</div>
      <div className="flex-1">
        <p className="text-red-800 text-sm">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  </div>
);

const EmptyState: React.FC<{
  title: string;
  description?: string;
  icon?: string;
}> = ({ title, description, icon = '📋' }) => (
  <div className="text-center py-12">
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    {description && (
      <p className="text-gray-600 text-sm max-w-sm mx-auto">{description}</p>
    )}
  </div>
);

// Componente principal del template
const V0ComponentTemplate: React.FC<V0ComponentTemplateProps> = ({
  title = 'Componente V0',
  description,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  onAction,
  onCancel,
  className,
  children,
}) => {
  const [loadingState, { setLoading, setError, setData, reset }] =
    useLoadingState();

  // Variantes de estilo
  const variantClasses = useMemo(
    () => ({
      default: 'bg-white border-gray-200 text-gray-900',
      primary: 'bg-blue-50 border-blue-200 text-blue-900',
      secondary: 'bg-gray-50 border-gray-200 text-gray-900',
      accent: 'bg-green-50 border-green-200 text-green-900',
    }),
    []
  );

  const sizeClasses = useMemo(
    () => ({
      sm: 'p-4 text-sm',
      md: 'p-6 text-base',
      lg: 'p-8 text-lg',
    }),
    []
  );

  // Manejadores de eventos
  const handleAction = useCallback(async () => {
    if (disabled || loading) return;

    try {
      setLoading(true);
      // Simular operación async
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (onAction) {
        await Promise.resolve(onAction());
      }

      setData({ success: true });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    }
  }, [disabled, loading, onAction, setLoading, setData, setError]);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
    reset();
  }, [onCancel, reset]);

  // Renderizado condicional basado en estados
  if (loadingState.error) {
    return (
      <div className={cn('border rounded-lg', className)}>
        <ErrorMessage
          message={loadingState.error}
          onRetry={() => {
            reset();
            handleAction();
          }}
        />
      </div>
    );
  }

  const renderContent = () => {
    if (loading || loadingState.isLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size={size} />
          <span className="ml-3 text-gray-600">Cargando...</span>
        </div>
      );
    }

    if (children) {
      return children;
    }

    return (
      <EmptyState
        title="Sin contenido"
        description="No hay contenido para mostrar en este momento"
        icon="📄"
      />
    );
  };

  return (
    <div
      className={cn(
        'border rounded-lg',
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {/* Header */}
      {(title || description) && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          {description && (
            <p className="text-gray-600 text-sm">{description}</p>
          )}
        </div>
      )}

      {/* Contenido principal */}
      <div className="mb-4">{renderContent()}</div>

      {/* Footer con acciones */}
      {(onAction || onCancel) && (
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          {onCancel && (
            <button
              onClick={handleCancel}
              disabled={disabled || loading || loadingState.isLoading}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          )}
          {onAction && (
            <button
              onClick={handleAction}
              disabled={disabled || loading || loadingState.isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {(loading || loadingState.isLoading) && (
                <LoadingSpinner size="sm" />
              )}
              <span className={loading || loadingState.isLoading ? 'ml-2' : ''}>
                Acción
              </span>
            </button>
          )}
        </div>
      )}

      {/* Estado de éxito */}
      {loadingState.data?.success && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-green-800 text-sm flex items-center">
            ✅ Operación completada exitosamente
          </p>
        </div>
      )}
    </div>
  );
};

// Exportaciones adicionales para casos de uso específicos
export const V0CardTemplate: React.FC<
  BaseComponentProps & {
    title: string;
    content: React.ReactNode;
    footer?: React.ReactNode;
  }
> = ({ title, content, footer, className, children }) => (
  <div
    className={cn(
      'bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden',
      className
    )}
  >
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
    </div>
    <div className="px-6 py-4">
      {content}
      {children}
    </div>
    {footer && (
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        {footer}
      </div>
    )}
  </div>
);

export const V0ModalTemplate: React.FC<
  BaseComponentProps & {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
  }
> = ({ isOpen, onClose, title, size = 'md', className, children }) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <button
          className="fixed inset-0 bg-black bg-opacity-25"
          onClick={onClose}
          aria-label="Cerrar modal" // Proporciona un nombre accesible
        />
        <div
          className={cn(
            'relative bg-white rounded-lg shadow-xl w-full',
            sizeClasses[size],
            className
          )}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

// Hooks utilitarios para v0 components
export const useV0State = <T,>(initialValue: T) => {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateValue = useCallback(async (newValue: T | ((prev: T) => T)) => {
    try {
      setIsLoading(true);
      setError(null);

      if (typeof newValue === 'function') {
        setValue((prev) => (newValue as (prev: T) => T)(prev));
      } else {
        setValue(newValue);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
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

// Tipos y utilidades para exportar
export type { V0ComponentTemplateProps, LoadingState, BaseComponentProps };
export { useLoadingState, LoadingSpinner, ErrorMessage, EmptyState };

export default V0ComponentTemplate;
