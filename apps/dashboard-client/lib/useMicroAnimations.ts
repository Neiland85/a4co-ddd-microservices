'use client';

import { useCallback, useMemo, useState } from 'react';

export interface MicroAnimationOptions {
  duration?: number;
  disabled?: boolean;
}

export interface MicroAnimationApi {
  [key: string]: any;
  isHovered: boolean;
  isPressed: boolean;
  isAnimating: boolean;
  duration: number;
  getAnimationProps: () => {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onMouseDown: () => void;
    onMouseUp: () => void;
  };
  getButtonProps: () => {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onMouseDown: () => void;
    onMouseUp: () => void;
  };
  animationClassName: string;
  buttonClassName: string;
  reset: () => void;
  trigger: () => void;
}

export const microAnimationClasses = {
  hover: 'transition-transform duration-150 hover:scale-[1.02]',
  press: 'active:scale-[0.98]',
  pulse: 'animate-pulse',
};

export function useMicroAnimations(options: MicroAnimationOptions = {}): MicroAnimationApi {
  const duration = options.duration ?? 150;
  const disabled = options.disabled ?? false;

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const reset = useCallback(() => {
    setIsHovered(false);
    setIsPressed(false);
    setIsAnimating(false);
  }, []);

  const trigger = useCallback(() => {
    if (disabled) return;

    setIsAnimating(true);
    window.setTimeout(() => setIsAnimating(false), duration);
  }, [disabled, duration]);

  const getAnimationProps = useCallback(
    () => ({
      onMouseEnter: () => {
        if (!disabled) setIsHovered(true);
      },
      onMouseLeave: () => {
        setIsHovered(false);
        setIsPressed(false);
      },
      onMouseDown: () => {
        if (!disabled) setIsPressed(true);
      },
      onMouseUp: () => {
        setIsPressed(false);
      },
    }),
    [disabled],
  );

  const animationClassName = useMemo(() => {
    if (disabled) return '';

    return [
      'transition-all',
      `duration-${duration}`,
      isHovered ? 'scale-[1.02]' : '',
      isPressed ? 'scale-[0.98]' : '',
      isAnimating ? 'animate-pulse' : '',
    ]
      .filter(Boolean)
      .join(' ');
  }, [disabled, duration, isHovered, isPressed, isAnimating]);

  return {
    isHovered,
    isPressed,
    isAnimating,
    duration,
    disabled,
    reset,
    trigger,
    triggerAnimation: trigger,
    animate: trigger,
    getAnimationProps,
    getButtonProps: getAnimationProps,
    getCardProps: getAnimationProps,
    getIconProps: getAnimationProps,
    animationClassName,
    buttonClassName: animationClassName,
    cardClassName: animationClassName,
    iconClassName: animationClassName,
    hoverClassName: microAnimationClasses.hover,
    pressClassName: microAnimationClasses.press,
    pulseClassName: microAnimationClasses.pulse,
  };
}

export default useMicroAnimations;
