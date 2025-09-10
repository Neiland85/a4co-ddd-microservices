import React from 'react';
interface V0WrapperCustomizations {
    readonly className?: string;
    readonly theme?: 'light' | 'dark' | 'auto' | 'minimal' | 'elevated' | 'glass';
    readonly animation?: 'none' | 'subtle' | 'bounce' | 'fade' | 'slide';
    readonly analytics?: boolean;
    readonly errorBoundary?: boolean;
    readonly loading?: boolean;
    readonly accessibility?: {
        readonly ariaLabel?: string;
        readonly role?: string;
        readonly tabIndex?: number;
    };
}
interface V0DataSource {
    readonly hook?: () => unknown;
    readonly transformer?: (data: unknown) => unknown;
    readonly refreshInterval?: number;
}
interface V0WrapperProps {
    readonly v0Component: React.ComponentType<Record<string, unknown>>;
    readonly customizations?: V0WrapperCustomizations;
    readonly dataSource?: V0DataSource;
    readonly onError?: (error: Error) => void;
    readonly onEvent?: (event: string, data: unknown) => void;
    readonly children?: React.ReactNode;
    readonly fallback?: React.ReactNode;
    readonly [key: string]: unknown;
}
export declare function V0ComponentWrapper({ v0Component: V0Component, customizations, dataSource, onError, onEvent, children, fallback, ...props }: Readonly<V0WrapperProps>): import("react/jsx-runtime").JSX.Element;
export declare function withV0Wrapper(V0Component: React.ComponentType<Record<string, unknown>>, defaultCustomizations?: V0WrapperCustomizations): (props: Readonly<Record<string, unknown>>) => import("react/jsx-runtime").JSX.Element;
export declare const v0WrapperPresets: {
    minimal: {
        theme: "minimal";
        animation: "none";
        errorBoundary: boolean;
    };
    elevated: {
        theme: "elevated";
        animation: "subtle";
        errorBoundary: boolean;
        analytics: boolean;
    };
    glass: {
        theme: "glass";
        animation: "fade";
        errorBoundary: boolean;
        analytics: boolean;
    };
    dashboard: {
        theme: "elevated";
        animation: "subtle";
        errorBoundary: boolean;
        analytics: boolean;
        accessibility: {
            role: string;
            ariaLabel: string;
        };
    };
    modal: {
        theme: "elevated";
        animation: "slide";
        errorBoundary: boolean;
        accessibility: {
            role: string;
            ariaLabel: string;
        };
    };
};
export declare function useV0Wrapper(Component: React.ComponentType<Record<string, unknown>>, customizations?: V0WrapperCustomizations): (props: Readonly<Record<string, unknown>>) => import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=V0ComponentWrapper.d.ts.map