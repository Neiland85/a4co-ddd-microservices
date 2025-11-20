import React from 'react';
import type { Dispatch, SetStateAction } from 'react';
interface BaseComponentProps {
    className?: string;
    children?: React.ReactNode;
}
interface V0ComponentTemplateProps extends BaseComponentProps {
    title?: string;
    description?: string;
    variant?: 'default' | 'primary' | 'secondary' | 'accent';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    onAction?: () => void;
    onCancel?: () => void;
}
interface LoadingState {
    isLoading: boolean;
    error: string | null;
    data: {
        success?: boolean;
    } | null;
}
declare const useLoadingState: (initialData?: unknown) => [LoadingState, {
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setData: (data: unknown) => void;
    reset: () => void;
}];
declare const LoadingSpinner: React.FC<{
    size?: 'sm' | 'md' | 'lg';
}>;
declare const ErrorMessage: React.FC<{
    message: string;
    onRetry?: () => void;
}>;
declare const EmptyState: React.FC<{
    title: string;
    description?: string;
    icon?: string;
}>;
declare const V0ComponentTemplate: React.FC<V0ComponentTemplateProps>;
export declare const V0CardTemplate: React.FC<BaseComponentProps & {
    title: string;
    content: React.ReactNode;
    footer?: React.ReactNode;
}>;
export declare const V0ModalTemplate: React.FC<BaseComponentProps & {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}>;
export declare const useV0State: <T>(initialValue: T) => {
    value: T;
    isLoading: boolean;
    error: string | null;
    updateValue: (newValue: T | ((prev: T) => T)) => Promise<void>;
    setValue: Dispatch<SetStateAction<T>>;
    setError: Dispatch<SetStateAction<string | null>>;
};
export type { V0ComponentTemplateProps, LoadingState, BaseComponentProps };
export { useLoadingState, LoadingSpinner, ErrorMessage, EmptyState };
export default V0ComponentTemplate;
//# sourceMappingURL=V0ComponentTemplate.d.ts.map