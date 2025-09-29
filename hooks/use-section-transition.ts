'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

export function useSectionTransition(activeSection: string) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousSection, setPreviousSection] = useState(activeSection);
  const [transitionProgress, setTransitionProgress] = useState(0);

  // Función optimizada para manejar transiciones
  const handleTransition = useCallback(
    (newSection: string) => {
      if (newSection !== previousSection) {
        setIsTransitioning(true);
        setPreviousSection(newSection);
        setTransitionProgress(0);

        // Animación de progreso suave
        const startTime = Date.now();
        const duration = 800;

        const animateProgress = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);

          setTransitionProgress(progress);

          if (progress < 1) {
            requestAnimationFrame(animateProgress);
          } else {
            setIsTransitioning(false);
            setTransitionProgress(0);
          }
        };

        requestAnimationFrame(animateProgress);
      }
    },
    [previousSection],
  );

  // Efecto optimizado para detectar cambios de sección
  useEffect(() => {
    handleTransition(activeSection);
  }, [activeSection, handleTransition]);

  // Valores memoizados para evitar re-renderizados
  const transitionState = useMemo(
    () => ({
      isTransitioning,
      previousSection,
      transitionProgress,
      // Función helper para determinar si estamos en medio de una transición
      isInTransition: isTransitioning && transitionProgress > 0 && transitionProgress < 1,
      // Función helper para obtener el progreso normalizado (0-1)
      normalizedProgress: Math.min(transitionProgress, 1),
    }),
    [isTransitioning, previousSection, transitionProgress],
  );

  return transitionState;
}
