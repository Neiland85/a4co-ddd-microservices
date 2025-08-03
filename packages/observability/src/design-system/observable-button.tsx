/**
 * Observable Button component with integrated logging and tracing
 */

import React, { useCallback } from 'react';
import { useInteractionLogger } from '../logging/react-hooks';
import { useInteractionTracing } from '../tracing/react-tracing';
import { SpanKind } from '@opentelemetry/api';

export interface ObservableButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  trackingId?: string;
  trackingMetadata?: Record<string, any>;
}

export const ObservableButton = React.forwardRef<HTMLButtonElement, ObservableButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'medium', 
    loading = false,
    trackingId,
    trackingMetadata,
    onClick,
    ...props 
  }, ref) => {
    // Logging hook
    const logInteraction = useInteractionLogger('button.click', {
      throttle: 300, // Prevent spam clicking from flooding logs
    });

    // Tracing hook
    const traceInteraction = useInteractionTracing(
      'button-click',
      trackingId || 'button',
      {
        throttle: 300,
        attributes: {
          'ui.component': 'Button',
          'ui.variant': variant,
          'ui.size': size,
          ...trackingMetadata,
        },
      }
    );

    const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
      // Log the interaction
      logInteraction({
        variant,
        size,
        trackingId,
        text: typeof children === 'string' ? children : undefined,
        ...trackingMetadata,
      });

      // Trace the interaction
      traceInteraction({
        timestamp: new Date().toISOString(),
        eventType: event.type,
        position: {
          x: event.clientX,
          y: event.clientY,
        },
      });

      // Call original onClick handler
      if (onClick) {
        onClick(event);
      }
    }, [onClick, variant, size, trackingId, children, trackingMetadata, logInteraction, traceInteraction]);

    const classNames = [
      'ds-button',
      `ds-button--${variant}`,
      `ds-button--${size}`,
      loading && 'ds-button--loading',
      props.disabled && 'ds-button--disabled',
    ].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        className={classNames}
        onClick={handleClick}
        disabled={loading || props.disabled}
        data-tracking-id={trackingId}
        {...props}
      >
        {loading && <span className="ds-button__spinner" />}
        {children}
      </button>
    );
  }
);

ObservableButton.displayName = 'ObservableButton';