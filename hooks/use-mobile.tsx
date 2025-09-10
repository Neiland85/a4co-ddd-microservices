import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  // Función optimizada para detectar cambios de viewport
  const handleResize = React.useCallback(() => {
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
  }, []);

  React.useEffect(() => {
    // Detección inicial
    handleResize();

    // Media query listener optimizado
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);

    // Usar addEventListener para mejor compatibilidad
    mql.addEventListener('change', handleResize);

    // Cleanup optimizado
    return () => {
      mql.removeEventListener('change', handleResize);
    };
  }, [handleResize]);

  // Valor memoizado para evitar re-renderizados
  return React.useMemo(() => !!isMobile, [isMobile]);
}
