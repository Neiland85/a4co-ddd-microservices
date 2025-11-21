'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import * as anime from 'animejs';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Evitar animaciones si ya está animando
    if (isAnimating) return;

    setIsAnimating(true);

    // Animación de entrada suave
    anime.animate(containerRef.current, {
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 400,
      easing: 'easeOutCubic',
      complete: () => {
        setIsAnimating(false);
      },
    });
  }, [pathname, isAnimating]);

  return (
    <div ref={containerRef} className="min-h-screen" style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
