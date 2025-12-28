import { useCallback, useRef, useEffect } from 'react';
import { animate } from 'animejs';

// Función helper para remover animaciones
const removeAnimation = (targets: string | HTMLElement) => {
  const element = typeof targets === 'string' ? document.querySelector(targets) : targets;
  if (element) {
    // Cancelar todas las animaciones del elemento
    const animations = (element as any).__animeAnimations || [];
    animations.forEach((anim: any) => {
      if (anim && typeof anim.cancel === 'function') {
        anim.cancel();
      }
    });
    (element as any).__animeAnimations = [];
  }
};

interface MicroAnimationConfig {
  duration?: number;
  easing?: string;
  amplitude?: number;
  frequency?: number;
  delay?: number;
}

interface IdempotentAnimationState {
  isAnimating: boolean;
  lastAnimationId: string | null;
  animationQueue: string[];
}

/**
 * Hook personalizado para animaciones de micro-interacciones con idempotencia
 * Crea movimientos irregulares pero controlados usando leyes matemáticas
 */
export const useMicroAnimations = () => {
  const animationStatesRef = useRef<Map<string, IdempotentAnimationState>>(new Map());
  const cleanupTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  /**
   * Genera un movimiento irregular controlado usando funciones trigonométricas
   * con principios de idempotencia
   */
  const generateControlledRandom = useCallback((seed: number, amplitude: number = 1) => {
    // Usamos funciones trigonométricas para crear movimientos "naturales"
    const time = Date.now() * 0.001; // tiempo en segundos
    const primaryWave = Math.sin(time * 2 + seed) * amplitude;
    const secondaryWave = Math.cos(time * 3.7 + seed * 1.3) * (amplitude * 0.3);
    const tertiaryWave = Math.sin(time * 5.1 + seed * 2.1) * (amplitude * 0.1);

    return primaryWave + secondaryWave + tertiaryWave;
  }, []);

  /**
   * Asegura idempotencia cancelando animaciones previas del mismo elemento
   */
  const ensureIdempotence = useCallback((elementId: string) => {
    const currentState = animationStatesRef.current.get(elementId);

    if (currentState?.isAnimating) {
      // Cancelar animación previa
      removeAnimation(`#${elementId}`);
      currentState.isAnimating = false;
    }

    // Limpiar timeout anterior si existe
    const existingTimeout = cleanupTimeoutsRef.current.get(elementId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    return currentState || { isAnimating: false, lastAnimationId: null, animationQueue: [] };
  }, []);

  /**
   * Animación de "hover" con movimientos irregulares
   */
  const animateHover = useCallback(
    (elementId: string, config: MicroAnimationConfig = {}) => {
      const {
        duration = 800,
        easing = 'easeOutElastic(1, .6)',
        amplitude = 3,
        frequency = 0.02,
      } = config;

      ensureIdempotence(elementId);

      const animationId = `hover-${elementId}-${Date.now()}`;

      animationStatesRef.current.set(elementId, {
        isAnimating: true,
        lastAnimationId: animationId,
        animationQueue: [],
      });

      // Usar animaciones secuenciales en lugar de timeline compleja
      const anim1 = animate(`#${elementId}`, {
        translateY: generateControlledRandom(Math.random(), -amplitude),
        translateX: generateControlledRandom(Math.random() * 2, amplitude * 0.5),
        scale: 1.05,
        rotate: generateControlledRandom(Math.random() * 3, 2),
        easing,
        duration: duration * 0.6,
      });

      setTimeout(() => {
        const anim2 = animate(`#${elementId}`, {
          translateY: generateControlledRandom(Math.random() * 1.5, amplitude * 0.3),
          translateX: generateControlledRandom(Math.random() * 2.5, -amplitude * 0.2),
          scale: 1.02,
          rotate: generateControlledRandom(Math.random() * 2, -1),
          easing,
          duration: duration * 0.3,
        });

        setTimeout(() => {
          animate(`#${elementId}`, {
            translateY: 0,
            translateX: 0,
            scale: 1,
            rotate: 0,
            easing,
            duration: duration * 0.1,
            complete: () => {
              const state = animationStatesRef.current.get(elementId);
              if (state) {
                state.isAnimating = false;
              }
            },
          });
        }, duration * 0.3);
      }, duration * 0.6);
      return animationId;
    },
    [ensureIdempotence, generateControlledRandom],
  );

  /**
   * Animación de "click" con feedback táctil
   */
  const animateClick = useCallback(
    (elementId: string, config: MicroAnimationConfig = {}) => {
      const { duration = 300, easing = 'easeOutBack', amplitude = 2 } = config;

      ensureIdempotence(elementId);

      const animationId = `click-${elementId}-${Date.now()}`;

      animationStatesRef.current.set(elementId, {
        isAnimating: true,
        lastAnimationId: animationId,
        animationQueue: [],
      });

      animate(`#${elementId}`, {
        scale: [
          { value: 0.95, duration: duration * 0.3 },
          { value: 1.08, duration: duration * 0.4 },
          { value: 1, duration: duration * 0.3 },
        ],
        translateY: [
          { value: amplitude, duration: duration * 0.2 },
          { value: -amplitude * 0.5, duration: duration * 0.3 },
          { value: 0, duration: duration * 0.5 },
        ],
        rotate: generateControlledRandom(Math.random() * 4, 1),
        easing,
        complete: () => {
          const state = animationStatesRef.current.get(elementId);
          if (state) {
            state.isAnimating = false;
          }
        },
      });

      return animationId;
    },
    [ensureIdempotence, generateControlledRandom],
  );

  /**
   * Animación de "focus" con pulso sutil
   */
  const animateFocus = useCallback(
    (elementId: string, config: MicroAnimationConfig = {}) => {
      const { duration = 1000, amplitude = 1.5 } = config;

      ensureIdempotence(elementId);

      const animationId = `focus-${elementId}-${Date.now()}`;

      animationStatesRef.current.set(elementId, {
        isAnimating: true,
        lastAnimationId: animationId,
        animationQueue: [],
      });

      animate(`#${elementId}`, {
        scale: [1, amplitude, 1],
        boxShadow: [
          { value: '0 0 0 0 rgba(59, 130, 246, 0)', duration: duration * 0.2 },
          { value: '0 0 0 4px rgba(59, 130, 246, 0.3)', duration: duration * 0.6 },
          { value: '0 0 0 0 rgba(59, 130, 246, 0)', duration: duration * 0.2 },
        ],
        easing: 'easeInOutSine',
        complete: () => {
          const state = animationStatesRef.current.get(elementId);
          if (state) {
            state.isAnimating = false;
          }
        },
      });

      return animationId;
    },
    [ensureIdempotence],
  );

  /**
   * Animación de "loading" con movimientos irregulares
   */
  const animateLoading = useCallback(
    (elementId: string, config: MicroAnimationConfig = {}) => {
      const { duration = 2000, amplitude = 4 } = config;

      ensureIdempotence(elementId);

      const animationId = `loading-${elementId}-${Date.now()}`;

      animationStatesRef.current.set(elementId, {
        isAnimating: true,
        lastAnimationId: animationId,
        animationQueue: [],
      });

      animate(`#${elementId}`, {
        translateX: [
          { value: -amplitude, duration: duration * 0.25 },
          { value: amplitude, duration: duration * 0.5 },
          { value: 0, duration: duration * 0.25 },
        ],
        translateY: generateControlledRandom(Math.random() * 5, amplitude * 0.5),
        scale: [1, 1.1, 1],
        easing: 'easeInOutQuad',
        loop: true,
        complete: () => {
          const state = animationStatesRef.current.get(elementId);
          if (state) {
            state.isAnimating = false;
          }
        },
      });

      return animationId;
    },
    [ensureIdempotence, generateControlledRandom],
  );

  const stopAnimation = useCallback((elementId: string) => {
    removeAnimation(`#${elementId}`);

    const state = animationStatesRef.current.get(elementId);
    if (state) {
      state.isAnimating = false;
      state.lastAnimationId = null;
    }

    // Limpiar timeout
    const timeout = cleanupTimeoutsRef.current.get(elementId);
    if (timeout) {
      clearTimeout(timeout);
      cleanupTimeoutsRef.current.delete(elementId);
    }
  }, []);

  /**
   * Cleanup al desmontar el componente
   */
  useEffect(() => {
    return () => {
      // Limpiar todas las animaciones y timeouts
      animationStatesRef.current.forEach((_, elementId) => {
        stopAnimation(elementId);
      });
      animationStatesRef.current.clear();

      cleanupTimeoutsRef.current.forEach((timeout) => {
        clearTimeout(timeout);
      });
      cleanupTimeoutsRef.current.clear();
    };
  }, [stopAnimation]);

  return {
    animateHover,
    animateClick,
    animateFocus,
    animateLoading,
    stopAnimation,
    generateControlledRandom,
  };
};
