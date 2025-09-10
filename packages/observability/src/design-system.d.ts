import React, { ComponentType } from 'react';
export interface DSObservabilityProps {
    onInteraction?: (action: string, data?: Record<string, any>) => void;
    componentName?: string;
    variant?: string;
    size?: string;
    disabled?: boolean;
    loading?: boolean;
}
export interface DSEvent {
    component: string;
    action: string;
    variant?: string;
    size?: string;
    props?: Record<string, any>;
    timestamp: number;
    sessionId: string;
    userId?: string;
    designToken?: string;
}
export declare class DesignSystemLogger {
    private logger;
    private tracer;
    logComponentEvent(event: Omit<DSEvent, 'timestamp' | 'sessionId'>): void;
    createComponentSpan(componentName: string, action: string, attributes?: Record<string, any>): any;
    private getSessionId;
}
export declare function withDSObservability<P extends object>(WrappedComponent: ComponentType<P>, componentName: string, defaultVariant?: string, defaultSize?: string): React.ForwardRefExoticComponent<React.PropsWithoutRef<P & DSObservabilityProps> & React.RefAttributes<any>>;
export declare function useDSObservability(componentName: string, variant?: string, size?: string): {
    logInteraction: (action: string, data?: Record<string, any>) => void;
};
export declare const ObservableButton: React.ForwardRefExoticComponent<Omit<React.ButtonHTMLAttributes<HTMLButtonElement> & DSObservabilityProps & {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
} & React.RefAttributes<HTMLButtonElement>, "ref"> & React.RefAttributes<any>>;
export declare const ObservableInput: React.ForwardRefExoticComponent<Omit<React.InputHTMLAttributes<HTMLInputElement> & DSObservabilityProps & {
    variant?: "default" | "error" | "success";
    size?: "sm" | "md" | "lg";
} & React.RefAttributes<HTMLInputElement>, "ref"> & React.RefAttributes<any>>;
export declare const ObservableCard: React.ForwardRefExoticComponent<Omit<React.HTMLAttributes<HTMLDivElement> & DSObservabilityProps & {
    variant?: "default" | "elevated" | "outlined";
    size?: "sm" | "md" | "lg";
} & React.RefAttributes<HTMLDivElement>, "ref"> & React.RefAttributes<any>>;
export declare function createDesignToken(component: string, variant?: string, size?: string): string;
export declare function parseDesignToken(token: string): {
    component: string;
    variant?: string;
    size?: string;
};
export declare function useDSPerformanceTracking(componentName: string): {
    renderCount: number;
    mountTime: number;
};
export declare function logDSError(componentName: string, error: Error, context?: Record<string, any>): void;
export declare function logDSMetric(componentName: string, metricName: string, value: number, tags?: Record<string, string>): void;
export type { DSObservabilityProps, DSEvent };
//# sourceMappingURL=design-system.d.ts.map