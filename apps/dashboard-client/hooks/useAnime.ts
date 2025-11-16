/**
 * useAnime Hook - Anime.js integration for React
 * Properly integrates anime.js with React using useRef and useEffect
 */

import { useEffect, useRef, type RefObject } from 'react';
import anime, { type AnimeParams } from 'animejs';

export interface UseAnimeOptions {
  autoPlay?: boolean;
  config: AnimeParams;
  dependencies?: unknown[];
}

export interface UseAnimeReturn<T extends HTMLElement = HTMLDivElement> {
  ref: RefObject<T>;
  play: () => void;
  pause: () => void;
  restart: () => void;
  reverse: () => void;
  seek: (time: number) => void;
}

/**
 * Hook to integrate Anime.js animations with React components
 * 
 * @example
 * ```tsx
 * const { ref } = useAnime({
 *   config: {
 *     translateY: [50, 0],
 *     opacity: [0, 1],
 *     duration: 800,
 *     easing: 'easeOutQuad'
 *   }
 * });
 * 
 * return <div ref={ref}>Animated content</div>;
 * ```
 */
export function useAnime<T extends HTMLElement = HTMLDivElement>(
  options: UseAnimeOptions
): UseAnimeReturn<T> {
  const ref = useRef<T>(null);
  const animationRef = useRef<anime.AnimeInstance | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Create animation instance
    const animation = anime({
      targets: ref.current,
      ...options.config,
      autoplay: options.autoPlay ?? true,
    });

    animationRef.current = animation;

    // Cleanup
    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, options.dependencies || []);

  const play = () => {
    animationRef.current?.play();
  };

  const pause = () => {
    animationRef.current?.pause();
  };

  const restart = () => {
    animationRef.current?.restart();
  };

  const reverse = () => {
    animationRef.current?.reverse();
  };

  const seek = (time: number) => {
    animationRef.current?.seek(time);
  };

  return { ref, play, pause, restart, reverse, seek };
}

/**
 * Hook for staggered animations on multiple elements
 */
export function useStaggeredAnime(
  selector: string,
  config: AnimeParams,
  autoPlay = true
) {
  const animationRef = useRef<anime.AnimeInstance | null>(null);

  useEffect(() => {
    const animation = anime({
      targets: selector,
      ...config,
      autoplay: autoPlay,
    });

    animationRef.current = animation;

    return () => {
      animation.pause();
    };
  }, [selector, autoPlay]);

  return animationRef;
}

/**
 * Hook for timeline animations
 */
export function useAnimeTimeline(autoPlay = false) {
  const timelineRef = useRef<anime.AnimeTimelineInstance | null>(null);

  useEffect(() => {
    timelineRef.current = anime.timeline({
      autoplay: autoPlay,
    });

    return () => {
      timelineRef.current?.pause();
    };
  }, [autoPlay]);

  return timelineRef.current;
}
