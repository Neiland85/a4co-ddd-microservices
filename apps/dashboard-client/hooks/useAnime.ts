'use client';

import { useEffect, useRef } from 'react';
import * as anime from 'animejs';

export function useAnime(options: any, deps: any[] = []) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      anime.animate(ref.current, options);
    }
  }, deps);

  return ref;
}

// Hook específico para transiciones de página
export function usePageTransition(isVisible: boolean, direction: 'left' | 'right' = 'right') {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    if (isVisible) {
      // Animación de entrada
      anime.animate(ref.current, {
        opacity: [0, 1],
        translateX: direction === 'left' ? [-50, 0] : [50, 0],
        duration: 400,
        easing: 'easeOutCubic',
      });
    } else {
      // Animación de salida
      anime.animate(ref.current, {
        opacity: [1, 0],
        translateX: direction === 'left' ? [0, -50] : [0, 50],
        duration: 300,
        easing: 'easeInCubic',
      });
    }
  }, [isVisible, direction]);

  return ref;
}
