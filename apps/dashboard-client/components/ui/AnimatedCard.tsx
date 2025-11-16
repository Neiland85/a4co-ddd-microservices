/**
 * Animated Card Component with 3D hover effects
 */
'use client';

import { useEffect, useRef, ReactNode } from 'react';
import { parallax3D } from '@/lib/animations/anime-utils';
import { cn } from '@/lib/utils';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  enable3D?: boolean;
  onClick?: () => void;
}

export function AnimatedCard({
  children,
  className,
  enable3D = true,
  onClick,
}: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (enable3D && cardRef.current) {
      parallax3D(cardRef.current, {
        maxRotation: 5,
        scale: 1.02,
      });
    }
  }, [enable3D]);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={cn(
        'rounded-xl bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-2xl',
        'border border-gray-100',
        onClick && 'cursor-pointer',
        className
      )}
      style={{
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  );
}
