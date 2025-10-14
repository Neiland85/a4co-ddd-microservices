import React from 'react';
export interface V0AdapterConfig {
    dataMapping?: Record<string, string>;
    eventHandlers?: Record<string, Function>;
    styleOverrides?: Record<string, any>;
    customProps?: Record<string, any>;
    validation?: {
        required?: string[];
        optional?: string[];
    };
}
export interface AdaptedComponentProps<T = any> {
    customData?: T;
    onCustomEvent?: (event: string, data: any) => void;
    className?: string;
    style?: React.CSSProperties;
}
export declare function createV0Adapter<T extends Record<string, any>>(OriginalComponent: React.ComponentType<T>, config?: V0AdapterConfig): (props: Partial<T> & AdaptedComponentProps) => React.ReactElement<T, string | React.JSXElementConstructor<any>>;
export declare function mapCommonV0Data(localData: any): {
    items: any;
    loading: any;
    error: any;
    title: any;
    description: any;
    user: any;
    theme: any;
    variant: any;
    size: any;
};
export declare function useV0Events(onCustomEvent?: (event: string, data: any) => void): {
    onClick: (data: any) => void;
    onSubmit: (data: any) => void;
    onChange: (data: any) => void;
    onSelect: (data: any) => void;
    onFilter: (data: any) => void;
    onSearch: (data: any) => void;
};
export declare function transformV0Styles(originalStyles: Record<string, any>, customizations?: Record<string, any>): {
    '--v0-primary': any;
    '--v0-secondary': any;
    '--v0-background': any;
    '--v0-foreground': any;
    '--v0-border': any;
    '--v0-radius': any;
};
export declare function validateV0Props<T>(props: T, schema: {
    required?: (keyof T)[];
    optional?: (keyof T)[];
    types?: Partial<Record<keyof T, string>>;
}): {
    isValid: boolean;
    errors: string[];
};
export declare const adapterPresets: {
    productCatalog: () => V0AdapterConfig;
    dashboard: () => V0AdapterConfig;
    form: () => V0AdapterConfig;
};
export declare function debugV0Component(componentName: string, props: any, config: V0AdapterConfig): void;
//# sourceMappingURL=V0AdapterUtils.d.ts.map