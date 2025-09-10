/**
 * Observable Button component with integrated logging and tracing
 */
import React from 'react';
export interface ObservableButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    loading?: boolean;
    trackingId?: string;
    trackingMetadata?: Record<string, any>;
}
export declare const ObservableButton: React.ForwardRefExoticComponent<ObservableButtonProps & React.RefAttributes<HTMLButtonElement>>;
//# sourceMappingURL=observable-button.d.ts.map