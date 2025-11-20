'use client';

import * as React from 'react';
import { useMicroAnimations } from '@/lib/useMicroAnimations';
import { cn } from '@/lib/utils';

export interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  animationIntensity?: 'subtle' | 'medium' | 'intense';
  enableHover?: boolean;
  enableClick?: boolean;
  enableFocus?: boolean;
  children: React.ReactNode;
}

const buttonVariants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
};

const buttonSizes = {
  default: 'h-10 px-4 py-2',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
  icon: 'h-10 w-10',
};

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  (
    {
      className,
      variant = 'default',
      size = 'default',
      animationIntensity = 'medium',
      enableHover = true,
      enableClick = true,
      enableFocus = true,
      onMouseEnter,
      onMouseLeave,
      onClick,
      onFocus,
      onBlur,
      children,
      ...props
    },
    ref,
  ) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const combinedRef = React.useRef<HTMLButtonElement>(null);

    // Combinar refs
    React.useImperativeHandle(ref, () => combinedRef.current!, []);

    const { animateHover, animateClick, animateFocus, stopAnimation } = useMicroAnimations();

    // Configuración de intensidad de animación
    const getAnimationConfig = React.useCallback(() => {
      const baseConfig = {
        subtle: { amplitude: 1, duration: 400 },
        medium: { amplitude: 2, duration: 600 },
        intense: { amplitude: 3, duration: 800 },
      };
      return baseConfig[animationIntensity];
    }, [animationIntensity]);

    // Handlers de eventos con animaciones
    const handleMouseEnter = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (enableHover && combinedRef.current) {
          combinedRef.current.id =
            combinedRef.current.id || `btn-${Math.random().toString(36).substr(2, 9)}`;
          animateHover(combinedRef.current.id, getAnimationConfig());
        }
        onMouseEnter?.(event);
      },
      [enableHover, animateHover, getAnimationConfig, onMouseEnter],
    );

    const handleMouseLeave = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (enableHover && combinedRef.current?.id) {
          stopAnimation(combinedRef.current.id);
        }
        onMouseLeave?.(event);
      },
      [enableHover, stopAnimation, onMouseLeave],
    );

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (enableClick && combinedRef.current) {
          combinedRef.current.id =
            combinedRef.current.id || `btn-${Math.random().toString(36).substr(2, 9)}`;
          animateClick(combinedRef.current.id, getAnimationConfig());
        }
        onClick?.(event);
      },
      [enableClick, animateClick, getAnimationConfig, onClick],
    );

    const handleFocus = React.useCallback(
      (event: React.FocusEvent<HTMLButtonElement>) => {
        if (enableFocus && combinedRef.current) {
          combinedRef.current.id =
            combinedRef.current.id || `btn-${Math.random().toString(36).substr(2, 9)}`;
          animateFocus(combinedRef.current.id, getAnimationConfig());
        }
        onFocus?.(event);
      },
      [enableFocus, animateFocus, getAnimationConfig, onFocus],
    );

    const handleBlur = React.useCallback(
      (event: React.FocusEvent<HTMLButtonElement>) => {
        if (enableFocus && combinedRef.current?.id) {
          stopAnimation(combinedRef.current.id);
        }
        onBlur?.(event);
      },
      [enableFocus, stopAnimation, onBlur],
    );

    return (
      <button
        ref={combinedRef}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          buttonVariants[variant],
          buttonSizes[size],
          className,
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      >
        {children}
      </button>
    );
  },
);

AnimatedButton.displayName = 'AnimatedButton';

export default AnimatedButton;
